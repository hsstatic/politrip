import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("trips").order("desc").collect();
  },
});

export const getById = query({
  args: { id: v.id("trips") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title_en: v.string(),
    title_ar: v.string(),
    title_tr: v.string(),
    description_en: v.string(),
    description_ar: v.string(),
    description_tr: v.string(),
    highlights_en: v.array(v.string()),
    highlights_ar: v.array(v.string()),
    highlights_tr: v.array(v.string()),
    location: v.string(),
    duration: v.string(),
    price: v.number(),
    currency: v.union(
      v.literal("USD"),
      v.literal("SAR"),
      v.literal("AED"),
      v.literal("TRY"),
      v.literal("QAR"),
      v.literal("KWD"),
    ),
    category: v.union(
      v.literal("cultural"),
      v.literal("adventure"),
      v.literal("luxury"),
      v.literal("nature"),
      v.literal("yacht"),
      v.literal("helicopter"),
      v.literal("balloon"),
    ),
    rating: v.number(),
    reviews: v.number(),
    images: v.array(v.string()),
    capacity: v.number(),
    nextAvailable: v.string(),
    isVIP: v.boolean(),
    isPopular: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("trips", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("trips"),
    title_en: v.optional(v.string()),
    title_ar: v.optional(v.string()),
    title_tr: v.optional(v.string()),
    description_en: v.optional(v.string()),
    description_ar: v.optional(v.string()),
    description_tr: v.optional(v.string()),
    highlights_en: v.optional(v.array(v.string())),
    highlights_ar: v.optional(v.array(v.string())),
    highlights_tr: v.optional(v.array(v.string())),
    location: v.optional(v.string()),
    duration: v.optional(v.string()),
    price: v.optional(v.number()),
    currency: v.optional(v.union(
      v.literal("USD"),
      v.literal("SAR"),
      v.literal("AED"),
      v.literal("TRY"),
      v.literal("QAR"),
      v.literal("KWD"),
    )),
    category: v.optional(v.union(
      v.literal("cultural"),
      v.literal("adventure"),
      v.literal("luxury"),
      v.literal("nature"),
      v.literal("yacht"),
      v.literal("helicopter"),
      v.literal("balloon"),
    )),
    rating: v.optional(v.number()),
    reviews: v.optional(v.number()),
    images: v.optional(v.array(v.string())),
    capacity: v.optional(v.number()),
    nextAvailable: v.optional(v.string()),
    isVIP: v.optional(v.boolean()),
    isPopular: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("trips") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
