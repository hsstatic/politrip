'use client';

import { useRef, useState } from 'react';
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

function HotelCard({
  hotel,
  lang,
  t,
  index,
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
}) {
  const name = lang === 'ar' ? hotel.name_ar : lang === 'tr' ? hotel.name_tr : hotel.name_en;
  const image = hotel.images[0];
  const catColor = CATEGORY_STYLES[hotel.category]?.color ?? 'rgba(255,255,255,0.4)';

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.65, delay: index * 0.06, ease: EASE_OUT }}
      className="group flex-shrink-0 w-[280px] sm:w-[320px] flex flex-col rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.07] hover:border-accent/30 transition-colors duration-300"
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-white/5">
        {image ? (
          <img
            src={image}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            style={{ willChange: 'transform' }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/10 text-5xl">🏨</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {hotel.isVIP && (
          <span className="absolute top-3 right-3 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-amber-500/90 text-black shadow-[0_0_12px_rgba(245,158,11,0.5)] z-10">
            {t('hotels.vip')}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <span className="text-[10px] uppercase tracking-[0.32em] font-medium" style={{ color: catColor }}>
          {hotel.category}
        </span>

        <div>
          <h3
            className="text-white text-lg font-light leading-snug mb-1"
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

        <div className="flex items-center justify-between gap-3 mt-auto pt-2">
          <div>
            <span className="text-white text-lg font-semibold">${hotel.price}</span>
            <span className="text-white/30 text-[11px] ml-1">{t('hotels.perNight')}</span>
          </div>
          <a
            href="https://wa.me/905300709555"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full text-[10px] font-bold tracking-[0.22em] uppercase bg-gradient-to-br from-accent-light via-accent to-accent-dark text-on-accent glow-gold hover:scale-105 transition-transform duration-200 flex-shrink-0"
          >
            {t('hotels.book')}
          </a>
        </div>
      </div>
    </motion.article>
  );
}

const VISIBLE = 2;

export default function Hotels() {
  const { t, language, isRTL } = useTranslations();
  const lang = language;
  const hotels = useQuery(api.hotels.getAll);
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const isStandalonePage = typeof window !== 'undefined' && window.location.pathname.includes('/hotels');
  if (!isStandalonePage && hotels !== undefined && hotels.length === 0) return null;

  const sliceEnd = isStandalonePage ? (hotels?.length ?? 0) : VISIBLE;
  const displayed = hotels?.slice(0, sliceEnd) ?? [];
  const canPrev = index > 0;
  const canNext = index < displayed.length - 1;

  function scrollTo(i: number) {
    setIndex(i);
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[i] as HTMLElement;
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  return (
    <section
      id="hotels"
      className="relative bg-canvas overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div
        className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(34,211,238,0.04) 0%, transparent 60%)' }}
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

        <div className="h-px bg-white/10 mb-8" />

        {/* Slider */}
        {hotels === undefined ? (
          /* Loading skeleton */
          <div className="flex gap-5 overflow-hidden">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex-shrink-0 w-[280px] sm:w-[320px] rounded-2xl bg-white/5 animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <>
            {/* Arrow nav — desktop */}
            {!isStandalonePage && displayed.length > 1 && (
              <div className="hidden sm:flex justify-end gap-2 mb-4">
                <button
                  onClick={() => scrollTo(Math.max(0, index - 1))}
                  disabled={!canPrev}
                  aria-label="Previous"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-accent/50 disabled:opacity-20 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => scrollTo(Math.min(displayed.length - 1, index + 1))}
                  disabled={!canNext}
                  aria-label="Next"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-accent/50 disabled:opacity-20 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* Cards track */}
            <div
              ref={trackRef}
              className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {displayed.map((hotel, i) => (
                <div key={hotel._id} className="snap-start">
                  <HotelCard hotel={hotel} lang={language} t={t} index={i} />
                </div>
              ))}
            </div>

            {/* Dot indicators */}
            {!isStandalonePage && displayed.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-5">
                {displayed.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollTo(i)}
                    aria-label={`Go to hotel ${i + 1}`}
                    className={`h-1 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-accent' : 'w-1.5 bg-white/20'}`}
                  />
                ))}
              </div>
            )}
          </>
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
