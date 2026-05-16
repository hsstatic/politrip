'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useTranslations } from '@/hooks/useTranslations';
import { EASE_OUT, EASE_EXPO_OUT, viewportOnce, cinematicRise } from '@/lib/motion';

const STATIC_PHOTOS = [
  { src: '/destinations/istanbul.jpg',   label: 'Istanbul',   span: 'lg:col-span-2 lg:row-span-2' },
  { src: '/destinations/cappadocia.jpg', label: 'Cappadocia', span: '' },
  { src: '/destinations/antalya.jpg',    label: 'Antalya',    span: '' },
  { src: '/destinations/trabzon.jpg',    label: 'Trabzon',    span: '' },
  { src: '/destinations/bursa.jpg',      label: 'Bursa',      span: '' },
  { src: '/destinations/sapanca.jpg',    label: 'Sapanca',    span: 'lg:col-span-2' },
];

export default function Gallery() {
  const { t, isRTL } = useTranslations();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const dbPhotos = useQuery(api.gallery.getAll);
  const PHOTOS = dbPhotos && dbPhotos.length > 0
    ? [...dbPhotos].sort((a, b) => a.order - b.order)
    : STATIC_PHOTOS;

  const close = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (lightbox !== null && lightbox >= PHOTOS.length) setLightbox(null);
  }, [PHOTOS.length, lightbox]);

  const prev = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length));
  }, []);

  const next = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i + 1) % PHOTOS.length));
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') (isRTL ? next : prev)();
      if (e.key === 'ArrowRight') (isRTL ? prev : next)();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, close, prev, next, isRTL]);

  return (
    <section
      id="gallery"
      className="relative bg-canvas overflow-hidden scene-layer"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Top bleed */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent z-10" />
      <div
        className="absolute top-0 left-0 right-0 h-[60px] pointer-events-none z-[5]"
        style={{ background: 'linear-gradient(to bottom, rgba(2,18,45,1) 0%, transparent 100%)' }}
        aria-hidden
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 pt-28 lg:pt-40 pb-28 lg:pb-40">
        {/* Header */}
        <motion.div
          className="max-w-2xl mb-16 lg:mb-20"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: EASE_OUT }}
          >
            <motion.div
              className={`h-px w-12 ${isRTL ? 'bg-gradient-to-l from-transparent to-accent' : 'bg-gradient-to-r from-transparent to-accent'}`}
              initial={{ scaleX: 0, originX: isRTL ? 1 : 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 }}
            />
            <span className="text-[10px] uppercase tracking-[0.42em] text-accent font-bold">
              {t('gallery.kicker')}
            </span>
          </motion.div>

          <motion.h2
            className="text-[clamp(36px,5vw,76px)] font-[350] text-white leading-[0.94] mb-5"
            style={{ fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.025em' }}
            variants={cinematicRise}
            transition={{ duration: 0.95, ease: EASE_EXPO_OUT, delay: 0.05 }}
          >
            {t('gallery.titleBefore')}{' '}{t('gallery.titleAccent')}
          </motion.h2>

          <motion.p
            className="text-white/50 text-base lg:text-lg leading-[1.7]"
            variants={cinematicRise}
            transition={{ duration: 1.0, ease: EASE_EXPO_OUT, delay: 0.18 }}
          >
            {t('gallery.subtitle')}
          </motion.p>
        </motion.div>

        {/* Masonry grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 lg:grid-rows-[260px_260px]">
          {PHOTOS.map((photo, i) => (
            <motion.button
              key={photo.src}
              type="button"
              aria-label={photo.label}
              className={`relative overflow-hidden rounded-xl group cursor-pointer ${photo.span} focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent`}
              style={{ minHeight: 180 }}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.7, ease: EASE_EXPO_OUT, delay: i * 0.07 }}
              onClick={() => setLightbox(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                loading="lazy"
                decoding="async"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                <span className="text-white text-[11px] font-bold uppercase tracking-[0.3em]">
                  {photo.label}
                </span>
              </div>
              {/* Expand icon */}
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" />
                </svg>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && PHOTOS[lightbox] != null && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-lg" aria-hidden />

            {/* Image */}
            <motion.div
              className="relative z-10 max-w-5xl w-full max-h-[85svh] flex flex-col items-center"
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE_EXPO_OUT }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PHOTOS[lightbox].src}
                alt={PHOTOS[lightbox].label}
                className="w-full max-h-[78svh] object-contain rounded-xl"
              />
              <div className="mt-4 flex items-center gap-6">
                <span className="text-white/50 text-[11px] uppercase tracking-[0.38em]">
                  {PHOTOS[lightbox].label}
                </span>
                <span className="text-white/20 text-[10px] tabular-nums">
                  {String(lightbox + 1).padStart(2, '0')} / {String(PHOTOS.length).padStart(2, '0')}
                </span>
              </div>
            </motion.div>

            {/* Prev / Next */}
            <button
              type="button"
              aria-label="Previous"
              onClick={(e) => { e.stopPropagation(); (isRTL ? next : prev)(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-accent hover:border-accent/40 transition-all duration-200 backdrop-blur-md bg-black/30"
            >
              {isRTL ? '→' : '←'}
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={(e) => { e.stopPropagation(); (isRTL ? prev : next)(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-accent hover:border-accent/40 transition-all duration-200 backdrop-blur-md bg-black/30"
            >
              {isRTL ? '←' : '→'}
            </button>

            {/* Close */}
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all duration-200 backdrop-blur-md bg-black/30 text-lg leading-none"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
