import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requirePermission } from "./authz";
import { PERMISSIONS } from "./permissions";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("gallery").order("asc").collect();
  },
});

export const getById = query({
  args: { id: v.id("gallery") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    adminToken: v.string(),
    src: v.string(),
    label: v.string(),
    span: v.string(),
    order: v.number(),
  },
  handler: async (ctx, { adminToken, ...args }) => {
    await requirePermission(ctx, adminToken, PERMISSIONS.CONTENT_CREATE);
    return await ctx.db.insert("gallery", args);
  },
});

export const update = mutation({
  args: {
    adminToken: v.string(),
    id: v.id("gallery"),
    src: v.optional(v.string()),
    label: v.optional(v.string()),
    span: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, { adminToken, id, ...fields }) => {
    await requirePermission(ctx, adminToken, PERMISSIONS.CONTENT_EDIT);
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { adminToken: v.string(), id: v.id("gallery") },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.adminToken, PERMISSIONS.CONTENT_DELETE);
    await ctx.db.delete(args.id);
  },
});
