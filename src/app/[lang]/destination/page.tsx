'use client';

import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import LenisProvider from '@/components/providers/LenisProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { destinations } from '@/components/sections/destinations/data';
import { useAppStore } from '@/lib/store';
import { EASE_EXPO_OUT, viewportOnce } from '@/lib/motion';

export default function DestinationsPage({ params }: { params: Promise<{ lang: string }> }) {
  use(params);
  const { language } = useAppStore();

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE_EXPO_OUT, delay: i * 0.07 }}
                viewport={viewportOnce}
              >
                <Link
                  href={`/${language}/destination/${d.id}`}
                  className="group block rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:border-accent/30 transition-all duration-300"
                >
                  {/* Color band */}
                  <div
                    className="h-1 w-full"
                    style={{ background: d.accent }}
                  />

                  <div className="p-6">
                    {/* Icon + badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{d.icon}</span>
                      <span
                        className="text-[9px] uppercase tracking-[0.3em] font-bold px-2.5 py-1 rounded-full border"
                        style={{ color: d.accent, borderColor: `${d.accent}40`, background: `${d.accent}12` }}
                      >
                        {d.badge[language]}
                      </span>
                    </div>

                    {/* Name */}
                    <h2
                      className="text-white text-xl font-light mb-1 group-hover:text-accent/90 transition-colors duration-300"
                      style={{ fontFamily: 'var(--font-display, serif)' }}
                    >
                      {d.name[language]}
                    </h2>
                    <p className="text-white/35 text-[11px] uppercase tracking-wider mb-3">{d.tag[language]}</p>

                    {/* Desc */}
                    <p className="text-white/50 text-[13px] leading-[1.65] line-clamp-3">{d.desc[language]}</p>

                    {/* Facts */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {[d.flightTime[language], d.climate[language]].map((fact) => (
                        <span key={fact} className="text-[10px] text-white/30 border border-white/[0.07] px-2.5 py-1 rounded-full">
                          {fact}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-accent/60 group-hover:text-accent transition-colors duration-300">
                      Explore
                      <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </LenisProvider>
  );
}
