/**
 * Single source of truth for the Destinations "Cinematic Editorial Spreads".
 *
 * `lng` / `lat` are real geographic coordinates, surfaced as a typographic
 * detail in each spread's corner ("41.01° N · 28.95° E").
 *
 * Per-destination `accent` colors are intentionally NOT brand cyan — they're
 * editorial color-coding so each city has its own visual personality (badge,
 * pulse dot, fact-chip borders, index numeral).
 */

import type { LocalizedString } from '@/types';

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
};

export const destinations: Destination[] = [
  {
    id: 'istanbul',
    name: { en: 'Istanbul', ar: 'إسطنبول', tr: 'İstanbul' },
    tag: { en: 'The Heart of Two Worlds', ar: 'قلب عالمين', tr: 'İki dünyanın kalbi' },
    badge: { en: 'Most Popular', ar: 'الأكثر طلباً', tr: 'En popüler' },
    desc: {
      en: 'Where East meets West — ancient mosques, rooftop restaurants, Bosphorus cruises, and vibrant bazaars steeped in a thousand years of empire.',
      ar: 'حيث يلتقي الشرق بالغرب — مساجد عريقة، مطاعم السطح، رحلات البوسفور، وأسواق حيوية تعبق بألف عام من الإمبراطوريات.',
      tr: 'Doğu ile Batı’nın buluştuğu yer — bin yıllık imparatorluk mirasıyla camiler, teras restoranlar, Boğaz turları ve çarşılar.',
    },
    color: '#1a3d63',
    accent: '#22d3ee',
    icon: '🕌',
    lng: 28.95,
    lat: 41.01,
    flightTime: {
      en: '3h 20m from Riyadh',
      ar: '٣س ٢٠د من الرياض',
      tr: 'Riyad’dan 3s 20dk',
    },
    climate: { en: 'Mediterranean · 22°C', ar: 'متوسطي · ٢٢°م', tr: 'Akdeniz · 22°C' },
    signature: {
      en: 'Bosphorus sunset cruise',
      ar: 'رحلة غروب البوسفور',
      tr: 'Boğaz’da gün batımı turu',
    },
  },
  {
    id: 'trabzon',
    name: { en: 'Trabzon', ar: 'طرابزون', tr: 'Trabzon' },
    tag: { en: 'The Black Sea Pearl', ar: 'جوهرة البحر الأسود', tr: 'Karadeniz incisi' },
    badge: { en: 'Nature', ar: 'طبيعة', tr: 'Doğa' },
    desc: {
      en: 'Sumela Monastery clinging impossibly to a cliff face, lush green highlands wrapped in mist, alpine lakes, and the most authentic corner of Türkiye.',
      ar: 'دير سوميلا المتشبث بشكل مستحيل بمنحدر صخري، ومرتفعات خضراء يلفها الضباب، وبحيرات جبلية، وأكثر زاوية أصيلة في تركيا.',
      tr: 'Uçuruma asılı Sumela Manastırı, sisli yeşil yaylalar, alpine göller ve Türkiye’nin en otantik köşesi.',
    },
    color: '#0e2a18',
    accent: '#4cad6c',
    icon: '🌿',
    lng: 39.72,
    lat: 41.0,
    flightTime: {
      en: '4h 45m via Istanbul',
      ar: '٤س ٤٥د عبر إسطنبول',
      tr: 'İstanbul aktarmalı 4s 45dk',
    },
    climate: { en: 'Oceanic · 17°C', ar: 'محيطي · ١٧°م', tr: 'Okyanus · 17°C' },
    signature: {
      en: 'Sumela Monastery + Uzungöl',
      ar: 'دير سوميلا وأوزونغول',
      tr: 'Sumela Manastırı + Uzungöl',
    },
  },
];
