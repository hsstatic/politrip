'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { motion } from 'framer-motion';
import LenisProvider from '@/components/providers/LenisProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useTranslations } from '@/hooks/useTranslations';
import { EASE_OUT, viewportOnce } from '@/lib/motion';
import type { Language } from '@/types';

const CATEGORY_STYLES: Record<string, { color: string }> = {
  'ultra-luxury': { color: '#fcd34d' },
  luxury: { color: '#67e8f9' },
  boutique: { color: '#c4b5fd' },
  resort: { color: '#6ee7b7' },
};

function HotelCard({
  hotel,
  lang,
  index,
}: {
  hotel: {
    _id: string;
    name_en: string; name_ar: string; name_tr: string;
    city: string; stars: number; price: number; category: string;
    images: string[]; amenities: string[]; isVIP: boolean; rating: number;
  };
  lang: Language;
  index: number;
}) {
  const name = lang === 'ar' ? hotel.name_ar : lang === 'tr' ? hotel.name_tr : hotel.name_en;
  const image = hotel.images[0];
  const catColor = CATEGORY_STYLES[hotel.category]?.color ?? 'rgba(255,255,255,0.4)';

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.75, delay: (index % 3) * 0.08, ease: EASE_OUT }}
      className="group rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03] flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-white/5 text-5xl">🏨</div>
        )}
        {hotel.isVIP && (
          <span className="absolute top-3 right-3 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-amber-500/90 text-black shadow-[0_0_12px_rgba(245,158,11,0.5)] z-10">
            VIP
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <span className="text-[10px] uppercase tracking-[0.32em] font-medium mb-2" style={{ color: catColor }}>
          {hotel.category}
        </span>
        <h3
          className="text-white text-xl font-normal leading-snug mb-1"
          style={{ fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.02em' }}
        >
          {name}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center gap-0.5">
            {Array.from({ length: Math.min(hotel.stars, 5) }, (_, i) => (
              <span key={i} className="text-amber-400 text-[11px]">★</span>
            ))}
          </span>
        </div>
        {hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {hotel.amenities.slice(0, 3).map((a) => (
              <span key={a} className="text-[10px] text-white/30 border border-white/[0.08] px-2.5 py-1 rounded-full">
                {a}
              </span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="text-[10px] text-white/20">+{hotel.amenities.length - 3}</span>
            )}
          </div>
        )}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/[0.06]">
          <div>
            <span className="text-white text-lg font-semibold">${hotel.price}</span>
            <span className="text-white/30 text-[11px] ml-1">/ night</span>
          </div>
          <a
            href="https://wa.me/905300000000"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full text-[10px] font-bold tracking-[0.22em] uppercase bg-gradient-to-br from-accent-light via-accent to-accent-dark text-on-accent hover:scale-105 transition-transform duration-200"
          >
            Reserve
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export default function CityHotelsPage({
  params,
}: {
  params: Promise<{ lang: string; city: string }>;
}) {
  const { lang, city } = use(params);
  const language = lang as Language;
  const hotels = useQuery(api.hotels.getByCity, { city });
  const { isRTL } = useTranslations();

  const cityLabel = city.charAt(0).toUpperCase() + city.slice(1);

  return (
    <LenisProvider>
      <Navbar />
      <main className="relative flex min-h-0 flex-1 flex-col bg-canvas" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="relative overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-20 px-6 sm:px-10 lg:px-20">
          <div
            className="absolute top-0 left-0 right-0 h-[400px] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(34,211,238,0.05) 0%, transparent 65%)',
            }}
            aria-hidden
          />
          <Link
            href={`/${lang}#destinations`}
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-white/35 hover:text-accent transition-colors mb-8"
          >
            <span aria-hidden>←</span>
            <span>All Destinations</span>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent" />
            <span className="text-[10px] uppercase tracking-[0.42em] text-accent font-bold">
              Hotels
            </span>
          </div>
          <h1
            className="text-[clamp(40px,6vw,96px)] font-normal text-white leading-[0.94] mb-4"
            style={{ fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.025em' }}
          >
            {cityLabel}
          </h1>
          <p className="text-white/50 text-base lg:text-lg max-w-lg leading-[1.7]">
            {hotels !== undefined
              ? `${hotels.length} ${hotels.length === 1 ? 'hotel' : 'hotels'} available`
              : 'Loading…'}
          </p>
        </div>

        {/* Hotel grid */}
        <div className="px-6 sm:px-10 lg:px-20 pb-24 lg:pb-32">
          {hotels === undefined && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-white/[0.06]">
                  <div className="aspect-[4/3] bg-white/5 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                    <div className="h-6 w-40 bg-white/5 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {hotels?.length === 0 && (
            <div className="text-center py-20 text-white/30">
              <p className="text-5xl mb-4">🏨</p>
              <p className="text-lg">No hotels listed for {cityLabel} yet.</p>
            </div>
          )}

          {hotels && hotels.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel, i) => (
                <HotelCard key={hotel._id} hotel={hotel} lang={language} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </LenisProvider>
  );
}
