import { query } from "./_generated/server";
import { v } from "convex/values";
import { requireStaff } from "./authz";
import { PERMISSIONS } from "./permissions";

export const staffStats = query({
  args: { adminToken: v.string() },
  handler: async (ctx, { adminToken }) => {
    const { user, permissions } = await requireStaff(ctx, adminToken);
    const isOwner = user.kind === "owner";
    const canCustomers = isOwner || permissions.has(PERMISSIONS.CUSTOMERS_VIEW);
    const canEmployees = isOwner || permissions.has(PERMISSIONS.EMPLOYEES_VIEW);
    const canBookings = isOwner || permissions.has(PERMISSIONS.BOOKINGS_VIEW);
    const canFinance = isOwner || permissions.has(PERMISSIONS.FINANCE_VIEW);
    const canNewsletter = isOwner || permissions.has(PERMISSIONS.NEWSLETTER_VIEW);

    const [hotels, destinations, trips, testimonials, gallery] = await Promise.all([
      ctx.db.query("hotels").collect(),
      ctx.db.query("destinations").collect(),
      ctx.db.query("trips").collect(),
      ctx.db.query("testimonials").collect(),
      ctx.db.query("gallery").collect(),
    ]);

    let customersTotal = 0;
    let customersActive = 0;
    let customersNew = 0;
    if (canCustomers) {
      const customers = await ctx.db
        .query("users")
        .withIndex("by_kind", (q) => q.eq("kind", "customer"))
        .collect();
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      customersTotal = customers.length;
      customersActive = customers.filter((c) => c.status === "active").length;
      customersNew = customers.filter((c) => c.createdAt >= weekAgo).length;
    }

    let employeesTotal = 0;
    let employeesActive = 0;
    if (canEmployees) {
      const employees = await ctx.db
        .query("users")
        .withIndex("by_kind", (q) => q.eq("kind", "employee"))
        .collect();
      employeesTotal = employees.length;
      employeesActive = employees.filter((e) => e.status === "active").length;
    }

    let bookingsTotal = 0;
    let bookingsPending = 0;
    let bookingsConfirmed = 0;
    let bookingsCompleted = 0;
    let bookingVolume = 0;
    if (canBookings) {
      const bookings = await ctx.db.query("bookings").collect();
      bookingsTotal = bookings.length;
      bookingsPending = bookings.filter((b) => b.status === "pending").length;
      bookingsConfirmed = bookings.filter((b) => b.status === "confirmed").length;
      bookingsCompleted = bookings.filter((b) => b.status === "completed").length;
      if (canFinance) {
        bookingVolume = bookings
          .filter((b) => b.status === "confirmed" || b.status === "completed")
          .reduce((sum, b) => sum + (Number.isFinite(b.totalPrice) ? b.totalPrice : 0), 0);
      }
    }

    let newsletterTotal = 0;
    if (canNewsletter) {
      const subs = await ctx.db.query("newsletter").collect();
      newsletterTotal = subs.length;
    }

    return {
      hotels: hotels.length,
      destinations: destinations.length,
      trips: trips.length,
      testimonials: testimonials.length,
      gallery: gallery.length,
      customersTotal: canCustomers ? customersTotal : null,
      customersActive: canCustomers ? customersActive : null,
      customersNew: canCustomers ? customersNew : null,
      employeesTotal: canEmployees ? employeesTotal : null,
      employeesActive: canEmployees ? employeesActive : null,
      bookingsTotal: canBookings ? bookingsTotal : null,
      bookingsPending: canBookings ? bookingsPending : null,
      bookingsConfirmed: canBookings ? bookingsConfirmed : null,
      bookingsCompleted: canBookings ? bookingsCompleted : null,
      bookingVolume: canFinance ? bookingVolume : null,
      newsletterTotal: canNewsletter ? newsletterTotal : null,
    };
  },
});

export const workspaceStats = query({
  args: { adminToken: v.string() },
  handler: async (ctx, { adminToken }) => {
    const { permissions } = await requireStaff(ctx, adminToken);
    const canBookings = permissions.has(PERMISSIONS.BOOKINGS_VIEW);
    if (!canBookings) {
      return { pending: 0, confirmed: 0, recent: [] as Array<Record<string, unknown>> };
    }
    const bookings = await ctx.db.query("bookings").order("desc").take(20);
    return {
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      recent: bookings.slice(0, 8).map((b) => ({
        id: b._id,
        contactName: b.contactName,
        itemTitle: b.itemTitle ?? b.itemId,
        status: b.status,
        startDate: b.startDate,
        type: b.type,
      })),
    };
  },
});
