'use client';

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion';
import { TURKEY_SVG_PATH } from '@/components/3d/turkeyOutlineSVG';

/** Width uses calc() so mobile Safari parses bounds; prevents horizontal bleed past 100vw. */
const TURKEY_MAP_SVG_CLASS =
  'h-auto w-full max-h-[min(82svh,78dvh)] max-w-[min(1400px,calc(100vw-2rem),calc(92svh*2))] lg:scale-[1.02]';

export default function TurkeyReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress: sp } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // ── Turkey SVG ────────────────────────────────────────────────────────────
  const svgOpacity = useTransform(sp, [0.02, 0.18], [0, 1]);

  const borderPathLength = useTransform(sp, [0.12, 0.55], [0, 1]);
  const borderOpacity = useTransform(sp, [0.10, 0.18, 0.88, 0.98], [0, 1, 1, 0]);
  const glowOpacity = useTransform(sp, [0.18, 0.36, 0.88, 0.98], [0, 0.7, 0.7, 0]);
  const fillOpacity = useTransform(sp, [0.22, 0.48], [0, 0.22]);

  const hue = useTransform(sp, [0.24, 1.0], [182, 196]);
  const sat = useTransform(sp, [0.24, 1.0], [85, 100]);
  const lit = useTransform(sp, [0.24, 1.0], [60, 72]);
  const fillColor = useMotionTemplate`hsl(${hue}, ${sat}%, ${lit}%)`;

  const labelOpacity = useTransform(sp, [0.58, 0.68, 0.90, 0.98], [0, 1, 1, 0]);
  const labelY = useTransform(sp, [0.58, 0.68], [18, 0]);

  if (reduceMotion) {
    return (
      <section
        id="turkey-reveal"
        className="relative w-full"
        style={{ height: '110svh' }}
        aria-hidden
      >
        <div className="sticky top-0 h-svh flex items-center justify-center overflow-x-hidden px-4 sm:px-6">
          <svg
            viewBox="0 0 800 400"
            className={TURKEY_MAP_SVG_CLASS}
            aria-label="Turkey silhouette"
          >
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
        {/* ── Turkey SVG silhouette ─────────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center overflow-x-hidden px-4 sm:px-6 pointer-events-none"
          style={{ opacity: svgOpacity }}
        >
          <svg
            viewBox="0 0 800 400"
            className={TURKEY_MAP_SVG_CLASS}
            aria-label="Turkey silhouette"
          >
            <motion.path
              d={TURKEY_SVG_PATH}
              style={{ fill: fillColor, fillOpacity }}
            />

            {/* Wide glow layer */}
            <motion.path
              d={TURKEY_SVG_PATH}
              fill="none"
              stroke="#22d3ee"
              strokeWidth={12}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                pathLength: borderPathLength,
                opacity: glowOpacity,
                filter: 'blur(6px)',
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
          </svg>
        </motion.div>

        {/* Ambient label */}
        <motion.div
          className="absolute left-1/2 bottom-[max(3.25rem,calc(env(safe-area-inset-bottom,0px)+2rem))] z-20 -translate-x-1/2 text-center pointer-events-none"
          style={{ opacity: labelOpacity, y: labelY }}
        >
          <div className="flex items-center gap-4 justify-center">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-accent/60" />
            <p className="text-[10px] uppercase tracking-[0.46em] text-accent/75 font-semibold">
              Discover Türkiye
            </p>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-accent/60" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
