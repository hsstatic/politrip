'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from '@/hooks/useTranslations';
import { EASE_EXPO_OUT } from '@/lib/motion';
import { getLenis } from '@/components/providers/LenisProvider';
import { TURKEY_SVG_PATH } from '@/components/3d/turkeyOutlineSVG';
import type { TranslationKey } from '@/lib/i18n';

const WHATSAPP_NUMBER = '905300709555';

const CITIES: { x: number; y: number; key: TranslationKey }[] = [
  { x: 280, y: 145, key: 'journey.slide1Name' },
  { x: 480, y: 280, key: 'journey.slide2Name' },
  { x: 420, y: 380, key: 'journey.slide3Name' },
  { x: 720, y: 160, key: 'journey.slide4Name' },
];

/** Soft routes between cities — fills the map interior */
const CITY_LINKS = [
  'M280 145 C 360 180, 420 220, 480 280',
  'M480 280 C 450 320, 430 350, 420 380',
  'M280 145 C 480 100, 620 120, 720 160',
  'M720 160 C 620 220, 540 260, 480 280',
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { offset: -60, duration: 1.8, easing: (t: number) => 1 - Math.pow(1 - t, 3) });
  } else {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE_EXPO_OUT, delay },
});

function TurkeyMap({
  reduceMotion,
  t,
}: {
  reduceMotion: boolean | null;
  t: (key: TranslationKey) => string;
}) {
  return (
    <motion.div
      className="relative w-full min-w-0 lg:translate-x-2"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.3, ease: EASE_EXPO_OUT, delay: 0.2 }}
    >
      {/* Glow plate behind the silhouette */}
      <div
        className="absolute left-1/2 top-1/2 -z-10 h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, color-mix(in srgb, var(--accent) 18%, transparent) 0%, transparent 70%)',
          filter: 'blur(28px)',
        }}
        aria-hidden
      />

      <svg
        viewBox="0 0 1000 500"
        preserveAspectRatio="xMidYMid meet"
        className="aspect-[2/1] h-auto w-full max-h-[min(38svh,280px)] sm:max-h-[min(42svh,360px)] lg:max-h-[min(78svh,620px)]"
        role="img"
        aria-label="Türkiye"
      >
        <defs>
          <linearGradient id="hero-tr-fill" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="hero-tr-stroke" x1="0%" y1="20%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="var(--accent-dark)" stopOpacity="0.65" />
            <stop offset="50%" stopColor="var(--accent)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--accent-light)" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="hero-tr-link" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
            <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        <path d={TURKEY_SVG_PATH} fill="url(#hero-tr-fill)" stroke="none" />

        <motion.path
          d={TURKEY_SVG_PATH}
          fill="none"
          stroke="url(#hero-tr-stroke)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, ease: EASE_EXPO_OUT, delay: 0.35 }}
        />

        {CITY_LINKS.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke="url(#hero-tr-link)"
            strokeWidth={1}
            strokeDasharray="4 6"
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: EASE_EXPO_OUT, delay: 1.1 + i * 0.12 }}
          />
        ))}

        {CITIES.map((city, i) => (
          <g key={city.key}>
            <motion.circle
              cx={city.x}
              cy={city.y}
              r={5.5}
              fill="var(--accent)"
              initial={reduceMotion ? false : { opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: EASE_EXPO_OUT, delay: 1.35 + i * 0.1 }}
            />
            <motion.circle
              cx={city.x}
              cy={city.y}
              r={12}
              fill="none"
              stroke="var(--accent)"
              strokeOpacity={0.4}
              strokeWidth={1}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE_EXPO_OUT, delay: 1.4 + i * 0.1 }}
            />
            <motion.text
              x={city.x}
              y={city.y - 18}
              textAnchor="middle"
              fill="var(--ink)"
              fillOpacity={0.65}
              fontSize={14}
              letterSpacing="0.14em"
              style={{ fontFamily: 'var(--font-display), ui-serif, serif' }}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.5 + i * 0.1 }}
            >
              {t(city.key).toUpperCase()}
            </motion.text>
          </g>
        ))}
      </svg>
    </motion.div>
  );
}

export default function Hero() {
  const { t, isRTL, language } = useTranslations();
  const reduceMotion = useReducedMotion();

  const stats = [
    { value: t('hero.stat1Value'), label: t('hero.stat1Label') },
    { value: t('hero.stat2Value'), label: t('hero.stat2Label') },
    { value: t('hero.stat3Value'), label: t('hero.stat3Label') },
  ];

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('cta.whatsappMsg'))}`;
  const isArabic = language === 'ar';

  return (
    <section
      id="home"
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative flex min-h-[100svh] w-full flex-col overflow-x-hidden bg-canvas"
    >
      {/* Layered atmosphere */}
      <div className="absolute inset-0" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 75% 50%, color-mix(in srgb, var(--accent) 12%, transparent) 0%, transparent 60%), radial-gradient(ellipse 55% 50% at 15% 40%, color-mix(in srgb, var(--canvas-band) 90%, transparent) 0%, transparent 70%)',
          }}
        />
        {/* Soft corner frames */}
        <div className="absolute left-5 top-24 hidden h-16 w-16 border-l border-t border-accent/25 sm:left-8 lg:left-12 lg:block" />
        <div className="absolute bottom-24 right-5 hidden h-16 w-16 border-b border-r border-accent/25 sm:right-8 lg:right-12 lg:block" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-5 pb-24 pt-28 sm:px-8 lg:flex-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-6 lg:px-12 lg:pb-16 lg:pt-24 xl:gap-10">
        {/* Copy column */}
        <div className={`text-center lg:text-start ${isRTL ? 'lg:order-2' : ''}`}>
          <motion.div
            {...rise(0.12)}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            <span
              className={`text-[11px] font-semibold tracking-[0.18em] text-accent ${isArabic ? '' : 'uppercase'}`}
            >
              {t('hero.badge')}
            </span>
          </motion.div>

          <motion.h1
            {...rise(0.25)}
            className={`mb-5 text-ink ${
              isArabic
                ? 'text-[clamp(2.3rem,5.5vw,4rem)] font-semibold leading-[1.22]'
                : 'text-[clamp(2.5rem,5.5vw,4.4rem)] font-light leading-[1.06] tracking-[-0.03em]'
            }`}
            style={{
              fontFamily: isArabic
                ? 'var(--font-arabic), sans-serif'
                : 'var(--font-display), ui-serif, serif',
            }}
          >
            {t('hero.title1')}
            <br />
            <span className="text-gradient-gold">{t('hero.title2')}</span>
          </motion.h1>

          <motion.p
            {...rise(0.4)}
            className="mx-auto mb-8 max-w-md text-[15px] leading-[1.8] text-ink-muted lg:mx-0"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            {...rise(0.52)}
            className="mb-10 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-accent-light via-accent to-accent-dark px-8 py-3.5 text-[12px] font-bold uppercase tracking-[0.2em] text-on-accent shadow-[0_8px_32px_-8px_var(--accent-glow)] transition-all duration-300 hover:scale-[1.03] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t('hero.ctaPrimary')}
            </a>
            <button
              type="button"
              onClick={() => scrollToSection('destinations')}
              className="inline-flex items-center justify-center rounded-full border border-edge bg-canvas/70 px-8 py-3.5 text-[12px] font-bold uppercase tracking-[0.2em] text-ink/80 backdrop-blur-sm transition-all duration-300 hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t('hero.ctaSecondary')}
            </button>
          </motion.div>

          <motion.dl
            {...rise(0.65)}
            className="flex items-center justify-center gap-8 border-t border-edge-subtle pt-8 sm:gap-10 lg:justify-start"
          >
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 lg:items-start">
                <dt className="sr-only">{s.label}</dt>
                <dd
                  className="text-2xl font-light leading-none text-ink sm:text-[1.7rem]"
                  style={{ fontFamily: 'var(--font-display), ui-serif, serif' }}
                >
                  {s.value}
                </dd>
                <dd className="text-[10px] uppercase tracking-[0.28em] text-ink/45">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <div className={`min-w-0 ${isRTL ? 'lg:order-1' : ''}`}>
          <TurkeyMap reduceMotion={reduceMotion} t={t} />
        </div>
      </div>

      <motion.button
        type="button"
        onClick={() => scrollToSection('destinations')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.15 }}
        className="group absolute bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        aria-label={t('hero.scrollDown')}
      >
        <span className="text-[9px] uppercase tracking-[0.42em] text-accent/70 transition-colors group-hover:text-accent">
          {t('hero.scrollDown')}
        </span>
        <motion.span
          className="block h-7 w-px bg-gradient-to-b from-accent/80 to-transparent"
          animate={reduceMotion ? undefined : { scaleY: [0.6, 1, 0.6], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.button>
    </section>
  );
}
