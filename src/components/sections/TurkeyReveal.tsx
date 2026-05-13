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

// Top-down commercial-jet silhouette, nose pointing right (+X).
// Fuselage x: 150 (nose) → -145 (tail). Wingspan y: ±86. ViewBox: -160 -100 320 200.
const PLANE_PATH =
  'M 150 0 C 135 10,85 16,25 18 L 5 18 ' +
  'C 0 22,-15 32,-25 72 C -28 82,-35 88,-38 86 ' +
  'C -42 76,-46 48,-50 20 L -76 16 ' +
  'C -95 13,-108 9,-118 7 ' +
  'C -122 18,-126 28,-130 32 L -134 30 C -136 24,-134 15,-128 7 ' +
  'L -140 4 L -145 1 L -145 -1 L -140 -4 ' +
  'L -128 -7 C -134 -15,-136 -24,-134 -30 L -130 -32 ' +
  'C -126 -28,-122 -18,-118 -7 L -76 -16 ' +
  'C -46 -48,-42 -76,-38 -86 C -35 -88,-28 -82,-25 -72 ' +
  'C -15 -32,0 -22,5 -18 L 25 -18 ' +
  'C 85 -16,135 -10,150 0 Z';

export default function TurkeyReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress: sp } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // ── Airplane ──────────────────────────────────────────────────────────────
  // Plane is height:100vh → width≈160vh. Start at -170vh (off-screen left),
  // end at 220vh (off-screen right). Both values share the vh unit so Framer
  // Motion interpolates them correctly regardless of viewport aspect ratio.
  const planePct = useTransform(sp, [0.08, 0.44], [-235, 240]);
  const planeLeft = useMotionTemplate`${planePct}vh`;
  const planeOpacity = useTransform(sp, [0.06, 0.13, 0.37, 0.47], [0, 1, 1, 0]);

  // ── Turkey SVG ────────────────────────────────────────────────────────────
  // Fades in as the plane exits, so Turkey "appears in the plane's wake".
  const svgOpacity = useTransform(sp, [0.38, 0.56], [0, 1]);

  // Stroke draws itself along the Turkey border
  const borderPathLength = useTransform(sp, [0.50, 0.82], [0, 1]);
  const borderOpacity = useTransform(sp, [0.48, 0.56, 0.93, 1.0], [0, 1, 1, 0]);

  // Glow blur layer
  const glowOpacity = useTransform(sp, [0.55, 0.68, 0.93, 1.0], [0, 0.7, 0.7, 0]);

  // Fill — slow cyan wash
  const fillOpacity = useTransform(sp, [0.58, 0.76], [0, 0.22]);

  // Animated fill color (hsl interpolation)
  const hue = useTransform(sp, [0.60, 1.0], [182, 196]);
  const sat = useTransform(sp, [0.60, 1.0], [85, 100]);
  const lit = useTransform(sp, [0.60, 1.0], [60, 72]);
  const fillColor = useMotionTemplate`hsl(${hue}, ${sat}%, ${lit}%)`;

  // "Discover Türkiye" label
  const labelOpacity = useTransform(sp, [0.74, 0.84, 0.94, 1.0], [0, 1, 1, 0]);
  const labelY = useTransform(sp, [0.74, 0.84], [18, 0]);


  if (reduceMotion) {
    return (
      <section
        id="turkey-reveal"
        className="relative w-full"
        style={{ height: '60svh' }}
        aria-hidden
      >
        <div className="sticky top-0 h-svh flex items-center justify-center">
          <svg
            viewBox="0 0 800 400"
            className="w-[min(90vw,700px)] h-auto"
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
      style={{ height: '250svh' }}
      aria-hidden
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* ── Airplane flying left → right ─────────────────────────────── */}
        <motion.div
          className="absolute pointer-events-none z-20"
          style={{
            left: planeLeft,
            top: '48%',
            translateY: '-50%',
            opacity: planeOpacity,
          }}
        >
          <svg
            viewBox="-160 -100 320 200"
            style={{
              height: '140vh',
              width: 'auto',
              filter: 'drop-shadow(0 0 32px #f59e0b) drop-shadow(0 0 14px #fbbf24)',
            }}
            aria-hidden
          >
            <g fill="#fbbf24">
              {/* Main fuselage + wings + tail */}
              <path d={PLANE_PATH} />
              {/* Engine nacelles — pods at ~55% semi-span, rotated to match sweep */}
              <ellipse cx="-26" cy="50" rx="16" ry="7" transform="rotate(20 -26 50)" />
              <ellipse cx="-26" cy="-50" rx="16" ry="7" transform="rotate(-20 -26 -50)" />
            </g>
          </svg>
        </motion.div>

        {/* ── Turkey SVG silhouette ─────────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
          style={{ opacity: svgOpacity }}
        >
          <svg
            viewBox="0 0 800 400"
            className="w-[min(92vw,820px)] lg:w-[min(72vw,860px)] h-auto"
            aria-label="Turkey silhouette"
          >
            {/* Filled silhouette with animated color */}
            <motion.path
              d={TURKEY_SVG_PATH}
              style={{ fill: fillColor, fillOpacity }}
            />

            {/* Wide glow layer (blurred duplicate) */}
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
          className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none"
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
