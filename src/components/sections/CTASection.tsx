'use client';

import { useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useTranslations } from '@/hooks/useTranslations';
import { EASE_OUT, EASE_EXPO_OUT, viewportOnce, cinematicRise } from '@/lib/motion';
import { TURKEY_SVG_PATH } from '@/components/3d/turkeyOutlineSVG';
import BookingModal from '@/components/ui/BookingModal';

function hash(i: number, s: number) {
  const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const WA_BASE = 'https://wa.me/905526867559';

export default function CTASection() {
  const { t, isRTL } = useTranslations();
  const sectionRef = useRef<HTMLElement>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 55, damping: 22 });

  // ── Parallax depth layers ────────────────────────────────────────────────────
  const mapY     = useTransform(smoothProgress, [0, 1], ['8%', '-8%']);
  const mapScale = useTransform(smoothProgress, [0, 0.5, 1], [0.9, 1.0, 1.08]);
  const mapOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 0.04, 0.04, 0]);

  const glowY = useTransform(smoothProgress, [0, 1], ['4%', '-4%']);

  // ── Particles — deterministic positions ─────────────────────────────────────
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left:    hash(i, 1) * 100,
        top:     hash(i, 2) * 80,
        size:    hash(i, 3) * 1.2 + 0.6,
        dur:     hash(i, 4) * 4 + 3,
        delay:   hash(i, 5) * 8,
        opacity: 0.12 + hash(i, 6) * 0.32,
        // Orbital motion params
        orbitR:  20 + hash(i, 7) * 40,
        orbitDur: 8 + hash(i, 8) * 12,
      })),
    [],
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden scene-layer"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        background: 'radial-gradient(ellipse 100% 120% at 50% 100%, #0d2c52 0%, #051b3c 55%, #02122d 100%)',
      }}
    >
      {/* ── Top atmospheric bleed ────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-canvas to-transparent pointer-events-none z-10" />

      {/* ── Deep ambient glow — parallax ─────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: glowY }}
        aria-hidden
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(34,211,238,0.065) 0%, transparent 65%)',
            filter: 'blur(48px)',
          }}
        />
      </motion.div>

      {/* ── Turkey silhouette watermark — parallax ────────────────────────────── */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        style={{ y: mapY }}
        aria-hidden
      >
        <motion.svg
          viewBox="0 0 1000 500"
          className="w-[min(110vw,900px)] h-auto"
          style={{ opacity: mapOpacity, scale: mapScale }}
        >
          <path d={TURKEY_SVG_PATH} fill="#22d3ee" />
        </motion.svg>
      </motion.div>

      {/* ── Particles with orbit motion ───────────────────────────────────────── */}
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

      {/* ── Cinematic ring accent — oversized circle behind content ─────────── */}
      <div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          border: '1px solid rgba(34,211,238,0.06)',
          boxShadow: '0 0 80px rgba(34,211,238,0.03)',
        }}
        aria-hidden
      />
      <div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/4 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          border: '1px solid rgba(34,211,238,0.04)',
        }}
        aria-hidden
      />

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <div className="relative z-10 pt-24 md:pt-40 pb-0 px-5 sm:px-8 max-w-5xl mx-auto text-center">

        {/* Eyebrow */}
        <motion.div
          variants={cinematicRise}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          transition={{ duration: 0.9, ease: EASE_EXPO_OUT }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <motion.div
            className="h-px w-10 bg-gradient-to-r from-transparent to-accent"
            initial={{ scaleX: 0, originX: 1 }}
            whileInView={{ scaleX: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 }}
          />
          <span className="text-[10px] uppercase tracking-[0.42em] text-accent font-bold">
            {t('cta.eyebrow')}
          </span>
          <motion.div
            className="h-px w-10 bg-gradient-to-l from-transparent to-accent"
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 }}
          />
        </motion.div>

        {/* Headline */}
        <motion.div
          variants={cinematicRise}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          transition={{ duration: 1.1, ease: EASE_EXPO_OUT, delay: 0.08 }}
          className="mb-6"
        >
          <h2
            className="text-[clamp(36px,5.5vw,80px)] font-light leading-tight text-white"
            style={{ fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.025em' }}
          >
            {t('cta.ready')}{' '}
            {t('cta.highlight')}
          </h2>
        </motion.div>

        <motion.p
          variants={cinematicRise}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          transition={{ duration: 1.0, ease: EASE_EXPO_OUT, delay: 0.16 }}
          className="text-white/50 text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          {t('cta.body')}
        </motion.p>

        {/* CTA button */}
        <motion.div
          variants={cinematicRise}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          transition={{ duration: 1.0, ease: EASE_EXPO_OUT, delay: 0.24 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
        >
          <div className="relative">
            {/* Multi-layer glow rings */}
            <div
              className="absolute -inset-4 rounded-full blur-2xl opacity-35 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse, rgba(34,211,238,0.6) 0%, transparent 70%)' }}
              aria-hidden
            />
            <div
              className="absolute -inset-2 rounded-full blur-xl opacity-20 pointer-events-none"
              style={{ background: 'rgba(34,211,238,0.8)' }}
              aria-hidden
            />
            <a
              href={`${WA_BASE}?text=${encodeURIComponent(t('cta.whatsappMsg'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group overflow-hidden px-10 py-5 rounded-full text-[11px] font-bold tracking-[0.28em] uppercase text-on-accent glow-gold bg-gradient-to-br from-accent-light via-accent to-accent-dark transition-all duration-300 hover:scale-105 inline-block"
            >
              <span className="relative z-10">{t('cta.whatsapp')}</span>
              {/* Inner hover shimmer */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </div>
            </a>
          </div>

        </motion.div>

        <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-xs text-white/25 mb-10"
        >
          {t('cta.footerNote')}
        </motion.p>

        {/* Editorial coordinates line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="flex items-center justify-center gap-4 pb-20"
        >
        </motion.div>
      </div>
    </section>
  );
}
