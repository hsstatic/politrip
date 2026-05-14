'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useAppStore } from '@/lib/store';
import { useTranslations } from '@/hooks/useTranslations';
import type { Destination } from './data';

interface DestSpreadProps {
  d: Destination;
  index: number;
  total: number;
}

function StarRow({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: Math.min(count, 5) }, (_, i) => (
        <span key={i} className="text-amber-400 text-[10px]">★</span>
      ))}
    </span>
  );
}

export default function DestSpread({ d, index, total }: DestSpreadProps) {
  const { language } = useAppStore();
  const { t, isRTL } = useTranslations();
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const hotels = useQuery(api.hotels.getByCity, { city: d.id });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [1, 1] : [1.0, 1.25],
  );
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ['0%', '0%'] : ['-5%', '5%'],
  );
  const contentY = useTransform(
    scrollYProgress,
    [0.1, 0.45],
    reduceMotion ? ['0px', '0px'] : ['52px', '0px'],
  );
  const contentOpacity = useTransform(scrollYProgress, [0.08, 0.38, 0.85, 0.98], [0, 1, 1, 0.6]);

  const panelOnRight = (index % 2 === 0) !== isRTL;
  const indexLabel = String(index + 1).padStart(2, '0');
  const totalLabel = String(total).padStart(2, '0');
  const latStr = `${Math.abs(d.lat).toFixed(2)}° ${d.lat >= 0 ? 'N' : 'S'}`;
  const lngStr = `${Math.abs(d.lng).toFixed(2)}° ${d.lng >= 0 ? 'E' : 'W'}`;

  const previewHotels = hotels?.slice(0, 3) ?? [];

  return (
    <section
      ref={ref}
      id={`dest-${d.id}`}
      className="relative w-full overflow-hidden isolate"
      aria-label={d.name[language]}
    >
      {/* ── Full-bleed photo ────────────────────────────────────────── */}
      <div className="min-h-svh relative">
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

        {/* ── Cinematic gradient overlays ───────────────────────────── */}
        <div
          className="absolute inset-0 -z-10 pointer-events-none hidden lg:block"
          style={{
            background: panelOnRight
              ? 'linear-gradient(90deg, rgba(2,18,45,0.08) 0%, rgba(2,18,45,0.18) 32%, rgba(2,18,45,0.82) 76%, rgba(2,18,45,0.96) 100%)'
              : 'linear-gradient(270deg, rgba(2,18,45,0.08) 0%, rgba(2,18,45,0.18) 32%, rgba(2,18,45,0.82) 76%, rgba(2,18,45,0.96) 100%)',
          }}
        />
        <div
          className="absolute inset-0 -z-10 pointer-events-none lg:hidden"
          style={{
            background:
              'linear-gradient(180deg, rgba(2,18,45,0.22) 0%, rgba(2,18,45,0.08) 35%, rgba(2,18,45,0.88) 72%, rgba(2,18,45,0.97) 100%)',
          }}
        />
        <div
          className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-b from-canvas/60 via-transparent to-canvas/50"
          aria-hidden
        />

        {/* ── Editorial index marker ─────────────────────────────────── */}
        <div
          className={`absolute top-10 lg:top-16 z-10 flex items-baseline gap-4 ${
            panelOnRight ? 'left-6 sm:left-10 lg:left-20' : 'right-6 sm:right-10 lg:right-20'
          }`}
        >
          <span
            className="text-[64px] lg:text-[96px] font-light leading-[0.85]"
            style={{
              fontFamily: 'var(--font-display, serif)',
              color: d.accent,
              textShadow: `0 0 48px ${d.accent}55`,
            }}
          >
            {indexLabel}
          </span>
          <span className="flex flex-col text-white/45 text-[9px] uppercase tracking-[0.42em] leading-[1.6]">
            <span>{t('destSpread.chapter')}</span>
            <span>/ {totalLabel}</span>
          </span>
        </div>

        {/* ── Coordinates ─────────────────────────────────────────────── */}
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

        {/* ── Glass content panel ──────────────────────────────────────── */}
        <div
          className={`absolute inset-x-0 bottom-0 lg:inset-y-0 flex items-end lg:items-center px-6 sm:px-12 lg:px-20 pb-14 lg:pb-0 ${
            panelOnRight ? 'lg:justify-end' : 'lg:justify-start'
          }`}
        >
          <motion.div
            className="w-full lg:max-w-[540px]"
            style={{ y: contentY, opacity: contentOpacity }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 mb-7 relative">
              <span
                className="absolute -inset-1 rounded-full opacity-20 blur-md"
                style={{ background: d.accent }}
                aria-hidden
              />
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

            {/* Tagline */}
            <p
              className="text-[clamp(18px,1.6vw,26px)] italic text-white/80 mb-7 font-[350]"
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
              <FactChip label={t('destSpread.flight')} value={d.flightTime[language]} accent={d.accent} />
              <FactChip label={t('destSpread.climate')} value={d.climate[language]} accent={d.accent} />
              <FactChip label={t('destSpread.signature')} value={d.signature[language]} accent={d.accent} />
            </div>

            {/* CTA */}
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

        {/* ── Section divider ─────────────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent z-10" />
      </div>

      {/* ── Hotel preview strip ─────────────────────────────────────── */}
      {hotels !== undefined && hotels.length > 0 && (
        <div className="relative bg-canvas/95 border-t border-white/[0.06] px-6 sm:px-10 lg:px-20 py-10 lg:py-14">
          {/* Section label */}
          <div className="flex items-center justify-between mb-7 gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div
                className="h-px w-8 shrink-0"
                style={{ background: `linear-gradient(to right, transparent, ${d.accent})` }}
              />
              <span
                className="text-[10px] uppercase tracking-[0.42em] font-bold"
                style={{ color: d.accent }}
              >
                {t('destSpread.hotelsIn')} {d.name[language]}
              </span>
            </div>
            {hotels.length > 3 && (
              <Link
                href={`/${language}/destination/${d.id}`}
                className="text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-accent transition-colors flex items-center gap-1.5"
              >
                {t('destSpread.seeAllHotels')} ({hotels.length})
                <span aria-hidden>{isRTL ? '←' : '→'}</span>
              </Link>
            )}
          </div>

          {/* Hotel cards — horizontal scroll on mobile, grid on desktop */}
          <div className="slider-track lg:grid lg:grid-cols-3 lg:gap-5">
            {previewHotels.map((hotel) => {
              const name = language === 'ar' ? hotel.name_ar : language === 'tr' ? hotel.name_tr : hotel.name_en;
              return (
                <div
                  key={hotel._id}
                  className="slider-item w-[260px] sm:w-[280px] lg:w-auto flex-shrink-0 rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.03] group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {hotel.images[0] ? (
                      <img
                        src={hotel.images[0]}
                        alt={name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/5 text-4xl">🏨</div>
                    )}
                    {hotel.isVIP && (
                      <span className="absolute top-2 right-2 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-amber-500/90 text-black">
                        VIP
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4
                        className="text-white text-[15px] font-normal leading-snug"
                        style={{ fontFamily: 'var(--font-display, serif)' }}
                      >
                        {name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="flex items-center gap-0.5">
                        {Array.from({ length: Math.min(hotel.stars, 5) }, (_, i) => (
                          <span key={i} className="text-amber-400 text-[10px]">★</span>
                        ))}
                      </span>
                      <span className="text-white/30 text-[10px] uppercase tracking-wider">{hotel.city}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white text-base font-semibold">${hotel.price}<span className="text-white/30 text-[10px] ml-1 font-normal">/ night</span></span>
                      <a
                        href="https://wa.me/905300000000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] uppercase tracking-[0.22em] font-bold px-3 py-1.5 rounded-full bg-gradient-to-br from-accent-light via-accent to-accent-dark text-on-accent hover:scale-105 transition-transform"
                      >
                        Book
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* See all link at bottom (always shown if hotels exist) */}
          <div className="mt-8 flex justify-end">
            <Link
              href={`/${language}/destination/${d.id}`}
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-white/35 hover:text-accent transition-colors"
            >
              {t('destSpread.seeAllHotels')} {hotels.length > 3 ? `(${hotels.length})` : ''}
              <span aria-hidden className="text-sm">{isRTL ? '←' : '→'}</span>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

function FactChip({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div
      className="px-4 py-2.5 border rounded-full backdrop-blur-xl"
      style={{
        borderColor: `${accent}45`,
        background: 'rgba(2, 18, 45, 0.50)',
        boxShadow: `0 0 18px ${accent}18`,
      }}
    >
      <div className="text-[8px] uppercase tracking-[0.32em] mb-0.5" style={{ color: `${accent}cc` }}>
        {label}
      </div>
      <div className="text-white text-[12px] font-medium">{value}</div>
    </div>
  );
}
