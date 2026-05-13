import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("bookings").order("desc").collect();
  },
});

export const getById = query({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    contactName: v.string(),
    contactEmail: v.optional(v.string()),
    contactPhone: v.string(),
    whatsapp: v.optional(v.string()),
    type: v.union(
      v.literal("trip"),
      v.literal("hotel"),
      v.literal("activity"),
      v.literal("transportation"),
    ),
    itemId: v.string(),
    itemTitle: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.string(),
    guests: v.number(),
    totalPrice: v.number(),
    currency: v.union(
      v.literal("USD"),
      v.literal("SAR"),
      v.literal("AED"),
      v.literal("TRY"),
      v.literal("QAR"),
      v.literal("KWD"),
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed"),
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bookings", args);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("bookings"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed"),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const remove = mutation({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
