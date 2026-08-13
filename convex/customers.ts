import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import {
  buildSearchText,
  notify,
  requirePermission,
  toPublicUser,
  writeAudit,
} from "./authz";
import { PERMISSIONS } from "./permissions";

export const list = query({
  args: {
    adminToken: v.string(),
    paginationOpts: paginationOptsValidator,
    status: v.optional(
      v.union(v.literal("active"), v.literal("disabled"), v.literal("deactivated")),
    ),
    query: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.adminToken, PERMISSIONS.CUSTOMERS_VIEW);
    const qText = args.query?.trim();
    const paginated = qText
      ? await ctx.db
          .query("users")
          .withSearchIndex("search_users", (q) => {
            const s = q.search("searchText", qText).eq("kind", "customer");
            return args.status ? s.eq("status", args.status) : s;
          })
          .paginate(args.paginationOpts)
      : args.status
        ? await ctx.db
            .query("users")
            .withIndex("by_kind_status", (q) => q.eq("kind", "customer").eq("status", args.status!))
            .order("desc")
            .paginate(args.paginationOpts)
        : await ctx.db
            .query("users")
            .withIndex("by_kind", (q) => q.eq("kind", "customer"))
            .order("desc")
            .paginate(args.paginationOpts);

    return {
      ...paginated,
      page: paginated.page.map(toPublicUser),
    };
  },
});

export const get = query({
  args: { adminToken: v.string(), id: v.id("users") },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.adminToken, PERMISSIONS.CUSTOMERS_VIEW);
    const user = await ctx.db.get(args.id);
    if (!user || user.kind !== "customer") return null;
    return toPublicUser(user);
  },
});

export const summary = query({
  args: { adminToken: v.string() },
  handler: async (ctx, { adminToken }) => {
    await requirePermission(ctx, adminToken, PERMISSIONS.CUSTOMERS_VIEW);
    const customers = await ctx.db
      .query("users")
      .withIndex("by_kind", (q) => q.eq("kind", "customer"))
      .collect();
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return {
      total: customers.length,
      active: customers.filter((c) => c.status === "active").length,
      disabled: customers.filter((c) => c.status === "disabled").length,
      deactivated: customers.filter((c) => c.status === "deactivated").length,
      newThisWeek: customers.filter((c) => c.createdAt >= weekAgo).length,
    };
  },
});

export const activity = query({
  args: { adminToken: v.string(), id: v.id("users") },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.adminToken, PERMISSIONS.CUSTOMERS_VIEW);
    const user = await ctx.db.get(args.id);
    if (!user || user.kind !== "customer") return [];
    const logs = await ctx.db
      .query("auditLogs")
      .withIndex("by_entity", (q) => q.eq("entityType", "user").eq("entityId", args.id))
      .order("desc")
      .take(50);
    const actorLogs = await ctx.db
      .query("auditLogs")
      .withIndex("by_actor", (q) => q.eq("actorUserId", args.id))
      .order("desc")
      .take(50);
    const merged = [...logs, ...actorLogs]
      .filter((item, index, arr) => arr.findIndex((x) => x._id === item._id) === index)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 50);
    return merged;
  },
});

export const create = mutation({
  args: {
    adminToken: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    const { user: actor } = await requirePermission(ctx, args.adminToken, PERMISSIONS.CUSTOMERS_CREATE);
    const email = args.email.trim().toLowerCase();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (existing) throw new Error("Email already registered");
    const now = Date.now();
    const firstName = args.firstName.trim();
    const lastName = args.lastName.trim();
    const phone = args.phone.trim();
    const id = await ctx.db.insert("users", {
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
    await writeAudit(ctx, {
      actor,
      action: "customer.created",
      entityType: "user",
      entityId: id,
      metadata: { email },
    });
    const created = await ctx.db.get(id);
    return toPublicUser(created!);
  },
});

export const update = mutation({
  args: {
    adminToken: v.string(),
    id: v.id("users"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user: actor } = await requirePermission(ctx, args.adminToken, PERMISSIONS.CUSTOMERS_EDIT);
    const user = await ctx.db.get(args.id);
    if (!user || user.kind !== "customer") throw new Error("Not found");
    const email = args.email?.trim().toLowerCase() ?? user.email;
    if (email !== user.email) {
      const taken = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .unique();
      if (taken) throw new Error("Email already registered");
    }
    const firstName = args.firstName?.trim() ?? user.firstName;
    const lastName = args.lastName?.trim() ?? user.lastName;
    const phone = args.phone?.trim() ?? user.phone;
    await ctx.db.patch(args.id, {
      email,
      firstName,
      lastName,
      phone,
      address: args.address?.trim() ?? user.address,
      city: args.city?.trim() ?? user.city,
      country: args.country?.trim() ?? user.country,
      searchText: buildSearchText({ firstName, lastName, email, phone }),
      updatedAt: Date.now(),
    });
    await writeAudit(ctx, {
      actor,
      action: "customer.edited",
      entityType: "user",
      entityId: args.id,
    });
    const updated = await ctx.db.get(args.id);
    return toPublicUser(updated!);
  },
});

export const setStatus = mutation({
  args: {
    adminToken: v.string(),
    id: v.id("users"),
    status: v.union(v.literal("active"), v.literal("disabled"), v.literal("deactivated")),
  },
  handler: async (ctx, args) => {
    const permission =
      args.status === "active" ? PERMISSIONS.CUSTOMERS_EDIT : PERMISSIONS.CUSTOMERS_EDIT;
    const { user: actor } = await requirePermission(ctx, args.adminToken, permission);
    const user = await ctx.db.get(args.id);
    if (!user || user.kind !== "customer") throw new Error("Not found");
    const now = Date.now();
    const tokenVersion = args.status === "active" ? user.tokenVersion : user.tokenVersion + 1;
    await ctx.db.patch(args.id, {
      status: args.status,
      deactivatedAt: args.status === "deactivated" ? now : undefined,
      tokenVersion,
      updatedAt: now,
    });
    if (args.status !== "active") {
      const sessions = await ctx.db
        .query("sessions")
        .withIndex("by_userId", (q) => q.eq("userId", args.id))
        .collect();
      for (const session of sessions) {
        if (!session.revokedAt) await ctx.db.patch(session._id, { revokedAt: now });
      }
    }
    await writeAudit(ctx, {
      actor,
      action: args.status === "active" ? "customer.reactivated" : `customer.${args.status}`,
      entityType: "user",
      entityId: args.id,
    });
    if (args.status !== "active") {
      await notify(ctx, {
        userId: args.id,
        type: "account",
        title: "Account status updated",
        body:
          args.status === "disabled"
            ? "Your PoliTrip account has been disabled. Contact support if this is unexpected."
            : "Your PoliTrip account has been deactivated.",
      });
    }
    return { ok: true as const };
  },
});

export const remove = mutation({
  args: { adminToken: v.string(), id: v.id("users") },
  handler: async (ctx, args) => {
    const { user: actor } = await requirePermission(ctx, args.adminToken, PERMISSIONS.CUSTOMERS_DELETE);
    const user = await ctx.db.get(args.id);
    if (!user || user.kind !== "customer") throw new Error("Not found");
    await ctx.db.delete(args.id);
    await writeAudit(ctx, {
      actor,
      action: "customer.deleted",
      entityType: "user",
      entityId: args.id,
      metadata: { email: user.email },
    });
    return { ok: true as const };
  },
});

export const adminCreateReset = mutation({
  args: {
    adminToken: v.string(),
    id: v.id("users"),
    tokenHash: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    const { user: actor } = await requirePermission(ctx, args.adminToken, PERMISSIONS.CUSTOMERS_EDIT);
    const user = await ctx.db.get(args.id);
    if (!user || user.kind !== "customer") throw new Error("Not found");
    await ctx.db.insert("passwordResets", {
      userId: user._id,
      tokenHash: args.tokenHash,
      expiresAt: args.expiresAt,
      createdAt: Date.now(),
    });
    await writeAudit(ctx, {
      actor,
      action: "customer.password_reset_issued",
      entityType: "user",
      entityId: args.id,
    });
    return { ok: true as const };
  },
});
