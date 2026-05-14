'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useTranslations } from '@/hooks/useTranslations';

const easeInOut = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const ease3 = [easeInOut, easeInOut, easeInOut];

export default function Hero() {
  const { language } = useAppStore();
  const { t, isRTL } = useTranslations();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Staggered opacity-only fade in; fade out matches the globe (0.88 → 1.0 smoothstep)
  const panelOpacity   = useTransform(scrollYProgress, [0.02, 0.10, 0.88, 1.0], [0, 1, 1, 0], { ease: ease3 });
  const eyebrowOpacity = useTransform(scrollYProgress, [0.04, 0.12, 0.88, 1.0], [0, 1, 1, 0], { ease: ease3 });
  const h1Opacity      = useTransform(scrollYProgress, [0.06, 0.14, 0.88, 1.0], [0, 1, 1, 0], { ease: ease3 });
  const h2Opacity      = useTransform(scrollYProgress, [0.08, 0.16, 0.88, 1.0], [0, 1, 1, 0], { ease: ease3 });
  const h3Opacity      = useTransform(scrollYProgress, [0.10, 0.18, 0.88, 1.0], [0, 1, 1, 0], { ease: ease3 });

  const htmlLang = language === 'ar' ? 'ar' : language === 'tr' ? 'tr' : 'en';
  const useArabicHeading = language === 'ar';

  const headlines = [
    { text: t('hero.headline1'), cls: 'text-white',          op: h1Opacity },
    { text: t('hero.headline2'), cls: 'text-gradient-gold',  op: h2Opacity },
    { text: t('hero.headline3'), cls: 'text-gradient-white', op: h3Opacity },
  ];

  return (
    <>
      {/* Scroll spacer — gives the section height so scrollYProgress works */}
      <section
        ref={heroRef}
        id="home"
        lang={htmlLang}
        className="relative w-full min-h-[200svh]"
        dir={isRTL ? 'rtl' : 'ltr'}
      />

      {/* Fixed panel — pinned to viewport, never moves, only fades */}
      <div
        aria-hidden={false}
        className={`fixed inset-0 z-20 pointer-events-none flex items-end justify-center px-6 pb-16 sm:px-10 sm:pb-20 lg:items-center lg:pb-0 lg:px-16 ${
          isRTL ? 'lg:justify-start' : 'lg:justify-end'
        }`}
      >
        <div className={`w-full max-w-md text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}>
          <motion.div
            className="relative isolate rounded-2xl border border-white/10 bg-black/50 px-6 py-8 shadow-[0_12px_48px_rgba(0,0,0,0.45)] backdrop-blur-md sm:px-8 sm:py-9 lg:px-10 lg:py-10"
            style={{ opacity: panelOpacity }}
            lang={htmlLang}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
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
          </motion.div>
        </div>
      </div>
    </>
  );
}
