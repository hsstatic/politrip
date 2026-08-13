import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireIdentity, requirePermission, writeAudit } from "./authz";
import { ALL_PERMISSIONS, isPermission, PERMISSIONS } from "./permissions";

export const list = query({
  args: { adminToken: v.string() },
  handler: async (ctx, { adminToken }) => {
    const { user, permissions } = await requireIdentity(ctx, adminToken);
    const allowed =
      user.kind === "owner" ||
      permissions.has(PERMISSIONS.ROLES_VIEW) ||
      permissions.has(PERMISSIONS.EMPLOYEES_VIEW) ||
      permissions.has(PERMISSIONS.EMPLOYEES_CREATE) ||
      permissions.has(PERMISSIONS.EMPLOYEES_EDIT);
    if (!allowed) throw new Error("Forbidden");
    const roles = await ctx.db.query("employeeRoles").order("asc").collect();
    return roles;
  },
});

export const get = query({
  args: { adminToken: v.string(), id: v.id("employeeRoles") },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.adminToken, PERMISSIONS.ROLES_VIEW);
    return await ctx.db.get(args.id);
  },
});

export const catalog = query({
  args: { adminToken: v.string() },
  handler: async (ctx, { adminToken }) => {
    await requirePermission(ctx, adminToken, PERMISSIONS.ROLES_VIEW);
    return ALL_PERMISSIONS;
  },
});

export const create = mutation({
  args: {
    adminToken: v.string(),
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    permissions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { user: actor } = await requirePermission(ctx, args.adminToken, PERMISSIONS.ROLES_EDIT);
    if (actor.kind !== "owner") throw new Error("Forbidden");
    const slug = args.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const existing = await ctx.db
      .query("employeeRoles")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (existing) throw new Error("Role slug already exists");
    const permissions = args.permissions.filter(isPermission);
    const now = Date.now();
    const id = await ctx.db.insert("employeeRoles", {
      name: args.name.trim(),
      slug,
      description: args.description?.trim(),
      permissions,
      createdAt: now,
      updatedAt: now,
    });
    await writeAudit(ctx, {
      actor,
      action: "role.created",
      entityType: "employeeRole",
      entityId: id,
      metadata: { slug, permissions },
    });
    return id;
  },
});

export const update = mutation({
  args: {
    adminToken: v.string(),
    id: v.id("employeeRoles"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    permissions: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { user: actor } = await requirePermission(ctx, args.adminToken, PERMISSIONS.ROLES_EDIT);
    if (actor.kind !== "owner") throw new Error("Forbidden");
    const role = await ctx.db.get(args.id);
    if (!role) throw new Error("Not found");
    const permissions = args.permissions ? args.permissions.filter(isPermission) : role.permissions;
    await ctx.db.patch(args.id, {
      name: args.name?.trim() ?? role.name,
      description: args.description?.trim() ?? role.description,
      permissions,
      updatedAt: Date.now(),
    });
    if (args.permissions) {
      const employees = await ctx.db
        .query("users")
        .withIndex("by_kind", (q) => q.eq("kind", "employee"))
        .collect();
      const now = Date.now();
      for (const employee of employees) {
        if (employee.employeeRoleId === args.id) {
          await ctx.db.patch(employee._id, {
            tokenVersion: employee.tokenVersion + 1,
            updatedAt: now,
          });
        }
      }
    }
    await writeAudit(ctx, {
      actor,
      action: "role.permissions_changed",
      entityType: "employeeRole",
      entityId: args.id,
      metadata: { permissions },
    });
    return { ok: true as const };
  },
});

export const remove = mutation({
  args: { adminToken: v.string(), id: v.id("employeeRoles") },
  handler: async (ctx, args) => {
    const { user: actor } = await requirePermission(ctx, args.adminToken, PERMISSIONS.ROLES_EDIT);
    if (actor.kind !== "owner") throw new Error("Forbidden");
    const role = await ctx.db.get(args.id);
    if (!role) throw new Error("Not found");
    const employees = await ctx.db
      .query("users")
      .withIndex("by_kind", (q) => q.eq("kind", "employee"))
      .collect();
    const assigned = employees.filter((e) => e.employeeRoleId === args.id);
    if (assigned.length > 0) {
      throw new Error("Reassign employees before deleting this role");
    }
    await ctx.db.delete(args.id);
    await writeAudit(ctx, {
      actor,
      action: "role.deleted",
      entityType: "employeeRole",
      entityId: args.id,
      metadata: { slug: role.slug },
    });
    return { ok: true as const };
  },
});
