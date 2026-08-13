'use client';

import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useTranslations } from '@/hooks/useTranslations';
import { EASE_OUT, viewportOnce } from '@/lib/motion';
import { getLocaleFromPathname, pathWithLocale } from '@/lib/locale-path';
import type { Language } from '@/types';

const CITY_LABELS: Record<string, string> = {
  istanbul: 'Istanbul',
  antalya: 'Antalya',
  trabzon: 'Trabzon',
  bursa: 'Bursa',
  cappadocia: 'Cappadocia',
  bodrum: 'Bodrum',
  sapanca: 'Sapanca',
};


type HotelData = {
  _id: string;
  name_en: string; name_ar: string; name_tr: string;
  city: string; stars: number; price: number; category: string;
  images: string[]; amenities: string[]; isVIP: boolean; rating: number;
  description_en?: string; description_ar?: string; description_tr?: string;
};

function StarRow({ count, onPhoto = false }: { count: number; onPhoto?: boolean }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: Math.min(count, 5) }, (_, i) => (
        <span key={i} className={`${onPhoto ? 'text-amber-400' : 'text-accent'} text-sm`}>★</span>
      ))}
    </span>
  );
}

function HotelModal({ hotel, lang, t, isRTL, onClose }: {
  hotel: HotelData;
  lang: Language;
  t: (key: Parameters<ReturnType<typeof useTranslations>['t']>[0]) => string;
  isRTL: boolean;
  onClose: () => void;
}) {
  const name = lang === 'ar' ? hotel.name_ar : lang === 'tr' ? hotel.name_tr : hotel.name_en;
  const desc = lang === 'ar' ? hotel.description_ar : lang === 'tr' ? hotel.description_tr : hotel.description_en;
  const [imgIdx, setImgIdx] = useState(0);
  const images = hotel.images.filter(Boolean);

  // Close on backdrop click or Escape
  const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }, [onClose]);
  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
        style={{ background: 'var(--scrim)', backdropFilter: 'blur(12px)' }}
        onClick={onClose}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={name}
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-canvas-muted border border-edge shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-ink/10 hover:bg-ink/20 flex items-center justify-center text-ink/60 hover:text-ink transition-all duration-200"
          >
            ✕
          </button>

          {/* Image gallery */}
          <div className="relative aspect-[16/9] overflow-hidden rounded-t-3xl bg-ink/5 flex-shrink-0">
            {images.length > 0 ? (
              <>
                <img
                  src={images[imgIdx]}
                  alt={name}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i - 1 + images.length) % images.length); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-all"
                    >‹</button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i + 1) % images.length); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-all"
                    >›</button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button key={i} onClick={(e) => { e.stopPropagation(); setImgIdx(i); }} className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-white' : 'bg-white/30'}`} />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-ink/10 text-6xl">🏨</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            {hotel.isVIP && (
              <span className="absolute top-4 left-4 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-amber-500/90 text-black shadow-[0_0_16px_rgba(245,158,11,0.5)]">
                {t('hotels.vip')}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 flex flex-col gap-5">
            {/* Name + stars + city */}
            <div>
              <h2
                className="text-ink text-2xl sm:text-3xl font-light leading-tight mb-2"
                style={{ fontFamily: isRTL ? 'var(--font-arabic), sans-serif' : 'var(--font-display, serif)', letterSpacing: '-0.02em' }}
              >
                {name}
              </h2>
              <div className="flex items-center gap-3">
                <StarRow count={hotel.stars} />
                <span className="text-ink/40 text-xs uppercase tracking-widest">{CITY_LABELS[hotel.city] ?? hotel.city}</span>
                {hotel.rating > 0 && (
                  <span className="text-ink/40 text-xs">· {hotel.rating.toFixed(1)} ★</span>
                )}
              </div>
            </div>

            {/* Description */}
            {desc && (
              <p className="text-ink/60 text-sm leading-[1.8]">{desc}</p>
            )}

            {/* Amenities */}
            {hotel.amenities.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-ink/30 mb-2.5">
                  {isRTL ? 'المرافق' : lang === 'tr' ? 'Olanaklar' : 'Amenities'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.map((a) => (
                    <span key={a} className="text-[11px] text-ink/50 border border-ink/10 px-3 py-1.5 rounded-full">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Book button */}
            <a
              href={`https://wa.me/905300709555?text=${encodeURIComponent(`Hi PoliTrip, I'm interested in ${name}. Can you help me book?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-[11px] font-bold tracking-[0.22em] uppercase bg-gradient-to-br from-accent-light via-accent to-accent-dark text-on-accent hover:scale-[1.02] hover:brightness-110 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t('hotels.book')}
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function HotelCard({
  hotel,
  lang,
  t,
  onClick,
}: {
  hotel: HotelData;
  lang: Language;
  t: (key: Parameters<ReturnType<typeof useTranslations>['t']>[0]) => string;
  onClick: () => void;
}) {
  const name = lang === 'ar' ? hotel.name_ar : lang === 'tr' ? hotel.name_tr : hotel.name_en;
  const image = hotel.images[0];

  return (
    <article
      onClick={onClick}
      className="group relative flex flex-col rounded-3xl overflow-hidden bg-ink/5 border border-ink/10 hover:border-accent/40 transition-colors duration-300 h-full cursor-pointer"
    >
      {/* Image */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-ink/5 flex-shrink-0">
        {image ? (
          <img
            src={image}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            style={{ willChange: 'transform' }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-ink/10 text-6xl">🏨</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        {hotel.isVIP && (
          <span className="absolute top-4 right-4 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-amber-500/90 text-black shadow-[0_0_16px_rgba(245,158,11,0.5)] z-10">
            {t('hotels.vip')}
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3
            className="text-white text-2xl lg:text-3xl font-light leading-tight"
            style={{ fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.02em' }}
          >
            {name}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <StarRow count={hotel.stars} onPhoto />
            <span className="text-white/50 text-[11px] uppercase tracking-wider">
              {CITY_LABELS[hotel.city] ?? hotel.city}
            </span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-4 p-6 flex-1">
        {hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {hotel.amenities.slice(0, 4).map((a) => (
              <span key={a} className="text-[11px] text-ink/40 border border-ink/10 px-3 py-1 rounded-full">
                {a}
              </span>
            ))}
            {hotel.amenities.length > 4 && (
              <span className="text-[11px] text-ink/25">+{hotel.amenities.length - 4}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 mt-auto">
          <a
            href="https://wa.me/905300709555"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-6 py-3 rounded-full text-[11px] font-bold tracking-[0.22em] uppercase bg-gradient-to-br from-accent-light via-accent to-accent-dark text-on-accent glow-gold hover:scale-105 transition-transform duration-200 flex-shrink-0"
          >
            {t('hotels.book')}
          </a>
        </div>
      </div>
    </article>
  );
}

const HOMEPAGE_LIMIT = 2;

export default function Hotels({ standalone = false }: { standalone?: boolean }) {
  const { t, language, isRTL } = useTranslations();
  const lang = language;
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const hotels = useQuery(api.hotels.getAll) as HotelData[] | undefined;
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const [selectedHotel, setSelectedHotel] = useState<HotelData | null>(null);

  // Search & filter state (standalone page only)
  const [search, setSearch] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const isStandalonePage = standalone;

  const allHotels = useMemo(() => hotels ?? [], [hotels]);

  const cityOptions = useMemo(() => {
    const seen = new Set<string>();
    allHotels.forEach((h) => seen.add(h.city));
    return Array.from(seen).sort();
  }, [allHotels]);

  const filtered = useMemo(() => {
    if (!isStandalonePage) return allHotels.slice(0, HOMEPAGE_LIMIT);
    return allHotels.filter((h) => {
      const name = lang === 'ar' ? h.name_ar : lang === 'tr' ? h.name_tr : h.name_en;
      const matchesSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || h.city.toLowerCase().includes(search.toLowerCase());
      const matchesCity = !filterCity || h.city === filterCity;
      return matchesSearch && matchesCity;
    });
  }, [allHotels, isStandalonePage, search, filterCity, lang]);

  const displayed = filtered;
  const total = displayed.length;

  const hasActiveFilters = search || filterCity;

  const goTo = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(i, total - 1));
    setCurrent(clamped);
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[clamped] as HTMLElement;
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  }, [total]);

  if (!isStandalonePage && hotels !== undefined && hotels.length === 0) return null;

  return (
    <>
    {selectedHotel && (
      <HotelModal
        hotel={selectedHotel}
        lang={lang}
        t={t}
        isRTL={isRTL}
        onClose={() => setSelectedHotel(null)}
      />
    )}
    <section
      id="hotels"
      className="relative bg-canvas overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div
        className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, color-mix(in srgb, var(--accent) 4%, transparent) 0%, transparent 60%)' }}
        aria-hidden
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 pt-24 lg:pt-36 pb-20 lg:pb-32">

        {/* Header + arrows row */}
        <div className="flex items-end justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.95, ease: EASE_OUT }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent" />
              <span className="text-[10px] uppercase tracking-[0.42em] text-accent font-bold">
                {t('hotels.kicker')}
              </span>
            </div>
            <h2
              className="text-[clamp(36px,5vw,80px)] font-[350] text-ink leading-[0.94] mb-5"
              style={{ fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.025em' }}
            >
              {t('hotels.titleBefore')}{' '}{t('hotels.titleAccent')}
            </h2>
            <p className="text-ink/55 text-base lg:text-lg leading-[1.7] max-w-xl">
              {t('hotels.subtitle')}
            </p>
          </motion.div>

          {/* Arrow buttons — desktop, only on homepage */}
          {!isStandalonePage && total > 1 && (
            <div className="hidden sm:flex gap-2 flex-shrink-0 pb-1">
              <button
                onClick={() => goTo(current - 1)}
                disabled={current === 0}
                aria-label="Previous hotel"
                className="w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center text-ink/50 hover:text-ink hover:border-accent/50 disabled:opacity-20 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => goTo(current + 1)}
                disabled={current === total - 1}
                aria-label="Next hotel"
                className="w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center text-ink/50 hover:text-ink hover:border-accent/50 disabled:opacity-20 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Search + filter bar — standalone page only */}
        {isStandalonePage && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="mb-8"
          >
            <div className="flex gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <svg
                  className="absolute top-1/2 -translate-y-1/2 text-ink/30 w-4 h-4 pointer-events-none"
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
                  placeholder={t('hotels.search')}
                  className="w-full bg-ink/5 border border-ink/10 rounded-full py-3 text-sm text-ink placeholder-ink/30 focus:outline-none focus:border-accent/50 transition-colors"
                  style={isRTL ? { paddingRight: '2.75rem', paddingLeft: '1.25rem' } : { paddingLeft: '2.75rem', paddingRight: '1.25rem' }}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>

              {/* Filter toggle button */}
              <button
                onClick={() => setShowFilters((v) => !v)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full border text-sm font-medium tracking-wide transition-all duration-200 ${
                  showFilters || filterCity
                    ? 'border-accent/60 text-accent bg-accent/10'
                    : 'border-ink/10 text-ink/60 hover:border-ink/20 hover:text-ink'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M10 12h4" />
                </svg>
                {t('hotels.filterCity')}
                {filterCity && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                )}
              </button>
            </div>

            {/* Filter dropdowns */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-3 pt-4">
                    {/* City filter */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] uppercase tracking-widest text-ink/30">{t('hotels.filterCity')}</span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setFilterCity('')}
                          className={`px-4 py-1.5 rounded-full text-xs border transition-all duration-150 ${!filterCity ? 'border-accent/60 text-accent bg-accent/10' : 'border-ink/10 text-ink/50 hover:border-ink/20'}`}
                        >
                          {t('hotels.filterAll')}
                        </button>
                        {cityOptions.map((city) => (
                          <button
                            key={city}
                            onClick={() => setFilterCity(city === filterCity ? '' : city)}
                            className={`px-4 py-1.5 rounded-full text-xs border capitalize transition-all duration-150 ${filterCity === city ? 'border-accent/60 text-accent bg-accent/10' : 'border-ink/10 text-ink/50 hover:border-ink/20'}`}
                          >
                            {CITY_LABELS[city] ?? city}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active filter + no results */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between mt-4">
                <span className="text-ink/40 text-sm">
                  {displayed.length} {displayed.length === 1 ? t('city.propProperty') : t('city.propProperties')}
                </span>
                <button
                  onClick={() => { setSearch(''); setFilterCity(''); }}
                  className="text-xs text-accent/70 hover:text-accent underline underline-offset-2 transition-colors"
                >
                  {t('hotels.clearFilters')}
                </button>
              </div>
            )}
          </motion.div>
        )}

        <div className="h-px bg-ink/10 mb-8" />

        {/* Cards */}
        {hotels === undefined ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden bg-ink/5 border border-ink/10 animate-pulse">
                <div className="aspect-[16/10] bg-ink/10" />
                <div className="p-6 flex flex-col gap-3">
                  <div className="h-3 bg-ink/10 rounded-full w-2/3" />
                  <div className="h-3 bg-ink/5 rounded-full w-1/2" />
                  <div className="h-10 bg-ink/5 rounded-full mt-4 w-1/3 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : isStandalonePage ? (
          /* Full grid on /hotels page */
          displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <svg className="w-12 h-12 text-ink/10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <p className="text-ink/30 text-sm">{t('hotels.noResults')}</p>
              <button
                onClick={() => { setSearch(''); setFilterCity(''); }}
                className="text-xs text-accent/70 hover:text-accent underline underline-offset-2 transition-colors"
              >
                {t('hotels.clearFilters')}
              </button>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} lang={language} t={t} onClick={() => setSelectedHotel(hotel)} />
            ))}
          </div>
          )
        ) : (
          /* Slider on homepage */
          <>
            {/* Mobile: snap scroll */}
            <div
              ref={trackRef}
              className="flex sm:hidden gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2"
              style={{ scrollbarWidth: 'none' }}
            >
              {displayed.map((hotel) => (
                <div key={hotel._id} className="snap-start shrink-0 w-[85vw]">
                  <HotelCard hotel={hotel} lang={language} t={t} onClick={() => setSelectedHotel(hotel)} />
                </div>
              ))}
            </div>

            {/* Desktop: grid */}
            <div
              className="hidden sm:grid gap-6"
              style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
            >
              {displayed.map((hotel) => (
                <HotelCard key={hotel._id} hotel={hotel} lang={language} t={t} onClick={() => setSelectedHotel(hotel)} />
              ))}
            </div>

            {/* Dot indicators — mobile only */}
            {total > 1 && (
              <div className="flex justify-center gap-2 mt-5 sm:hidden">
                {displayed.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Hotel ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-accent' : 'w-2 bg-ink/20'}`}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* View all — homepage only */}
        {!isStandalonePage && hotels && hotels.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="flex justify-center pt-12"
          >
            <a
              href={pathWithLocale('/hotels', locale)}
              className="group flex items-center gap-3 px-8 py-4 rounded-full border border-accent/30 text-[11px] uppercase tracking-[0.32em] text-accent hover:bg-accent/10 hover:border-accent transition-all duration-300"
            >
              {t('hotels.viewAll')}
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>
        )}
      </div>
    </section>
    </>
  );
}
