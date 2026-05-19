'use client';

import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import LenisProvider from '@/components/providers/LenisProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAppStore } from '@/lib/store';
import { useTranslations } from '@/hooks/useTranslations';
import { EASE_EXPO_OUT, viewportOnce } from '@/lib/motion';
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
  color: string; accent: string; icon: string; imageUrl?: string; lat: number; lng: number;
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
    imageUrl: doc.imageUrl,
    lat: doc.lat,
    lng: doc.lng,
    category: 'culture',
  };
}


function DestCard({ d, index }: { d: Destination & { imageUrl?: string }; index: number }) {
  const { language: lang } = useAppStore();
  const { t } = useTranslations();
  const imageSrc = d.imageUrl || `/destinations/${d.id}.jpg`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE_EXPO_OUT, delay: (index % 3) * 0.07 }}
      viewport={viewportOnce}
      className="cinema-panel group overflow-hidden relative aspect-[4/3]"
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
  );
}

export default function DestinationsPage({ params }: { params: Promise<{ lang: string }> }) {
  use(params);
  const convexDests = useQuery(api.destinations.getAll);
  const destinations = convexDests ? convexDests.map(convexToDestination) : [];

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
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent" />
              <span className="text-[10px] uppercase tracking-[0.42em] text-accent font-bold">Destinations</span>
            </div>
            <h1
              className="text-[clamp(2rem,5vw,4rem)] font-[350] text-white leading-tight mb-4"
              style={{ fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.02em' }}
            >
              All Destinations
            </h1>
            <p className="text-white/50 text-base max-w-xl leading-relaxed">
              From the Bosphorus to the Black Sea — explore every chapter of Türkiye.
            </p>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
{destinations.map((d, i) => <DestCard key={d.id} d={d} index={i} />)}
          </div>
        </main>

        <Footer />
      </div>
    </LenisProvider>
  );
}
