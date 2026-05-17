'use client';

import { motion } from 'framer-motion';
import { useTranslations } from '@/hooks/useTranslations';
import { EASE_OUT, EASE_EXPO_OUT, viewportOnce, cinematicRise } from '@/lib/motion';

const WA_BASE = 'https://wa.me/905526867559';

function Check({ accent }: { accent: string }) {
  return (
    <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6.5" stroke={accent} strokeOpacity="0.35" />
      <path d="M4 7l2 2 4-4" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface Tier {
  nameKey: string;
  descKey: string;
  priceKey: string;
  features: string[];
  accent: string;
  popular: boolean;
}

const TIERS: Tier[] = [
  {
    nameKey: 'pricing.tier1.name',
    descKey: 'pricing.tier1.desc',
    priceKey: 'pricing.tier1.price',
    features: ['pricing.tier1.f1', 'pricing.tier1.f2', 'pricing.tier1.f3', 'pricing.tier1.f4'],
    accent: '#67e8f9',
    popular: false,
  },
  {
    nameKey: 'pricing.tier2.name',
    descKey: 'pricing.tier2.desc',
    priceKey: 'pricing.tier2.price',
    features: ['pricing.tier2.f1', 'pricing.tier2.f2', 'pricing.tier2.f3', 'pricing.tier2.f4', 'pricing.tier2.f5'],
    accent: '#f59e0b',
    popular: true,
  },
  {
    nameKey: 'pricing.tier3.name',
    descKey: 'pricing.tier3.desc',
    priceKey: 'pricing.tier3.price',
    features: ['pricing.tier3.f1', 'pricing.tier3.f2', 'pricing.tier3.f3', 'pricing.tier3.f4', 'pricing.tier3.f5', 'pricing.tier3.f6'],
    accent: '#c084fc',
    popular: false,
  },
];

export default function Pricing() {
  const { t, isRTL } = useTranslations();

  return (
    <section
      id="pricing"
      className="relative bg-canvas overflow-hidden scene-layer"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Atmospheric top bleed */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent z-10" />
      <div
        className="absolute top-0 left-0 right-0 h-[60px] pointer-events-none z-[5]"
        style={{ background: 'linear-gradient(to bottom, rgba(2,18,45,1) 0%, transparent 100%)' }}
        aria-hidden
      />

      {/* Deep radial ambience */}
      <div
        className="absolute top-0 left-0 right-0 h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(34,211,238,0.05) 0%, transparent 65%)' }}
        aria-hidden
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 pt-28 lg:pt-40 pb-28 lg:pb-40">
        {/* Section header */}
        <motion.div
          className="max-w-2xl mb-20 lg:mb-24"
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
              {t('pricing.kicker')}
            </span>
          </motion.div>

          <motion.h2
            className="text-[clamp(36px,5vw,76px)] font-[350] text-white leading-[0.94] mb-6"
            style={{ fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.025em' }}
            variants={cinematicRise}
            transition={{ duration: 0.95, ease: EASE_EXPO_OUT, delay: 0.05 }}
          >
            {t('pricing.titleBefore')}{' '}
            <span className="text-gradient-gold italic">{t('pricing.titleAccent')}</span>
          </motion.h2>

          <motion.p
            className="text-white/55 text-base lg:text-lg leading-[1.7]"
            variants={cinematicRise}
            transition={{ duration: 1.0, ease: EASE_EXPO_OUT, delay: 0.18 }}
          >
            {t('pricing.subtitle')}
          </motion.p>
        </motion.div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.nameKey}
              className="relative flex flex-col rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.85, ease: EASE_EXPO_OUT, delay: i * 0.1 }}
              style={{
                background: tier.popular
                  ? `linear-gradient(145deg, rgba(245,158,11,0.08) 0%, rgba(2,18,45,0.85) 60%)`
                  : 'rgba(255,255,255,0.025)',
                border: `1px solid ${tier.accent}${tier.popular ? '40' : '22'}`,
                boxShadow: tier.popular ? `0 0 60px ${tier.accent}18, 0 0 0 1px ${tier.accent}30` : undefined,
              }}
            >
              {/* Popular badge */}
              {tier.popular && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0 z-20 px-4 py-1 text-[9px] font-bold uppercase tracking-[0.3em] rounded-b-full"
                  style={{ background: tier.accent, color: '#02122d' }}
                >
                  {t('pricing.mostPopular')}
                </div>
              )}

              <div className="flex flex-col flex-1 p-7 lg:p-8 pt-10">
                {/* Tier name + accent dot */}
                <div className="flex items-center gap-2.5 mb-3">
                  <span
                    className="inline-block w-2 h-2 rounded-full shrink-0"
                    style={{ background: tier.accent, boxShadow: `0 0 8px ${tier.accent}` }}
                    aria-hidden
                  />
                  <span
                    className="text-[11px] font-bold uppercase tracking-[0.38em]"
                    style={{ color: tier.accent }}
                  >
                    {t(tier.nameKey as Parameters<typeof t>[0])}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 mb-4">
                  <span className="text-[11px] text-white/40 font-medium">{t('pricing.from')}</span>
                  <span
                    className="text-[clamp(40px,4.5vw,56px)] font-light leading-none text-white"
                    style={{ fontFamily: 'var(--font-display, serif)' }}
                  >
                    ${t(tier.priceKey as Parameters<typeof t>[0])}
                  </span>
                  <span className="text-[11px] text-white/35 font-medium">{t('pricing.perPerson')}</span>
                </div>

                {/* Divider */}
                <div
                  className="h-px w-full mb-5"
                  style={{ background: `linear-gradient(to right, ${tier.accent}55, transparent)` }}
                />

                {/* Description */}
                <p className="text-white/50 text-[13px] leading-[1.75] mb-7">
                  {t(tier.descKey as Parameters<typeof t>[0])}
                </p>

                {/* Features */}
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {tier.features.map((fKey) => (
                    <li key={fKey} className="flex items-start gap-2.5 text-white/70 text-[13px] leading-snug">
                      <Check accent={tier.accent} />
                      <span>{t(fKey as Parameters<typeof t>[0])}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={`${WA_BASE}?text=${encodeURIComponent(`Hi PoliTrip, I'm interested in the ${t(tier.nameKey as Parameters<typeof t>[0])} package. Can you give me a quote?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-3.5 rounded-full text-[11px] font-bold tracking-[0.28em] uppercase transition-all duration-300 hover:scale-[1.03]"
                  style={{
                    background: tier.popular
                      ? `linear-gradient(135deg, ${tier.accent}, #d97706)`
                      : 'rgba(255,255,255,0.06)',
                    color: tier.popular ? '#02122d' : tier.accent,
                    border: `1px solid ${tier.accent}${tier.popular ? '00' : '40'}`,
                  }}
                >
                  {t('pricing.cta')}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
