import { mutation } from "../_generated/server";

/**
 * One-time migration: copies the old `imageUrl` string field into the new `images[]` array.
 * Run once from the Convex dashboard after deploying the schema change.
 * Safe to run multiple times — skips rows that already have images.
 */
export const run = mutation({
  args: {},
  handler: async (ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await ctx.db.query("destinations").collect() as any[];
    let migrated = 0;
    for (const row of rows) {
      const hasImages = Array.isArray(row.images) && row.images.length > 0;
      if (hasImages) continue;

      const legacyUrl: string | undefined = row.imageUrl;
      const newImages = legacyUrl ? [legacyUrl] : [];
      await ctx.db.patch(row._id, { images: newImages });
      migrated++;
    }
    return { migrated, total: rows.length };
  },
});
