import { query } from "./_generated/server";
import { v } from "convex/values";
import { requireStaff } from "./authz";
import { PERMISSIONS } from "./permissions";

function monthKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export const bookings = query({
  args: { adminToken: v.string() },
  handler: async (ctx, { adminToken }) => {
    const { user, permissions } = await requireStaff(ctx, adminToken);
    const canView =
      user.kind === "owner" ||
      permissions.has(PERMISSIONS.BOOKINGS_VIEW) ||
      permissions.has(PERMISSIONS.FINANCE_VIEW);
    if (!canView) throw new Error("Forbidden");
    const canFinance = user.kind === "owner" || permissions.has(PERMISSIONS.FINANCE_VIEW);

    const rows = await ctx.db.query("bookings").collect();
    const byStatus: Record<string, number> = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };
    const byType: Record<string, number> = {};
    const volumeByCurrency: Record<string, number> = {};
    const byMonth: Record<string, { count: number; volume: number }> = {};

    for (const row of rows) {
      byStatus[row.status] = (byStatus[row.status] ?? 0) + 1;
      byType[row.type] = (byType[row.type] ?? 0) + 1;
      const key = monthKey(row._creationTime);
      if (!byMonth[key]) byMonth[key] = { count: 0, volume: 0 };
      byMonth[key].count += 1;
      if (row.status === "confirmed" || row.status === "completed") {
        const amount = Number.isFinite(row.totalPrice) ? row.totalPrice : 0;
        volumeByCurrency[row.currency] = (volumeByCurrency[row.currency] ?? 0) + amount;
        byMonth[key].volume += amount;
      }
    }

    const months = Object.keys(byMonth)
      .sort()
      .slice(-12)
      .map((key) => ({
        month: key,
        count: byMonth[key].count,
        volume: canFinance ? byMonth[key].volume : null,
      }));

    return {
      total: rows.length,
      byStatus,
      byType,
      volumeByCurrency: canFinance ? volumeByCurrency : null,
      months,
      canFinance,
    };
  },
});
