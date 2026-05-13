'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, currencySymbols } from '@/lib/store';
import type { Currency, Language } from '@/types';
import { EASE_OUT } from '@/lib/motion';

const navItems = [
  { label: { en: 'Destinations', ar: 'الوجهات' }, href: '#destinations' },
  { label: { en: 'VIP Experience', ar: 'تجارب VIP' }, href: '#vip' },
  { label: { en: 'Hotels', ar: 'الفنادق' }, href: '#hotels' },
  { label: { en: 'Packages', ar: 'الباقات' }, href: '/packages' },
];

const currencies: Currency[] = ['USD', 'SAR', 'AED', 'TRY', 'QAR', 'KWD'];
const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'عربي' },
];

export default function Navbar() {
  const { language, currency, setLanguage, setCurrency, isMobileMenuOpen, setMobileMenuOpen } = useAppStore();
  const [scrolled, setScrolled] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Handles three cases:
  //   1. `/some-route` → client-side route navigation
  //   2. `#anchor` on the home page → smooth-scroll to the section
  //   3. `#anchor` on any other page → route to home, then jump to anchor
  const handleNav = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('/')) {
      router.push(href);
      return;
    }
    if (pathname !== '/') {
      router.push(`/${href}`);
      return;
    }
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const isAr = language === 'ar';

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-canvas/85 backdrop-blur-xl border-b border-white/6 py-3'
            : 'bg-transparent py-5'
        }`}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            aria-label={isAr ? 'PoliTrip — الصفحة الرئيسية' : 'PoliTrip — Home'}
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
                className={`h-full w-full object-contain ${isAr ? 'object-right' : 'object-left'}`}
              />
            </span>
            <span
              className="translate-y-[0.5px] whitespace-nowrap text-base font-semibold tracking-tight text-gradient-gold sm:text-[1.0625rem] lg:text-lg"
              style={{ fontFamily: 'var(--font-display, serif)' }}
            >
              PoliTrip
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-7">
            {navItems.map(({ label, href }) => (
              <button
                key={href}
                type="button"
                onClick={() => handleNav(href)}
                className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/65 hover:text-accent transition-colors duration-300 relative group"
              >
                {label[language]}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-400" />
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language toggle */}
            <div className="flex items-center gap-0.5 rounded-full p-0.5 border border-white/10 bg-white/4">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all duration-300 ${
                    language === lang.code
                      ? 'bg-accent text-on-accent shadow-sm'
                      : 'text-white/50 hover:text-accent'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Currency picker */}
            <div className="relative">
              <button
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold border border-white/12 text-white/60 hover:border-accent/50 hover:text-accent transition-all duration-300"
              >
                <span>{currencySymbols[currency]}</span>
                <span>{currency}</span>
                <svg className={`w-2.5 h-2.5 transition-transform ${currencyOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {currencyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: EASE_OUT }}
                    className="absolute top-full mt-2 right-0 glass-dark rounded-xl overflow-hidden min-w-[130px] z-50 border border-white/8"
                  >
                    {currencies.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setCurrency(c); setCurrencyOpen(false); }}
                        className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs text-left transition-colors hover:bg-accent/8 ${
                          currency === c ? 'text-accent font-semibold' : 'text-white/65'
                        }`}
                      >
                        <span className="w-5 text-center">{currencySymbols[c]}</span>
                        <span>{c}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={() => handleNav('/packages')}
              className="px-5 py-2.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase text-on-accent bg-gradient-to-br from-accent-light via-accent to-accent-dark hover:brightness-108 transition-all duration-300 glow-gold"
            >
              {isAr ? 'احجز الآن' : 'Book Now'}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2 relative z-50"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
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

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-40 flex flex-col pt-24 px-8 bg-canvas/98 backdrop-blur-2xl border-l border-white/6"
            dir={isAr ? 'rtl' : 'ltr'}
          >
            <div className="flex flex-col gap-4 mt-6">
              {navItems.map(({ label, href }, i) => (
                <motion.button
                  key={href}
                  type="button"
                  initial={{ opacity: 0, x: 32 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, ease: EASE_OUT }}
                  onClick={() => handleNav(href)}
                  className="text-2xl font-light tracking-tight text-left text-white/85 hover:text-accent transition-colors border-b border-white/6 pb-4"
                  style={{ fontFamily: 'var(--font-display, serif)' }}
                >
                  {label[language]}
                </motion.button>
              ))}
            </div>

            <div className="mt-auto pb-12 flex flex-col gap-4">
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      language === lang.code
                        ? 'bg-accent text-on-accent'
                        : 'border border-white/15 text-white/60'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {currencies.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                      currency === c
                        ? 'bg-accent/12 text-accent border border-accent/40'
                        : 'border border-white/12 text-white/50'
                    }`}
                  >
                    {currencySymbols[c]} {c}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => handleNav('/packages')}
                className="w-full py-4 rounded-full text-sm font-bold tracking-[0.2em] uppercase text-on-accent bg-gradient-to-br from-accent-light to-accent-dark"
              >
                {isAr ? 'احجز الآن' : 'Book Now'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
