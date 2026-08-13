import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { notify, requireIdentity, requirePermission, writeAudit } from "./authz";
import { PERMISSIONS } from "./permissions";

const bookingType = v.union(
  v.literal("trip"),
  v.literal("hotel"),
  v.literal("activity"),
  v.literal("transportation"),
);

const bookingStatus = v.union(
  v.literal("pending"),
  v.literal("confirmed"),
  v.literal("cancelled"),
  v.literal("completed"),
);

const currency = v.union(
  v.literal("USD"),
  v.literal("SAR"),
  v.literal("AED"),
  v.literal("TRY"),
  v.literal("QAR"),
  v.literal("KWD"),
);

export const getAll = query({
  args: { adminToken: v.string() },
  handler: async (ctx, { adminToken }) => {
    await requirePermission(ctx, adminToken, PERMISSIONS.BOOKINGS_VIEW);
    return await ctx.db.query("bookings").order("desc").collect();
  },
});

export const getById = query({
  args: { adminToken: v.string(), id: v.id("bookings") },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.adminToken, PERMISSIONS.BOOKINGS_VIEW);
    return await ctx.db.get(args.id);
  },
});

export const listForUser = query({
  args: { adminToken: v.string(), userId: v.id("users") },
  handler: async (ctx, args) => {
    const { user, permissions } = await requireIdentity(ctx, args.adminToken);
    const allowed =
      user.kind === "owner" ||
      permissions.has(PERMISSIONS.CUSTOMERS_VIEW) ||
      permissions.has(PERMISSIONS.BOOKINGS_VIEW);
    if (!allowed) throw new Error("Forbidden");
    const target = await ctx.db.get(args.userId);
    if (!target) return [];
    const byUser = await ctx.db
      .query("bookings")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .take(50);
    const byEmail = await ctx.db
      .query("bookings")
      .withIndex("by_contactEmail", (q) => q.eq("contactEmail", target.email))
      .take(50);
    const seen = new Set<string>();
    const merged = [];
    for (const row of [...byUser, ...byEmail]) {
      if (seen.has(row._id)) continue;
      seen.add(row._id);
      merged.push(row);
    }
    return merged.sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const listMine = query({
  args: { authToken: v.string() },
  handler: async (ctx, { authToken }) => {
    const { user } = await requireIdentity(ctx, authToken);
    const byUser = await ctx.db
      .query("bookings")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(50);
    const byEmail = user.email
      ? await ctx.db
          .query("bookings")
          .withIndex("by_contactEmail", (q) => q.eq("contactEmail", user.email))
          .order("desc")
          .take(50)
      : [];
    const seen = new Set<string>();
    const merged = [];
    for (const row of [...byUser, ...byEmail]) {
      if (seen.has(row._id)) continue;
      seen.add(row._id);
      merged.push(row);
    }
    return merged.sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const getMineById = query({
  args: { authToken: v.string(), id: v.id("bookings") },
  handler: async (ctx, args) => {
    const { user } = await requireIdentity(ctx, args.authToken);
    const booking = await ctx.db.get(args.id);
    if (!booking) return null;
    const owns =
      booking.userId === user._id ||
      (booking.contactEmail && booking.contactEmail.toLowerCase() === user.email);
    if (!owns) throw new Error("Forbidden");
    return booking;
  },
});

export const create = mutation({
  args: {
    adminToken: v.string(),
    contactName: v.string(),
    contactEmail: v.optional(v.string()),
    contactPhone: v.string(),
    whatsapp: v.optional(v.string()),
    type: bookingType,
    itemId: v.string(),
    itemTitle: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.string(),
    guests: v.number(),
    totalPrice: v.number(),
    currency,
    notes: v.optional(v.string()),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, { adminToken, ...args }) => {
    const { user: actor } = await requirePermission(ctx, adminToken, PERMISSIONS.BOOKINGS_CREATE);
    const id = await ctx.db.insert("bookings", { ...args, status: "pending" });
    await writeAudit(ctx, {
      actor,
      action: "booking.created",
      entityType: "booking",
      entityId: id,
    });
    if (args.userId) {
      await notify(ctx, {
        userId: args.userId,
        type: "booking",
        title: "Booking received",
        body: `We received your ${args.type} request${args.itemTitle ? ` for ${args.itemTitle}` : ""}.`,
        href: "/account/bookings",
      });
    }
    return id;
  },
});

export const updateStatus = mutation({
  args: {
    adminToken: v.string(),
    id: v.id("bookings"),
    status: bookingStatus,
  },
  handler: async (ctx, args) => {
    const needed =
      args.status === "cancelled"
        ? PERMISSIONS.BOOKINGS_CANCEL
        : args.status === "completed"
          ? PERMISSIONS.BOOKINGS_COMPLETE
          : PERMISSIONS.BOOKINGS_EDIT;
    const { user: actor } = await requirePermission(ctx, args.adminToken, needed);
    const booking = await ctx.db.get(args.id);
    if (!booking) throw new Error("Not found");
    await ctx.db.patch(args.id, { status: args.status });
    await writeAudit(ctx, {
      actor,
      action: "booking.status_changed",
      entityType: "booking",
      entityId: args.id,
      metadata: { from: booking.status, to: args.status },
    });
    const targetUserId =
      booking.userId ??
      (booking.contactEmail
        ? (
            await ctx.db
              .query("users")
              .withIndex("by_email", (q) => q.eq("email", booking.contactEmail!.toLowerCase()))
              .unique()
          )?._id
        : undefined);
    if (targetUserId) {
      await notify(ctx, {
        userId: targetUserId,
        type: "booking",
        title: "Booking updated",
        body: `Your booking is now ${args.status}.`,
        href: "/account/bookings",
      });
    }
  },
});

export const remove = mutation({
  args: { adminToken: v.string(), id: v.id("bookings") },
  handler: async (ctx, args) => {
    const { user: actor } = await requirePermission(ctx, args.adminToken, PERMISSIONS.BOOKINGS_EDIT);
    if (actor.kind !== "owner") throw new Error("Forbidden");
    await ctx.db.delete(args.id);
    await writeAudit(ctx, {
      actor,
      action: "booking.deleted",
      entityType: "booking",
      entityId: args.id,
    });
  },
});
