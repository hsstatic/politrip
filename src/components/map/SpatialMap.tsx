'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';
import { useHolographicUI } from '@/hooks/useHolographicUI';
import { useTranslations } from '@/hooks/useTranslations';
import HolographicPanel from '@/components/ui/HolographicPanel';
import type { TranslationKey } from '@/lib/i18n';

const VIP_ROW_KEYS: { labelKey: TranslationKey; subKey: TranslationKey; icon: string }[] = [
  { icon: '✈️', labelKey: 'spatial.vip.jets', subKey: 'spatial.vip.jetsSub' },
  { icon: '🏨', labelKey: 'spatial.vip.hotels', subKey: 'spatial.vip.hotelsSub' },
  { icon: '🚗', labelKey: 'spatial.vip.chauffeur', subKey: 'spatial.vip.chauffeurSub' },
  { icon: '⛵', labelKey: 'spatial.vip.yacht', subKey: 'spatial.vip.yachtSub' },
];

const CITY_ROW_KEYS: { icon: string; nameKey: TranslationKey; descKey: TranslationKey }[] = [
  { icon: '🕌', nameKey: 'spatial.city.istanbul', descKey: 'spatial.city.istanbulDesc' },
  { icon: '🎈', nameKey: 'spatial.city.cappadocia', descKey: 'spatial.city.cappadociaDesc' },
  { icon: '🏖️', nameKey: 'spatial.city.antalya', descKey: 'spatial.city.antalyaDesc' },
  { icon: '🌿', nameKey: 'spatial.city.trabzon', descKey: 'spatial.city.trabzonDesc' },
];

interface Props {
  scrollYProgress: MotionValue<number>;
}

export default function SpatialMap({ scrollYProgress }: Props) {
  const { t, isRTL } = useTranslations();
  const ui = useHolographicUI(scrollYProgress);

  const routeBarWidth = useTransform(ui.route.progress, [0, 1], ['2%', '100%']);
  const planePosLeft = useTransform(ui.route.progress, [0, 1], ['2%', '96%']);

  return (
    <>
      <motion.div
        className="absolute top-28 right-8 z-30 w-52 hidden lg:block pointer-events-none"
        style={{ opacity: ui.gulf.opacity, y: ui.gulf.y, x: ui.parallaxX }}
      >
        <HolographicPanel variant="gold" glow label={t('spatial.regionLabel')}>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-2xl leading-none">🇸🇦</span>
            <span
              className="text-[17px] font-semibold text-white/92"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('spatial.arabianGulf')}
            </span>
          </div>
          <p className="text-[11px] text-white/44 leading-relaxed mb-3.5">
            {t('spatial.gulfDescription')}
          </p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
            </span>
            <span className="text-[8px] uppercase tracking-[0.32em] text-accent/80">
              {t('spatial.liveDepartures')}
            </span>
          </div>
        </HolographicPanel>
      </motion.div>

      <motion.div
        className="absolute bottom-[5.5rem] left-1/2 z-30 w-72 -translate-x-1/2 hidden lg:block pointer-events-none"
        style={{ opacity: ui.route.opacity, x: ui.parallaxX }}
      >
        <HolographicPanel label={t('spatial.routeLabel')}>
          <p className="text-center text-[10px] uppercase tracking-[0.42em] text-white/35 mb-3">
            {t('spatial.gulfToTurkey')}
          </p>

          <div className="relative flex items-center gap-2 mb-3.5">
            <span className="text-[10px] text-white/55 shrink-0">🇸🇦</span>
            <div className="flex-1 relative h-[3px] bg-white/8 rounded-full overflow-visible">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: routeBarWidth,
                  background: 'linear-gradient(90deg, #0e7490, #22d3ee, #67e8f9)',
                }}
              />
              <motion.span
                className="absolute top-1/2 -translate-y-1/2 text-[13px] -translate-x-1/2 drop-shadow-sm"
                style={{ left: planePosLeft }}
              >
                ✈️
              </motion.span>
            </div>
            <span className="text-[10px] text-white/55 shrink-0">🇹🇷</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="text-center px-2 py-1.5 rounded-lg bg-white/4">
              <div
                className="text-base font-semibold text-gradient-gold"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                ~2,412 km
              </div>
              <div className="text-[7px] uppercase tracking-[0.3em] text-white/28 mt-0.5">{t('spatial.distance')}</div>
            </div>
            <div className="text-center px-2 py-1.5 rounded-lg bg-white/4">
              <div
                className="text-base font-semibold text-gradient-gold"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                ~3.5 hrs
              </div>
              <div className="text-[7px] uppercase tracking-[0.3em] text-white/28 mt-0.5">{t('spatial.flightTimeLabel')}</div>
            </div>
          </div>
        </HolographicPanel>
      </motion.div>

      <motion.div
        className="absolute top-1/2 -translate-y-1/2 right-8 z-30 w-52 hidden lg:block"
        style={{ opacity: ui.vip.opacity, x: ui.vip.x }}
      >
        <HolographicPanel label={t('spatial.vipServices')}>
          <div className="space-y-1">
            {VIP_ROW_KEYS.map((s) => (
              <div
                key={s.labelKey}
                className="group flex items-center gap-2.5 px-2.5 py-2 rounded-xl cursor-pointer transition-all duration-300 hover:bg-white/6"
                style={{
                  transition: 'background 0.3s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1)',
                }}
              >
                <span className="text-[15px] w-5 text-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                  {s.icon}
                </span>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-white/80 group-hover:text-accent transition-colors duration-300">
                    {t(s.labelKey)}
                  </div>
                  <div className="text-[9px] text-white/32">{t(s.subKey)}</div>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2.5 h-2.5 rounded-full border border-accent/50 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-accent" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </HolographicPanel>
      </motion.div>

      <motion.div
        className="absolute top-28 right-8 z-30 w-52 hidden lg:block pointer-events-none"
        style={{ opacity: ui.turkey.opacity, y: ui.turkey.y, x: ui.parallaxX }}
      >
        <HolographicPanel variant="blue" glow label={t('spatial.destinationLabel')}>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-2xl leading-none">🇹🇷</span>
            <span
              className="text-[17px] font-semibold text-white/92"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Türkiye
            </span>
          </div>
          <p className="text-[11px] text-white/44 leading-relaxed mb-3.5">
            {t('spatial.turkeyDescription')}
          </p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-55" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-400" />
            </span>
            <span className="text-[8px] uppercase tracking-[0.28em] text-blue-300/70">
              41.0082° N, 28.9784° E
            </span>
          </div>
        </HolographicPanel>
      </motion.div>

      <motion.div
        className="absolute bottom-24 right-8 z-30 w-52 space-y-1.5 hidden lg:block"
        style={{ opacity: ui.cities.opacity, scale: ui.cities.scale }}
      >
        {CITY_ROW_KEYS.map((city, i) => (
          <div
            key={city.nameKey}
            className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl glass-dark border border-white/8 cursor-pointer transition-all duration-300 hover:border-accent/35 hover:bg-white/5"
            style={{ transitionDelay: `${i * 55}ms` }}
          >
            <span className="text-[15px] shrink-0 transition-transform duration-300 group-hover:scale-110">
              {city.icon}
            </span>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-white/82 group-hover:text-accent transition-colors duration-300">
                {t(city.nameKey)}
              </div>
              <div className="text-[9px] text-white/32">{t(city.descKey)}</div>
            </div>
            <div className={`ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 ${isRTL ? 'group-hover:-translate-x-1' : 'translate-x-1 group-hover:translate-x-0'}`}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5h6M6 3l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-accent" />
              </svg>
            </div>
          </div>
        ))}
      </motion.div>
    </>
  );
}
