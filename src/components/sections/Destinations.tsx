'use client';

import { motion } from 'framer-motion';
import { useTranslations } from '@/hooks/useTranslations';
import { EASE_OUT, viewportOnce } from '@/lib/motion';
import { destinations } from './destinations/data';
import DestSpread from './destinations/DestSpread';

function WordReveal({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.85, ease: EASE_OUT, delay: i * 0.07 }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

export default function Destinations() {
  const { t, isRTL } = useTranslations();

  return (
    <section
      id="destinations"
      className="relative bg-canvas overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent z-10" />

      {/* Subtle depth radial */}
      <div
        className="absolute top-0 left-0 right-0 h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(34,211,238,0.045) 0%, transparent 65%)',
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 pt-24 lg:pt-36 pb-20 lg:pb-32">
        <div className="max-w-3xl">
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: EASE_OUT }}
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent" />
            <span className="text-[10px] uppercase tracking-[0.42em] text-accent font-bold">
              {t('destinations.kicker')}
            </span>
          </motion.div>

          <h2
            className="text-[clamp(38px,5.4vw,84px)] font-light text-white leading-[0.94] mb-7"
            style={{ fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.025em' }}
          >
            <WordReveal text={t('destinations.titleBefore')} />
            {' '}
            <span className="text-gradient-gold italic">
              <WordReveal text={t('destinations.titleAccent')} />
            </span>
          </h2>

          <motion.p
            className="text-white/55 text-base lg:text-lg leading-[1.7] max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.3 }}
          >
            {t('destinations.subtitle')}
          </motion.p>

          <motion.div
            className="mt-12 flex items-center gap-3 text-white/30 text-[9px] uppercase tracking-[0.42em]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.5 }}
          >
            <span>{t('destinations.scrollHint')}</span>
            <span className="h-px w-12 bg-white/20" />
            <span>
              01 / {String(destinations.length).padStart(2, '0')}
            </span>
          </motion.div>
        </div>
      </div>

      <div>
        {destinations.map((d, i) => (
          <DestSpread key={d.id} d={d} index={i} total={destinations.length} />
        ))}
      </div>
    </section>
  );
}
