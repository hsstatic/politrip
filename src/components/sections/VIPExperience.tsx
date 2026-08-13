'use client';

import { motion } from 'framer-motion';
import { useTranslations } from '@/hooks/useTranslations';
import { viewportOnce, EASE_EXPO_OUT, EASE_OUT } from '@/lib/motion';

const SERVICES = [
  {
    icon: '✈',
    titleKey: 'vip.service1.title',
    descKey: 'vip.service1.desc',
    accent: '#f59e0b',
  },
  {
    icon: '⛵',
    titleKey: 'vip.service2.title',
    descKey: 'vip.service2.desc',
    accent: '#818cf8',
  },
  {
    icon: '🏨',
    titleKey: 'vip.service3.title',
    descKey: 'vip.service3.desc',
    accent: '#fbbf24',
  },
  {
    icon: '🚁',
    titleKey: 'vip.service4.title',
    descKey: 'vip.service4.desc',
    accent: '#34d399',
  },
  {
    icon: '🚗',
    titleKey: 'vip.service5.title',
    descKey: 'vip.service5.desc',
    accent: '#f472b6',
  },
  {
    icon: '🧭',
    titleKey: 'vip.service6.title',
    descKey: 'vip.service6.desc',
    accent: '#fb923c',
  },
] as const;

const STATS = [
  { value: '5★', labelKey: 'vip.stat1' },
  { value: '24/7', labelKey: 'vip.stat2' },
  { value: '100%', labelKey: 'vip.stat3' },
  { value: '15+', labelKey: 'vip.stat4' },
] as const;

export default function VIPExperience() {
  const { t, isRTL } = useTranslations();

  return (
    <div className="bg-canvas text-ink" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── Hero banner ──────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--accent) 12%, transparent) 0%, transparent 65%), linear-gradient(180deg, color-mix(in srgb, var(--canvas) 60%, transparent) 0%, var(--canvas) 100%)',
          }}
          aria-hidden
        />
        {/* Gold shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" aria-hidden />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 pt-40 pb-20 w-full">
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="flex items-center gap-3 mb-6"
          >
            <div className={`h-px w-12 ${isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-transparent to-accent`} />
            <span className="text-[10px] uppercase tracking-[0.42em] text-accent font-bold">
              {t('vip.eyebrow')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: EASE_EXPO_OUT, delay: 0.1 }}
            className={`text-[clamp(42px,6vw,96px)] font-[300] max-w-4xl mb-6 ${isRTL ? 'leading-[1.2] tracking-normal' : 'leading-[0.95] tracking-[-0.02em]'}`}
            style={{ fontFamily: isRTL ? 'var(--font-arabic), sans-serif' : 'var(--font-display, serif)' }}
          >
            {t('vip.headline1')}{' '}
            <span className="text-ink">
              {t('vip.headline2')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_EXPO_OUT, delay: 0.25 }}
            className="text-ink/55 text-base lg:text-lg leading-[1.8] max-w-2xl"
          >
            {t('vip.intro')}
          </motion.p>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────────── */}
      <section className="border-y border-edge">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-edge">
            {STATS.map((s, i) => (
              <motion.div
                key={s.labelKey}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: i * 0.08 }}
                className="py-10 px-8 text-center"
              >
                <p
                  className="text-[clamp(36px,4vw,56px)] font-[300] leading-none mb-2 text-gradient-brand"
                  style={{ fontFamily: 'var(--font-display, serif)' }}
                >
                  {s.value}
                </p>
                <p className="text-[11px] uppercase tracking-[0.28em] text-ink/40 font-medium">
                  {t(s.labelKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services grid ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-28 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.8, ease: EASE_OUT }}
          className="max-w-xl mb-16 lg:mb-20"
        >
          <h2
            className={`text-[clamp(32px,4.5vw,68px)] font-[300] mb-5 ${isRTL ? 'leading-[1.2] tracking-normal' : 'leading-[0.97] tracking-[-0.02em]'}`}
            style={{ fontFamily: isRTL ? 'var(--font-arabic), sans-serif' : 'var(--font-display, serif)' }}
          >
            {t('vip.servicesTitle')}
          </h2>
          <p className="text-ink/50 text-base leading-[1.75]">
            {t('vip.servicesSubtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((svc, i) => (
            <motion.div
              key={svc.titleKey}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.75, ease: EASE_EXPO_OUT, delay: i * 0.07 }}
              className="cinema-panel relative p-7 overflow-hidden group"
            >
              {/* Gold top border shimmer */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: 'linear-gradient(to right, transparent, color-mix(in srgb, var(--accent) 55%, transparent), transparent)',
                }}
                aria-hidden
              />

              {/* Corner glow on hover */}
              <div
                className="absolute top-0 right-0 w-40 h-40 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(ellipse at top right, color-mix(in srgb, var(--accent) 8%, transparent), transparent 70%)',
                }}
                aria-hidden
              />

              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-5 shrink-0"
                style={{
                  background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
                }}
              >
                {svc.icon}
              </div>

              <h3
                className="text-ink text-lg font-medium mb-2 leading-snug"
                style={{ fontFamily: 'var(--font-display, serif)' }}
              >
                {t(svc.titleKey)}
              </h3>
              <p className="text-ink/45 text-[13px] leading-[1.75]">
                {t(svc.descKey)}
              </p>

              {/* Bottom gold rule on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(to right, transparent, color-mix(in srgb, var(--accent) 45%, transparent), transparent)' }}
                aria-hidden
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA strip ─────────────────────────────────────────────────────── */}
      <section className="border-t border-edge">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-24 lg:py-32 flex flex-col lg:flex-row items-center justify-between gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.8, ease: EASE_OUT }}
            className="max-w-xl"
          >
            <h2
              className={`text-[clamp(28px,3.5vw,52px)] font-[300] mb-4 ${isRTL ? 'leading-[1.3] tracking-normal' : 'leading-[1.05] tracking-[-0.02em]'}`}
              style={{ fontFamily: isRTL ? 'var(--font-arabic), sans-serif' : 'var(--font-display, serif)' }}
            >
              {t('vip.ctaTitle')}
            </h2>
            <p className="text-ink/45 text-base leading-[1.75]">
              {t('vip.ctaBody')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: EASE_EXPO_OUT, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 shrink-0"
          >
            <a
              href="https://wa.me/905300709555"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full text-[11px] font-bold tracking-[0.28em] uppercase bg-gradient-to-br from-accent-light via-accent to-accent-dark text-on-accent glow-gold transition-all duration-300 hover:scale-105 hover:brightness-110 text-center"
            >
              {t('vip.ctaWhatsapp')}
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
