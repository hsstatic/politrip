'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useTranslations } from '@/hooks/useTranslations';
import {
  EASE_OUT, EASE_EXPO_OUT,
  viewportOnce,
  cinematicRise, cinematicStagger, cinematicItem,
  eyebrowReveal, headlineWord,
} from '@/lib/motion';
import { destinations as staticDestinations } from './destinations/data';
import type { Destination } from './destinations/data';
import DestSpread from './destinations/DestSpread';

function CinematicWord({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
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

function convexToDestination(doc: {
  _id: string;
  name_en: string; name_ar: string; name_tr: string;
  tag_en: string; tag_ar: string; tag_tr: string;
  badge_en: string; badge_ar: string; badge_tr: string;
  desc_en: string; desc_ar: string; desc_tr: string;
  flightTime_en: string; flightTime_ar: string; flightTime_tr: string;
  climate_en: string; climate_ar: string; climate_tr: string;
  signature_en: string; signature_ar: string; signature_tr: string;
  color: string; accent: string; icon: string; lat: number; lng: number;
}): Destination {
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
    lat: doc.lat,
    lng: doc.lng,
  };
}

const INITIAL_VISIBLE = 3;

export default function Destinations() {
  const { t, isRTL } = useTranslations();
  const [showAll, setShowAll] = useState(false);

  const convexDests = useQuery(api.destinations.getAll);
  const allDestinations: Destination[] =
    convexDests && convexDests.length > 0
      ? convexDests.map(convexToDestination)
      : staticDestinations;

  const visibleDestinations = showAll ? allDestinations : allDestinations.slice(0, INITIAL_VISIBLE);
  const hiddenCount = allDestinations.length - INITIAL_VISIBLE;

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
        style={{
          background: 'linear-gradient(to bottom, rgba(2,18,45,1) 0%, transparent 100%)',
        }}
        aria-hidden
      />

      {/* ── Deep radial ambience ─────────────────────────────────────────── */}
      <div
        className="absolute top-0 left-0 right-0 h-[700px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 90% 55% at 50% 0%, rgba(34,211,238,0.06) 0%, transparent 65%)',
        }}
        aria-hidden
      />

      {/* ── Perspective grid — depth floor ───────────────────────────────── */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-64 pointer-events-none overflow-hidden opacity-[0.35]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.35 }}
        viewport={viewportOnce}
        transition={{ duration: 1.4, ease: EASE_OUT }}
        aria-hidden
      >
        <div className="perspective-grid w-full h-full" />
      </motion.div>

      {/* ── Section header — cinematic entry ─────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 pt-28 lg:pt-40 pb-20 lg:pb-32">
        <motion.div
          className="max-w-3xl"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {/* Eyebrow */}
          <motion.div
            className="flex items-center gap-3 mb-6"
            variants={eyebrowReveal}
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
            className="text-[clamp(38px,5.4vw,84px)] font-[350] text-white leading-[0.94] mb-7"
            style={{ fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.025em' }}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            <CinematicWord text={t('destinations.titleBefore')} />
            {' '}
            <span className="text-gradient-gold italic">
              <CinematicWord text={t('destinations.titleAccent')} />
            </span>
          </motion.h2>

          {/* Sub */}
          <motion.p
            className="text-white/55 text-base lg:text-lg leading-[1.7] max-w-xl"
            variants={cinematicRise}
            transition={{ duration: 1.0, ease: EASE_EXPO_OUT, delay: 0.25 }}
          >
            {t('destinations.subtitle')}
          </motion.p>

          {/* Scroll hint */}
          <motion.div
            className="mt-12 flex items-center gap-3 text-white/30 text-[9px] uppercase tracking-[0.42em]"
            variants={cinematicRise}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.42 }}
          >
            <span>{t('destinations.scrollHint')}</span>
            <span className="h-px w-12 bg-white/20" />
            <span>01 / {String(allDestinations.length).padStart(2, '0')}</span>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Destination spreads ───────────────────────────────────────────── */}
      <div>
        {visibleDestinations.map((d, i) => (
          <DestSpread key={d.id} d={d} index={i} total={allDestinations.length} />
        ))}
      </div>

      {/* ── Show more CTA ─────────────────────────────────────────────────── */}
      {!showAll && hiddenCount > 0 && (
        <motion.div
          className="flex justify-center py-16 lg:py-20"
          variants={cinematicRise}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          transition={{ duration: 0.9, ease: EASE_EXPO_OUT }}
        >
          <button
            onClick={() => setShowAll(true)}
            className="holo-cta inline-flex items-center gap-3 px-8 py-4 text-[11px] uppercase tracking-[0.28em] font-medium"
          >
            <span>{t('destinations.seeAllCities')}</span>
            <span aria-hidden className="text-base leading-none opacity-70">({hiddenCount})</span>
            <span aria-hidden className="text-base leading-none">{isRTL ? '←' : '→'}</span>
          </button>
        </motion.div>
      )}
    </section>
  );
}
