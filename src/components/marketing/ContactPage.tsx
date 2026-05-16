'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useTranslations } from '@/hooks/useTranslations';
import { pathWithLocale, getLocaleFromPathname } from '@/lib/locale-path';
import { EASE_OUT, EASE_EXPO_OUT, viewportOnce } from '@/lib/motion';
import type { TranslationKey } from '@/lib/i18n';

const ACCENT = '#22d3ee';

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 7 10-7" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

const BLOCKS = [
  { icon: <EmailIcon />, key: 'block1' },
  { icon: <WhatsAppIcon />, key: 'block2' },
  { icon: <LocationIcon />, key: 'block3' },
] as const;

export function ContactPage() {
  const { t, isRTL } = useTranslations();
  const pathname = usePathname();
  const homeHref = pathWithLocale('/', getLocaleFromPathname(pathname));

  return (
    <div className="bg-canvas text-white" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[52vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 60% at 50% 0%, ${ACCENT}18 0%, transparent 65%), linear-gradient(180deg, rgba(2,18,45,0.5) 0%, rgba(2,18,45,1) 100%)`,
          }}
          aria-hidden
        />
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: `linear-gradient(to right, transparent, ${ACCENT}55, transparent)` }}
          aria-hidden
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 pt-40 pb-20">
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
            className="flex items-center gap-3 mb-6"
          >
            <div
              className="h-px w-10"
              style={{ background: `linear-gradient(to ${isRTL ? 'left' : 'right'}, transparent, ${ACCENT})` }}
            />
            <span className="text-[10px] uppercase tracking-[0.42em] font-bold" style={{ color: ACCENT }}>
              {t('slug.contact.eyebrow' as TranslationKey)}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: EASE_EXPO_OUT, delay: 0.1 }}
            className={`max-w-3xl ${isRTL ? 'text-[clamp(32px,4.5vw,72px)] font-light leading-[1.2] tracking-normal' : 'text-[clamp(40px,5.5vw,84px)] font-light leading-[0.95] tracking-[-0.025em]'}`}
            style={{ fontFamily: isRTL ? 'var(--font-arabic), sans-serif' : 'var(--font-display, serif)' }}
          >
            {t('slug.contact.headline' as TranslationKey)}
          </motion.h1>

          {/* Hours badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.25 }}
            className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.04] text-white/45 text-[11px] tracking-[0.14em]"
          >
            <span style={{ color: ACCENT }}><ClockIcon /></span>
            <span>09:00 – 21:00 · Istanbul · 7 days</span>
          </motion.div>
        </div>
      </section>

      {/* ── Primary action cards ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* WhatsApp */}
          <motion.a
            href="https://wa.me/905300000000"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: EASE_EXPO_OUT }}
            className="group relative overflow-hidden rounded-2xl p-8 flex flex-col gap-5 transition-all duration-500 hover:scale-[1.015]"
            style={{
              background: 'linear-gradient(135deg, rgba(34,211,238,0.1) 0%, rgba(34,211,238,0.04) 100%)',
              border: '1px solid rgba(34,211,238,0.18)',
              boxShadow: '0 0 0 0 rgba(34,211,238,0)',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 48px rgba(34,211,238,0.12)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 0 0 rgba(34,211,238,0)')}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34,211,238,0.07), transparent)' }}
              aria-hidden
            />
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)', color: ACCENT }}
            >
              <WhatsAppIcon />
            </div>
            <div>
              <p
                className={`text-white text-xl font-light mb-1 ${isRTL ? 'leading-[1.4]' : 'leading-snug tracking-[-0.01em]'}`}
                style={{ fontFamily: isRTL ? 'var(--font-arabic), sans-serif' : 'var(--font-display, serif)' }}
              >
                {t('slug.contact.wa.title' as TranslationKey)}
              </p>
              <p className="text-white/45 text-sm leading-[1.7]">
                {t('slug.contact.wa.desc' as TranslationKey)}
              </p>
            </div>
            <div className="mt-auto flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] font-bold" style={{ color: ACCENT }}>
              <span>{t('slug.contact.wa.cta' as TranslationKey)}</span>
              <span className={`transition-transform duration-300 group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'}`}>
                {isRTL ? '←' : '→'}
              </span>
            </div>
          </motion.a>

          {/* Email */}
          <motion.a
            href="mailto:info@politrip.com"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: EASE_EXPO_OUT, delay: 0.08 }}
            className="group relative overflow-hidden rounded-2xl p-8 flex flex-col gap-5 transition-all duration-500 hover:scale-[1.015]"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white/50 group-hover:text-accent transition-colors duration-300"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <EmailIcon />
            </div>
            <div>
              <p
                className={`text-white text-xl font-light mb-1 ${isRTL ? 'leading-[1.4]' : 'leading-snug tracking-[-0.01em]'}`}
                style={{ fontFamily: isRTL ? 'var(--font-arabic), sans-serif' : 'var(--font-display, serif)' }}
              >
                {t('slug.contact.email.title' as TranslationKey)}
              </p>
              <p className="text-white/45 text-sm leading-[1.7]">
                {t('slug.contact.email.desc' as TranslationKey)}
              </p>
            </div>
            <div className="mt-auto flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] font-bold text-white/35 group-hover:text-accent transition-colors duration-300">
              <span>info@politrip.com</span>
              <span className={`transition-transform duration-300 group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'}`}>
                {isRTL ? '←' : '→'}
              </span>
            </div>
          </motion.a>
        </div>
      </section>

      {/* ── Info blocks ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 pb-24 lg:pb-36">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {BLOCKS.map(({ icon, key }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: EASE_EXPO_OUT, delay: i * 0.07 }}
              className="relative rounded-2xl p-7 overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(to right, transparent, ${ACCENT}30, transparent)` }}
                aria-hidden
              />
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-5 text-white/40"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {icon}
              </div>
              <h3
                className={`text-white text-lg font-light mb-3 ${isRTL ? 'leading-[1.45]' : 'leading-snug tracking-[-0.01em]'}`}
                style={{ fontFamily: isRTL ? 'var(--font-arabic), sans-serif' : 'var(--font-display, serif)' }}
              >
                {t(`slug.contact.${key}.heading` as TranslationKey)}
              </h3>
              <p className="text-white/45 text-[13px] leading-[1.8]">
                {t(`slug.contact.${key}.body` as TranslationKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Location strip ────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 16 : -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="flex items-center gap-4"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: `${ACCENT}15`, border: `1px solid ${ACCENT}30`, color: ACCENT }}
            >
              <LocationIcon />
            </div>
            <div>
              <p
                className={`text-white text-base font-light ${isRTL ? 'leading-[1.4]' : 'tracking-[-0.01em]'}`}
                style={{ fontFamily: isRTL ? 'var(--font-arabic), sans-serif' : 'var(--font-display, serif)' }}
              >
                {t('slug.contact.stat1.value' as TranslationKey)}
              </p>
              <p className="text-white/35 text-[11px] uppercase tracking-[0.24em]">
                {t('slug.contact.stat1.label' as TranslationKey)}
              </p>
            </div>
          </motion.div>

          <motion.a
            href="https://wa.me/905300000000"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, ease: EASE_EXPO_OUT, delay: 0.1 }}
            className="px-8 py-4 rounded-full text-[11px] font-bold tracking-[0.28em] uppercase text-[#02122d] transition-all duration-300 hover:scale-105 hover:brightness-110 shrink-0"
            style={{
              background: `linear-gradient(135deg, ${ACCENT} 0%, rgba(255,255,255,0.85) 50%, ${ACCENT} 100%)`,
              boxShadow: `0 0 32px ${ACCENT}33`,
            }}
          >
            {t('slug.contact.cta' as TranslationKey)}
          </motion.a>
        </div>
      </section>

    </div>
  );
}
