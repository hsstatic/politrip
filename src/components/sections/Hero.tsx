'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useTranslations } from '@/hooks/useTranslations';

export default function Hero() {
  const { language } = useAppStore();
  const { t, isRTL } = useTranslations();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const washOpacity = useTransform(scrollYProgress, [0.0, 0.12, 0.88, 0.98], [0, 1, 1, 0]);

  const eyebrowOpacity = useTransform(scrollYProgress, [0.02, 0.10, 0.88, 0.97], [0, 1, 1, 0]);
  const eyebrowY = useTransform(scrollYProgress, [0.02, 0.10], [24, 0]);
  const eyebrowX = useTransform(scrollYProgress, [0.02, 0.10], [isRTL ? -16 : 16, 0]);

  const h1Opacity = useTransform(scrollYProgress, [0.05, 0.13, 0.88, 0.97], [0, 1, 1, 0]);
  const h1Y = useTransform(scrollYProgress, [0.05, 0.13], [70, 0]);

  const h2Opacity = useTransform(scrollYProgress, [0.08, 0.16, 0.88, 0.97], [0, 1, 1, 0]);
  const h2Y = useTransform(scrollYProgress, [0.08, 0.16], [70, 0]);

  const h3Opacity = useTransform(scrollYProgress, [0.11, 0.19, 0.88, 0.97], [0, 1, 1, 0]);
  const h3Y = useTransform(scrollYProgress, [0.11, 0.19], [70, 0]);

  const panelOpacity = useTransform(scrollYProgress, [0, 0.02, 0.10, 0.88, 0.97], [0, 0, 1, 1, 0]);
  const panelY = useTransform(scrollYProgress, [0.02, 0.11], [22, 0]);
  const panelScale = useTransform(scrollYProgress, [0.02, 0.11], [0.96, 1]);

  const htmlLang = language === 'ar' ? 'ar' : language === 'tr' ? 'tr' : 'en';

  const headlines = [
    { text: t('hero.headline1'), cls: 'text-white', op: h1Opacity, y: h1Y },
    { text: t('hero.headline2'), cls: 'text-gradient-gold', op: h2Opacity, y: h2Y },
    { text: t('hero.headline3'), cls: 'text-gradient-white', op: h3Opacity, y: h3Y },
  ];

  const useArabicHeading = language === 'ar';

  return (
    <section
      ref={heroRef}
      id="home"
      lang={htmlLang}
      className="relative w-full min-h-[200svh]"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        <div
          className={`relative z-20 mx-auto h-svh max-w-7xl px-6 sm:px-10 lg:px-16 flex flex-col items-center justify-end pb-[max(4rem,env(safe-area-inset-bottom,0px))] lg:flex-row lg:items-center lg:pb-0 ${
            isRTL ? 'lg:justify-start' : 'lg:justify-end'
          }`}
        >
          <div
            className={`relative w-full max-w-md text-center ${
              isRTL ? 'lg:text-right' : 'lg:text-left'
            }`}
          >
            <motion.div
              className="relative isolate rounded-2xl border border-white/10 bg-black/50 px-6 py-8 shadow-[0_12px_48px_rgba(0,0,0,0.45)] backdrop-blur-md sm:px-8 sm:py-9 lg:px-10 lg:py-10"
              style={{ opacity: panelOpacity, y: panelY, scale: panelScale, transformOrigin: 'center bottom' }}
            >
              <motion.div
                style={{ opacity: eyebrowOpacity, y: eyebrowY, x: eyebrowX }}
                className={`flex items-center gap-3 mb-6 lg:mb-8 justify-center ${
                  isRTL ? 'lg:justify-end' : 'lg:justify-start'
                }`}
              >
                <div
                  className={`h-px w-10 shrink-0 ${
                    isRTL ? 'bg-gradient-to-l from-transparent to-accent' : 'bg-gradient-to-r from-transparent to-accent'
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
                <div key={i} className={`overflow-hidden ${i < 2 ? 'mb-1.5 sm:mb-2' : 'mb-7 sm:mb-8 lg:mb-10'}`}>
                  <motion.h1
                    style={{
                      opacity: line.op,
                      y: line.y,
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
      </div>
    </section>
  );
}
