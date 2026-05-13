'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAppStore } from '@/lib/store';

export default function Hero() {
  const { language } = useAppStore();
  const isAr = language === 'ar';
  const heroRef = useRef<HTMLElement>(null);

  // 0 = top of hero at top of viewport, 1 = bottom of hero at top of viewport.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Side wash for text contrast — gently fades in with the copy.
  const washOpacity = useTransform(scrollYProgress, [0.0, 0.12, 0.65, 0.82], [0, 1, 1, 0]);

  // Eyebrow appears first.
  const eyebrowOpacity = useTransform(scrollYProgress, [0.02, 0.10, 0.65, 0.78], [0, 1, 1, 0]);
  const eyebrowY = useTransform(scrollYProgress, [0.02, 0.10], [24, 0]);
  const eyebrowX = useTransform(scrollYProgress, [0.02, 0.10], [isAr ? -16 : 16, 0]);

  // Headline lines stagger in from below with overshoot.
  const h1Opacity = useTransform(scrollYProgress, [0.05, 0.13, 0.65, 0.78], [0, 1, 1, 0]);
  const h1Y = useTransform(scrollYProgress, [0.05, 0.13], [70, 0]);

  const h2Opacity = useTransform(scrollYProgress, [0.08, 0.16, 0.65, 0.78], [0, 1, 1, 0]);
  const h2Y = useTransform(scrollYProgress, [0.08, 0.16], [70, 0]);

  const h3Opacity = useTransform(scrollYProgress, [0.11, 0.19, 0.65, 0.78], [0, 1, 1, 0]);
  const h3Y = useTransform(scrollYProgress, [0.11, 0.19], [70, 0]);

  // Semi-transparent backdrop card — fades in slightly before headlines, lifts & scales in.
  const panelOpacity = useTransform(scrollYProgress, [0, 0.02, 0.10, 0.65, 0.78], [0, 0, 1, 1, 0]);
  const panelY = useTransform(scrollYProgress, [0.02, 0.11], [22, 0]);
  const panelScale = useTransform(scrollYProgress, [0.02, 0.11], [0.96, 1]);

  const headlines = [
    { text: isAr ? 'بوابتك المميزة' : 'Your Premium', cls: 'text-white', op: h1Opacity, y: h1Y },
    { text: isAr ? 'من الخليج' : 'Gateway From The Gulf', cls: 'text-gradient-gold', op: h2Opacity, y: h2Y },
    { text: isAr ? 'إلى تركيا' : 'To Türkiye', cls: 'text-gradient-white', op: h3Opacity, y: h3Y },
  ];

  return (
    <section
      ref={heroRef}
      id="home"
      lang={isAr ? 'ar' : 'en'}
      className="relative w-full min-h-[300svh]"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* Side wash for text contrast over the globe — desktop horizontal,
            mobile vertical (text sits at the bottom of the viewport on phones,
            so a bottom-up navy fade reads correctly behind it). */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none hidden lg:block"
          style={{
            opacity: washOpacity,
            background: isAr
              ? 'linear-gradient(to right, rgba(2,18,45,0.85) 0%, rgba(2,18,45,0.5) 30%, transparent 60%)'
              : 'linear-gradient(to left, rgba(2,18,45,0.85) 0%, rgba(2,18,45,0.5) 30%, transparent 60%)',
          }}
        />
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none lg:hidden"
          style={{
            opacity: washOpacity,
            background:
              'linear-gradient(to top, rgba(2,18,45,0.94) 0%, rgba(2,18,45,0.78) 22%, rgba(2,18,45,0.30) 50%, transparent 75%)',
          }}
        />

        {/* Hero text — bottom-center on mobile, side column on desktop. */}
        <div
          className={`relative z-20 mx-auto h-full max-w-7xl px-6 sm:px-10 lg:px-16 flex flex-col items-center justify-end pb-16 lg:flex-row lg:items-center lg:pb-0 ${
            isAr ? 'lg:justify-start' : 'lg:justify-end'
          }`}
        >
          <div
            className={`relative w-full max-w-md text-center ${
              isAr ? 'lg:text-right' : 'lg:text-left'
            }`}
          >
            {/* Dark translucent panel — scroll-linked fade, lift & scale */}
            <motion.div
              className="relative isolate rounded-2xl border border-white/10 bg-black/50 px-6 py-8 shadow-[0_12px_48px_rgba(0,0,0,0.45)] backdrop-blur-md sm:px-8 sm:py-9 lg:px-10 lg:py-10"
              style={{ opacity: panelOpacity, y: panelY, scale: panelScale, transformOrigin: 'center bottom' }}
            >
              <motion.div
                style={{ opacity: eyebrowOpacity, y: eyebrowY, x: eyebrowX }}
                className={`flex items-center gap-3 mb-6 lg:mb-8 justify-center ${
                  isAr ? 'lg:justify-end' : 'lg:justify-start'
                }`}
              >
                <div
                  className={`h-px w-10 shrink-0 ${
                    isAr ? 'bg-gradient-to-l from-transparent to-accent' : 'bg-gradient-to-r from-transparent to-accent'
                  }`}
                  aria-hidden
                />
                <span
                  className={`max-w-[14rem] text-[11px] font-semibold text-accent tracking-[0.28em] [font-family:var(--font-body),ui-sans-serif,system-ui,sans-serif] ${
                    isAr ? 'text-right leading-snug tracking-[0.12em]' : 'uppercase'
                  }`}
                >
                  {isAr ? 'سياحة خليجية فاخرة' : 'Premium Gulf Tourism'}
                </span>
              </motion.div>

              {headlines.map((line, i) => (
                <div key={i} className={`overflow-hidden ${i < 2 ? 'mb-1.5 sm:mb-2' : 'mb-7 sm:mb-8 lg:mb-10'}`}>
                  <motion.h1
                    style={{
                      opacity: line.op,
                      y: line.y,
                      fontFamily: isAr ? 'var(--font-arabic), sans-serif' : 'var(--font-display), ui-serif, serif',
                    }}
                    className={`text-balance ${line.cls} ${
                      isAr
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
