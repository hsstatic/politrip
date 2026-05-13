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

const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  'ultra-luxury': { bg: 'rgba(245,158,11,0.12)', text: '#fcd34d' },
  luxury: { bg: 'rgba(34,211,238,0.12)', text: '#67e8f9' },
  boutique: { bg: 'rgba(168,85,247,0.12)', text: '#c4b5fd' },
  resort: { bg: 'rgba(52,211,153,0.12)', text: '#6ee7b7' },
};

function AnimatedStars({ count, delay = 0 }: { count: number; delay?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: Math.min(count, 5) }, (_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.4 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.35, delay: delay + i * 0.06, ease: EASE_OUT }}
          className="text-amber-400 text-xs"
        >
          ★
        </motion.span>
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
  const catStyle = CATEGORY_STYLES[hotel.category] ?? { bg: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.5)' };

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.72, delay: (index % 3) * 0.1, ease: EASE_OUT }}
      className="group relative flex flex-col bg-white/[0.03] border border-white/[0.09] rounded-2xl overflow-hidden hover:border-accent/25 transition-all duration-500"
      style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.25)' }}
    >
      {/* Image with hover parallax zoom */}
      <div className="relative h-56 overflow-hidden bg-white/5">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/10 text-5xl">🏨</div>
        )}

        {/* Bottom gradient — deeper on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-80" />

        {/* VIP badge */}
        {hotel.isVIP && (
          <span className="absolute top-3 right-3 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-amber-500/90 text-black shadow-[0_0_12px_rgba(245,158,11,0.5)]">
            {t('hotels.vip')}
          </span>
        )}

        {/* Category */}
        <span
          className="absolute bottom-3 left-3 text-[10px] uppercase tracking-wider font-medium px-2.5 py-1 rounded-full backdrop-blur-sm"
          style={{ background: catStyle.bg, color: catStyle.text, border: `1px solid ${catStyle.text}30` }}
        >
          {hotel.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3
            className="text-white font-medium leading-snug"
            style={{ fontFamily: 'var(--font-display, serif)' }}
          >
            {name}
          </h3>
          <AnimatedStars count={hotel.stars} delay={(index % 3) * 0.1 + 0.3} />
        </div>

        <p className="text-white/38 text-xs mb-3 uppercase tracking-wider">
          {CITY_LABELS[hotel.city] ?? hotel.city}
        </p>

        {hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {hotel.amenities.slice(0, 3).map((a) => (
              <span key={a} className="text-[10px] text-white/35 border border-white/10 px-2 py-0.5 rounded-full">
                {a}
              </span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="text-[10px] text-white/25">+{hotel.amenities.length - 3}</span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3">
          {/* Price with glow accent */}
          <div
            className="px-3 py-1.5 rounded-full border"
            style={{
              borderColor: 'rgba(34,211,238,0.32)',
              background: 'rgba(34,211,238,0.06)',
              boxShadow: '0 0 14px rgba(34,211,238,0.12)',
            }}
          >
            <span className="text-white text-base font-semibold">${hotel.price}</span>
            <span className="text-white/35 text-[11px] ml-1">{t('hotels.perNight')}</span>
          </div>
          <a
            href="https://wa.me/905300000000"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase bg-gradient-to-br from-accent-light via-accent to-accent-dark text-on-accent glow-gold hover:scale-105 transition-transform duration-200"
          >
            {t('hotels.book')}
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export default function Hotels() {
  const { t, language, isRTL } = useTranslations();
  const hotels = useQuery(api.hotels.getAll);

  if (hotels !== undefined && hotels.length === 0) return null;

  return (
    <section
      id="hotels"
      className="relative bg-canvas overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      {/* Depth radial */}
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
          className="max-w-3xl mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent" />
            <span className="text-[10px] uppercase tracking-[0.42em] text-accent font-bold">
              {t('hotels.kicker')}
            </span>
          </div>
          <h2
            className="text-[clamp(38px,5.4vw,84px)] font-light text-white leading-[0.94] mb-7"
            style={{ fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.025em' }}
          >
            {t('hotels.titleBefore')}{' '}
            <span className="text-gradient-gold italic">{t('hotels.titleAccent')}</span>
          </h2>
          <p className="text-white/55 text-base lg:text-lg leading-[1.7] max-w-xl">
            {t('hotels.subtitle')}
          </p>
        </motion.div>

        {/* Grid */}
        {hotels === undefined ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel, i) => (
              <HotelCard key={hotel._id} hotel={hotel} lang={language} t={t} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
