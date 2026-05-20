/** Paths owned by dedicated app routes — must not appear here (e.g. /hotels, /about). */
export const MARKETING_SLUGS = [
  'team',
  'help',
  'privacy',
  'terms',
  'contact',
  'vision',
  'vip',
] as const;

export type MarketingSlug = (typeof MARKETING_SLUGS)[number];

export function isMarketingSlug(s: string): s is MarketingSlug {
  return (MARKETING_SLUGS as readonly string[]).includes(s);
}
