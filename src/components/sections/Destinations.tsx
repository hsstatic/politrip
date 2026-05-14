'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useTranslations } from '@/hooks/useTranslations';
import { EASE_OUT, viewportOnce } from '@/lib/motion';
import { destinations as staticDestinations } from './destinations/data';
import type { Destination } from './destinations/data';
import DestSpread from './destinations/DestSpread';

function WordReveal({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.85, ease: EASE_OUT, delay: i * 0.07 }}
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

  // Use Convex data when loaded, fall back to static data while loading
  const allDestinations: Destination[] =
    convexDests && convexDests.length > 0
      ? convexDests.map(convexToDestination)
      : staticDestinations;

  const visibleDestinations = showAll
    ? allDestinations
    : allDestinations.slice(0, INITIAL_VISIBLE);

  const hiddenCount = allDestinations.length - INITIAL_VISIBLE;

  return (
    <section
      id="destinations"
      className="relative bg-canvas overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent z-10" />

      <div
        className="absolute top-0 left-0 right-0 h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(34,211,238,0.045) 0%, transparent 65%)',
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 pt-24 lg:pt-36 pb-20 lg:pb-32">
        <div className="max-w-3xl">
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: EASE_OUT }}
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent" />
            <span className="text-[10px] uppercase tracking-[0.42em] text-accent font-bold">
              {t('destinations.kicker')}
            </span>
          </motion.div>

          <h2
            className="text-[clamp(38px,5.4vw,84px)] font-[350] text-white leading-[0.94] mb-7"
            style={{ fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.025em' }}
          >
            <WordReveal text={t('destinations.titleBefore')} />
            {' '}
            <span className="text-gradient-gold italic">
              <WordReveal text={t('destinations.titleAccent')} />
            </span>
          </h2>

          <motion.p
            className="text-white/55 text-base lg:text-lg leading-[1.7] max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.3 }}
          >
            {t('destinations.subtitle')}
          </motion.p>

          <motion.div
            className="mt-12 flex items-center gap-3 text-white/30 text-[9px] uppercase tracking-[0.42em]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.5 }}
          >
            <span>{t('destinations.scrollHint')}</span>
            <span className="h-px w-12 bg-white/20" />
            <span>
              01 / {String(allDestinations.length).padStart(2, '0')}
            </span>
          </motion.div>
        </div>
      </div>

      <div>
        {visibleDestinations.map((d, i) => (
          <DestSpread key={d.id} d={d} index={i} total={allDestinations.length} />
        ))}
      </div>

      {!showAll && hiddenCount > 0 && (
        <motion.div
          className="flex justify-center py-16 lg:py-20"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <button
            onClick={() => setShowAll(true)}
            className="holo-cta inline-flex items-center gap-3 px-8 py-4 text-[11px] uppercase tracking-[0.28em] font-medium"
          >
            <span>{t('destinations.seeAllCities')}</span>
            <span aria-hidden className="text-base leading-none opacity-70">
              ({hiddenCount})
            </span>
            <span aria-hidden className="text-base leading-none">
              {isRTL ? '←' : '→'}
            </span>
          </button>
        </motion.div>
      )}
    </section>
  );
}
