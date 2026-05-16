'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useTranslations } from '@/hooks/useTranslations';
import type { Language } from '@/types';
import type { TranslationKey } from '@/lib/i18n';
import { EASE_OUT } from '@/lib/motion';
import { getLenis } from '@/components/providers/LenisProvider';
import {
  getLocaleFromPathname,
  pathWithLocale,
  stripLocaleFromPathname,
} from '@/lib/locale-path';

const NAV_KEYS: { key: TranslationKey; href: string }[] = [
  { key: 'nav.destinations', href: '#destinations' },
  { key: 'nav.vipExperience', href: '/vip' },
  { key: 'nav.hotels', href: '/hotels' },
  { key: 'nav.about', href: '/about' },
  { key: 'nav.contact', href: '/contact' },
];

const languages: { code: Language; labelKey: TranslationKey }[] = [
  { code: 'en', labelKey: 'lang.en' },
  { code: 'ar', labelKey: 'lang.ar' },
  { code: 'tr', labelKey: 'lang.tr' },
];

export default function Navbar() {
  const { language, setLanguage, isMobileMenuOpen, setMobileMenuOpen } = useAppStore();
  const { t, isRTL } = useTranslations();
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const updateScrolled = () => {
      const lenis = getLenis();
      const y = lenis != null ? lenis.scroll : window.scrollY;
      setScrolled(y > 60);
    };

    updateScrolled();
    window.addEventListener('scroll', updateScrolled, { passive: true });

    let unsubscribeLenis: (() => void) | undefined;
    const attachLenis = () => {
      unsubscribeLenis?.();
      unsubscribeLenis = getLenis()?.on('scroll', updateScrolled);
    };
    attachLenis();
    const raf = requestAnimationFrame(attachLenis);

    return () => {
      cancelAnimationFrame(raf);
      unsubscribeLenis?.();
      window.removeEventListener('scroll', updateScrolled);
    };
  }, []);

  const handleNav = (href: string) => {
    setMobileMenuOpen(false);
    const loc = getLocaleFromPathname(pathname);
    const basePath = stripLocaleFromPathname(pathname);
    const onHome = basePath === '/';

    if (href.startsWith('/')) {
      router.push(pathWithLocale(href, loc));
      return;
    }
    if (!onHome) {
      router.push(pathWithLocale(`/${href}`, loc));
      return;
    }
    const el = document.querySelector(href);
    if (!(el instanceof HTMLElement)) return;

    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(el, { offset: -88, duration: 1.15 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.0, ease: EASE_OUT, delay: 0.1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? 'bg-canvas/80 backdrop-blur-2xl border-b border-white/[0.07] py-3 shadow-[0_1px_0_rgba(34,211,238,0.06)]'
            : 'bg-transparent py-5'
        }`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          <Link
            href={pathWithLocale('/', getLocaleFromPathname(pathname))}
            aria-label={t('nav.logoAria')}
            className="-m-2 inline-flex shrink-0 items-center gap-2 p-2 lg:gap-2.5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center sm:h-10 sm:w-10 lg:h-11 lg:w-11">
              <Image
                src="/textures/earth/logo.svg"
                alt=""
                width={1024}
                height={1024}
                priority
                unoptimized
                sizes="(max-width: 640px) 36px, (max-width: 1024px) 40px, 44px"
                className={`h-full w-full object-contain ${isRTL ? 'object-right' : 'object-left'}`}
              />
            </span>
            <span
              className="translate-y-[0.5px] whitespace-nowrap font-bold uppercase text-base sm:text-[1.0625rem] lg:text-lg"
              style={{
                fontFamily: 'var(--font-display, serif)',
                letterSpacing: '0.22em',
                background: 'linear-gradient(135deg, #e2c97e 0%, #f5e6b8 40%, #c9a84c 70%, #e2c97e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
                filter: 'drop-shadow(0 0 8px rgba(229,193,100,0.45))',
              }}
            >
              POLITRIP
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-7">
            {NAV_KEYS.map(({ key, href }) => (
              <button
                key={href}
                type="button"
                onClick={() => handleNav(href)}
                className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/60 hover:text-accent transition-all duration-300 relative group"
              >
                {t(key)}
                {/* Underline draw */}
                <span className="absolute -bottom-0.5 start-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-[450ms] ease-out" />
                {/* Hover glow */}
                <span className="absolute inset-0 -m-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(34,211,238,0.07) 0%, transparent 70%)' }}
                />
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-0.5 rounded-full p-0.5 border border-white/10 bg-white/4">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    const next = pathWithLocale(
                      stripLocaleFromPathname(pathname),
                      lang.code
                    );
                    setLanguage(lang.code);
                    router.push(next);
                  }}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all duration-300 ${
                    language === lang.code
                      ? 'bg-accent text-on-accent shadow-sm'
                      : 'text-white/50 hover:text-accent'
                  }`}
                >
                  {t(lang.labelKey)}
                </button>
              ))}
            </div>

          </div>

          {/* Language switcher — visible on mobile, outside the menu */}
          <div className="flex lg:hidden items-center gap-0.5 rounded-full p-0.5 border border-white/10 bg-white/4 mr-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  const next = pathWithLocale(stripLocaleFromPathname(pathname), lang.code);
                  setLanguage(lang.code);
                  router.push(next);
                }}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all duration-300 ${
                  language === lang.code
                    ? 'bg-accent text-on-accent shadow-sm'
                    : 'text-white/50 hover:text-accent'
                }`}
              >
                {t(lang.labelKey)}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="lg:hidden flex flex-col gap-1.5 p-2 relative z-50"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={t('nav.menuAria')}
          >
            <motion.span
              animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="block w-6 h-0.5 bg-accent origin-center"
            />
            <motion.span
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-6 h-0.5 bg-accent"
            />
            <motion.span
              animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="block w-6 h-0.5 bg-accent origin-center"
            />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-40 flex flex-col pt-24 px-8 bg-canvas/98 backdrop-blur-2xl border-s border-white/6"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className="flex flex-col gap-4 mt-6">
              {NAV_KEYS.map(({ key, href }, i) => (
                <motion.button
                  key={href}
                  type="button"
                  initial={{ opacity: 0, x: 32 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, ease: EASE_OUT }}
                  onClick={() => handleNav(href)}
                  className="text-2xl font-light tracking-tight text-start text-white/85 hover:text-accent transition-colors border-b border-white/6 pb-4"
                  style={{ fontFamily: 'var(--font-display, serif)' }}
                >
                  {t(key)}
                </motion.button>
              ))}
            </div>

            <div className="mt-auto pb-[max(3rem,calc(env(safe-area-inset-bottom,0px)+2.75rem))] flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      const next = pathWithLocale(
                        stripLocaleFromPathname(pathname),
                        lang.code
                      );
                      setLanguage(lang.code);
                      router.push(next);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      language === lang.code
                        ? 'bg-accent text-on-accent'
                        : 'border border-white/15 text-white/60'
                    }`}
                  >
                    {t(lang.labelKey)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
