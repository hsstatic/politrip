'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useTranslations } from '@/hooks/useTranslations';
import { pathWithLocale, getLocaleFromPathname } from '@/lib/locale-path';
import { EASE_OUT, EASE_EXPO_OUT, viewportOnce } from '@/lib/motion';
import type { TranslationKey } from '@/lib/i18n';
import type { MarketingSlug } from '@/lib/marketing-slugs';

const SLUG_CTA_HREF: Record<MarketingSlug, string> = {
  about:   '#',
  team:    'https://wa.me/905526867559',
  help:    'https://wa.me/905526867559',
  privacy: 'mailto:privacy@politrip.com',
  terms:   'mailto:info@politrip.com',
  contact: 'https://wa.me/905526867559',
  vision:  '#',
  hotels:  'https://wa.me/905526867559',
  vip:     'https://wa.me/905526867559',
};

const SLUG_ACCENT: Record<MarketingSlug, string> = {
  about:   '#22d3ee',
  team:    '#818cf8',
  help:    '#fb923c',
  privacy: '#94a3b8',
  terms:   '#94a3b8',
  contact: '#22d3ee',
  vision:  '#22d3ee',
  hotels:  '#22d3ee',
  vip:     '#e2c97e',
};

// Which slugs have stats bars and how many stats each has
const SLUG_STATS: Record<MarketingSlug, number> = {
  about: 4, team: 4, help: 2,
  privacy: 0, terms: 0, contact: 1, vision: 3, hotels: 0, vip: 4,
};

// Which slugs have 3 content blocks (all do except hotels which has 0 in meta)
const SLUG_BLOCKS: Record<MarketingSlug, number> = {
  about: 3, team: 3, help: 3,
  privacy: 3, terms: 3, contact: 3, vision: 3, hotels: 0, vip: 3,
};

export function MarketingArticle({ slug }: { slug: MarketingSlug }) {
  const { t, isRTL } = useTranslations();
  const pathname = usePathname();
  const homeHref = pathWithLocale('/', getLocaleFromPathname(pathname));
  const accent = SLUG_ACCENT[slug];
  const numStats = SLUG_STATS[slug];
  const numBlocks = SLUG_BLOCKS[slug];

  const headline = t(`slug.${slug}.headline` as TranslationKey);
  const eyebrow  = t(`slug.${slug}.eyebrow`  as TranslationKey);
  const cta      = t(`slug.${slug}.cta`      as TranslationKey);

  return (
    <div className="bg-canvas text-white" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 55% at 50% 0%, ${accent}14 0%, transparent 65%), linear-gradient(180deg, rgba(2,18,45,0.55) 0%, rgba(2,18,45,1) 100%)`,
          }}
          aria-hidden
        />
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: `linear-gradient(to right, transparent, ${accent}50, transparent)` }}
          aria-hidden
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 pt-40 pb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            <Link
              href={homeHref}
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-white/35 hover:text-white/70 transition-colors mb-10"
            >
              <span>{isRTL ? '→' : '←'}</span>
              <span>{t('slug.backHome' as TranslationKey)}</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: isRTL ? 16 : -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.05 }}
            className="flex items-center gap-3 mb-5"
          >
            <div
              className="h-px w-10"
              style={{ background: `linear-gradient(to ${isRTL ? 'left' : 'right'}, transparent, ${accent})` }}
            />
            <span className="text-[10px] uppercase tracking-[0.42em] font-bold" style={{ color: accent }}>
              {eyebrow}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: EASE_EXPO_OUT, delay: 0.1 }}
            className={`max-w-4xl ${isRTL ? 'text-[clamp(32px,4.5vw,72px)] font-light leading-[1.2] tracking-normal' : 'text-[clamp(40px,5.5vw,88px)] font-light leading-[0.95] tracking-[-0.025em]'}`}
            style={{ fontFamily: isRTL ? 'var(--font-arabic), sans-serif' : 'var(--font-display, serif)' }}
          >
            {headline}
          </motion.h1>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────────── */}
      {numStats > 0 && (
        <section className="border-y border-white/[0.07]">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
            <div
              className="grid divide-x divide-white/[0.07]"
              style={{ gridTemplateColumns: `repeat(${numStats}, 1fr)` }}
            >
              {Array.from({ length: numStats }, (_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.7, ease: EASE_OUT, delay: i * 0.07 }}
                  className="py-10 px-8 text-center"
                >
                  <p
                    className="text-[clamp(28px,3.5vw,48px)] font-light leading-none mb-2"
                    style={{
                      fontFamily: 'var(--font-display, serif)',
                      background: `linear-gradient(135deg, ${accent} 0%, rgba(255,255,255,0.9) 50%, ${accent} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {t(`slug.${slug}.stat${i + 1}.value` as TranslationKey)}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/40 font-medium">
                    {t(`slug.${slug}.stat${i + 1}.label` as TranslationKey)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Content blocks ────────────────────────────────────────────────── */}
      {numBlocks > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-24 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            <div className="hidden lg:block lg:col-span-3">
              <div className="sticky top-32">
                <p className="text-[10px] uppercase tracking-[0.42em] font-bold mb-4" style={{ color: accent }}>
                  PoliTrip
                </p>
                <div className="h-px w-10" style={{ background: `linear-gradient(to right, ${accent}, transparent)` }} />
              </div>
            </div>

            <div className="lg:col-span-9 space-y-16">
              {Array.from({ length: numBlocks }, (_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.8, ease: EASE_EXPO_OUT, delay: i * 0.06 }}
                  className={`relative ${isRTL ? 'pr-8 border-r' : 'pl-8 border-l'} border-white/[0.07]`}
                >
                  <div
                    className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-0 w-0.5 h-8`}
                    style={{ background: `linear-gradient(to bottom, ${accent}, transparent)` }}
                  />
                  <h2
                    className={`text-[clamp(20px,2.5vw,32px)] font-light text-white mb-4 ${isRTL ? 'leading-[1.4] tracking-normal' : 'leading-snug tracking-[-0.02em]'}`}
                    style={{ fontFamily: isRTL ? 'var(--font-arabic), sans-serif' : 'var(--font-display, serif)' }}
                  >
                    {t(`slug.${slug}.block${i + 1}.heading` as TranslationKey)}
                  </h2>
                  <p className="text-white/55 text-base leading-[1.85]">
                    {t(`slug.${slug}.block${i + 1}.body` as TranslationKey)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      {cta && (
        <section className="border-t border-white/[0.07]">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-20 lg:py-28 flex flex-col sm:flex-row items-center justify-between gap-8">
            <motion.p
              initial={{ opacity: 0, x: isRTL ? 16 : -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="text-white/40 text-sm uppercase tracking-[0.22em]"
            >
              PoliTrip · Luxury travel in Türkiye
            </motion.p>
            <motion.a
              href={SLUG_CTA_HREF[slug]}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, ease: EASE_EXPO_OUT, delay: 0.1 }}
              className="px-8 py-4 rounded-full text-[11px] font-bold tracking-[0.28em] uppercase text-[#02122d] transition-all duration-300 hover:scale-105 hover:brightness-110 shrink-0"
              style={{
                background: `linear-gradient(135deg, ${accent} 0%, rgba(255,255,255,0.85) 50%, ${accent} 100%)`,
                boxShadow: `0 0 32px ${accent}33`,
              }}
            >
              {cta}
            </motion.a>
          </div>
        </section>
      )}
    </div>
  );
}
