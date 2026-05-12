'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, formatPrice } from '@/lib/store';
import { t } from '@/lib/i18n';
import { trips, vipPackages } from '@/lib/data/trips';
import SectionHeader from '@/components/ui/SectionHeader';
import GlassCard from '@/components/ui/GlassCard';
import CardSlider from '@/components/ui/CardSlider';

const categoryIcons: Record<string, string> = {
  yacht: '⛵', balloon: '🎈', helicopter: '🚁',
  nature: '🌿', cultural: '🕌', adventure: '🏔️', luxury: '👑',
};
const categoryColors: Record<string, string> = {
  yacht: '#1E90FF', balloon: '#C9A96E', helicopter: '#6C3FC5',
  nature: '#2ECC71', cultural: '#E67E22', adventure: '#E74C3C', luxury: '#C9A96E',
};
const filterCategories = [
  { key: 'all',        label: { en: 'All',        ar: 'الكل'      } },
  { key: 'yacht',      label: { en: 'Yacht',      ar: 'يخت'       } },
  { key: 'balloon',    label: { en: 'Balloon',    ar: 'بالون'     } },
  { key: 'helicopter', label: { en: 'Helicopter', ar: 'هليكوبتر' } },
  { key: 'nature',     label: { en: 'Nature',     ar: 'طبيعة'     } },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} className={`w-3 h-3 ${s <= Math.floor(rating) ? 'text-[#C9A96E]' : 'text-[rgba(201,169,110,0.25)]'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

function TripCard({ trip }: { trip: typeof trips[0] }) {
  const { language, currency, openBookingModal } = useAppStore();
  const tr = (k: Parameters<typeof t>[0]) => t(k, language);
  const l = (o: { en: string; ar: string }) => o[language];

  return (
    <GlassCard className="group h-full flex flex-col">
      {/* Image area */}
      <div className="relative h-48 overflow-hidden bg-[#0D1F3C] flex items-center justify-center">
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
          style={{ background: `radial-gradient(ellipse at 50% 50%, ${categoryColors[trip.category]}22 0%, transparent 70%)` }}
        />
        <div className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity duration-500">
          {categoryIcons[trip.category]}
        </div>
        <div className="absolute top-3 left-3 flex gap-2">
          {trip.isVIP && (
            <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-gradient-to-r from-[#E8CC9A] to-[#C9A96E] text-[#030812]">
              {tr('trips.vip')}
            </span>
          )}
          {trip.isPopular && (
            <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest glass border border-[rgba(201,169,110,0.3)] text-[#C9A96E]">
              {tr('trips.popular')}
            </span>
          )}
        </div>
        <div className="absolute bottom-3 right-3 text-right">
          <p className="text-[10px] text-[rgba(245,240,232,0.4)]">{tr('common.from')}</p>
          <p className="text-xl font-black text-gradient-gold">{formatPrice(trip.price, currency)}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] uppercase tracking-widest text-[#C9A96E] mb-1">📍 {trip.location}</p>
        <h3 className="text-sm font-bold text-[rgba(245,240,232,0.95)] leading-snug mb-2" style={{ fontFamily: 'var(--font-display,serif)' }}>
          {l(trip.title)}
        </h3>
        <p className="text-xs text-[rgba(245,240,232,0.5)] leading-relaxed mb-3 flex-1 line-clamp-2">
          {l(trip.description)}
        </p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <StarRating rating={trip.rating} />
            <span className="text-xs text-[rgba(245,240,232,0.45)]">({trip.reviews})</span>
          </div>
          <span className="text-xs text-[rgba(245,240,232,0.45)]">⏱ {trip.duration}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => openBookingModal('trip', trip.id)}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-[#E8CC9A] to-[#C9A96E] text-[#030812] hover:opacity-90 transition-opacity"
          >
            {tr('trips.bookNow')}
          </button>
          <button className="px-3 py-2.5 rounded-xl glass border border-[rgba(201,169,110,0.2)] text-[rgba(245,240,232,0.5)] hover:text-[#C9A96E] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

export default function VIPTrips() {
  const { language, currency, openBookingModal } = useAppStore();
  const tr = (k: Parameters<typeof t>[0]) => t(k, language);
  const l = (o: { en: string; ar: string }) => o[language];
  const [activeFilter, setActiveFilter] = useState('all');
  const [activePackage, setActivePackage] = useState(0);
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const filtered = activeFilter === 'all' ? trips : trips.filter((t) => t.category === activeFilter);

  return (
    <section
      id="trips"
      className="relative py-20 md:py-32 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom,#030812 0%,#0A1628 50%,#030812 100%)' }}
      dir={dir}
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-72 md:w-96 h-72 md:h-96 rounded-full bg-[#C9A96E] opacity-[0.03] blur-[80px]"/>
        <div className="absolute bottom-1/4 right-0 w-72 md:w-96 h-72 md:h-96 rounded-full bg-[#1E90FF] opacity-[0.04] blur-[80px]"/>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow={language === 'ar' ? 'تجارب حصرية' : 'Exclusive Experiences'}
          title={tr('trips.title')}
          subtitle={tr('trips.subtitle')}
        />

        {/* ── VIP Packages ─────────────────────────────────── */}
        <div className="mb-16">
          {/* Package tab row — scrollable on mobile */}
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2 slider-track px-0 -mx-0" style={{ scrollSnapType: 'none' }}>
            {vipPackages.map((pkg, i) => (
              <button
                key={pkg.id}
                onClick={() => setActivePackage(i)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap shrink-0 transition-all duration-300 ${
                  activePackage === i
                    ? 'bg-gradient-to-r from-[#E8CC9A] to-[#C9A96E] text-[#030812]'
                    : 'glass border border-[rgba(201,169,110,0.2)] text-[rgba(245,240,232,0.6)] hover:text-[#C9A96E]'
                }`}
              >
                {l(pkg.title)}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activePackage}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              {vipPackages[activePackage] && (
                <GlassCard tilt={false}>
                  <div className="flex flex-col md:flex-row">
                    {/* Visual */}
                    <div className="relative md:w-1/2 h-52 md:h-72 overflow-hidden bg-[#0D1F3C] flex items-center justify-center">
                      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%,rgba(201,169,110,0.15) 0%,transparent 70%)' }}/>
                      <div className="text-8xl opacity-20">
                        {vipPackages[activePackage].id.includes('royal') ? '👑' : vipPackages[activePackage].id.includes('coast') ? '⛵' : '✈️'}
                      </div>
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-[#E8CC9A] to-[#C9A96E] text-[#030812]">
                        {vipPackages[activePackage].badge}
                      </span>
                      <div className="absolute bottom-4 right-4 text-right">
                        <p className="text-xs text-[rgba(245,240,232,0.4)] mb-0.5">{language === 'ar' ? 'يبدأ من' : 'From'}</p>
                        <p className="text-2xl font-black text-gradient-gold">{formatPrice(vipPackages[activePackage].price, currency)}</p>
                        <p className="text-xs text-[rgba(245,240,232,0.4)]">{vipPackages[activePackage].duration}</p>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="md:w-1/2 p-5 md:p-8 flex flex-col justify-between gap-4">
                      <div>
                        <h3 className="text-xl md:text-2xl font-black text-[rgba(245,240,232,0.95)] mb-2" style={{ fontFamily: 'var(--font-display,serif)' }}>
                          {l(vipPackages[activePackage].title)}
                        </h3>
                        <p className="text-[rgba(245,240,232,0.55)] text-sm leading-relaxed mb-4">
                          {l(vipPackages[activePackage].description)}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {vipPackages[activePackage].includes.map((item) => (
                            <span key={item} className="px-3 py-1.5 rounded-lg text-xs glass border border-[rgba(201,169,110,0.2)] text-[rgba(245,240,232,0.7)] flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] inline-block"/>
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => openBookingModal('vip-package', vipPackages[activePackage].id)}
                        className="w-full py-3.5 rounded-xl text-sm font-bold tracking-widest uppercase text-[#030812] bg-gradient-to-r from-[#E8CC9A] to-[#C9A96E] hover:opacity-90 transition-opacity glow-gold"
                      >
                        {tr('trips.bookNow')}
                      </button>
                    </div>
                  </div>
                </GlassCard>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Category filter ───────────────────────────────── */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 slider-track px-0" style={{ scrollSnapType: 'none', justifyContent: 'safe center' }}>
          {filterCategories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveFilter(cat.key)}
              className={`px-4 py-2.5 rounded-full text-xs font-medium tracking-wider whitespace-nowrap shrink-0 transition-all duration-300 ${
                activeFilter === cat.key
                  ? 'bg-[#C9A96E] text-[#030812] font-bold'
                  : 'glass border border-[rgba(201,169,110,0.2)] text-[rgba(245,240,232,0.6)] hover:text-[#C9A96E]'
              }`}
            >
              {cat.label[language]}
            </button>
          ))}
        </div>

        {/* ── Card grid / slider ────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardSlider desktopCols="md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </CardSlider>
          </motion.div>
        </AnimatePresence>

        {/* View all */}
        <div className="mt-10 text-center">
          <button className="px-7 py-3.5 rounded-full text-sm font-bold tracking-widest uppercase glass border border-[rgba(201,169,110,0.3)] text-[rgba(245,240,232,0.7)] hover:text-[#C9A96E] hover:border-[rgba(201,169,110,0.6)] transition-all duration-300">
            {tr('trips.viewAll')}
          </button>
        </div>
      </div>
    </section>
  );
}
