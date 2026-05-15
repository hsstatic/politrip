'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useTranslations } from '@/hooks/useTranslations';

const easeInOut = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const ease3 = [easeInOut, easeInOut, easeInOut];

// Floating ambient data chips — the "Vision Pro" HUD feel
const DATA_CHIPS = [
  { label: 'ISTANBUL', sub: '41°01′N · 28°58′E', pos: 'top-[18%] left-[6%] lg:left-[8%]', delay: 0.4 },
  { label: 'CAPPADOCIA', sub: '38°39′N · 34°50′E', pos: 'top-[32%] right-[5%] lg:right-[7%]', delay: 0.6 },
  { label: 'ANTALYA', sub: '36°53′N · 30°42′E', pos: 'bottom-[28%] left-[4%] lg:left-[6%]', delay: 0.8 },
];

export default function Hero() {
  const { language } = useAppStore();
  const { t, isRTL } = useTranslations();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Smooth spring for parallax depth — removes jitter on fast scroll
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 30 });

  // Panel & content fade — staggered opacity cascade
  const panelOpacity   = useTransform(scrollYProgress, [0.02, 0.10, 0.88, 1.0], [0, 1, 1, 0], { ease: ease3 });
  const eyebrowOpacity = useTransform(scrollYProgress, [0.04, 0.12, 0.88, 1.0], [0, 1, 1, 0], { ease: ease3 });
  const h1Opacity      = useTransform(scrollYProgress, [0.06, 0.14, 0.88, 1.0], [0, 1, 1, 0], { ease: ease3 });
  const h2Opacity      = useTransform(scrollYProgress, [0.08, 0.16, 0.88, 1.0], [0, 1, 1, 0], { ease: ease3 });
  const h3Opacity      = useTransform(scrollYProgress, [0.10, 0.18, 0.88, 1.0], [0, 1, 1, 0], { ease: ease3 });

  // Cinematic parallax — panel drifts slightly upward as user scrolls
  const panelY = useTransform(smoothProgress, [0, 1], ['0px', '-60px']);

  // Ambient chip parallax — each layer moves at different speed
  const chipY1 = useTransform(smoothProgress, [0, 1], ['0px', '-40px']);
  const chipY2 = useTransform(smoothProgress, [0, 1], ['0px', '-25px']);
  const chipY3 = useTransform(smoothProgress, [0, 1], ['0px', '-55px']);
  const chipOpacity = useTransform(scrollYProgress, [0.05, 0.14, 0.75, 0.88], [0, 1, 1, 0]);

  // Horizontal scan line — cinematic HUD element
  const scanLineX = useTransform(smoothProgress, [0, 0.5, 1], ['-100%', '0%', '100%']);
  const scanLineOpacity = useTransform(scrollYProgress, [0.05, 0.12, 0.72, 0.82], [0, 0.6, 0.6, 0]);

  const htmlLang = language === 'ar' ? 'ar' : language === 'tr' ? 'tr' : 'en';
  const useArabicHeading = language === 'ar';

  const headlines = [
    { text: t('hero.headline1'), cls: 'text-white',          op: h1Opacity },
    { text: t('hero.headline2'), cls: 'text-gradient-gold',  op: h2Opacity },
    { text: t('hero.headline3'), cls: 'text-gradient-white', op: h3Opacity },
  ];

  const chipYValues = [chipY1, chipY2, chipY3];

  return (
    <>
      {/* Scroll spacer */}
      <section
        ref={heroRef}
        id="home"
        lang={htmlLang}
        className="relative w-full min-h-[200svh]"
        dir={isRTL ? 'rtl' : 'ltr'}
      />

      {/* ── Ambient floating HUD chips ─────────────────────────────────────── */}
      {DATA_CHIPS.map((chip, i) => (
        <motion.div
          key={chip.label}
          className={`fixed z-[21] pointer-events-none hidden lg:flex flex-col gap-0.5 ${chip.pos}`}
          style={{ opacity: chipOpacity, y: chipYValues[i] }}
          initial={{ opacity: 0 }}
        >
          <div
            className="px-3 py-2 rounded-lg"
            style={{
              background: 'rgba(2, 18, 45, 0.55)',
              border: '1px solid rgba(34, 211, 238, 0.14)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="text-[8px] font-bold tracking-[0.38em] uppercase text-accent/80 mb-0.5">
              {chip.label}
            </div>
            <div className="text-[9px] text-white/35 tracking-wider font-mono">
              {chip.sub}
            </div>
          </div>
        </motion.div>
      ))}

      {/* ── Horizontal scan line — cinematic HUD ──────────────────────────── */}
      <motion.div
        className="fixed left-0 right-0 z-[21] pointer-events-none hidden lg:block"
        style={{
          top: '50%',
          height: '1px',
          opacity: scanLineOpacity,
        }}
        aria-hidden
      >
        <motion.div
          className="h-full"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.4), transparent)',
            x: scanLineX,
          }}
        />
      </motion.div>

      {/* ── Main content panel — fixed, cinema-panel glass ────────────────── */}
      <div
        aria-hidden={false}
        className={`fixed inset-0 z-20 pointer-events-none flex items-end justify-center px-6 pb-16 sm:px-10 sm:pb-20 lg:items-center lg:pb-0 lg:px-16 ${
          isRTL ? 'lg:justify-start' : 'lg:justify-end'
        }`}
      >
        <div className={`w-full max-w-md text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}>
          <motion.div
            className="cinema-panel cinema-panel--accent px-6 py-8 sm:px-8 sm:py-9 lg:px-10 lg:py-10"
            style={{ opacity: panelOpacity, y: panelY }}
            lang={htmlLang}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Eyebrow row */}
            <motion.div
              style={{ opacity: eyebrowOpacity }}
              className={`flex items-center gap-3 mb-6 lg:mb-8 justify-center ${
                isRTL ? 'lg:justify-end' : 'lg:justify-start'
              }`}
            >
              <div
                className={`h-px w-10 shrink-0 ${
                  isRTL
                    ? 'bg-gradient-to-l from-transparent to-accent'
                    : 'bg-gradient-to-r from-transparent to-accent'
                }`}
                aria-hidden
              />
              <span
                className={`max-w-[14rem] text-[11px] font-semibold text-accent tracking-[0.28em] [font-family:var(--font-body),ui-sans-serif,system-ui,sans-serif] ${
                  useArabicHeading ? 'text-right leading-snug tracking-[0.12em]' : 'uppercase'
                }`}
              >
                {t('hero.eyebrow')}
              </span>
            </motion.div>

            {/* Headlines — staggered opacity cascade */}
            {headlines.map((line, i) => (
              <div key={i} className={i < 2 ? 'mb-1.5 sm:mb-2' : 'mb-7 sm:mb-8 lg:mb-10'}>
                <motion.h1
                  style={{
                    opacity: line.op,
                    fontFamily: useArabicHeading
                      ? 'var(--font-arabic), sans-serif'
                      : 'var(--font-display), ui-serif, serif',
                  }}
                  className={`text-balance ${line.cls} ${
                    useArabicHeading
                      ? 'text-[clamp(1.875rem,5.8vw,3.85rem)] font-normal leading-[1.18] tracking-normal'
                      : 'text-[clamp(2.125rem,4.85vw,min(4.5rem,4.875rem))] font-light leading-[1.06] tracking-[-0.02em]'
                  }`}
                >
                  {line.text}
                </motion.h1>
              </div>
            ))}

            {/* Bottom decorative rule */}
            <motion.div
              style={{ opacity: eyebrowOpacity }}
              className="flex items-center gap-3"
            >
              <div className="h-px flex-1 bg-gradient-to-r from-accent/30 to-transparent" />
              <span className="text-[8px] font-mono text-white/20 tracking-widest">PoliTrip</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
