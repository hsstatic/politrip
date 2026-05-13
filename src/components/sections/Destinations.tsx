'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { EASE_OUT, viewportOnce } from '@/lib/motion';
import { destinations } from './destinations/data';
import DestSpread from './destinations/DestSpread';

/**
 * Destinations — "Cinematic Editorial Spreads".
 *
 * Picks up where the Hero leaves off (8K Earth locked on Türkiye) by giving
 * each city a full-viewport magazine spread: full-bleed photo, ghost
 * watermark name, alternating glass content panel, chapter numbering. The
 * pattern is borrowed from luxury travel sites (Aman, Belmond, Mr & Mrs
 * Smith) and lets each destination have its own cinematic moment.
 */
export default function Destinations() {
  const { language } = useAppStore();
  const isAr = language === 'ar';

  return (
    <section
      id="destinations"
      className="relative bg-canvas overflow-hidden"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Top hairline tying the section to Hero above */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent z-10" />

      {/* ── Section header ───────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 pt-24 lg:pt-36 pb-20 lg:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.95, ease: EASE_OUT }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent" />
            <span className="text-[10px] uppercase tracking-[0.42em] text-accent font-bold">
              {isAr ? 'الوجهات' : 'Destinations'}
            </span>
          </div>
          <h2
            className="text-[clamp(38px,5.4vw,84px)] font-light text-white leading-[0.94] mb-7"
            style={{ fontFamily: 'var(--font-display, serif)' }}
          >
            {isAr ? 'ست وجهات،' : 'Six chapters,'}{' '}
            <span className="text-gradient-gold italic">
              {isAr ? 'تركيا واحدة' : 'one Türkiye'}
            </span>
          </h2>
          <p className="text-white/55 text-base lg:text-lg leading-[1.7] max-w-xl">
            {isAr
              ? 'من البوسفور إلى وديان كابادوكيا، ومن المتوسط إلى البحر الأسود — كل وجهة فصل من رحلة واحدة. اسحب لاكتشاف.'
              : 'From the Bosphorus to the Cappadocian valleys, the Mediterranean to the Black Sea — each destination is a different chapter of one journey. Scroll to travel.'}
          </p>

          {/* Tiny scroll-hint cue */}
          <div className="mt-12 flex items-center gap-3 text-white/30 text-[9px] uppercase tracking-[0.42em]">
            <span>{isAr ? 'اسحب' : 'Scroll'}</span>
            <span className="h-px w-12 bg-white/20" />
            <span>
              01 / {String(destinations.length).padStart(2, '0')}
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── Editorial spreads ─────────────────────────────────────── */}
      <div>
        {destinations.map((d, i) => (
          <DestSpread key={d.id} d={d} index={i} total={destinations.length} />
        ))}
      </div>
    </section>
  );
}
