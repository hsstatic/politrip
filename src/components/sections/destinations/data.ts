/**
 * Shared types for destination content (data itself lives in Convex).
 *
 * Per-destination `accent` colors are intentionally NOT the brand accent —
 * they're editorial color-coding so each city has its own visual personality
 * (badge, pulse dot, fact-chip borders, index numeral).
 */

import type { LocalizedString } from '@/types';

export type DestCategory = 'culture' | 'nature' | 'beach' | 'honeymoon';

export type Destination = {
  id: string;
  name: LocalizedString;
  /** Short headline tagline ("The Heart of Two Worlds"). */
  tag: LocalizedString;
  /** Editorial badge ("Most Popular", "Iconic", "Beach VIP", etc.). */
  badge: LocalizedString;
  desc: LocalizedString;
  /** Editorial accent color used for badge / pin / active state. */
  color: string;
  accent: string;
  icon: string;
  /** Real geographic coordinates — drives map pin placement + zoom focus. */
  lng: number;
  lat: number;
  /** Three quick-fact chips shown in each chapter. */
  flightTime: LocalizedString;
  climate: LocalizedString;
  signature: LocalizedString;
  category: DestCategory;
};

export type DestinationWithImage = Destination & { imageUrl?: string };

/** Shape of a `destinations` document as stored in Convex. */
export type ConvexDestinationDoc = {
  _id: string;
  name_en: string; name_ar: string; name_tr: string;
  tag_en: string; tag_ar: string; tag_tr: string;
  badge_en: string; badge_ar: string; badge_tr: string;
  desc_en: string; desc_ar: string; desc_tr: string;
  flightTime_en: string; flightTime_ar: string; flightTime_tr: string;
  climate_en: string; climate_ar: string; climate_tr: string;
  signature_en: string; signature_ar: string; signature_tr: string;
  color: string; accent: string; icon: string; images?: string[]; lat: number; lng: number;
};

const BADGE_TO_CATEGORY: Record<string, DestCategory> = {
  nature: 'nature',
  doğa: 'nature',
  طبيعة: 'nature',
  beach: 'beach',
  plaj: 'beach',
  شاطئ: 'beach',
  honeymoon: 'honeymoon',
  balayı: 'honeymoon',
  'شهر العسل': 'honeymoon',
};

function badgeToCategory(badge: string): DestCategory {
  const lower = badge.toLowerCase();
  for (const [key, cat] of Object.entries(BADGE_TO_CATEGORY)) {
    if (lower.includes(key)) return cat;
  }
  return 'culture';
}

/** Maps a Convex destination document to the UI `Destination` shape. */
export function convexToDestination(doc: ConvexDestinationDoc): DestinationWithImage {
  return {
    id: doc.name_en.toLowerCase().replace(/\s+/g, '-'),
    name: { en: doc.name_en, ar: doc.name_ar, tr: doc.name_tr },
    tag: { en: doc.tag_en, ar: doc.tag_ar, tr: doc.tag_tr },
    badge: { en: doc.badge_en, ar: doc.badge_ar, tr: doc.badge_tr },
    desc: { en: doc.desc_en, ar: doc.desc_ar, tr: doc.desc_tr },
    flightTime: { en: doc.flightTime_en, ar: doc.flightTime_ar, tr: doc.flightTime_tr },
    climate: { en: doc.climate_en, ar: doc.climate_ar, tr: doc.climate_tr },
    signature: { en: doc.signature_en, ar: doc.signature_ar, tr: doc.signature_tr },
    color: doc.color,
    accent: doc.accent,
    icon: doc.icon,
    imageUrl: doc.images?.[0],
    lat: doc.lat,
    lng: doc.lng,
    category: badgeToCategory(doc.badge_en),
  };
}
