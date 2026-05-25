'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import LenisProvider from '@/components/providers/LenisProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAppStore } from '@/lib/store';
import { EASE_EXPO_OUT, viewportOnce } from '@/lib/motion';
import { getLocaleFromPathname, pathWithLocale } from '@/lib/locale-path';
import { useTranslations } from '@/hooks/useTranslations';
import type { Destination } from '@/components/sections/destinations/data';

function convexToDestination(doc: {
  _id: string;
  name_en: string; name_ar: string; name_tr: string;
  tag_en: string; tag_ar: string; tag_tr: string;
  badge_en: string; badge_ar: string; badge_tr: string;
  desc_en: string; desc_ar: string; desc_tr: string;
  flightTime_en: string; flightTime_ar: string; flightTime_tr: string;
  climate_en: string; climate_ar: string; climate_tr: string;
  signature_en: string; signature_ar: string; signature_tr: string;
  color: string; accent: string; icon: string; images?: string[]; lat: number; lng: number;
}): Destination & { imageUrl?: string } {
  return {
    id: doc.name_en.toLowerCase().replace(/\s+/g, '-'),
    name: { en: doc.name_en, ar: doc.name_ar, tr: doc.name_tr },
    tag: { en: doc.tag_en, ar: doc.tag_ar, tr: doc.tag_tr },
    badge: { en: doc.badge_en, ar: doc.badge_ar, tr: doc.badge_tr },
    desc: { en: doc.desc_en, ar: doc.desc_ar, tr: doc.desc_tr },
    flightTime: { en: doc.flightTime_en, ar: doc.flightTime_ar, tr: doc.flightTime_tr },
    climate: { en: doc.climate_en, ar: doc.climate_ar, tr: doc.climate_tr },
    signature: { en: doc.signature_en, ar: doc.signature_ar, tr: doc.signature_tr },
    color: doc.color,
    accent: doc.accent,
    icon: doc.icon,
    imageUrl: doc.images?.[0],
    lat: doc.lat,
    lng: doc.lng,
    category: 'culture',
  };
}


function DestCard({ d, index }: { d: Destination & { imageUrl?: string }; index: number }) {
  const { language: lang } = useAppStore();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const imageSrc = d.imageUrl || `/destinations/${d.id}.jpg`;

  return (
    <Link href={pathWithLocale(`/destination/${d.id}`, locale)}>
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE_EXPO_OUT, delay: (index % 3) * 0.07 }}
      viewport={viewportOnce}
      className="cinema-panel group overflow-hidden relative aspect-[4/3] cursor-pointer"
    >
      <img
        src={imageSrc}
        alt={d.name[lang]}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
        style={{ willChange: 'transform' }}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <span
        className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.32em] font-bold px-2.5 py-1 rounded-full"
        style={{ background: `${d.accent}25`, color: d.accent, border: `1px solid ${d.accent}40`, backdropFilter: 'blur(8px)' }}
      >
        {d.badge[lang]}
      </span>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3
          className="text-white text-2xl font-light leading-none mb-1"
          style={{ fontFamily: 'var(--font-display, serif)' }}
        >
          {d.name[lang]}
        </h3>
        <p className="text-white/60 text-xs italic" style={{ fontFamily: 'var(--font-display, serif)' }}>
          {d.tag[lang]}
        </p>
      </div>
    </motion.div>
    </Link>
  );
}

export default function DestinationsPage({ params }: { params: Promise<{ lang: string }> }) {
  use(params);
  const { t, isRTL } = useTranslations();
  const { language: lang } = useAppStore();
  const convexDests = useQuery(api.destinations.getAll);
  const destinations = convexDests ? convexDests.map(convexToDestination) : [];
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? destinations.filter((d) =>
        d.name[lang].toLowerCase().includes(search.toLowerCase()) ||
        d.tag[lang].toLowerCase().includes(search.toLowerCase())
      )
    : destinations;

  return (
    <LenisProvider>
      <div className="min-h-screen bg-canvas text-white">
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 pt-32 pb-28">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_EXPO_OUT }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent" />
              <span className="text-[10px] uppercase tracking-[0.42em] text-accent font-bold">{t('destinations.kicker')}</span>
            </div>
            <h1
              className="text-[clamp(2rem,5vw,4rem)] font-[350] text-white leading-tight mb-4"
              style={{ fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.02em' }}
            >
              {t('destinations.allDestinations')}
            </h1>
            <p className="text-white/50 text-base max-w-xl leading-relaxed">
              {t('destinations.pageSubtitle')}
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_EXPO_OUT, delay: 0.15 }}
            className="relative max-w-md mb-10"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <svg
              className="absolute top-1/2 -translate-y-1/2 text-white/30 w-4 h-4 pointer-events-none"
              style={isRTL ? { right: '1rem' } : { left: '1rem' }}
              fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isRTL ? 'ابحث عن وجهة…' : lang === 'tr' ? 'Destinasyon ara…' : 'Search destinations…'}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-full py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent/50 transition-colors"
              style={isRTL ? { paddingRight: '2.75rem', paddingLeft: '1.25rem' } : { paddingLeft: '2.75rem', paddingRight: '1.25rem' }}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                style={isRTL ? { left: '1rem' } : { right: '1rem' }}
              >
                ✕
              </button>
            )}
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filtered.map((d, i) => <DestCard key={d.id} d={d} index={i} />)}
            {filtered.length === 0 && (
              <p className="text-white/30 text-sm col-span-2 text-center py-16">
                {isRTL ? 'لا توجد نتائج' : lang === 'tr' ? 'Sonuç bulunamadı' : 'No destinations found'}
              </p>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </LenisProvider>
  );
}
