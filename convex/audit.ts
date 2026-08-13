import { query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { requireOwner, requirePermission } from "./authz";
import { PERMISSIONS } from "./permissions";

export const list = query({
  args: {
    adminToken: v.string(),
    paginationOpts: paginationOptsValidator,
    action: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.adminToken, PERMISSIONS.AUDIT_VIEW);
    const result = await ctx.db.query("auditLogs").order("desc").paginate(args.paginationOpts);
    if (!args.action) return result;
    return {
      ...result,
      page: result.page.filter((row) => row.action === args.action),
    };
  },
});

export const ownerList = query({
  args: {
    adminToken: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    await requireOwner(ctx, args.adminToken);
    return await ctx.db.query("auditLogs").order("desc").paginate(args.paginationOpts);
  },
});
