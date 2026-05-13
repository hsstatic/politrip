'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useTranslations } from '@/hooks/useTranslations';
import type { Destination } from './data';

interface DestSpreadProps {
  d: Destination;
  index: number;
  total: number;
}

/**
 * "Cinematic Editorial Spread" — one full-viewport scene per destination.
 *
 * Inspired by award-winning travel sites (Aman, Belmond, Mr & Mrs Smith):
 *   - Full-bleed photo with subtle Ken Burns parallax
 *   - Glass content panel alternating left/right per index (single column on mobile)
 *   - Editorial index ("01 / 02") + geographic coordinates as typographic detail
 *   - Per-destination accent color drives badge / pulse / chip borders
 *
 * Scroll choreography (driven by `useScroll` against this section's bounds):
 *   - image scales 1.05 → 1.2 across the whole spread (Ken Burns)
 *   - image drifts -5% → +5% on Y (parallax)
 *   - content fades + rises in as the spread enters view, holds, then fades
 *     gently as it exits — so each spread has a clear "moment".
 */
export default function DestSpread({ d, index, total }: DestSpreadProps) {
  const { language } = useAppStore();
  const { t, isRTL } = useTranslations();
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [1, 1] : [1.05, 1.2],
  );
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ['0%', '0%'] : ['-4%', '4%'],
  );
  const contentY = useTransform(
    scrollYProgress,
    [0.1, 0.45],
    reduceMotion ? ['0px', '0px'] : ['48px', '0px'],
  );
  const contentOpacity = useTransform(scrollYProgress, [0.08, 0.4, 0.85, 0.98], [0, 1, 1, 0.6]);

  // Alternate panel side for editorial rhythm. In RTL, mirror the alternation
  // so the reading-order entry point still leads the eye into the panel.
  const panelOnRight = (index % 2 === 0) !== isRTL;

  const indexLabel = String(index + 1).padStart(2, '0');
  const totalLabel = String(total).padStart(2, '0');

  const latStr = `${Math.abs(d.lat).toFixed(2)}° ${d.lat >= 0 ? 'N' : 'S'}`;
  const lngStr = `${Math.abs(d.lng).toFixed(2)}° ${d.lng >= 0 ? 'E' : 'W'}`;

  return (
    <section
      ref={ref}
      id={`dest-${d.id}`}
      className="relative min-h-svh w-full overflow-hidden isolate"
      aria-label={d.name[language]}
    >
      {/* ── 1. Full-bleed photo with Ken Burns parallax ─────────────── */}
      <motion.div
        className="absolute inset-0 -z-20"
        style={{ scale: imageScale, y: imageY }}
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/destinations/${d.id}.jpg`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </motion.div>

      {/* ── 2. Cinematic gradient overlays for depth + text legibility ─ */}
      {/* Side wash on lg+: navy blooms from the panel side */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none hidden lg:block"
        style={{
          background: panelOnRight
            ? 'linear-gradient(90deg, rgba(2,18,45,0.10) 0%, rgba(2,18,45,0.20) 35%, rgba(2,18,45,0.78) 78%, rgba(2,18,45,0.92) 100%)'
            : 'linear-gradient(270deg, rgba(2,18,45,0.10) 0%, rgba(2,18,45,0.20) 35%, rgba(2,18,45,0.78) 78%, rgba(2,18,45,0.92) 100%)',
        }}
      />
      {/* Bottom wash on mobile: full-width fade so stacked content reads */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none lg:hidden"
        style={{
          background:
            'linear-gradient(180deg, rgba(2,18,45,0.25) 0%, rgba(2,18,45,0.10) 35%, rgba(2,18,45,0.85) 75%, rgba(2,18,45,0.96) 100%)',
        }}
      />
      {/* Top + bottom edge darkening tying spreads together as one section */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-b from-canvas/55 via-transparent to-canvas/45"
        aria-hidden
      />

      {/* ── 3. Editorial index marker — top corner opposite the panel ── */}
      <div
        className={`absolute top-10 lg:top-16 z-10 flex items-baseline gap-4 ${
          panelOnRight ? 'left-6 sm:left-10 lg:left-20' : 'right-6 sm:right-10 lg:right-20'
        }`}
      >
        <span
          className="text-[64px] lg:text-[96px] font-light leading-[0.85]"
          style={{ fontFamily: 'var(--font-display, serif)', color: d.accent }}
        >
          {indexLabel}
        </span>
        <span className="flex flex-col text-white/45 text-[9px] uppercase tracking-[0.42em] leading-[1.6]">
          <span>{t('destSpread.chapter')}</span>
          <span>/ {totalLabel}</span>
        </span>
      </div>

      {/* ── 4. Coordinates detail — top corner on the panel side ──────── */}
      <div
        className={`absolute top-12 lg:top-20 z-10 hidden sm:flex flex-col text-white/40 text-[9px] uppercase tracking-[0.42em] leading-[1.7] ${
          panelOnRight
            ? 'right-6 sm:right-10 lg:right-20 text-right'
            : 'left-6 sm:left-10 lg:left-20 text-left'
        }`}
      >
        <span>{latStr}</span>
        <span>{lngStr}</span>
        <span
          className={`mt-2 h-px w-8 bg-white/20 ${panelOnRight ? 'self-end' : 'self-start'}`}
        />
      </div>

      {/* ── 5. Glass content panel ──────────────────────────────────── */}
      <div
        className={`absolute inset-x-0 bottom-0 lg:inset-y-0 flex items-end lg:items-center px-6 sm:px-12 lg:px-20 pb-14 lg:pb-0 ${
          panelOnRight ? 'lg:justify-end' : 'lg:justify-start'
        }`}
      >
        <motion.div
          className="w-full lg:max-w-[540px]"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          {/* Badge with pulsing accent dot */}
          <div className="inline-flex items-center gap-2.5 mb-7">
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
                style={{ background: d.accent }}
              />
              <span
                className="relative inline-flex h-1.5 w-1.5 rounded-full"
                style={{ background: d.accent }}
              />
            </span>
            <span
              className="text-[10px] uppercase tracking-[0.42em] font-bold"
              style={{ color: d.accent }}
            >
              {d.badge[language]}
            </span>
          </div>

          {/* City name */}
          <h3
            className="text-[clamp(56px,8vw,120px)] font-light text-white leading-[0.9] mb-4"
            style={{ fontFamily: 'var(--font-display, serif)' }}
          >
            {d.name[language]}
          </h3>

          {/* Tagline (italic serif) */}
          <p
            className="text-[clamp(18px,1.6vw,26px)] italic text-white/80 mb-7 font-light"
            style={{ fontFamily: 'var(--font-display, serif)' }}
          >
            {d.tag[language]}
          </p>

          {/* Description */}
          <p className="text-white/65 text-base lg:text-[17px] leading-[1.7] mb-9 max-w-md">
            {d.desc[language]}
          </p>

          {/* Fact chips */}
          <div className="flex flex-wrap gap-2.5 mb-10">
            <FactChip
              label={t('destSpread.flight')}
              value={d.flightTime[language]}
              accent={d.accent}
            />
            <FactChip
              label={t('destSpread.climate')}
              value={d.climate[language]}
              accent={d.accent}
            />
            <FactChip
              label={t('destSpread.signature')}
              value={d.signature[language]}
              accent={d.accent}
            />
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <a
              href="#contact"
              className="holo-cta inline-flex items-center gap-2 px-7 py-3.5 text-[11px] uppercase tracking-[0.28em] font-medium"
              data-cursor="pointer"
            >
              <span>{t('destSpread.planTrip')}</span>
              <span aria-hidden className="text-base leading-none">
                {isRTL ? '←' : '→'}
              </span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* ── 6. Hairline divider between spreads ─────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent z-10" />
    </section>
  );
}

interface FactChipProps {
  label: string;
  value: string;
  accent: string;
}

function FactChip({ label, value, accent }: FactChipProps) {
  return (
    <div
      className="px-4 py-2.5 border rounded-full backdrop-blur-md"
      style={{
        borderColor: `${accent}40`,
        background: 'rgba(2, 18, 45, 0.45)',
      }}
    >
      <div
        className="text-[8px] uppercase tracking-[0.32em] mb-0.5"
        style={{ color: `${accent}cc` }}
      >
        {label}
      </div>
      <div className="text-white text-[12px] font-medium">{value}</div>
    </div>
  );
}
