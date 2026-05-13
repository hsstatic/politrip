import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("hotels").order("desc").collect();
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
    name_en: v.string(),
    name_ar: v.string(),
    name_tr: v.string(),
    description_en: v.string(),
    description_ar: v.string(),
    description_tr: v.string(),
    city: v.union(
      v.literal("istanbul"),
      v.literal("antalya"),
      v.literal("trabzon"),
      v.literal("bursa"),
      v.literal("cappadocia"),
      v.literal("bodrum"),
      v.literal("sapanca"),
    ),
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
  handler: async (ctx, args) => {
    return await ctx.db.insert("hotels", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("hotels"),
    name_en: v.optional(v.string()),
    name_ar: v.optional(v.string()),
    name_tr: v.optional(v.string()),
    description_en: v.optional(v.string()),
    description_ar: v.optional(v.string()),
    description_tr: v.optional(v.string()),
    city: v.optional(v.union(
      v.literal("istanbul"),
      v.literal("antalya"),
      v.literal("trabzon"),
      v.literal("bursa"),
      v.literal("cappadocia"),
      v.literal("bodrum"),
      v.literal("sapanca"),
    )),
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
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("hotels") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
