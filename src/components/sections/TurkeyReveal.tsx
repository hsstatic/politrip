'use client';

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import { TURKEY_SVG_PATH } from '@/components/3d/turkeyOutlineSVG';
import { useTranslations } from '@/hooks/useTranslations';

const TURKEY_MAP_SVG_CLASS =
  'h-auto w-full max-h-[min(82svh,78dvh)] max-w-[min(1400px,calc(100vw-2rem),calc(92svh*2))] lg:scale-[1.02]';

export default function TurkeyReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { t } = useTranslations();

  const { scrollYProgress: sp } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const smoothSp = useSpring(sp, { stiffness: 60, damping: 25 });

  // ── Turkey SVG ──────────────────────────────────────────────────────────────
  const svgOpacity   = useTransform(sp, [0.02, 0.18], [0, 1]);
  const svgScale     = useTransform(smoothSp, [0, 0.5, 1], [0.88, 1.0, 1.06]);

  const borderPathLength = useTransform(sp, [0.12, 0.55], [0, 1]);
  const borderOpacity    = useTransform(sp, [0.10, 0.18, 0.88, 0.98], [0, 1, 1, 0]);
  const glowOpacity      = useTransform(sp, [0.18, 0.36, 0.88, 0.98], [0, 0.7, 0.7, 0]);
  const fillOpacity      = useTransform(sp, [0.22, 0.48], [0, 0.22]);

  const hue      = useTransform(sp, [0.24, 1.0], [182, 196]);
  const sat      = useTransform(sp, [0.24, 1.0], [85, 100]);
  const lit      = useTransform(sp, [0.24, 1.0], [60, 72]);
  const fillColor = useMotionTemplate`hsl(${hue}, ${sat}%, ${lit}%)`;

  // ── Label ───────────────────────────────────────────────────────────────────
  const labelOpacity = useTransform(sp, [0.58, 0.68, 0.90, 0.98], [0, 1, 1, 0]);
  const labelY       = useTransform(sp, [0.58, 0.68], [18, 0]);

  // ── Radial glow halo — behind the SVG, synced with fill opacity ─────────────
  const haloOpacity = useTransform(sp, [0.25, 0.50, 0.88, 0.98], [0, 0.55, 0.55, 0]);
  const haloScale   = useTransform(smoothSp, [0.2, 0.7], [0.7, 1.1]);

  // ── Background depth shift — subtle parallax of the section bg ──────────────
  const bgY = useTransform(smoothSp, [0, 1], ['0%', '12%']);

  // ── Top cross-fade — makes the transition from globe seamless ───────────────
  const topFadeOpacity = useTransform(sp, [0, 0.12], [1, 0]);

  // ── Stats that fly in during the reveal ─────────────────────────────────────
  const stats = [
    { value: t('turkeyReveal.stat1Value'), unit: t('turkeyReveal.stat1Unit'), label: t('turkeyReveal.stat1Label') },
    { value: t('turkeyReveal.stat2Value'), unit: t('turkeyReveal.stat2Unit'), label: t('turkeyReveal.stat2Label') },
    { value: t('turkeyReveal.stat3Value'), unit: t('turkeyReveal.stat3Unit'), label: t('turkeyReveal.stat3Label') },
  ];
  const statsOpacity = useTransform(sp, [0.62, 0.74, 0.90, 0.98], [0, 1, 1, 0]);
  const statsY       = useTransform(sp, [0.62, 0.74], [24, 0]);

  if (reduceMotion) {
    return (
      <section
        id="turkey-reveal"
        className="relative w-full"
        style={{ height: '110svh' }}
        aria-hidden
      >
        <div className="sticky top-0 h-svh flex items-center justify-center overflow-x-hidden px-4 sm:px-6">
          <svg viewBox="0 0 1000 500" className={TURKEY_MAP_SVG_CLASS} aria-label="Turkey silhouette">
            <path d={TURKEY_SVG_PATH} fill="rgba(34,211,238,0.15)" stroke="#67E8F9" strokeWidth={2} />
          </svg>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="turkey-reveal"
      className="relative w-full"
      style={{ height: '320svh' }}
      aria-hidden
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden">

        {/* ── Parallax background depth layer ──────────────────────────────── */}
        <motion.div
          className="absolute inset-0 -z-10"
          style={{ y: bgY, willChange: 'transform' }}
          aria-hidden
        >
          {/* Deep space radial — gives a sense of infinite depth */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 120% 80% at 50% 60%, rgba(13,44,82,0.45) 0%, rgba(2,18,45,0.0) 65%)',
            }}
          />
        </motion.div>

        {/* ── Top cross-fade — blends from globe/hero into this section ────── */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-30"
          style={{ opacity: topFadeOpacity }}
          aria-hidden
        >
          <div className="h-full bg-gradient-to-b from-canvas to-transparent" />
        </motion.div>

        {/* ── Radial glow halo — the ambient atmosphere around Turkey ──────── */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]"
          style={{ opacity: haloOpacity }}
          aria-hidden
        >
          <motion.div
            className="w-[min(900px,90vw)] aspect-[2/1]"
            style={{ scale: haloScale }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(34,211,238,0.14) 0%, rgba(34,211,238,0.04) 55%, transparent 75%)',
                filter: 'blur(24px)',
              }}
            />
          </motion.div>
        </motion.div>

        {/* ── Turkey SVG silhouette ─────────────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center overflow-x-hidden px-4 sm:px-6 pointer-events-none"
          style={{ opacity: svgOpacity, willChange: 'opacity' }}
        >
          <motion.svg
            viewBox="0 0 1000 500"
            className={TURKEY_MAP_SVG_CLASS}
            style={{ scale: svgScale, willChange: 'transform' }}
            aria-label="Turkey silhouette"
          >
            {/* Base fill */}
            <motion.path
              d={TURKEY_SVG_PATH}
              style={{ fill: fillColor, fillOpacity }}
            />

            {/* Wide glow layer */}
            <motion.path
              d={TURKEY_SVG_PATH}
              fill="none"
              stroke="#22d3ee"
              strokeWidth={14}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                pathLength: borderPathLength,
                opacity: glowOpacity,
                filter: 'blur(8px)',
              }}
            />

            {/* Secondary glow — tighter, brighter */}
            <motion.path
              d={TURKEY_SVG_PATH}
              fill="none"
              stroke="#67E8F9"
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                pathLength: borderPathLength,
                opacity: useTransform(glowOpacity, (v) => v * 0.5),
                filter: 'blur(3px)',
              }}
            />

            {/* Crisp border */}
            <motion.path
              d={TURKEY_SVG_PATH}
              fill="none"
              stroke="#67E8F9"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ pathLength: borderPathLength, opacity: borderOpacity }}
            />
          </motion.svg>
        </motion.div>

        {/* ── Stats row — floats in from below ─────────────────────────────── */}
        <motion.div
          className="absolute left-1/2 top-[58%] -translate-x-1/2 z-20 pointer-events-none hidden sm:flex items-center gap-10 lg:gap-16"
          style={{ opacity: statsOpacity, y: statsY }}
        >
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1 text-center">
              <div className="flex items-baseline gap-1">
                <span
                  className="text-[28px] lg:text-[36px] font-light text-white leading-none"
                  style={{ fontFamily: 'var(--font-display, serif)' }}
                >
                  {s.value}
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-accent/80 font-bold">
                  {s.unit}
                </span>
              </div>
              <span className="text-[9px] text-white/30 uppercase tracking-[0.38em]">{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── Ambient label ────────────────────────────────────────────────── */}
        <motion.div
          className="absolute left-1/2 bottom-[max(3.25rem,calc(env(safe-area-inset-bottom,0px)+2rem))] z-20 -translate-x-1/2 text-center pointer-events-none"
          style={{ opacity: labelOpacity, y: labelY }}
        >
          <div className="flex items-center gap-4 justify-center">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-accent/60" />
            <p className="text-[10px] uppercase tracking-[0.46em] text-accent/75 font-semibold">
              {t('turkeyReveal.discover')}
            </p>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-accent/60" />
          </div>
        </motion.div>

        {/* ── Bottom cross-fade — blends into the next section ─────────────── */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-25"
          style={{
            background: 'linear-gradient(to top, rgba(2,18,45,1) 0%, rgba(2,18,45,0.6) 50%, transparent 100%)',
          }}
          aria-hidden
        />
      </div>
    </section>
  );
}
