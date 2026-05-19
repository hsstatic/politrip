'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';
import {
  EASE_OUT, EASE_EXPO_OUT,
  viewportOnce,
  headlineWord,
} from '@/lib/motion';
import type { Destination, DestCategory } from './destinations/data';

function CinematicWord({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-visible pb-1">
          <motion.span
            className="inline-block"
            variants={headlineWord}
            transition={{ duration: 0.95, ease: EASE_EXPO_OUT, delay: i * 0.09 }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

type FilterKey = 'all' | DestCategory;

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

function convexToDestination(doc: {
  _id: string;
  name_en: string; name_ar: string; name_tr: string;
  tag_en: string; tag_ar: string; tag_tr: string;
  badge_en: string; badge_ar: string; badge_tr: string;
  desc_en: string; desc_ar: string; desc_tr: string;
  flightTime_en: string; flightTime_ar: string; flightTime_tr: string;
  climate_en: string; climate_ar: string; climate_tr: string;
  signature_en: string; signature_ar: string; signature_tr: string;
  color: string; accent: string; icon: string; imageUrl?: string; lat: number; lng: number;
}): Destination & { imageUrl?: string } {
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
    imageUrl: doc.imageUrl,
    lat: doc.lat,
    lng: doc.lng,
    category: badgeToCategory(doc.badge_en),
  };
}


const FILTERS: { key: FilterKey; labelKey: string }[] = [
  { key: 'all',       labelKey: 'destinations.filterAll' },
  { key: 'culture',   labelKey: 'destinations.filterCulture' },
  { key: 'nature',    labelKey: 'destinations.filterNature' },
  { key: 'beach',     labelKey: 'destinations.filterBeach' },
  { key: 'honeymoon', labelKey: 'destinations.filterHoneymoon' },
];

export default function Destinations() {
  const { t, isRTL } = useTranslations();
  const { language } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const convexDests = useQuery(api.destinations.getAll);
  const allDestinations: (Destination & { imageUrl?: string })[] = convexDests
    ? convexDests.map(convexToDestination)
    : [];

  const filteredDestinations = activeFilter === 'all'
    ? allDestinations
    : allDestinations.filter((d) => d.category === activeFilter);

  const isStandalonePage = typeof window !== 'undefined' && window.location.pathname.includes('/destination');
  const displayedDestinations = isStandalonePage ? filteredDestinations : filteredDestinations.slice(0, 4);

  return (
    <section
      id="destinations"
      className="relative bg-canvas overflow-hidden scene-layer"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* ── Atmospheric top-bleed from TurkeyReveal ──────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent z-10" />
      <div
        className="absolute top-0 left-0 right-0 h-[80px] pointer-events-none z-[5]"
        style={{ background: 'linear-gradient(to bottom, rgba(2,18,45,1) 0%, transparent 100%)' }}
        aria-hidden
      />

      {/* ── Deep radial ambience ─────────────────────────────────────────── */}
      <div
        className="absolute top-0 left-0 right-0 h-[700px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 90% 55% at 50% 0%, rgba(34,211,238,0.06) 0%, transparent 65%)' }}
        aria-hidden
      />

      {/* ── Perspective grid — depth floor ───────────────────────────────── */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-64 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.35 }}
        viewport={viewportOnce}
        transition={{ duration: 1.4, ease: EASE_OUT }}
        aria-hidden
      >
        <div className="perspective-grid w-full h-full" />
      </motion.div>

      {/* ── Section header ───────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 sm:px-12 lg:px-20 pt-16 lg:pt-24 pb-10 lg:pb-16">
        <motion.div
          className="max-w-3xl"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {/* Eyebrow */}
          <motion.div
            className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: EASE_OUT }}
          >
            <motion.div
              className="h-px w-12 bg-gradient-to-r from-transparent to-accent"
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 }}
            />
            <span className="text-[10px] uppercase tracking-[0.42em] text-accent font-bold">
              {t('destinations.kicker')}
            </span>
          </motion.div>

          {/* Headline — word-by-word cinematic reveal */}
          <motion.h2
            className="text-[clamp(26px,3.8vw,52px)] font-[350] text-white leading-[1.2] mb-3 pb-1 overflow-visible"
            style={{ fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.02em' }}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            <CinematicWord text={t('destinations.titleBefore')} />
            {' '}
            <CinematicWord text={t('destinations.titleAccent')} />
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-white/50 text-[13px] leading-[1.55] max-w-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 1.0, ease: EASE_EXPO_OUT, delay: 0.25 }}
          >
            {t('destinations.subtitle')}
          </motion.p>

          {/* Scroll hint — only when there are destinations */}
          {filteredDestinations.length > 0 && (
            <motion.div
              className="mt-5 flex items-center gap-3 text-white/30 text-[9px] uppercase tracking-[0.42em]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.42 }}
            >
              <span>{t('destinations.scrollHint')}</span>
              <span className="h-px w-12 bg-white/20" />
              <span>01 / {String(displayedDestinations.length).padStart(2, '0')}</span>
            </motion.div>
          )}

        </motion.div>
      </div>

      {/* ── Destination cards grid ────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 pb-16 lg:pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: EASE_EXPO_OUT }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {displayedDestinations.map((d, i) => (
              <div key={d.id} className={!isStandalonePage && i >= 2 ? 'hidden sm:block' : undefined}>
                <DestCard d={d} index={i} isRTL={isRTL} language={t} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {!isStandalonePage && filteredDestinations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="flex justify-center pt-12 pb-12"
          >
            <Link
              href={`/${language}/destination`}
              className="group flex items-center gap-3 px-8 py-4 rounded-full border border-accent/30 text-[11px] uppercase tracking-[0.32em] text-accent hover:bg-accent/10 hover:border-accent transition-all duration-300"
            >
              View All Destinations
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function DestModal({ d, onClose }: { d: Destination & { imageUrl?: string }; onClose: () => void }) {
  const { language: lang } = useAppStore();
  const { t } = useTranslations();
  const cityKey = d.id.replace(/-/g, '');
  const hotels = useQuery(api.hotels.getByCity, { city: d.id });
  const preview = hotels?.slice(0, 2) ?? [];
  const imageSrc = d.imageUrl || `/destinations/${d.id}.jpg`;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

        {/* Panel */}
        <motion.div
          className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#040f24] border border-white/[0.08] shadow-2xl"
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.35, ease: EASE_EXPO_OUT }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hero image */}
          <div className="relative aspect-[16/7] overflow-hidden rounded-t-3xl">
            <img src={imageSrc} alt={d.name[lang]} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040f24] via-black/30 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <div className="absolute bottom-0 left-0 p-6">
              <span
                className="text-[9px] uppercase tracking-[0.32em] font-bold px-2.5 py-1 rounded-full mb-3 inline-block"
                style={{ background: `${d.accent}25`, color: d.accent, border: `1px solid ${d.accent}40` }}
              >
                {d.badge[lang]}
              </span>
              <h2 className="text-white text-3xl sm:text-4xl font-light" style={{ fontFamily: 'var(--font-display, serif)' }}>
                {d.name[lang]}
              </h2>
              <p className="text-white/60 text-sm italic mt-1" style={{ fontFamily: 'var(--font-display, serif)' }}>{d.tag[lang]}</p>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <p className="text-white/70 text-sm leading-[1.8]">{d.desc[lang]}</p>


            {preview.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-white/30 mb-3">{t('hotels.kicker')}</p>
                <div className="space-y-3">
                  {preview.map((hotel) => {
                    const name = lang === 'ar' ? hotel.name_ar : lang === 'tr' ? hotel.name_tr : hotel.name_en;
                    return (
                      <div key={hotel._id} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        {hotel.images[0] && (
                          <img src={hotel.images[0]} alt={name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-light truncate" style={{ fontFamily: 'var(--font-display, serif)' }}>{name}</p>
                          <p className="text-white/40 text-[11px] mt-0.5">{'★'.repeat(hotel.stars)} · ${hotel.price}{t('hotels.perNight')}</p>
                        </div>
                        <a
                          href="https://wa.me/905300709555"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9px] uppercase tracking-[0.22em] font-bold px-3 py-1.5 rounded-full shrink-0"
                          style={{ background: 'linear-gradient(135deg, #e2c97e 0%, #f5e6b8 40%, #c9a84c 100%)', color: '#02122d' }}
                        >
                          {t('hotels.book')}
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTA */}
            <Link
              href={`/${lang}/destination/${d.id}`}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-[11px] font-bold tracking-[0.28em] uppercase border border-accent/30 text-accent hover:bg-accent/10 transition-all duration-200"
            >
              {t('destinations.seeHotels')}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function DestCard({ d, index, isRTL, language }: { d: Destination & { imageUrl?: string }; index: number; isRTL: boolean; language: ReturnType<typeof useTranslations>['t'] }) {
  const { language: lang } = useAppStore();
  const [open, setOpen] = useState(false);
  const imageSrc = d.imageUrl || `/destinations/${d.id}.jpg`;

  return (
    <>
      {open && <DestModal d={d} onClose={() => setOpen(false)} />}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.7, ease: EASE_EXPO_OUT, delay: (index % 3) * 0.07 }}
        className="cinema-panel group overflow-hidden relative aspect-[4/3] cursor-pointer"
        onClick={() => setOpen(true)}
      >
        {/* Full image */}
        <img
          src={imageSrc}
          alt={d.name[lang]}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
          style={{ willChange: 'transform' }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Badge */}
        <span
          className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.32em] font-bold px-2.5 py-1 rounded-full"
          style={{ background: `${d.accent}25`, color: d.accent, border: `1px solid ${d.accent}40`, backdropFilter: 'blur(8px)' }}
        >
          {d.badge[lang]}
        </span>

        {/* Bottom: city name */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3
            className="text-white text-2xl font-light leading-none mb-1"
            style={{ fontFamily: 'var(--font-display, serif)' }}
          >
            {d.name[lang]}
          </h3>
          <p className="text-white/60 text-xs italic" style={{ fontFamily: 'var(--font-display, serif)' }}>
            {d.tag[lang]}
          </p>
        </div>
      </motion.div>
    </>
  );
}
