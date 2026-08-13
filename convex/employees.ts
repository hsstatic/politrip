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
    roleId: v.optional(v.id("employeeRoles")),
    query: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.adminToken, PERMISSIONS.EMPLOYEES_VIEW);
    const qText = args.query?.trim();
    const result = qText
      ? await ctx.db
          .query("users")
          .withSearchIndex("search_users", (q) => {
            const s = q.search("searchText", qText).eq("kind", "employee");
            return args.status ? s.eq("status", args.status) : s;
          })
          .paginate(args.paginationOpts)
      : args.status
        ? await ctx.db
            .query("users")
            .withIndex("by_kind_status", (q) => q.eq("kind", "employee").eq("status", args.status!))
            .order("desc")
            .paginate(args.paginationOpts)
        : await ctx.db
            .query("users")
            .withIndex("by_kind", (q) => q.eq("kind", "employee"))
            .order("desc")
            .paginate(args.paginationOpts);

    const page = args.roleId
      ? result.page.filter((u) => u.employeeRoleId === args.roleId)
      : result.page;

    return {
      ...result,
      page: page.map(toPublicUser),
    };
  },
});

export const summary = query({
  args: { adminToken: v.string() },
  handler: async (ctx, { adminToken }) => {
    await requirePermission(ctx, adminToken, PERMISSIONS.EMPLOYEES_VIEW);
    const employees = await ctx.db
      .query("users")
      .withIndex("by_kind", (q) => q.eq("kind", "employee"))
      .collect();
    return {
      total: employees.length,
      active: employees.filter((e) => e.status === "active").length,
      disabled: employees.filter((e) => e.status === "disabled").length,
    };
  },
});

export const get = query({
  args: { adminToken: v.string(), id: v.id("users") },
  handler: async (ctx, args) => {
    const { user: actor } = await requirePermission(ctx, args.adminToken, PERMISSIONS.EMPLOYEES_VIEW);
    const user = await ctx.db.get(args.id);
    if (!user || user.kind !== "employee") return null;
    if (actor.kind !== "owner" && actor._id !== user._id && !actor.employeeRoleId) {
      // staff with view can see other employees; ownership check is permission-based
    }
    let role = null;
    if (user.employeeRoleId) role = await ctx.db.get(user.employeeRoleId);
    return { ...toPublicUser(user), role };
  },
});

export const activity = query({
  args: { adminToken: v.string(), id: v.id("users") },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.adminToken, PERMISSIONS.EMPLOYEES_VIEW);
    const user = await ctx.db.get(args.id);
    if (!user || user.kind !== "employee") return [];
    const logs = await ctx.db
      .query("auditLogs")
      .withIndex("by_actor", (q) => q.eq("actorUserId", args.id))
      .order("desc")
      .take(50);
    return logs;
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
    employeeRoleId: v.optional(v.id("employeeRoles")),
  },
  handler: async (ctx, args) => {
    const { user: actor } = await requirePermission(ctx, args.adminToken, PERMISSIONS.EMPLOYEES_CREATE);
    if (actor.kind !== "owner" && actor.kind !== "employee") throw new Error("Forbidden");
    const email = args.email.trim().toLowerCase();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (existing) throw new Error("Email already registered");
    if (args.employeeRoleId) {
      const role = await ctx.db.get(args.employeeRoleId);
      if (!role) throw new Error("Role not found");
    }
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
      kind: "employee",
      employeeRoleId: args.employeeRoleId,
      status: "active",
      tokenVersion: 0,
      searchText: buildSearchText({ firstName, lastName, email, phone }),
      createdAt: now,
      updatedAt: now,
    });
    await writeAudit(ctx, {
      actor,
      action: "employee.created",
      entityType: "user",
      entityId: id,
      metadata: { email, roleId: args.employeeRoleId },
    });
    await notify(ctx, {
      userId: id,
      type: "account",
      title: "Staff access",
      body: "Your PoliTrip staff account is ready. Sign in to open your workspace.",
      href: "/workspace",
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
    employeeRoleId: v.optional(v.union(v.id("employeeRoles"), v.null())),
  },
  handler: async (ctx, args) => {
    const { user: actor } = await requirePermission(ctx, args.adminToken, PERMISSIONS.EMPLOYEES_EDIT);
    const user = await ctx.db.get(args.id);
    if (!user || user.kind !== "employee") throw new Error("Not found");
    const email = args.email?.trim().toLowerCase() ?? user.email;
    if (email !== user.email) {
      const taken = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .unique();
      if (taken) throw new Error("Email already registered");
    }
    if (args.employeeRoleId) {
      const role = await ctx.db.get(args.employeeRoleId);
      if (!role) throw new Error("Role not found");
    }
    const firstName = args.firstName?.trim() ?? user.firstName;
    const lastName = args.lastName?.trim() ?? user.lastName;
    const phone = args.phone?.trim() ?? user.phone;
    const roleChanged =
      args.employeeRoleId !== undefined && args.employeeRoleId !== user.employeeRoleId;
    await ctx.db.patch(args.id, {
      email,
      firstName,
      lastName,
      phone,
      employeeRoleId: args.employeeRoleId === undefined ? user.employeeRoleId : args.employeeRoleId ?? undefined,
      searchText: buildSearchText({ firstName, lastName, email, phone }),
      tokenVersion: roleChanged ? user.tokenVersion + 1 : user.tokenVersion,
      updatedAt: Date.now(),
    });
    await writeAudit(ctx, {
      actor,
      action: roleChanged ? "employee.role_changed" : "employee.edited",
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
    const { user: actor } = await requirePermission(ctx, args.adminToken, PERMISSIONS.EMPLOYEES_EDIT);
    const user = await ctx.db.get(args.id);
    if (!user || user.kind !== "employee") throw new Error("Not found");
    if (user._id === actor._id && args.status !== "active") {
      throw new Error("You cannot disable your own staff account");
    }
    const now = Date.now();
    await ctx.db.patch(args.id, {
      status: args.status,
      tokenVersion: args.status === "active" ? user.tokenVersion : user.tokenVersion + 1,
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
      action: args.status === "active" ? "employee.reactivated" : `employee.${args.status}`,
      entityType: "user",
      entityId: args.id,
    });
    return { ok: true as const };
  },
});

export const remove = mutation({
  args: { adminToken: v.string(), id: v.id("users") },
  handler: async (ctx, args) => {
    const { user: actor } = await requirePermission(ctx, args.adminToken, PERMISSIONS.EMPLOYEES_DELETE);
    const user = await ctx.db.get(args.id);
    if (!user || user.kind !== "employee") throw new Error("Not found");
    if (user._id === actor._id) throw new Error("You cannot delete your own staff account");
    await ctx.db.delete(args.id);
    await writeAudit(ctx, {
      actor,
      action: "employee.deleted",
      entityType: "user",
      entityId: args.id,
      metadata: { email: user.email },
    });
    return { ok: true as const };
  },
});
