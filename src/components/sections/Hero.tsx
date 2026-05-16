'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useTranslations } from '@/hooks/useTranslations';
import { getLenis } from '@/components/providers/LenisProvider';


function scrollTo(id: string, duration = 2.2) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { duration, easing: (t: number) => 1 - Math.pow(1 - t, 3) });
  } else {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

export default function Hero() {
  const { language } = useAppStore();
  const { t, isRTL } = useTranslations();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress, scrollY } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 30 });

  const panelOpacity   = useTransform(scrollYProgress, [0.02, 0.10, 0.88, 1.0], [0, 1, 1, 0]);
  const eyebrowOpacity = useTransform(scrollYProgress, [0.04, 0.12, 0.88, 1.0], [0, 1, 1, 0]);
  const h1Opacity      = useTransform(scrollYProgress, [0.06, 0.14, 0.88, 1.0], [0, 1, 1, 0]);
  const h2Opacity      = useTransform(scrollYProgress, [0.08, 0.16, 0.88, 1.0], [0, 1, 1, 0]);
  const h3Opacity      = useTransform(scrollYProgress, [0.10, 0.18, 0.88, 1.0], [0, 1, 1, 0]);

  const panelY    = useTransform(smoothProgress, [0, 1], ['0px', '-60px']);
  const scanLineX     = useTransform(smoothProgress, [0, 0.5, 1], ['-100%', '0%', '100%']);
  const scanLineOpacity = useTransform(scrollYProgress, [0.05, 0.12, 0.72, 0.82], [0, 0.6, 0.6, 0]);

  const entryOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const htmlLang = language === 'ar' ? 'ar' : language === 'tr' ? 'tr' : 'en';
  const useArabicHeading = language === 'ar';

  const headlines = [
    { text: t('hero.headline1'), cls: 'text-white',          op: h1Opacity },
    { text: t('hero.headline2'), cls: 'text-gradient-gold',  op: h2Opacity },
    { text: t('hero.headline3'), cls: 'text-gradient-white', op: h3Opacity },
  ];

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

      {/* Entry overlay — fades on scroll */}
      <motion.div
        className="fixed inset-0 z-[22] pointer-events-none flex flex-col items-center justify-center px-6 text-center"
        style={{ opacity: entryOpacity, willChange: 'opacity' }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-accent" aria-hidden />
          <span className="text-[10px] uppercase tracking-[0.42em] text-accent font-bold">
            {t('hero.eyebrow')}
          </span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-accent" aria-hidden />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="text-[clamp(2.8rem,9vw,7rem)] font-bold uppercase leading-none mb-4"
          style={{
            fontFamily: 'var(--font-display, serif)',
            letterSpacing: '0.18em',
            background: 'linear-gradient(135deg, #e2c97e 0%, #f5e6b8 40%, #c9a84c 70%, #e2c97e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 40px rgba(229,193,100,0.35))',
          }}
        >
          POLITRIP
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.75 }}
          className="max-w-[22rem] text-white/60 text-[13px] leading-[1.65] mb-8 text-center"
        >
          {t('hero.tagline')}
        </motion.p>

        <motion.button
          type="button"
          className="pointer-events-auto flex flex-col items-center gap-3 group"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          onClick={() => {
            const el = document.getElementById('turkey-reveal');
            if (!el) return;
            const lenis = getLenis();
            const target = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.4;
            if (lenis) lenis.scrollTo(target, { duration: 2.2, easing: (t: number) => 1 - Math.pow(1 - t, 3) });
            else window.scrollTo({ top: target, behavior: 'smooth' });
          }}
        >
          <span className="text-[9px] uppercase tracking-[0.42em] text-white/30 group-hover:text-accent transition-colors duration-300">
            {t('hero.scrollDown')}
          </span>
          <div className="relative w-9 h-9 rounded-full border border-accent/40 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-all duration-300">
            <motion.svg
              className="w-4 h-4 text-accent"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </motion.svg>
          </div>
        </motion.button>
      </motion.div>


      {/* Horizontal scan line */}
      <motion.div
        className="fixed left-0 right-0 z-[21] pointer-events-none hidden lg:block"
        style={{ top: '50%', height: '1px', opacity: scanLineOpacity }}
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

      {/* Main content panel */}
      <div
        className={`fixed inset-0 z-20 pointer-events-none flex items-end justify-center px-6 pb-16 sm:px-10 sm:pb-20 lg:items-center lg:pb-0 lg:px-16 ${
          isRTL ? 'lg:justify-start' : 'lg:justify-end'
        }`}
      >
        <div className={`w-full max-w-[420px] text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}>
          <motion.div
            className="cinema-panel cinema-panel--accent px-8 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14"
            style={{ opacity: panelOpacity, y: panelY, willChange: 'transform, opacity' }}
            lang={htmlLang}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Eyebrow row */}
            <motion.div
              style={{ opacity: eyebrowOpacity }}
              className={`flex items-center gap-3 mb-4 justify-center ${
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

            {/* Headline — single line */}
            <motion.h1
              style={{
                opacity: h1Opacity,
                fontFamily: useArabicHeading
                  ? 'var(--font-arabic), sans-serif'
                  : 'var(--font-display), ui-serif, serif',
              }}
              className={`overflow-visible pb-1 mb-5 ${
                useArabicHeading
                  ? 'text-[clamp(1.1rem,3vw,2rem)] font-normal leading-[1.22] tracking-normal text-white'
                  : 'text-[clamp(1.1rem,2.4vw,2rem)] font-light leading-[1.15] tracking-[-0.01em] text-white'
              }`}
            >
              {t('hero.headline1')}{' '}
              <span className="text-gradient-gold">{t('hero.headline2')}</span>
              {' '}{t('hero.headline3')}
            </motion.h1>

            {/* Tagline */}
            <motion.p
              style={{ opacity: h3Opacity }}
              className="text-white/50 text-[13px] leading-[1.7] mb-6 max-w-[340px] mx-auto lg:mx-0"
            >
              {t('hero.tagline')}
            </motion.p>

            {/* Scroll down button */}
            <motion.button
              type="button"
              style={{ opacity: eyebrowOpacity }}
              onClick={() => scrollTo('destinations', 3.5)}
              className={`pointer-events-auto flex items-center gap-3 mb-6 group ${
                isRTL ? 'flex-row-reverse justify-end' : ''
              }`}
            >
              <div className="relative w-9 h-9 rounded-full border border-accent/40 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-all duration-300">
                <motion.svg
                  className="w-4 h-4 text-accent"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </div>
              <span className="text-[10px] uppercase tracking-[0.32em] text-white/35 group-hover:text-accent transition-colors duration-300">
                {t('hero.scrollDown')}
              </span>
            </motion.button>

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
