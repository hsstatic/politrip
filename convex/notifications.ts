import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { notify, requireIdentity, requirePermission } from "./authz";
import { PERMISSIONS } from "./permissions";

export const listMine = query({
  args: { authToken: v.string(), unreadOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const { user } = await requireIdentity(ctx, args.authToken);
    const rows = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(50);
    return args.unreadOnly ? rows.filter((n) => !n.readAt) : rows;
  },
});

export const unreadCount = query({
  args: { authToken: v.string() },
  handler: async (ctx, { authToken }) => {
    const { user } = await requireIdentity(ctx, authToken);
    const rows = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .take(100);
    return rows.filter((n) => !n.readAt).length;
  },
});

export const markRead = mutation({
  args: { authToken: v.string(), id: v.id("notifications") },
  handler: async (ctx, args) => {
    const { user } = await requireIdentity(ctx, args.authToken);
    const row = await ctx.db.get(args.id);
    if (!row || row.userId !== user._id) throw new Error("Forbidden");
    if (!row.readAt) await ctx.db.patch(args.id, { readAt: Date.now() });
    return { ok: true as const };
  },
});

export const markAllRead = mutation({
  args: { authToken: v.string() },
  handler: async (ctx, { authToken }) => {
    const { user } = await requireIdentity(ctx, authToken);
    const rows = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
    const now = Date.now();
    for (const row of rows) {
      if (!row.readAt) await ctx.db.patch(row._id, { readAt: now });
    }
    return { ok: true as const };
  },
});

export const send = mutation({
  args: {
    adminToken: v.string(),
    userId: v.id("users"),
    title: v.string(),
    body: v.string(),
    type: v.optional(v.string()),
    href: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.adminToken, PERMISSIONS.NOTIFICATIONS_MANAGE);
    const target = await ctx.db.get(args.userId);
    if (!target) throw new Error("Not found");
    await notify(ctx, {
      userId: args.userId,
      type: args.type?.trim() || "staff",
      title: args.title.trim().slice(0, 120),
      body: args.body.trim().slice(0, 500),
      href: args.href?.trim(),
    });
    return { ok: true as const };
  },
});
