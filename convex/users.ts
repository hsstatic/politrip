import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {
  buildSearchText,
  notify,
  requireIdentity,
  requireServerToken,
  resolvePermissions,
  toPublicUser,
  writeAudit,
} from "./authz";
import { DEFAULT_EMPLOYEE_ROLES } from "./permissions";

export const getAuthRecord = query({
  args: { serverToken: v.string(), email: v.string() },
  handler: async (ctx, { serverToken, email }) => {
    await requireServerToken(serverToken);
    const normalized = email.trim().toLowerCase();
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .unique();
    if (!user) return null;
    return {
      ...toPublicUser(user),
      passwordHash: user.passwordHash,
      tokenVersion: user.tokenVersion,
    };
  },
});

export const getPublicById = query({
  args: { serverToken: v.string(), userId: v.id("users") },
  handler: async (ctx, { serverToken, userId }) => {
    await requireServerToken(serverToken);
    const user = await ctx.db.get(userId);
    if (!user) return null;
    return { ...toPublicUser(user), tokenVersion: user.tokenVersion };
  },
});

export const ensureDefaultRoles = mutation({
  args: { serverToken: v.string() },
  handler: async (ctx, { serverToken }) => {
    await requireServerToken(serverToken);
    const now = Date.now();
    for (const role of DEFAULT_EMPLOYEE_ROLES) {
      const existing = await ctx.db
        .query("employeeRoles")
        .withIndex("by_slug", (q) => q.eq("slug", role.slug))
        .unique();
      if (existing) continue;
      await ctx.db.insert("employeeRoles", {
        name: role.name,
        slug: role.slug,
        description: role.description,
        permissions: [...role.permissions],
        createdAt: now,
        updatedAt: now,
      });
    }
    return { ok: true as const };
  },
});

export const registerCustomer = mutation({
  args: {
    serverToken: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    await requireServerToken(args.serverToken);
    const email = args.email.trim().toLowerCase();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (existing) {
      throw new Error("Email already registered");
    }
    const now = Date.now();
    const firstName = args.firstName.trim();
    const lastName = args.lastName.trim();
    const phone = args.phone.trim();
    const userId = await ctx.db.insert("users", {
      email,
      passwordHash: args.passwordHash,
      firstName,
      lastName,
      phone,
      kind: "customer",
      status: "active",
      tokenVersion: 0,
      searchText: buildSearchText({ firstName, lastName, email, phone }),
      createdAt: now,
      updatedAt: now,
    });
    const user = await ctx.db.get(userId);
    await writeAudit(ctx, {
      actor: user,
      action: "customer.registered",
      entityType: "user",
      entityId: userId,
    });
    await notify(ctx, {
      userId,
      type: "account",
      title: "Welcome to PoliTrip",
      body: "Your traveller account is ready. You can manage your profile and bookings here.",
      href: "/account",
    });
    return { ...toPublicUser(user!), tokenVersion: 0 };
  },
});

export const ensureOwner = mutation({
  args: {
    serverToken: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireServerToken(args.serverToken);
    const email = args.email.trim().toLowerCase();
    const owners = await ctx.db
      .query("users")
      .withIndex("by_kind", (q) => q.eq("kind", "owner"))
      .take(5);
    const existingOwner = owners[0];
    if (existingOwner && existingOwner.email !== email) {
      throw new Error("Owner already exists");
    }
    const now = Date.now();
    if (existingOwner) {
      await ctx.db.patch(existingOwner._id, {
        passwordHash: args.passwordHash,
        updatedAt: now,
        status: "active",
      });
      const updated = await ctx.db.get(existingOwner._id);
      return { ...toPublicUser(updated!), tokenVersion: updated!.tokenVersion };
    }

    const byEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (byEmail) {
      throw new Error("Email already registered");
    }

    const firstName = (args.firstName ?? "Owner").trim();
    const lastName = (args.lastName ?? "PoliTrip").trim();
    const phone = (args.phone ?? "").trim();
    const userId = await ctx.db.insert("users", {
      email,
      passwordHash: args.passwordHash,
      firstName,
      lastName,
      phone,
      kind: "owner",
      status: "active",
      tokenVersion: 0,
      searchText: buildSearchText({ firstName, lastName, email, phone }),
      createdAt: now,
      updatedAt: now,
    });
    const user = await ctx.db.get(userId);
    await writeAudit(ctx, {
      actor: user,
      action: "owner.bootstrapped",
      entityType: "user",
      entityId: userId,
    });
    return { ...toPublicUser(user!), tokenVersion: 0 };
  },
});

export const createSession = mutation({
  args: {
    serverToken: v.string(),
    userId: v.id("users"),
    expiresAt: v.number(),
    userAgent: v.optional(v.string()),
    ip: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireServerToken(args.serverToken);
    const user = await ctx.db.get(args.userId);
    if (!user || user.status !== "active") throw new Error("Unauthorized");
    const sessionId = await ctx.db.insert("sessions", {
      userId: args.userId,
      userAgent: args.userAgent?.slice(0, 300),
      ip: args.ip?.slice(0, 128),
      createdAt: Date.now(),
      expiresAt: args.expiresAt,
    });
    await ctx.db.patch(args.userId, { lastLoginAt: Date.now(), updatedAt: Date.now() });
    return { sessionId };
  },
});

export const revokeSession = mutation({
  args: {
    serverToken: v.string(),
    sessionId: v.id("sessions"),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    await requireServerToken(args.serverToken);
    const session = await ctx.db.get(args.sessionId);
    if (!session) return { ok: true as const };
    if (args.userId && session.userId !== args.userId) throw new Error("Forbidden");
    if (!session.revokedAt) {
      await ctx.db.patch(args.sessionId, { revokedAt: Date.now() });
    }
    return { ok: true as const };
  },
});

export const revokeAllSessions = mutation({
  args: { serverToken: v.string(), userId: v.id("users") },
  handler: async (ctx, args) => {
    await requireServerToken(args.serverToken);
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    const now = Date.now();
    for (const session of sessions) {
      if (!session.revokedAt) await ctx.db.patch(session._id, { revokedAt: now });
    }
    const user = await ctx.db.get(args.userId);
    if (user) {
      await ctx.db.patch(args.userId, {
        tokenVersion: user.tokenVersion + 1,
        updatedAt: now,
      });
    }
    return { ok: true as const };
  },
});

export const getSession = query({
  args: { serverToken: v.string(), sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    await requireServerToken(args.serverToken);
    const session = await ctx.db.get(args.sessionId);
    if (!session) return null;
    return {
      id: session._id,
      userId: session.userId,
      expiresAt: session.expiresAt,
      revokedAt: session.revokedAt,
      createdAt: session.createdAt,
      userAgent: session.userAgent,
      ip: session.ip,
    };
  },
});

export const listMySessions = query({
  args: { authToken: v.string() },
  handler: async (ctx, { authToken }) => {
    const { user, sessionId } = await requireIdentity(ctx, authToken);
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
    return sessions
      .filter((s) => !s.revokedAt && s.expiresAt > Date.now())
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((s) => ({
        id: s._id,
        createdAt: s.createdAt,
        expiresAt: s.expiresAt,
        userAgent: s.userAgent,
        current: s._id === sessionId,
      }));
  },
});

export const revokeMySession = mutation({
  args: { authToken: v.string(), sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const { user } = await requireIdentity(ctx, args.authToken);
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== user._id) throw new Error("Forbidden");
    if (!session.revokedAt) await ctx.db.patch(args.sessionId, { revokedAt: Date.now() });
    return { ok: true as const };
  },
});

export const updatePasswordHash = mutation({
  args: {
    serverToken: v.string(),
    userId: v.id("users"),
    passwordHash: v.string(),
    revokeSessions: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireServerToken(args.serverToken);
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("Not found");
    const now = Date.now();
    const patch: {
      passwordHash: string;
      updatedAt: number;
      tokenVersion?: number;
    } = {
      passwordHash: args.passwordHash,
      updatedAt: now,
    };
    if (args.revokeSessions !== false) {
      patch.tokenVersion = user.tokenVersion + 1;
      const sessions = await ctx.db
        .query("sessions")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .collect();
      for (const session of sessions) {
        if (!session.revokedAt) await ctx.db.patch(session._id, { revokedAt: now });
      }
    }
    await ctx.db.patch(args.userId, patch);
    await writeAudit(ctx, {
      actor: user,
      action: "user.password_changed",
      entityType: "user",
      entityId: args.userId,
    });
    return { ok: true as const, tokenVersion: patch.tokenVersion ?? user.tokenVersion };
  },
});

export const createPasswordReset = mutation({
  args: {
    serverToken: v.string(),
    email: v.string(),
    tokenHash: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    await requireServerToken(args.serverToken);
    const email = args.email.trim().toLowerCase();
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (!user || user.status === "disabled") return { ok: true as const, created: false };
    await ctx.db.insert("passwordResets", {
      userId: user._id,
      tokenHash: args.tokenHash,
      expiresAt: args.expiresAt,
      createdAt: Date.now(),
    });
    await writeAudit(ctx, {
      actor: user,
      action: "user.password_reset_requested",
      entityType: "user",
      entityId: user._id,
    });
    return {
      ok: true as const,
      created: true,
      userId: user._id,
      kind: user.kind,
      firstName: user.firstName,
    };
  },
});

export const consumePasswordReset = mutation({
  args: {
    serverToken: v.string(),
    tokenHash: v.string(),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    await requireServerToken(args.serverToken);
    const reset = await ctx.db
      .query("passwordResets")
      .withIndex("by_tokenHash", (q) => q.eq("tokenHash", args.tokenHash))
      .unique();
    if (!reset || reset.usedAt || reset.expiresAt < Date.now()) {
      throw new Error("Invalid or expired reset token");
    }
    const user = await ctx.db.get(reset.userId);
    if (!user || user.status === "disabled") throw new Error("Invalid or expired reset token");
    const now = Date.now();
    await ctx.db.patch(reset._id, { usedAt: now });
    await ctx.db.patch(user._id, {
      passwordHash: args.passwordHash,
      tokenVersion: user.tokenVersion + 1,
      updatedAt: now,
      status: user.status === "deactivated" ? "active" : user.status,
      deactivatedAt: user.status === "deactivated" ? undefined : user.deactivatedAt,
    });
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
    for (const session of sessions) {
      if (!session.revokedAt) await ctx.db.patch(session._id, { revokedAt: now });
    }
    await writeAudit(ctx, {
      actor: user,
      action: "user.password_reset_completed",
      entityType: "user",
      entityId: user._id,
    });
    return { ...toPublicUser(user), tokenVersion: user.tokenVersion + 1 };
  },
});

export const generateUploadUrl = mutation({
  args: { authToken: v.string() },
  handler: async (ctx, { authToken }) => {
    await requireIdentity(ctx, authToken);
    return await ctx.storage.generateUploadUrl();
  },
});

export const setAvatar = mutation({
  args: { authToken: v.string(), storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const { user } = await requireIdentity(ctx, args.authToken);
    const url = await ctx.storage.getUrl(args.storageId);
    if (user.avatarStorageId && user.avatarStorageId !== args.storageId) {
      try {
        await ctx.storage.delete(user.avatarStorageId);
      } catch {
        // previous file may already be gone
      }
    }
    await ctx.db.patch(user._id, {
      avatarStorageId: args.storageId,
      avatarUrl: url ?? undefined,
      updatedAt: Date.now(),
    });
    const updated = await ctx.db.get(user._id);
    return toPublicUser(updated!);
  },
});

export const clearAvatar = mutation({
  args: { authToken: v.string() },
  handler: async (ctx, { authToken }) => {
    const { user } = await requireIdentity(ctx, authToken);
    if (user.avatarStorageId) {
      try {
        await ctx.storage.delete(user.avatarStorageId);
      } catch {
        // ignore
      }
    }
    await ctx.db.patch(user._id, {
      avatarStorageId: undefined,
      avatarUrl: undefined,
      updatedAt: Date.now(),
    });
    const updated = await ctx.db.get(user._id);
    return toPublicUser(updated!);
  },
});

export const me = query({
  args: { authToken: v.string() },
  handler: async (ctx, { authToken }) => {
    const { user, permissions } = await requireIdentity(ctx, authToken);
    let roleName: string | undefined;
    if (user.employeeRoleId) {
      const role = await ctx.db.get(user.employeeRoleId);
      roleName = role?.name;
    }
    const publicUser = toPublicUser(user);
    if (user.avatarStorageId) {
      publicUser.avatarUrl = (await ctx.storage.getUrl(user.avatarStorageId)) ?? publicUser.avatarUrl;
    }
    return {
      user: publicUser,
      permissions: [...permissions],
      roleName,
    };
  },
});

export const updateMe = mutation({
  args: {
    authToken: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
  },
  handler: async (ctx, { authToken, ...fields }) => {
    const { user } = await requireIdentity(ctx, authToken);
    const firstName = fields.firstName?.trim() ?? user.firstName;
    const lastName = fields.lastName?.trim() ?? user.lastName;
    const phone = fields.phone?.trim() ?? user.phone;
    await ctx.db.patch(user._id, {
      firstName,
      lastName,
      phone,
      address: fields.address?.trim() ?? user.address,
      city: fields.city?.trim() ?? user.city,
      country: fields.country?.trim() ?? user.country,
      searchText: buildSearchText({ firstName, lastName, email: user.email, phone }),
      updatedAt: Date.now(),
    });
    const updated = await ctx.db.get(user._id);
    return toPublicUser(updated!);
  },
});

export const deactivateMe = mutation({
  args: { authToken: v.string() },
  handler: async (ctx, { authToken }) => {
    const { user } = await requireIdentity(ctx, authToken);
    if (user.kind === "owner") throw new Error("Owner accounts cannot be self-deactivated");
    const now = Date.now();
    await ctx.db.patch(user._id, {
      status: "deactivated",
      deactivatedAt: now,
      tokenVersion: user.tokenVersion + 1,
      updatedAt: now,
    });
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
    for (const session of sessions) {
      if (!session.revokedAt) await ctx.db.patch(session._id, { revokedAt: now });
    }
    await writeAudit(ctx, {
      actor: user,
      action: "user.self_deactivated",
      entityType: "user",
      entityId: user._id,
    });
    return { ok: true as const };
  },
});

export const getMeWithPermissions = query({
  args: { serverToken: v.string(), userId: v.id("users"), sessionId: v.optional(v.id("sessions")) },
  handler: async (ctx, args) => {
    await requireServerToken(args.serverToken);
    const user = await ctx.db.get(args.userId);
    if (!user) return null;
    if (args.sessionId) {
      const session = await ctx.db.get(args.sessionId);
      if (
        !session ||
        session.userId !== user._id ||
        session.revokedAt ||
        session.expiresAt < Date.now()
      ) {
        return null;
      }
    }
    const permissions = await resolvePermissions(ctx, user);
    let roleName: string | undefined;
    if (user.employeeRoleId) {
      const role = await ctx.db.get(user.employeeRoleId);
      roleName = role?.name;
    }
    const publicUser = toPublicUser(user);
    if (user.avatarStorageId) {
      publicUser.avatarUrl = (await ctx.storage.getUrl(user.avatarStorageId)) ?? publicUser.avatarUrl;
    }
    return {
      user: { ...publicUser, tokenVersion: user.tokenVersion },
      permissions: [...permissions],
      roleName,
    };
  },
});

export const issueResetForUser = mutation({
  args: {
    adminToken: v.string(),
    userId: v.id("users"),
    tokenHash: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    const { user: actor, permissions } = await requireIdentity(ctx, args.adminToken);
    const target = await ctx.db.get(args.userId);
    if (!target || target.kind === "owner") throw new Error("Forbidden");
    const allowed =
      actor.kind === "owner" ||
      (target.kind === "customer" && permissions.has("customers.edit")) ||
      (target.kind === "employee" && permissions.has("employees.edit"));
    if (!allowed) throw new Error("Forbidden");
    await ctx.db.insert("passwordResets", {
      userId: target._id,
      tokenHash: args.tokenHash,
      expiresAt: args.expiresAt,
      createdAt: Date.now(),
    });
    await writeAudit(ctx, {
      actor,
      action: `${target.kind}.password_reset_issued`,
      entityType: "user",
      entityId: target._id,
    });
    return { ok: true as const, email: target.email };
  },
});

export const countByKind = query({
  args: { serverToken: v.string(), kind: v.union(v.literal("customer"), v.literal("employee"), v.literal("owner")) },
  handler: async (ctx, args) => {
    await requireServerToken(args.serverToken);
    const rows = await ctx.db
      .query("users")
      .withIndex("by_kind", (q) => q.eq("kind", args.kind))
      .collect();
    return rows.length;
  },
});
