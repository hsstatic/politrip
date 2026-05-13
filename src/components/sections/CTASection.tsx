'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { EASE_OUT } from '@/lib/motion';

function hash(i: number, s: number) {
  const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// Stylized Istanbul skyline as SVG
function IstanbulSkyline() {
  return (
    <svg
      viewBox="0 0 1200 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      preserveAspectRatio="xMidYMax meet"
    >
      {/* Water reflection */}
      <rect x="0" y="180" width="1200" height="40" fill="rgba(34,211,238,0.04)" />
      <line x1="0" y1="180" x2="1200" y2="180" stroke="rgba(34,211,238,0.15)" strokeWidth="1" />

      {/* Main dome + minarets (Hagia Sophia / Blue Mosque silhouette) */}
      <ellipse cx="600" cy="120" rx="50" ry="40" fill="rgba(34,211,238,0.08)" />
      <rect x="572" y="80" width="56" height="40" fill="rgba(34,211,238,0.06)" />
      {/* Left minaret */}
      <rect x="548" y="40" width="10" height="100" fill="rgba(34,211,238,0.1)" />
      <path d="M553 40 L548 30 L558 30 Z" fill="rgba(34,211,238,0.15)" />
      {/* Right minaret */}
      <rect x="642" y="40" width="10" height="100" fill="rgba(34,211,238,0.1)" />
      <path d="M647 40 L642 30 L652 30 Z" fill="rgba(34,211,238,0.15)" />

      {/* Left cluster of buildings */}
      <rect x="50" y="140" width="30" height="40" fill="rgba(255,255,255,0.04)" />
      <rect x="85" y="120" width="45" height="60" fill="rgba(255,255,255,0.05)" />
      <rect x="135" y="100" width="35" height="80" fill="rgba(255,255,255,0.04)" />
      <rect x="175" y="130" width="50" height="50" fill="rgba(255,255,255,0.03)" />
      <rect x="230" y="110" width="40" height="70" fill="rgba(255,255,255,0.04)" />
      {/* Small dome left */}
      <ellipse cx="280" cy="110" rx="22" ry="18" fill="rgba(34,211,238,0.07)" />
      <rect x="270" y="90" width="6" height="28" fill="rgba(34,211,238,0.1)" />
      <rect x="284" y="90" width="6" height="28" fill="rgba(34,211,238,0.1)" />

      {/* Middle-left */}
      <rect x="330" y="105" width="55" height="75" fill="rgba(255,255,255,0.04)" />
      <rect x="390" y="115" width="40" height="65" fill="rgba(255,255,255,0.03)" />
      <rect x="435" y="130" width="30" height="50" fill="rgba(255,255,255,0.04)" />
      <rect x="470" y="105" width="25" height="75" fill="rgba(255,255,255,0.05)" />
      <rect x="500" y="120" width="35" height="60" fill="rgba(255,255,255,0.03)" />

      {/* Right cluster */}
      <rect x="665" y="120" width="35" height="60" fill="rgba(255,255,255,0.03)" />
      <rect x="705" y="105" width="25" height="75" fill="rgba(255,255,255,0.05)" />
      <rect x="735" y="130" width="30" height="50" fill="rgba(255,255,255,0.04)" />
      {/* Small dome right */}
      <ellipse cx="795" cy="115" rx="22" ry="18" fill="rgba(34,211,238,0.07)" />
      <rect x="785" y="95" width="6" height="28" fill="rgba(34,211,238,0.09)" />
      <rect x="799" y="95" width="6" height="28" fill="rgba(34,211,238,0.09)" />

      <rect x="830" y="110" width="40" height="70" fill="rgba(255,255,255,0.04)" />
      <rect x="875" y="125" width="50" height="55" fill="rgba(255,255,255,0.03)" />
      <rect x="930" y="140" width="35" height="40" fill="rgba(255,255,255,0.04)" />
      <rect x="970" y="115" width="45" height="65" fill="rgba(255,255,255,0.05)" />
      <rect x="1020" y="130" width="30" height="50" fill="rgba(255,255,255,0.03)" />
      <rect x="1055" y="110" width="40" height="70" fill="rgba(255,255,255,0.04)" />
      <rect x="1100" y="140" width="50" height="40" fill="rgba(255,255,255,0.03)" />

      {/* Bosphorus bridge silhouette (very faint) */}
      <path d="M0 175 Q600 160 1200 175" stroke="rgba(34,211,238,0.08)" strokeWidth="1" fill="none" />

      {/* Glow below dome */}
      <ellipse cx="600" cy="180" rx="120" ry="15" fill="rgba(34,211,238,0.06)" />
    </svg>
  );
}

export default function CTASection() {
  const { language } = useAppStore();
  const isAr = language === 'ar';

  const particles = useMemo(
    () => Array.from({ length: 18 }, (_, i) => ({
      left: hash(i, 1) * 100,
      top: hash(i, 2) * 80,
      size: hash(i, 3) * 2 + 1,
      dur: hash(i, 4) * 4 + 3,
      delay: hash(i, 5) * 5,
    })),
    []
  );

  return (
    <section
      className="relative overflow-hidden"
      dir={isAr ? 'rtl' : 'ltr'}
      style={{
        background: 'radial-gradient(ellipse 100% 120% at 50% 100%, #0d2c52 0%, #051b3c 55%, #02122d 100%)',
      }}
    >
      {/* Gold particles */}
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
              opacity: 0.3,
              animationName: 'twinkle',
              animationDuration: `${p.dur}s`,
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Top fade in from previous section */}
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
            {isAr ? 'رحلتك تنتظر' : 'Your Journey Awaits'}
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
            style={{ fontFamily: 'var(--font-display, serif)' }}
          >
            {isAr ? 'مستعد للمغادرة' : 'Ready to'}{' '}
            <span className="text-gradient-gold italic glow-gold-text">
              {isAr ? '؟' : 'Depart?'}
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
          {isAr
            ? 'انضم إلى آلاف المسافرين الخليجيين الذين اكتشفوا تركيا بأسلوب PoliTrip. رحلتك المثالية تبدأ بمكالمة واحدة.'
            : 'Join thousands of Gulf travelers who have discovered Türkiye the PoliTrip way. Your perfect journey begins with a single call.'}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE_OUT }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
        >
          <a
            href="https://wa.me/905300000000"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden px-10 py-5 rounded-full text-[11px] font-bold tracking-[0.28em] uppercase text-on-accent glow-gold bg-gradient-to-br from-accent-light via-accent to-accent-dark transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10">{isAr ? 'احجز عبر واتساب' : 'Book via WhatsApp'}</span>
          </a>
          <Link
            href="/packages"
            className="px-10 py-5 rounded-full text-[11px] font-bold tracking-[0.28em] uppercase text-white/70 border border-white/16 hover:border-accent/55 hover:text-accent transition-all duration-300"
          >
            {isAr ? 'استكشف الباقات' : 'Explore Packages'}
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-xs text-white/25 mb-16"
        >
          {isAr ? 'لا توجد رسوم حجز. سنرد خلال ٢٤ ساعة.' : 'No booking fee. Response within 24 hours.'}
        </motion.p>

        {/* Istanbul skyline silhouette */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, delay: 0.2, ease: EASE_OUT }}
          className="relative"
        >
          {/* Skyline glow */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#02122d] via-transparent to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[500px] h-12 bg-accent/12 blur-[40px] rounded-full" />
          <IstanbulSkyline />
        </motion.div>
      </div>
    </section>
  );
}
