import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("destinations").order("desc").collect();
  },
});

export const getById = query({
  args: { id: v.id("destinations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name_en: v.string(),
    name_ar: v.string(),
    name_tr: v.string(),
    tag_en: v.string(),
    tag_ar: v.string(),
    tag_tr: v.string(),
    badge_en: v.string(),
    badge_ar: v.string(),
    badge_tr: v.string(),
    desc_en: v.string(),
    desc_ar: v.string(),
    desc_tr: v.string(),
    flightTime_en: v.string(),
    flightTime_ar: v.string(),
    flightTime_tr: v.string(),
    climate_en: v.string(),
    climate_ar: v.string(),
    climate_tr: v.string(),
    signature_en: v.string(),
    signature_ar: v.string(),
    signature_tr: v.string(),
    color: v.string(),
    accent: v.string(),
    icon: v.string(),
    lat: v.number(),
    lng: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("destinations", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("destinations"),
    name_en: v.optional(v.string()),
    name_ar: v.optional(v.string()),
    name_tr: v.optional(v.string()),
    tag_en: v.optional(v.string()),
    tag_ar: v.optional(v.string()),
    tag_tr: v.optional(v.string()),
    badge_en: v.optional(v.string()),
    badge_ar: v.optional(v.string()),
    badge_tr: v.optional(v.string()),
    desc_en: v.optional(v.string()),
    desc_ar: v.optional(v.string()),
    desc_tr: v.optional(v.string()),
    flightTime_en: v.optional(v.string()),
    flightTime_ar: v.optional(v.string()),
    flightTime_tr: v.optional(v.string()),
    climate_en: v.optional(v.string()),
    climate_ar: v.optional(v.string()),
    climate_tr: v.optional(v.string()),
    signature_en: v.optional(v.string()),
    signature_ar: v.optional(v.string()),
    signature_tr: v.optional(v.string()),
    color: v.optional(v.string()),
    accent: v.optional(v.string()),
    icon: v.optional(v.string()),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("destinations") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
