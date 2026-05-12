'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, currencySymbols } from '@/lib/store';
import { t } from '@/lib/i18n';
import type { Currency, Language } from '@/types';

const navItems = [
  { key: 'nav.trips' as const, href: '#trips' },
  { key: 'nav.hotels' as const, href: '#hotels' },
  { key: 'nav.nightlife' as const, href: '#nightlife' },
  { key: 'nav.transport' as const, href: '#transport' },
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
  const tr = (key: Parameters<typeof t>[0]) => t(key, language);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMobileMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass border-b border-[rgba(201,169,110,0.15)] py-3'
            : 'bg-transparent py-6'
        }`}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96E] to-[#A07840] rounded-full opacity-20 group-hover:opacity-40 transition-opacity" />
              <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
                <circle cx="20" cy="20" r="18" stroke="#C9A96E" strokeWidth="1.5" />
                <path d="M10 20 Q20 8 30 20 Q20 32 10 20Z" fill="#C9A96E" opacity="0.8" />
                <circle cx="20" cy="20" r="3" fill="#C9A96E" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold tracking-wider text-gradient-gold" style={{ fontFamily: 'var(--font-display, serif)' }}>
                PoliTrip
              </span>
              <div className="text-[10px] text-[#C9A96E] opacity-60 tracking-[3px] uppercase -mt-1">
                {language === 'ar' ? 'تجارب فاخرة' : 'Luxury Travel'}
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map(({ key, href }) => (
              <button
                key={key}
                onClick={() => handleNav(href)}
                className="text-sm font-medium tracking-widest uppercase text-[rgba(245,240,232,0.7)] hover:text-[#C9A96E] transition-colors duration-300 relative group"
              >
                {tr(key)}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C9A96E] group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language toggle */}
            <div className="flex items-center gap-1 bg-[rgba(255,255,255,0.05)] rounded-full p-1 border border-[rgba(201,169,110,0.15)]">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                    language === lang.code
                      ? 'bg-[#C9A96E] text-[#030812]'
                      : 'text-[rgba(245,240,232,0.6)] hover:text-[#C9A96E]'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Currency */}
            <div className="relative">
              <button
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-[rgba(201,169,110,0.2)] text-[rgba(245,240,232,0.7)] hover:text-[#C9A96E] hover:border-[rgba(201,169,110,0.4)] transition-all duration-300"
              >
                <span>{currencySymbols[currency]}</span>
                <span>{currency}</span>
                <svg className={`w-3 h-3 transition-transform ${currencyOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {currencyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full mt-2 right-0 glass rounded-xl border border-[rgba(201,169,110,0.2)] overflow-hidden min-w-[120px]"
                  >
                    {currencies.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setCurrency(c); setCurrencyOpen(false); }}
                        className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs text-left hover:bg-[rgba(201,169,110,0.1)] transition-colors ${
                          currency === c ? 'text-[#C9A96E]' : 'text-[rgba(245,240,232,0.7)]'
                        }`}
                      >
                        <span className="w-6">{currencySymbols[c]}</span>
                        <span>{c}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA */}
            <button
              onClick={() => handleNav('#trips')}
              className="relative overflow-hidden px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase text-[#030812] bg-gradient-to-r from-[#E8CC9A] to-[#C9A96E] hover:from-[#C9A96E] hover:to-[#A07840] transition-all duration-300 glow-gold"
            >
              {tr('nav.bookNow')}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            <motion.span
              animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="block w-6 h-0.5 bg-[#C9A96E] origin-center"
            />
            <motion.span
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-6 h-0.5 bg-[#C9A96E]"
            />
            <motion.span
              animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="block w-6 h-0.5 bg-[#C9A96E] origin-center"
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-40 glass flex flex-col pt-24 px-8"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="flex flex-col gap-6 mt-8">
              {navItems.map(({ key, href }, i) => (
                <motion.button
                  key={key}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => handleNav(href)}
                  className="text-2xl font-medium tracking-wider text-left text-[rgba(245,240,232,0.8)] hover:text-[#C9A96E] transition-colors border-b border-[rgba(201,169,110,0.1)] pb-4"
                  style={{ fontFamily: 'var(--font-display, serif)' }}
                >
                  {tr(key)}
                </motion.button>
              ))}
            </div>

            <div className="mt-auto pb-10 flex flex-col gap-4">
              {/* Language */}
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      language === lang.code
                        ? 'bg-[#C9A96E] text-[#030812]'
                        : 'border border-[rgba(201,169,110,0.3)] text-[rgba(245,240,232,0.6)]'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {/* Currency — horizontal scroll row */}
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {currencies.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                      currency === c
                        ? 'bg-[rgba(201,169,110,0.2)] text-[#C9A96E] border border-[#C9A96E]'
                        : 'border border-[rgba(201,169,110,0.2)] text-[rgba(245,240,232,0.5)]'
                    }`}
                  >
                    {currencySymbols[c]} {c}
                  </button>
                ))}
              </div>

              <button
                onClick={() => { handleNav('#trips'); setMobileMenuOpen(false); }}
                className="w-full py-4 rounded-full text-sm font-bold tracking-widest uppercase text-[#030812] bg-gradient-to-r from-[#E8CC9A] to-[#C9A96E]"
              >
                {tr('nav.bookNow')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
