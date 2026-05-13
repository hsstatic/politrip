'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '@/hooks/useTranslations';
import { EASE_OUT } from '@/lib/motion';
import { TURKEY_SVG_PATH } from '@/components/3d/turkeyOutlineSVG';

function hash(i: number, s: number) {
  const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453;
  return x - Math.floor(x);
}


export default function CTASection() {
  const { t, isRTL } = useTranslations();

  const particles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        left: hash(i, 1) * 100,
        top: hash(i, 2) * 80,
        size: hash(i, 3) * 0.8 + 0.7,
        dur: hash(i, 4) * 4 + 3,
        delay: hash(i, 5) * 6,
        opacity: 0.15 + hash(i, 6) * 0.3,
      })),
    [],
  );

  return (
    <section
      className="relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        background:
          'radial-gradient(ellipse 100% 120% at 50% 100%, #0d2c52 0%, #051b3c 55%, #02122d 100%)',
      }}
    >
      {/* Turkey silhouette watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        aria-hidden
      >
        <svg
          viewBox="0 0 800 400"
          className="w-[min(110vw,900px)] h-auto opacity-[0.04]"
          style={{ transform: 'translateY(10%)' }}
        >
          <path d={TURKEY_SVG_PATH} fill="#22d3ee" />
        </svg>
      </div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" suppressHydrationWarning>
        {particles.map((p, i) => (
          <div
            key={i}
            suppressHydrationWarning
            className="absolute rounded-full bg-accent"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animationName: 'twinkle',
              animationDuration: `${p.dur}s`,
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-canvas to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 pt-24 md:pt-36 pb-0 px-5 sm:px-8 max-w-5xl mx-auto text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-accent" />
          <span className="text-[10px] uppercase tracking-[0.42em] text-accent font-bold">
            {t('cta.eyebrow')}
          </span>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-accent" />
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.0, delay: 0.1, ease: EASE_OUT }}
          className="mb-6"
        >
          <h2
            className="text-[clamp(36px,5.5vw,80px)] font-light leading-tight text-white"
            style={{ fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.025em' }}
          >
            {t('cta.ready')}{' '}
            <span className="italic glow-gold-text shimmer-accent">
              {t('cta.highlight')}
            </span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE_OUT }}
          className="text-white/50 text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          {t('cta.body')}
        </motion.p>

        {/* CTA button with radial glow */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE_OUT }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
        >
          <div className="relative">
            {/* Button glow ring */}
            <div
              className="absolute -inset-3 rounded-full blur-xl opacity-40 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse, rgba(34,211,238,0.55) 0%, transparent 70%)' }}
              aria-hidden
            />
            <a
              href="https://wa.me/905300000000"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group overflow-hidden px-10 py-5 rounded-full text-[11px] font-bold tracking-[0.28em] uppercase text-on-accent glow-gold bg-gradient-to-br from-accent-light via-accent to-accent-dark transition-all duration-300 hover:scale-105 inline-block"
            >
              <span className="relative z-10">{t('cta.whatsapp')}</span>
            </a>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-xs text-white/25 mb-8"
        >
          {t('cta.footerNote')}
        </motion.p>

        {/* Editorial coordinates line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.6 }}
          className="flex items-center justify-center gap-4 pb-20"
        >
          <div className="h-px w-12 bg-white/15" />
          <span className="text-[9px] uppercase tracking-[0.42em] text-white/20">
            41°01′N · 28°58′E · Istanbul, Türkiye
          </span>
          <div className="h-px w-12 bg-white/15" />
        </motion.div>
      </div>
    </section>
  );
}
