'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, formatPrice } from '@/lib/store';
import { t } from '@/lib/i18n';
import { hotels } from '@/lib/data/hotels';
import SectionHeader from '@/components/ui/SectionHeader';
import GlassCard from '@/components/ui/GlassCard';
import CardSlider from '@/components/ui/CardSlider';
import type { TurkishCity } from '@/types';

const cityFilters: { key: 'all' | TurkishCity; labelKey: Parameters<typeof t>[0] }[] = [
  { key: 'all',        labelKey: 'hotels.filter.all'        },
  { key: 'istanbul',   labelKey: 'hotels.filter.istanbul'   },
  { key: 'antalya',    labelKey: 'hotels.filter.antalya'    },
  { key: 'cappadocia', labelKey: 'hotels.filter.cappadocia' },
  { key: 'bursa',      labelKey: 'hotels.filter.bursa'      },
  { key: 'trabzon',    labelKey: 'hotels.filter.trabzon'    },
];

const hotelEmojis: Record<string, string> = {
  istanbul: '🕌', antalya: '🌊', cappadocia: '🎈',
  bursa: '⛰️', trabzon: '🌿', bodrum: '⛵', sapanca: '🏔️',
};

function StarDisplay({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-3 h-3 text-[#C9A96E]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

function HotelCard({ hotel }: { hotel: typeof hotels[0] }) {
  const { language, currency, openBookingModal } = useAppStore();
  const tr = (k: Parameters<typeof t>[0]) => t(k, language);
  const l = (o: { en: string; ar: string }) => o[language];

  return (
    <GlassCard tilt={false} className="group h-full flex flex-col">
      {/* Visual */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#0D1F3C] to-[#030812] flex items-center justify-center">
        <div className="absolute inset-0 transition-all duration-500 group-hover:scale-110"
          style={{ background: 'radial-gradient(ellipse at 30% 30%,rgba(201,169,110,0.12) 0%,transparent 60%)' }}
        />
        <div className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity duration-500">
          {hotelEmojis[hotel.city] ?? '🏨'}
        </div>

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <StarDisplay count={hotel.stars} />
          {hotel.isVIP && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-gradient-to-r from-[#E8CC9A] to-[#C9A96E] text-[#030812]">VIP</span>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full text-[9px] font-medium glass border border-[rgba(255,255,255,0.1)] text-[rgba(245,240,232,0.6)] capitalize">
            {hotel.category.replace('-', ' ')}
          </span>
        </div>

        <div className="absolute bottom-3 right-3 text-right">
          <p className="text-xl font-black text-gradient-gold">{formatPrice(hotel.price, currency)}</p>
          <p className="text-[10px] text-[rgba(245,240,232,0.4)]">/{tr('hotels.perNight')}</p>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] uppercase tracking-widest text-[#C9A96E] mb-1 capitalize">
          📍 {hotel.city === 'cappadocia' ? 'Cappadocia' : hotel.city.charAt(0).toUpperCase() + hotel.city.slice(1)}
        </p>
        <h3 className="text-sm font-bold text-[rgba(245,240,232,0.95)] mb-2 leading-snug" style={{ fontFamily: 'var(--font-display,serif)' }}>
          {l(hotel.name)}
        </h3>
        <p className="text-xs text-[rgba(245,240,232,0.5)] leading-relaxed mb-3 flex-1 line-clamp-2">
          {l(hotel.description)}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {hotel.amenities.slice(0, 3).map((a) => (
            <span key={a} className="px-2 py-0.5 rounded text-[9px] glass border border-[rgba(255,255,255,0.08)] text-[rgba(245,240,232,0.5)]">{a}</span>
          ))}
          {hotel.amenities.length > 3 && (
            <span className="px-2 py-0.5 rounded text-[9px] text-[rgba(201,169,110,0.6)]">+{hotel.amenities.length - 3}</span>
          )}
        </div>

        {/* Rating row */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[#C9A96E] flex items-center justify-center">
            <span className="text-xs font-black text-[#030812]">{hotel.rating}</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[rgba(245,240,232,0.8)]">Excellent</p>
            <p className="text-[9px] text-[rgba(245,240,232,0.4)]">{hotel.reviews.toLocaleString()} reviews</p>
          </div>
        </div>

        <button
          onClick={() => openBookingModal('hotel', hotel.id)}
          className="w-full py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-[#E8CC9A] to-[#C9A96E] text-[#030812] hover:opacity-90 transition-opacity"
        >
          {language === 'ar' ? 'احجز الآن' : 'Book Now'}
        </button>
      </div>
    </GlassCard>
  );
}

export default function Hotels() {
  const { language } = useAppStore();
  const tr = (k: Parameters<typeof t>[0]) => t(k, language);
  const [activeCity, setActiveCity] = useState<'all' | TurkishCity>('all');
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const filtered = activeCity === 'all' ? hotels : hotels.filter((h) => h.city === activeCity);

  return (
    <section
      id="hotels"
      className="relative py-20 md:py-32 overflow-hidden"
      style={{ background: '#030812' }}
      dir={dir}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(201,169,110,0.3),transparent)' }}/>
        <div className="absolute right-0 top-1/3 w-[500px] h-[500px] rounded-full bg-[#6C3FC5] opacity-[0.03] blur-[100px]"/>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow={language === 'ar' ? 'فنادق فاخرة' : 'Luxury Stays'}
          title={tr('hotels.title')}
          subtitle={tr('hotels.subtitle')}
        />

        {/* City filter — horizontally scrollable on mobile */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2 slider-track px-0" style={{ scrollSnapType: 'none', justifyContent: 'safe center' }}>
          {cityFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveCity(f.key)}
              className={`px-4 py-2.5 rounded-full text-xs font-medium tracking-wider whitespace-nowrap shrink-0 transition-all duration-300 ${
                activeCity === f.key
                  ? 'bg-gradient-to-r from-[#E8CC9A] to-[#C9A96E] text-[#030812] font-bold'
                  : 'glass border border-[rgba(201,169,110,0.2)] text-[rgba(245,240,232,0.6)] hover:text-[#C9A96E]'
              }`}
            >
              {tr(f.labelKey)}
            </button>
          ))}
        </div>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCity}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardSlider desktopCols="md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </CardSlider>
          </motion.div>
        </AnimatePresence>

        {/* View all */}
        <div className="mt-10 text-center">
          <button className="px-7 py-3.5 rounded-full text-sm font-bold tracking-widest uppercase glass border border-[rgba(201,169,110,0.3)] text-[rgba(245,240,232,0.7)] hover:text-[#C9A96E] hover:border-[rgba(201,169,110,0.6)] transition-all duration-300">
            {tr('hotels.viewAll')}
          </button>
        </div>
      </div>
    </section>
  );
}
