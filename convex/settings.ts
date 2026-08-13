import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireOwner, requirePermission, writeAudit } from "./authz";
import { PERMISSIONS } from "./permissions";

const ALLOWED_KEYS = new Set(["support_whatsapp", "support_email", "business_name"]);

export const getAll = query({
  args: { adminToken: v.string() },
  handler: async (ctx, { adminToken }) => {
    await requirePermission(ctx, adminToken, PERMISSIONS.SETTINGS_VIEW);
    const rows = await ctx.db.query("appSettings").collect();
    return Object.fromEntries(rows.map((row) => [row.key, row.value])) as Record<string, string>;
  },
});

export const update = mutation({
  args: {
    adminToken: v.string(),
    key: v.string(),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const { user: actor } = await requirePermission(ctx, args.adminToken, PERMISSIONS.SETTINGS_EDIT);
    if (!ALLOWED_KEYS.has(args.key)) throw new Error("Unknown setting");
    const existing = await ctx.db
      .query("appSettings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();
    const value = args.value.trim().slice(0, 200);
    if (existing) {
      await ctx.db.patch(existing._id, {
        value,
        updatedAt: Date.now(),
        updatedBy: actor._id,
      });
    } else {
      await ctx.db.insert("appSettings", {
        key: args.key,
        value,
        updatedAt: Date.now(),
        updatedBy: actor._id,
      });
    }
    await writeAudit(ctx, {
      actor,
      action: "settings.updated",
      entityType: "appSettings",
      entityId: args.key,
    });
    return { ok: true as const };
  },
});

export const securityOverview = query({
  args: { adminToken: v.string() },
  handler: async (ctx, { adminToken }) => {
    await requireOwner(ctx, adminToken);
    const sessions = await ctx.db.query("sessions").collect();
    const active = sessions.filter((s) => !s.revokedAt && s.expiresAt > Date.now());
    return {
      activeSessions: active.length,
      owners: (
        await ctx.db
          .query("users")
          .withIndex("by_kind", (q) => q.eq("kind", "owner"))
          .collect()
      ).map((u) => ({
        id: u._id,
        email: u.email,
        lastLoginAt: u.lastLoginAt,
        status: u.status,
      })),
    };
  },
});
