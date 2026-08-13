'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useTranslations } from '@/hooks/useTranslations';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { subscribeNewsletter, type NewsletterState } from '@/app/actions/newsletter';
import { staggerContainer, staggerItem, EASE_EXPO_OUT, cinematicRise } from '@/lib/motion';

const socialLinks = [
  {
    name: 'WhatsApp',
    href: 'https://wa.me/905300709555',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    ),
  },
];

const companyLinks = [
  { labelKey: 'footer.link.about'   as const, href: '/about' },
  { labelKey: 'footer.link.team'    as const, href: '/team' },
  { labelKey: 'footer.link.vision'  as const, href: '/vision' },
];

const serviceLinks = [
  { labelKey: 'footer.link.vipTrips'      as const, href: '/#vip' },
  { labelKey: 'footer.link.luxuryHotels'  as const, href: '/hotels' },
  { labelKey: 'footer.link.destinations'  as const, href: '/#destinations' },
];


export default function Footer() {
  const { t, isRTL } = useTranslations();
  const { withLocale } = useLocalizedPath();
  const [email, setEmail] = useState('');
  const footerRef = useRef<HTMLElement>(null);
  const initialState: NewsletterState = { ok: false };
  const [state, action, pending] = useActionState(subscribeNewsletter, initialState);

  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['start end', 'end end'],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  // Parallax depth orb behind the footer
  const orbY    = useTransform(smoothProgress, [0, 1], ['20%', '-10%']);
  const orbScale = useTransform(smoothProgress, [0, 1], [0.7, 1.15]);

  useEffect(() => {
    if (state.ok) {
      const id = window.setTimeout(() => setEmail(''), 0);
      return () => window.clearTimeout(id);
    }
  }, [state.ok]);

  const columns = [
    { titleKey: 'footer.column.company'  as const, links: companyLinks },
    { titleKey: 'footer.column.services' as const, links: serviceLinks },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden border-t border-edge-subtle bg-canvas text-ink"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* ── Top atmospheric bleed from CTA ───────────────────────────────── */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 20%, transparent), transparent)' }}
        aria-hidden
      />

      {/* ── Deep parallax ambient orb ─────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: orbY }}
        aria-hidden
      >
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[min(900px,100%)] h-72 rounded-full"
          style={{
            scale: orbScale,
            background: 'radial-gradient(ellipse at center bottom, color-mix(in srgb, var(--accent) 7%, transparent) 0%, transparent 70%)',
            filter: 'blur(48px)',
          }}
        />
      </motion.div>

      {/* ── Subtle editorial grid ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: 'linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-10">
        {/* ── Brand + newsletter + links grid ──────────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -8% 0px', amount: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16"
        >
          {/* Brand col */}
          <motion.div variants={staggerItem} className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-6">
              <span className="flex h-10 w-10 shrink-0 items-center">
                <Image
                  src="/textures/earth/logo.svg"
                  alt=""
                  width={1024}
                  height={1024}
                  unoptimized
                  sizes="40px"
                  className="h-full w-full object-contain"
                />
              </span>
              <span
                className="text-gradient-brand translate-y-[0.5px] whitespace-nowrap font-bold uppercase text-lg"
                style={{
                  fontFamily: 'var(--font-display, serif)',
                  letterSpacing: '0.22em',
                }}
              >
                POLITRIP
              </span>
            </div>

            <p className="text-ink/50 text-sm leading-relaxed mb-6 max-w-xs">
              {t('footer.brandBlurb')}
            </p>

            {/* Newsletter */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-accent-light mb-3 font-semibold">
                {t('footer.newsletter')}
              </p>
              <form action={action} className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    aria-label={t('footer.placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('footer.placeholder')}
                    className="flex-1 bg-ink/5 border border-edge rounded-full px-4 py-2.5 text-xs text-ink/85 placeholder:text-ink/35 focus:outline-none focus:border-accent/50 focus:bg-ink/10 transition-all duration-300"
                  />
                  <button
                    type="submit"
                    disabled={pending}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-on-accent bg-gradient-to-br from-accent-light to-accent-dark hover:brightness-110 hover:scale-105 transition-all duration-300 disabled:opacity-60"
                  >
                    {state.ok ? t('footer.subscribeOk') : pending ? t('footer.pending') : t('footer.subscribe')}
                  </button>
                </div>
                {state.error === 'invalid' && (
                  <p className="text-[11px] text-danger/90">{t('footer.invalidEmail')}</p>
                )}
                {state.error === 'server' && (
                  <p className="text-[11px] text-danger/90">{t('footer.serverError')}</p>
                )}
              </form>
            </div>

            {/* Social icons */}
            <div className="flex gap-2.5 mt-6">
              {socialLinks.map((s) => (
                <Link
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-edge text-ink/45 hover:text-accent hover:border-accent/40 hover:scale-110 transition-all duration-300 hover:shadow-[0_0_16px_var(--accent-glow)]"
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {columns.map((col) => (
            <motion.div key={col.titleKey} variants={staggerItem}>
              <p className="text-[10px] uppercase tracking-[0.28em] text-accent-light mb-4 font-semibold">
                {t(col.titleKey)}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href.startsWith('http') ? link.href : withLocale(link.href)}
                      className="text-sm text-ink/45 hover:text-ink/85 transition-colors duration-300 relative group inline-flex items-center gap-1.5"
                    >
                      <span className="absolute -bottom-px left-0 w-0 h-px bg-accent/50 group-hover:w-full transition-all duration-300" />
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Contact bar — cinema-panel glass ─────────────────────────────── */}
        <motion.div
          variants={cinematicRise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -6% 0px' }}
          transition={{ duration: 1.0, ease: EASE_EXPO_OUT }}
          className="cinema-panel cinema-panel--accent rounded-2xl p-6 mb-10"
        >
          <div className="flex flex-wrap gap-6 items-center justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.24em] text-accent mb-0.5 font-semibold">WhatsApp</p>
              <a href="https://wa.me/905300709555" target="_blank" rel="noopener noreferrer" className="text-sm text-ink/85 hover:text-accent transition-colors ltr-only">+90 530 070 95 55</a>
            </div>
            <div className="flex flex-wrap gap-6">
              <a href="mailto:info@politrip.com.tr" className="text-sm text-ink/50 hover:text-accent transition-colors">info@politrip.com.tr</a>
              <a href="mailto:rebar@politrip.com.tr" className="text-sm text-ink/50 hover:text-accent transition-colors">rebar@politrip.com.tr</a>
            </div>
          </div>
        </motion.div>

        {/* ── Divider ───────────────────────────────────────────────────────── */}
        <div className="divider-gold mb-8" />

        {/* ── Bottom bar ────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink/40">
            © {new Date().getFullYear()} PoliTrip. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
