'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { motion } from 'framer-motion';
import LenisProvider from '@/components/providers/LenisProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useTranslations } from '@/hooks/useTranslations';
import { EASE_OUT, EASE_EXPO_OUT, viewportOnce } from '@/lib/motion';
import type { Language } from '@/types';

const CATEGORY_STYLES: Record<string, { color: string; label: string }> = {
  'ultra-luxury': { color: '#fcd34d', label: 'Ultra Luxury' },
  luxury: { color: '#67e8f9', label: 'Luxury' },
  boutique: { color: '#c4b5fd', label: 'Boutique' },
  resort: { color: '#6ee7b7', label: 'Resort' },
};

const CITY_META: Record<string, { tagline: string; description: string; accentColor: string; region: string }> = {
  istanbul: {
    tagline: 'The Heart of Two Worlds',
    description: 'Where East meets West across the Bosphorus — a city of Byzantine grandeur, Ottoman splendour, and electrifying modern energy.',
    accentColor: '#22d3ee',
    region: 'Marmara Region',
  },
  antalya: {
    tagline: 'The Turquoise Coast',
    description: 'Dramatic limestone cliffs plunge into crystalline Mediterranean waters, framing ancient Roman ruins and world-class beach resorts.',
    accentColor: '#34d399',
    region: 'Mediterranean Coast',
  },
  cappadocia: {
    tagline: 'Valleys of Stone & Sky',
    description: 'A lunar landscape of fairy chimneys, cave hotels, and hot-air balloons drifting above rose-tinted valleys at dawn.',
    accentColor: '#fb923c',
    region: 'Central Anatolia',
  },
  trabzon: {
    tagline: 'The Black Sea Pearl',
    description: 'Lush green mountains tumble toward the sea. Ancient monasteries cling to cliffsides above valleys thick with hazelnut orchards.',
    accentColor: '#4ade80',
    region: 'Black Sea Region',
  },
  bodrum: {
    tagline: 'The Aegean Riviera',
    description: 'Whitewashed villas, superyacht marinas, and vibrant nightlife orbit the ancient Castle of St Peter on the turquoise Aegean.',
    accentColor: '#818cf8',
    region: 'Aegean Coast',
  },
  bursa: {
    tagline: 'The Green City',
    description: "Turkey's first Ottoman capital cradles thermal spas, snow-capped Uludağ, and a magnificent silk bazaar beneath centuries-old mosques.",
    accentColor: '#a3e635',
    region: 'Marmara Region',
  },
  sapanca: {
    tagline: "Nature's Escape",
    description: 'A serene lake ringed by forested hills offers the perfect retreat — thermal springs, farm-to-table cuisine, and mountain air.',
    accentColor: '#2dd4bf',
    region: 'Marmara Region',
  },
};

function StarRow({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: Math.min(count, 5) }, (_, i) => (
        <svg key={i} width="10" height="10" viewBox="0 0 10 10" fill="#fbbf24">
          <path d="M5 0l1.12 3.44H9.76L6.82 5.57l1.12 3.44L5 7l-2.94 2.01L3.18 5.57.24 3.44H3.88z" />
        </svg>
      ))}
    </span>
  );
}

function HotelCard({
  hotel,
  lang,
  index,
}: {
  hotel: {
    _id: string;
    name_en: string; name_ar: string; name_tr: string;
    city: string; stars: number; price: number; category: string;
    images: string[]; amenities: string[]; isVIP: boolean; rating: number;
  };
  lang: Language;
  index: number;
}) {
  const name = lang === 'ar' ? hotel.name_ar : lang === 'tr' ? hotel.name_tr : hotel.name_en;
  const image = hotel.images[0];
  const cat = CATEGORY_STYLES[hotel.category] ?? { color: 'rgba(255,255,255,0.4)', label: hotel.category };

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.8, ease: EASE_EXPO_OUT, delay: (index % 3) * 0.09 }}
      className="group relative rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.02] flex flex-col hover:border-white/[0.15] transition-colors duration-500"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/[0.03]">
            <span className="text-4xl mb-2 opacity-30">🏨</span>
            <span className="text-white/20 text-xs uppercase tracking-widest">No image</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span
            className="text-[9px] font-bold tracking-[0.3em] uppercase px-2.5 py-1 rounded-full backdrop-blur-sm"
            style={{
              color: cat.color,
              background: `${cat.color}18`,
              border: `1px solid ${cat.color}35`,
            }}
          >
            {cat.label}
          </span>
          {hotel.isVIP && (
            <span className="text-[9px] font-black tracking-[0.3em] uppercase px-2.5 py-1 rounded-full bg-amber-500/90 text-black shadow-[0_0_14px_rgba(245,158,11,0.45)]">
              VIP
            </span>
          )}
        </div>

        {/* Stars on image */}
        <div className="absolute bottom-3 left-4">
          <StarRow count={hotel.stars} />
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="text-white text-xl font-light leading-snug mb-3 group-hover:text-accent transition-colors duration-300"
          style={{ fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.02em' }}
        >
          {name}
        </h3>

        {hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {hotel.amenities.slice(0, 4).map((a) => (
              <span
                key={a}
                className="text-[9px] text-white/35 border border-white/[0.07] px-2.5 py-1 rounded-full"
              >
                {a}
              </span>
            ))}
            {hotel.amenities.length > 4 && (
              <span className="text-[9px] text-white/20 self-center">+{hotel.amenities.length - 4} more</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.06]">
          <div>
            <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] block mb-0.5">From</span>
            <div className="flex items-baseline gap-1">
              <span className="text-white text-2xl font-light">${hotel.price}</span>
              <span className="text-white/30 text-[11px]">/ night</span>
            </div>
          </div>
          <a
            href="https://wa.me/905300000000"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full text-[10px] font-bold tracking-[0.22em] uppercase bg-gradient-to-br from-accent-light via-accent to-accent-dark text-on-accent hover:scale-105 hover:brightness-110 transition-all duration-200"
          >
            Reserve
          </a>
        </div>
      </div>
    </motion.article>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02]">
      <div className="aspect-[4/3] bg-white/[0.04] animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-16 bg-white/[0.04] rounded animate-pulse" />
        <div className="h-6 w-44 bg-white/[0.05] rounded animate-pulse" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 w-16 bg-white/[0.03] rounded-full animate-pulse" />
          ))}
        </div>
        <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between">
          <div className="h-7 w-20 bg-white/[0.04] rounded animate-pulse" />
          <div className="h-8 w-20 bg-white/[0.04] rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function CityHotelsPage({
  params,
}: {
  params: Promise<{ lang: string; city: string }>;
}) {
  const { lang, city } = use(params);
  const language = lang as Language;
  const hotels = useQuery(api.hotels.getByCity, { city });
  const { isRTL } = useTranslations();

  const cityLabel = city.charAt(0).toUpperCase() + city.slice(1);
  const cityMeta = CITY_META[city.toLowerCase()] ?? {
    tagline: 'Discover the city',
    description: 'Explore our handpicked selection of luxury hotels in this destination.',
    accentColor: '#22d3ee',
    region: 'Türkiye',
  };

  return (
    <LenisProvider>
      <Navbar />
      <main
        className="relative flex min-h-0 flex-1 flex-col bg-canvas"
        dir={isRTL ? 'rtl' : 'ltr'}
      >

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28 px-6 sm:px-10 lg:px-20">
          {/* Ambient glow */}
          <div
            className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 70% 55% at 50% 0%, ${cityMeta.accentColor}10 0%, transparent 65%)`,
            }}
            aria-hidden
          />
          {/* Top shimmer line */}
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: `linear-gradient(to right, transparent, ${cityMeta.accentColor}45, transparent)` }}
            aria-hidden
          />

          <div className="relative z-10 max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            >
              <Link
                href={`/${lang}#destinations`}
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-white/30 hover:text-white/60 transition-colors mb-10"
              >
                <span>←</span>
                <span>All Destinations</span>
              </Link>
            </motion.div>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.05 }}
              className="flex items-center gap-3 mb-5"
            >
              <div
                className="h-px w-10"
                style={{ background: `linear-gradient(to right, transparent, ${cityMeta.accentColor})` }}
              />
              <span
                className="text-[10px] uppercase tracking-[0.42em] font-bold"
                style={{ color: cityMeta.accentColor }}
              >
                {cityMeta.region}
              </span>
            </motion.div>

            {/* City name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: EASE_EXPO_OUT, delay: 0.1 }}
              className="text-[clamp(52px,8vw,120px)] font-light text-white leading-[0.92] tracking-[-0.03em] mb-4"
              style={{ fontFamily: 'var(--font-display, serif)' }}
            >
              {cityLabel}
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE_EXPO_OUT, delay: 0.2 }}
              className="text-[clamp(15px,1.8vw,20px)] font-light mb-2 max-w-xl"
              style={{ color: cityMeta.accentColor }}
            >
              {cityMeta.tagline}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE_EXPO_OUT, delay: 0.28 }}
              className="text-white/45 text-base lg:text-lg max-w-2xl leading-[1.8] mb-10"
            >
              {cityMeta.description}
            </motion.p>

            {/* Hotel count pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE_EXPO_OUT, delay: 0.35 }}
              className="inline-flex items-center gap-3"
            >
              <span
                className="px-4 py-2 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase border"
                style={{
                  color: cityMeta.accentColor,
                  borderColor: `${cityMeta.accentColor}35`,
                  background: `${cityMeta.accentColor}0d`,
                }}
              >
                {hotels === undefined
                  ? 'Loading hotels…'
                  : hotels.length === 0
                  ? 'No hotels listed yet'
                  : `${hotels.length} ${hotels.length === 1 ? 'property' : 'properties'} available`}
              </span>
            </motion.div>
          </div>
        </section>

        {/* ── Divider ─────────────────────────────────────────────────── */}
        <div
          className="h-px mx-6 sm:mx-10 lg:mx-20 mb-16"
          style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)' }}
        />

        {/* ── Hotel grid ──────────────────────────────────────────────── */}
        <div className="px-6 sm:px-10 lg:px-20 pb-28 lg:pb-40 max-w-7xl mx-auto w-full">
          {hotels === undefined && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {hotels?.length === 0 && (
            <div className="text-center py-28">
              <p className="text-[64px] mb-5 opacity-20">🏨</p>
              <p
                className="text-2xl font-light mb-3"
                style={{ fontFamily: 'var(--font-display, serif)' }}
              >
                Coming Soon
              </p>
              <p className="text-white/30 text-sm max-w-xs mx-auto leading-relaxed">
                We are finalising our hotel selection for {cityLabel}. Contact us and we will hand-pick the perfect property for you.
              </p>
              <a
                href="https://wa.me/905300000000"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full text-[11px] font-bold tracking-[0.22em] uppercase border border-accent/35 text-accent hover:bg-accent/10 transition-colors"
              >
                WhatsApp Us
              </a>
            </div>
          )}

          {hotels && hotels.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel, i) => (
                <HotelCard key={hotel._id} hotel={hotel} lang={language} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* ── CTA strip ───────────────────────────────────────────────── */}
        <section className="border-t border-white/[0.07]">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-20 lg:py-28 flex flex-col lg:flex-row items-center justify-between gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: EASE_OUT }}
            >
              <p className="text-white/35 text-[10px] uppercase tracking-[0.32em] mb-2">Curated just for you</p>
              <h2
                className="text-[clamp(26px,3vw,44px)] font-light leading-tight tracking-[-0.02em] text-white"
                style={{ fontFamily: 'var(--font-display, serif)' }}
              >
                Need help choosing the right hotel?
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.7, ease: EASE_EXPO_OUT, delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-4 shrink-0"
            >
              <a
                href="https://wa.me/905300000000"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full text-[11px] font-bold tracking-[0.28em] uppercase text-[#02122d] transition-all duration-300 hover:scale-105 hover:brightness-110 text-center"
                style={{
                  background: 'linear-gradient(135deg, #67e8f9 0%, #22d3ee 50%, #0e7490 100%)',
                  boxShadow: '0 0 32px rgba(34,211,238,0.22)',
                }}
              >
                WhatsApp Our Team
              </a>
              <Link
                href={`/${lang}#hotels`}
                className="px-8 py-4 rounded-full text-[11px] font-bold tracking-[0.28em] uppercase text-accent border border-accent/30 hover:bg-accent/10 hover:border-accent/55 transition-all duration-300 hover:scale-105 text-center"
              >
                All Hotels
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </LenisProvider>
  );
}
