'use client';

import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useTranslations } from '@/hooks/useTranslations';
import { EASE_OUT, viewportOnce } from '@/lib/motion';
import type { Language } from '@/types';

const CITY_LABELS: Record<string, string> = {
  istanbul: 'Istanbul',
  antalya: 'Antalya',
  trabzon: 'Trabzon',
  bursa: 'Bursa',
  cappadocia: 'Cappadocia',
  bodrum: 'Bodrum',
  sapanca: 'Sapanca',
};

const CATEGORY_STYLES: Record<string, { color: string }> = {
  'ultra-luxury': { color: '#fcd34d' },
  luxury:         { color: '#67e8f9' },
  boutique:       { color: '#c4b5fd' },
  resort:         { color: '#6ee7b7' },
};

function StarRow({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: Math.min(count, 5) }, (_, i) => (
        <span key={i} className="text-amber-400 text-[11px]">★</span>
      ))}
    </span>
  );
}

function HotelRow({
  hotel,
  lang,
  t,
  index,
  isLast,
}: {
  hotel: {
    _id: string;
    name_en: string; name_ar: string; name_tr: string;
    city: string; stars: number; price: number; category: string;
    images: string[]; amenities: string[]; isVIP: boolean; rating: number;
  };
  lang: Language;
  t: (key: Parameters<ReturnType<typeof useTranslations>['t']>[0]) => string;
  index: number;
  isLast: boolean;
}) {
  const name = lang === 'ar' ? hotel.name_ar : lang === 'tr' ? hotel.name_tr : hotel.name_en;
  const image = hotel.images[0];
  const catColor = CATEGORY_STYLES[hotel.category]?.color ?? 'rgba(255,255,255,0.4)';
  const indexLabel = String(index + 1).padStart(2, '0');

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.75, delay: index * 0.08, ease: EASE_OUT }}
    >
      {/* Row */}
      <div className="group flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10 py-10 lg:py-14">

        {/* Index number — ghost watermark, desktop only */}
        <div
          className="hidden lg:block flex-shrink-0 w-16 text-right select-none"
          aria-hidden
        >
          <span
            className="text-[110px] font-light leading-none text-white/[0.05]"
            style={{ fontFamily: 'var(--font-display, serif)' }}
          >
            {indexLabel}
          </span>
        </div>

        {/* Image */}
        <div className="relative flex-1 overflow-hidden rounded-2xl aspect-[4/3] bg-white/5">
          {/* Mobile index */}
          <span
            className="lg:hidden absolute top-3 left-4 text-[11px] uppercase tracking-[0.32em] text-white/35 z-10"
            aria-hidden
          >
            {indexLabel}
          </span>

          {image ? (
            <img
              src={image}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              style={{ willChange: 'transform' }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/10 text-5xl">🏨</div>
          )}

          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* VIP badge */}
          {hotel.isVIP && (
            <span className="absolute top-3 right-3 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-amber-500/90 text-black shadow-[0_0_12px_rgba(245,158,11,0.5)] z-10">
              {t('hotels.vip')}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="lg:w-[300px] lg:flex-shrink-0 flex flex-col gap-3">
          {/* Category */}
          <span
            className="text-[10px] uppercase tracking-[0.32em] font-medium"
            style={{ color: catColor }}
          >
            {hotel.category}
          </span>

          {/* Name + stars */}
          <div>
            <h3
              className="text-white text-xl lg:text-2xl font-light leading-snug mb-1"
              style={{ fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.02em' }}
            >
              {name}
            </h3>
            <div className="flex items-center gap-2">
              <StarRow count={hotel.stars} />
              <span className="text-white/30 text-[10px] uppercase tracking-wider">
                {CITY_LABELS[hotel.city] ?? hotel.city}
              </span>
            </div>
          </div>

          {/* Amenity tags */}
          {hotel.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {hotel.amenities.slice(0, 3).map((a) => (
                <span key={a} className="text-[10px] text-white/30 border border-white/[0.08] px-2.5 py-1 rounded-full">
                  {a}
                </span>
              ))}
              {hotel.amenities.length > 3 && (
                <span className="text-[10px] text-white/20">+{hotel.amenities.length - 3}</span>
              )}
            </div>
          )}

          {/* Price + CTA */}
          <div className="flex items-center justify-between gap-3 mt-1">
            <div>
              <span className="text-white text-lg font-semibold">${hotel.price}</span>
              <span className="text-white/30 text-[11px] ml-1">{t('hotels.perNight')}</span>
            </div>
            <a
              href="https://wa.me/905526867559"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full text-[10px] font-bold tracking-[0.22em] uppercase bg-gradient-to-br from-accent-light via-accent to-accent-dark text-on-accent glow-gold hover:scale-105 transition-transform duration-200 flex-shrink-0"
            >
              {t('hotels.book')}
            </a>
          </div>
        </div>
      </div>

      {/* Divider — not after last row */}
      {!isLast && <div className="h-px bg-white/8" />}
    </motion.article>
  );
}

export default function Hotels() {
  const { t, language, isRTL } = useTranslations();
  const lang = language;
  const hotels = useQuery(api.hotels.getAll);

  // On the homepage, hide the section when no hotels exist yet
  const isStandalonePage = typeof window !== 'undefined' && window.location.pathname.includes('/hotels');
  if (!isStandalonePage && hotels !== undefined && hotels.length === 0) return null;

  return (
    <section
      id="hotels"
      className="relative bg-canvas overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div
        className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(34,211,238,0.04) 0%, transparent 60%)',
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 pt-24 lg:pt-36 pb-20 lg:pb-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.95, ease: EASE_OUT }}
          className="max-w-3xl mb-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent" />
            <span className="text-[10px] uppercase tracking-[0.42em] text-accent font-bold">
              {t('hotels.kicker')}
            </span>
          </div>
          <h2
            className="text-[clamp(38px,5.4vw,84px)] font-[350] text-white leading-[0.94] mb-7"
            style={{ fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.025em' }}
          >
            {t('hotels.titleBefore')}{' '}{t('hotels.titleAccent')}
          </h2>
          <p className="text-white/55 text-base lg:text-lg leading-[1.7] max-w-xl">
            {t('hotels.subtitle')}
          </p>
        </motion.div>

        {/* Full-width rule separating header from list */}
        <div className="h-px bg-white/10 mb-0" />

        {/* List — on homepage cap at 3 */}
        {hotels === undefined ? (
          /* Loading skeleton — 3 placeholder rows */
          <div>
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 py-10 lg:py-14">
                  <div className="hidden lg:block w-16" />
                  <div className="flex-1 aspect-[4/3] rounded-2xl bg-white/5 animate-pulse" />
                  <div className="lg:w-[300px] space-y-3">
                    <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                    <div className="h-7 w-48 bg-white/5 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-white/5 rounded animate-pulse" />
                  </div>
                </div>
                {i < 2 && <div className="h-px bg-white/8" />}
              </div>
            ))}
          </div>
        ) : (
          <div>
            {hotels.map((hotel, i) => (
              <HotelRow
                key={hotel._id}
                hotel={hotel}
                lang={language}
                t={t}
                index={i}
                isLast={i === hotels.length - 1}
              />
            ))}
          </div>
        )}

        {/* View all button — only on homepage */}
        {!isStandalonePage && hotels && hotels.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="flex justify-center pt-12"
          >
            <a
              href={`/${lang}/hotels`}
              className="group flex items-center gap-3 px-8 py-4 rounded-full border border-accent/30 text-[11px] uppercase tracking-[0.32em] text-accent hover:bg-accent/10 hover:border-accent transition-all duration-300"
            >
              View All Hotels
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
