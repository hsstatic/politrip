import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requirePermission } from "./authz";
import { PERMISSIONS } from "./permissions";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("hotels").order("desc").collect();
    return rows.sort((a, b) => {
      const ao = a.order ?? null;
      const bo = b.order ?? null;
      if (ao === null && bo === null) return 0;
      if (ao === null) return 1;
      if (bo === null) return -1;
      return ao - bo;
    });
  },
});

export const getByCity = query({
  args: { city: v.string() },
  handler: async (ctx, { city }) => {
    return await ctx.db
      .query("hotels")
      .filter((q) => q.eq(q.field("city"), city))
      .order("desc")
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("hotels") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    adminToken: v.string(),
    name_en: v.string(),
    name_ar: v.string(),
    name_tr: v.string(),
    description_en: v.string(),
    description_ar: v.string(),
    description_tr: v.string(),
    city: v.string(),
    stars: v.number(),
    rating: v.number(),
    reviews: v.number(),
    price: v.number(),
    images: v.array(v.string()),
    amenities: v.array(v.string()),
    category: v.union(
      v.literal("ultra-luxury"),
      v.literal("luxury"),
      v.literal("boutique"),
      v.literal("resort"),
    ),
    isVIP: v.boolean(),
    lat: v.number(),
    lng: v.number(),
  },
  handler: async (ctx, { adminToken, ...args }) => {
    await requirePermission(ctx, adminToken, PERMISSIONS.CONTENT_CREATE);
    return await ctx.db.insert("hotels", args);
  },
});

export const update = mutation({
  args: {
    adminToken: v.string(),
    id: v.id("hotels"),
    name_en: v.optional(v.string()),
    name_ar: v.optional(v.string()),
    name_tr: v.optional(v.string()),
    description_en: v.optional(v.string()),
    description_ar: v.optional(v.string()),
    description_tr: v.optional(v.string()),
    city: v.optional(v.string()),
    stars: v.optional(v.number()),
    rating: v.optional(v.number()),
    reviews: v.optional(v.number()),
    price: v.optional(v.number()),
    images: v.optional(v.array(v.string())),
    amenities: v.optional(v.array(v.string())),
    category: v.optional(v.union(
      v.literal("ultra-luxury"),
      v.literal("luxury"),
      v.literal("boutique"),
      v.literal("resort"),
    )),
    isVIP: v.optional(v.boolean()),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
  },
  handler: async (ctx, { adminToken, id, ...fields }) => {
    await requirePermission(ctx, adminToken, PERMISSIONS.CONTENT_EDIT);
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { adminToken: v.string(), id: v.id("hotels") },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.adminToken, PERMISSIONS.CONTENT_DELETE);
    await ctx.db.delete(args.id);
  },
});

export const reorder = mutation({
  args: { adminToken: v.string(), orderedIds: v.array(v.id("hotels")) },
  handler: async (ctx, { adminToken, orderedIds }) => {
    await requirePermission(ctx, adminToken, PERMISSIONS.CONTENT_EDIT);
    await Promise.all(
      orderedIds.map((id, index) => ctx.db.patch(id, { order: index }))
    );
  },
});
