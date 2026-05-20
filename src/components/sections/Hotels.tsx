'use client';

import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from '@/hooks/useTranslations';
import { EASE_OUT, viewportOnce } from '@/lib/motion';
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

const CATEGORY_STYLES: Record<string, { color: string }> = {
  'ultra-luxury': { color: '#fcd34d' },
  luxury:         { color: '#67e8f9' },
  boutique:       { color: '#c4b5fd' },
  resort:         { color: '#6ee7b7' },
};

function StarRow({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: Math.min(count, 5) }, (_, i) => (
        <span key={i} className="text-amber-400 text-sm">★</span>
      ))}
    </span>
  );
}

function HotelCard({
  hotel,
  lang,
  t,
}: {
  hotel: {
    _id: string;
    name_en: string; name_ar: string; name_tr: string;
    city: string; stars: number; price: number; category: string;
    images: string[]; amenities: string[]; isVIP: boolean; rating: number;
  };
  lang: Language;
  t: (key: Parameters<ReturnType<typeof useTranslations>['t']>[0]) => string;
}) {
  const name = lang === 'ar' ? hotel.name_ar : lang === 'tr' ? hotel.name_tr : hotel.name_en;
  const image = hotel.images[0];
  const catColor = CATEGORY_STYLES[hotel.category]?.color ?? 'rgba(255,255,255,0.4)';

  return (
    <article className="group relative flex flex-col rounded-3xl overflow-hidden bg-white/[0.03] border border-white/[0.08] hover:border-accent/40 transition-colors duration-300 h-full">
      {/* Image */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-white/5 flex-shrink-0">
        {image ? (
          <img
            src={image}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            style={{ willChange: 'transform' }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/10 text-6xl">🏨</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        {hotel.isVIP && (
          <span className="absolute top-4 right-4 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-amber-500/90 text-black shadow-[0_0_16px_rgba(245,158,11,0.5)] z-10">
            {t('hotels.vip')}
          </span>
        )}
        {/* Name overlaid on image bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className="text-[10px] uppercase tracking-[0.32em] font-medium block mb-2" style={{ color: catColor }}>
            {hotel.category}
          </span>
          <h3
            className="text-white text-2xl lg:text-3xl font-light leading-tight"
            style={{ fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.02em' }}
          >
            {name}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <StarRow count={hotel.stars} />
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
              <span key={a} className="text-[11px] text-white/40 border border-white/[0.08] px-3 py-1 rounded-full">
                {a}
              </span>
            ))}
            {hotel.amenities.length > 4 && (
              <span className="text-[11px] text-white/25">+{hotel.amenities.length - 4}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 mt-auto">
          <div>
            <span className="text-white text-2xl font-semibold">${hotel.price}</span>
            <span className="text-white/35 text-xs ml-1.5">{t('hotels.perNight')}</span>
          </div>
          <a
            href="https://wa.me/905300709555"
            target="_blank"
            rel="noopener noreferrer"
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

const CONVEX_URL = 'https://hardy-mouse-88.eu-west-1.convex.cloud';

export default function Hotels({ standalone = false }: { standalone?: boolean }) {
  const { t, language, isRTL } = useTranslations();
  const lang = language;
  const [hotels, setHotels] = useState<any[] | undefined>(undefined);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch(`${CONVEX_URL}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: 'hotels:getAll', args: {} }),
    })
      .then((r) => r.json())
      .then((data) => setHotels(data.status === 'success' ? data.value : []))
      .catch(() => setHotels([]));
  }, []);
  const trackRef = useRef<HTMLDivElement>(null);

  // Search & filter state (standalone page only)
  const [search, setSearch] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const isStandalonePage = standalone;

  const allHotels = hotels ?? [];

  const cityOptions = useMemo(() => {
    const seen = new Set<string>();
    allHotels.forEach((h) => seen.add(h.city));
    return Array.from(seen).sort();
  }, [allHotels]);

  const categoryOptions = useMemo(() => {
    const seen = new Set<string>();
    allHotels.forEach((h) => seen.add(h.category));
    return Array.from(seen).sort();
  }, [allHotels]);

  const filtered = useMemo(() => {
    if (!isStandalonePage) return allHotels.slice(0, HOMEPAGE_LIMIT);
    return allHotels.filter((h) => {
      const name = lang === 'ar' ? h.name_ar : lang === 'tr' ? h.name_tr : h.name_en;
      const matchesSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || h.city.toLowerCase().includes(search.toLowerCase());
      const matchesCity = !filterCity || h.city === filterCity;
      const matchesCategory = !filterCategory || h.category === filterCategory;
      return matchesSearch && matchesCity && matchesCategory;
    });
  }, [allHotels, isStandalonePage, search, filterCity, filterCategory, lang]);

  const displayed = filtered;
  const total = displayed.length;

  const hasActiveFilters = search || filterCity || filterCategory;

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
    <section
      id="hotels"
      className="relative bg-canvas overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div
        className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(34,211,238,0.04) 0%, transparent 60%)' }}
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
              className="text-[clamp(36px,5vw,80px)] font-[350] text-white leading-[0.94] mb-5"
              style={{ fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.025em' }}
            >
              {t('hotels.titleBefore')}{' '}{t('hotels.titleAccent')}
            </h2>
            <p className="text-white/55 text-base lg:text-lg leading-[1.7] max-w-xl">
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
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-accent/50 disabled:opacity-20 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => goTo(current + 1)}
                disabled={current === total - 1}
                aria-label="Next hotel"
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-accent/50 disabled:opacity-20 transition-all duration-200"
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
                  placeholder={t('hotels.search')}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-full py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent/50 transition-colors"
                  style={isRTL ? { paddingRight: '2.75rem', paddingLeft: '1.25rem' } : { paddingLeft: '2.75rem', paddingRight: '1.25rem' }}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>

              {/* Filter toggle button */}
              <button
                onClick={() => setShowFilters((v) => !v)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full border text-sm font-medium tracking-wide transition-all duration-200 ${
                  showFilters || filterCity || filterCategory
                    ? 'border-accent/60 text-accent bg-accent/10'
                    : 'border-white/[0.08] text-white/60 hover:border-white/20 hover:text-white'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M10 12h4" />
                </svg>
                {t('hotels.filterCity')} / {t('hotels.filterCategory')}
                {(filterCity || filterCategory) && (
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
                      <span className="text-[10px] uppercase tracking-widest text-white/30">{t('hotels.filterCity')}</span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setFilterCity('')}
                          className={`px-4 py-1.5 rounded-full text-xs border transition-all duration-150 ${!filterCity ? 'border-accent/60 text-accent bg-accent/10' : 'border-white/[0.08] text-white/50 hover:border-white/20'}`}
                        >
                          {t('hotels.filterAll')}
                        </button>
                        {cityOptions.map((city) => (
                          <button
                            key={city}
                            onClick={() => setFilterCity(city === filterCity ? '' : city)}
                            className={`px-4 py-1.5 rounded-full text-xs border capitalize transition-all duration-150 ${filterCity === city ? 'border-accent/60 text-accent bg-accent/10' : 'border-white/[0.08] text-white/50 hover:border-white/20'}`}
                          >
                            {CITY_LABELS[city] ?? city}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Category filter */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] uppercase tracking-widest text-white/30">{t('hotels.filterCategory')}</span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setFilterCategory('')}
                          className={`px-4 py-1.5 rounded-full text-xs border transition-all duration-150 ${!filterCategory ? 'border-accent/60 text-accent bg-accent/10' : 'border-white/[0.08] text-white/50 hover:border-white/20'}`}
                        >
                          {t('hotels.filterAll')}
                        </button>
                        {categoryOptions.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setFilterCategory(cat === filterCategory ? '' : cat)}
                            className={`px-4 py-1.5 rounded-full text-xs border capitalize transition-all duration-150 ${filterCategory === cat ? 'border-accent/60 text-accent bg-accent/10' : 'border-white/[0.08] text-white/50 hover:border-white/20'}`}
                          >
                            {cat}
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
                <span className="text-white/40 text-sm">
                  {displayed.length} {displayed.length === 1 ? 'hotel' : 'hotels'}
                </span>
                <button
                  onClick={() => { setSearch(''); setFilterCity(''); setFilterCategory(''); }}
                  className="text-xs text-accent/70 hover:text-accent underline underline-offset-2 transition-colors"
                >
                  {t('hotels.clearFilters')}
                </button>
              </div>
            )}
          </motion.div>
        )}

        <div className="h-px bg-white/10 mb-8" />

        {/* Cards */}
        {hotels === undefined ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden bg-white/[0.03] border border-white/[0.08] animate-pulse">
                <div className="aspect-[16/10] bg-white/[0.06]" />
                <div className="p-6 flex flex-col gap-3">
                  <div className="h-3 bg-white/[0.06] rounded-full w-2/3" />
                  <div className="h-3 bg-white/[0.04] rounded-full w-1/2" />
                  <div className="h-10 bg-white/[0.04] rounded-full mt-4 w-1/3 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : isStandalonePage ? (
          /* Full grid on /hotels page */
          displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <svg className="w-12 h-12 text-white/10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <p className="text-white/30 text-sm">{t('hotels.noResults')}</p>
              <button
                onClick={() => { setSearch(''); setFilterCity(''); setFilterCategory(''); }}
                className="text-xs text-accent/70 hover:text-accent underline underline-offset-2 transition-colors"
              >
                {t('hotels.clearFilters')}
              </button>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} lang={language} t={t} />
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
                  <HotelCard hotel={hotel} lang={language} t={t} />
                </div>
              ))}
            </div>

            {/* Desktop: grid */}
            <div
              className="hidden sm:grid gap-6"
              style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
            >
              {displayed.map((hotel) => (
                <HotelCard key={hotel._id} hotel={hotel} lang={language} t={t} />
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
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-accent' : 'w-2 bg-white/20'}`}
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
              href={`/${lang}/hotels`}
              className="group flex items-center gap-3 px-8 py-4 rounded-full border border-accent/30 text-[11px] uppercase tracking-[0.32em] text-accent hover:bg-accent/10 hover:border-accent transition-all duration-300"
            >
              View All Hotels
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
