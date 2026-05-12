'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, formatPrice } from '@/lib/store';
import { t } from '@/lib/i18n';
import { hotels } from '@/lib/data/hotels';
import SectionHeader from '@/components/ui/SectionHeader';
import GlassCard from '@/components/ui/GlassCard';
import type { TurkishCity } from '@/types';

const cityFilters: { key: 'all' | TurkishCity; labelKey: Parameters<typeof t>[0] }[] = [
  { key: 'all', labelKey: 'hotels.filter.all' },
  { key: 'istanbul', labelKey: 'hotels.filter.istanbul' },
  { key: 'antalya', labelKey: 'hotels.filter.antalya' },
  { key: 'cappadocia', labelKey: 'hotels.filter.cappadocia' },
  { key: 'bursa', labelKey: 'hotels.filter.bursa' },
  { key: 'trabzon', labelKey: 'hotels.filter.trabzon' },
];

const hotelEmojis: Record<string, string> = {
  'istanbul': '🕌',
  'antalya': '🌊',
  'cappadocia': '🎈',
  'bursa': '⛰️',
  'trabzon': '🌿',
  'bodrum': '⛵',
  'sapanca': '🏔️',
};

function StarDisplay({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-3 h-3 text-[#C9A96E]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Hotels() {
  const { language, currency, openBookingModal } = useAppStore();
  const tr = (key: Parameters<typeof t>[0]) => t(key, language);
  const [activeCity, setActiveCity] = useState<'all' | TurkishCity>('all');
  const [hoveredHotel, setHoveredHotel] = useState<string | null>(null);

  const l = (obj: { en: string; ar: string }) => obj[language];

  const filtered = activeCity === 'all' ? hotels : hotels.filter((h) => h.city === activeCity);

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <section
      id="hotels"
      className="relative py-32 overflow-hidden"
      style={{ background: '#030812' }}
      dir={dir}
    >
      {/* Decorative gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent)' }}
        />
        <div className="absolute right-0 top-1/3 w-[500px] h-[500px] rounded-full bg-[#6C3FC5] opacity-[0.03] blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <SectionHeader
          eyebrow={language === 'ar' ? 'فنادق فاخرة' : 'Luxury Stays'}
          title={tr('hotels.title')}
          subtitle={tr('hotels.subtitle')}
        />

        {/* City Filter */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-2 justify-center flex-wrap">
          {cityFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveCity(filter.key)}
              className={`px-5 py-2.5 rounded-full text-xs font-medium tracking-wider whitespace-nowrap transition-all duration-300 ${
                activeCity === filter.key
                  ? 'bg-gradient-to-r from-[#E8CC9A] to-[#C9A96E] text-[#030812] font-bold'
                  : 'glass border border-[rgba(201,169,110,0.2)] text-[rgba(245,240,232,0.6)] hover:text-[#C9A96E]'
              }`}
            >
              {tr(filter.labelKey)}
            </button>
          ))}
        </div>

        {/* Hotels Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((hotel, i) => (
              <motion.div
                key={hotel.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                onHoverStart={() => setHoveredHotel(hotel.id)}
                onHoverEnd={() => setHoveredHotel(null)}
              >
                <GlassCard className="group h-full flex flex-col overflow-hidden" tilt={false}>
                  {/* Hotel visual */}
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#0D1F3C] to-[#030812] flex items-center justify-center">
                    {/* Animated gradient background */}
                    <motion.div
                      className="absolute inset-0"
                      animate={hoveredHotel === hotel.id ? {
                        background: 'radial-gradient(ellipse at 30% 30%, rgba(201,169,110,0.2) 0%, transparent 60%)',
                      } : {
                        background: 'radial-gradient(ellipse at 50% 50%, rgba(13,31,60,0.8) 0%, transparent 70%)',
                      }}
                      transition={{ duration: 0.5 }}
                    />

                    <div className="text-7xl opacity-20 group-hover:opacity-35 group-hover:scale-110 transition-all duration-700">
                      {hotelEmojis[hotel.city] || '🏨'}
                    </div>

                    {/* Stars & VIP */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <StarDisplay count={hotel.stars} />
                      {hotel.isVIP && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-gradient-to-r from-[#E8CC9A] to-[#C9A96E] text-[#030812]">
                          VIP
                        </span>
                      )}
                    </div>

                    {/* Category badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-[9px] font-medium glass border border-[rgba(255,255,255,0.1)] text-[rgba(245,240,232,0.6)] capitalize">
                        {hotel.category.replace('-', ' ')}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="absolute bottom-3 right-3 text-right">
                      <p className="text-xl font-black text-gradient-gold">{formatPrice(hotel.price, currency)}</p>
                      <p className="text-[10px] text-[rgba(245,240,232,0.4)]">/{tr('hotels.perNight')}</p>
                    </div>
                  </div>

                  {/* Hotel info */}
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-[10px] uppercase tracking-widest text-[#C9A96E] mb-1 capitalize">
                      📍 {hotel.city === 'cappadocia' ? 'Cappadocia' : hotel.city.charAt(0).toUpperCase() + hotel.city.slice(1)}
                    </p>
                    <h3
                      className="text-base font-bold text-[rgba(245,240,232,0.95)] mb-2 leading-snug"
                      style={{ fontFamily: 'var(--font-display, serif)' }}
                    >
                      {l(hotel.name)}
                    </h3>
                    <p className="text-xs text-[rgba(245,240,232,0.5)] leading-relaxed mb-4 flex-1 line-clamp-2">
                      {l(hotel.description)}
                    </p>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {hotel.amenities.slice(0, 3).map((amenity) => (
                        <span
                          key={amenity}
                          className="px-2 py-0.5 rounded text-[9px] glass border border-[rgba(255,255,255,0.08)] text-[rgba(245,240,232,0.5)]"
                        >
                          {amenity}
                        </span>
                      ))}
                      {hotel.amenities.length > 3 && (
                        <span className="px-2 py-0.5 rounded text-[9px] text-[rgba(201,169,110,0.6)]">
                          +{hotel.amenities.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Rating row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-8 h-8 rounded-lg bg-[#C9A96E] flex items-center justify-center">
                          <span className="text-xs font-black text-[#030812]">{hotel.rating}</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-[rgba(245,240,232,0.8)]">Excellent</p>
                          <p className="text-[9px] text-[rgba(245,240,232,0.4)]">{hotel.reviews.toLocaleString()} reviews</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => openBookingModal('hotel', hotel.id)}
                      className="w-full py-3 rounded-xl text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-[#E8CC9A] to-[#C9A96E] text-[#030812] hover:opacity-90 transition-opacity"
                    >
                      {language === 'ar' ? 'احجز الآن' : 'Book Now'}
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View all */}
        <div className="mt-12 text-center">
          <button className="px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase glass border border-[rgba(201,169,110,0.3)] text-[rgba(245,240,232,0.7)] hover:text-[#C9A96E] hover:border-[rgba(201,169,110,0.6)] transition-all duration-300">
            {tr('hotels.viewAll')}
          </button>
        </div>
      </div>
    </section>
  );
}
