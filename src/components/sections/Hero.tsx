'use client';

import { useRef, useEffect, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';

const GlobeCanvas = lazy(() => import('@/components/3d/Globe'));

const stats = [
  { value: '12,000+', key: 'hero.stat1' as const },
  { value: '240+',    key: 'hero.stat2' as const },
  { value: '80+',     key: 'hero.stat3' as const },
  { value: '6',       key: 'hero.stat4' as const },
];

export default function Hero() {
  const { language } = useAppStore();
  const tr = (key: Parameters<typeof t>[0]) => t(key, language);
  const containerRef = useRef<HTMLElement>(null);
  const scrollProgress = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const springProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
  const textY       = useTransform(springProgress, [0, 1], ['0%', '25%']);
  const textOpacity = useTransform(springProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    return springProgress.on('change', (v) => { scrollProgress.current = v; });
  }, [springProgress]);

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-[100svh] flex flex-col overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 0%,#0D1F3C 0%,#030812 70%)' }}
      dir={dir}
    >
      {/* Globe */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full"/>}>
          <GlobeCanvas scrollProgress={scrollProgress}/>
        </Suspense>
      </div>

      {/* Radial vignette */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%,transparent 30%,rgba(3,8,18,0.7) 100%)' }}
      />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 md:h-64 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top,#030812 0%,transparent 100%)' }}
      />

      {/* Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {[...Array(14)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-[#C9A96E]"
            style={{
              width:  `${Math.random() * 2.5 + 1}px`,
              height: `${Math.random() * 2.5 + 1}px`,
              left:   `${Math.random() * 100}%`,
              top:    `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.1,
              animation: `twinkle ${Math.random() * 4 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-20 flex flex-col items-center justify-center flex-1 text-center px-5 sm:px-8 pt-28 pb-20"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center gap-3 mb-6 md:mb-8"
        >
          <div className="h-px w-8 md:w-12 bg-gradient-to-r from-transparent to-[#C9A96E]"/>
          <span className="text-[10px] md:text-xs uppercase tracking-[4px] md:tracking-[5px] text-[#C9A96E] font-medium">
            {tr('hero.subtitle')}
          </span>
          <div className="h-px w-8 md:w-12 bg-gradient-to-l from-transparent to-[#C9A96E]"/>
        </motion.div>

        {/* Headline */}
        <div className="overflow-hidden mb-2 md:mb-4">
          <motion.h1
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="text-[clamp(52px,13vw,160px)] font-black leading-none tracking-tight"
            style={{
              fontFamily: 'var(--font-display,serif)',
              background: 'linear-gradient(180deg,#FFFFFF 0%,rgba(255,255,255,0.6) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}
          >
            {tr('hero.title1')}
          </motion.h1>
        </div>

        <div className="overflow-hidden mb-7 md:mb-10">
          <motion.h1
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.65, ease: [0.4, 0, 0.2, 1] }}
            className="text-[clamp(52px,13vw,160px)] font-black leading-none tracking-tight"
            style={{
              fontFamily: 'var(--font-display,serif)',
              background: 'linear-gradient(135deg,#E8CC9A 0%,#C9A96E 50%,#A07840 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}
          >
            {tr('hero.title2')}
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-[rgba(245,240,232,0.6)] text-base md:text-lg max-w-xl md:max-w-2xl mb-8 md:mb-12 leading-relaxed px-2"
        >
          {language === 'ar'
            ? 'تجارب سفر حصرية للمسافر الخليجي — رحلات VIP، فنادق فاخرة، ومغامرات لا تُنسى في تركيا الجميلة.'
            : 'Exclusive travel experiences for Gulf explorers — VIP trips, luxury hotels, and unforgettable adventures across magnificent Türkiye.'}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14 md:mb-20 w-full max-w-sm sm:max-w-none"
        >
          <button
            onClick={() => document.getElementById('trips')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative overflow-hidden w-full sm:w-auto px-7 py-4 rounded-full text-sm font-bold tracking-widest uppercase text-[#030812] glow-gold"
            style={{ background: 'linear-gradient(135deg,#E8CC9A,#C9A96E)' }}
          >
            <span className="relative z-10">{tr('hero.cta1')}</span>
            <div
              className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"
              style={{ background: 'linear-gradient(135deg,#A07840,#C9A96E)' }}
            />
          </button>

          <button
            onClick={() => document.getElementById('hotels')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-7 py-4 rounded-full text-sm font-bold tracking-widest uppercase border border-[rgba(201,169,110,0.4)] text-[rgba(245,240,232,0.8)] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all duration-300 glass"
          >
            {tr('hero.cta2')}
          </button>
        </motion.div>

        {/* Stats — 2×2 on mobile, 4 cols on md+ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 w-full max-w-xs sm:max-w-md md:max-w-3xl"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.4 + i * 0.1 }}
              className="glass rounded-xl md:rounded-2xl px-3 py-3 md:px-4 md:py-4 text-center pulse-glow"
            >
              <div
                className="text-xl md:text-3xl font-black mb-0.5 text-gradient-gold"
                style={{ fontFamily: 'var(--font-display,serif)' }}
              >
                {stat.value}
              </div>
              <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-[rgba(245,240,232,0.5)]">
                {tr(stat.key)}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] md:text-[10px] uppercase tracking-[4px] text-[rgba(245,240,232,0.35)]">
          {language === 'ar' ? 'اكتشف' : 'Scroll'}
        </span>
        <div className="w-px h-10 md:h-12 bg-gradient-to-b from-[#C9A96E] to-transparent float"/>
      </motion.div>

      {/* Destination card — desktop only */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden lg:block"
      >
        <div className="glass rounded-xl px-4 py-3 border border-[rgba(201,169,110,0.3)]">
          <p className="text-[10px] uppercase tracking-widest text-[#C9A96E] mb-1">Destination</p>
          <p className="text-sm font-semibold text-[rgba(245,240,232,0.9)]">🇹🇷 İstanbul</p>
          <p className="text-[10px] text-[rgba(245,240,232,0.4)]">41.0082° N, 28.9784° E</p>
        </div>
      </motion.div>
    </section>
  );
}
