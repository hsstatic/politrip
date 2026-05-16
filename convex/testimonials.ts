import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("testimonials").order("asc").collect();
  },
});

export const getById = query({
  args: { id: v.id("testimonials") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    country_en: v.string(), country_ar: v.string(), country_tr: v.string(),
    flag: v.string(),
    role_en: v.string(), role_ar: v.string(), role_tr: v.string(),
    text_en: v.string(), text_ar: v.string(), text_tr: v.string(),
    trip_en: v.string(), trip_ar: v.string(), trip_tr: v.string(),
    date_en: v.string(), date_ar: v.string(), date_tr: v.string(),
    rating: v.number(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("testimonials", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("testimonials"),
    name: v.optional(v.string()),
    country_en: v.optional(v.string()), country_ar: v.optional(v.string()), country_tr: v.optional(v.string()),
    flag: v.optional(v.string()),
    role_en: v.optional(v.string()), role_ar: v.optional(v.string()), role_tr: v.optional(v.string()),
    text_en: v.optional(v.string()), text_ar: v.optional(v.string()), text_tr: v.optional(v.string()),
    trip_en: v.optional(v.string()), trip_ar: v.optional(v.string()), trip_tr: v.optional(v.string()),
    date_en: v.optional(v.string()), date_ar: v.optional(v.string()), date_tr: v.optional(v.string()),
    rating: v.optional(v.number()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("testimonials") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
