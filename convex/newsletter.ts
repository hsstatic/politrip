import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requirePermission } from "./authz";
import { PERMISSIONS } from "./permissions";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const subscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const normalized = email.trim().toLowerCase();
    if (!EMAIL_RE.test(normalized) || normalized.length > 254) {
      throw new Error("Invalid email");
    }
    const existing = await ctx.db
      .query("newsletter")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .unique();
    if (existing) return { ok: true as const, duplicate: true };

    const recent = await ctx.db.query("newsletter").order("desc").take(20);
    if (recent.length === 20 && Date.now() - recent[19].createdAt < 60_000) {
      throw new Error("Too many requests");
    }

    await ctx.db.insert("newsletter", { email: normalized, createdAt: Date.now() });
    return { ok: true as const, duplicate: false };
  },
});

export const getAll = query({
  args: { adminToken: v.string() },
  handler: async (ctx, { adminToken }) => {
    await requirePermission(ctx, adminToken, PERMISSIONS.NEWSLETTER_VIEW);
    return await ctx.db.query("newsletter").order("desc").collect();
  },
});
