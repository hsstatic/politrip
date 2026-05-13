export const MARKETING_SLUGS = [
  'about',
  'team',
  'careers',
  'press',
  'help',
  'privacy',
  'terms',
  'contact',
] as const;

export type MarketingSlug = (typeof MARKETING_SLUGS)[number];

export function isMarketingSlug(s: string): s is MarketingSlug {
  return (MARKETING_SLUGS as readonly string[]).includes(s);
}
