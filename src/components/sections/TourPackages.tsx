'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore, formatPrice } from '@/lib/store';
import { staggerContainer, staggerItem, viewportOnce, EASE_OUT } from '@/lib/motion';

const packages = [
  {
    id: 'essential',
    badge: { en: 'Essential', ar: 'أساسي' },
    icon: '🌟',
    color: '#6a8aaa',
    price: 1200,
    duration: { en: '5 days', ar: '٥ أيام' },
    name: { en: 'Classic Türkiye', ar: 'تركيا الكلاسيكية' },
    desc: {
      en: 'Perfect introduction to Istanbul — guided city tour, Bosphorus cruise, and 4-star hotel.',
      ar: 'مقدمة مثالية لإسطنبول — جولة مرشدة، رحلة بوسفور، وفندق ٤ نجوم.',
    },
    includes: [
      { en: 'Airport transfers', ar: 'انتقالات المطار' },
      { en: 'Guided city tour', ar: 'جولة مرشدة' },
      { en: 'Bosphorus cruise', ar: 'رحلة بوسفور' },
      { en: '4-star hotel', ar: 'فندق ٤ نجوم' },
      { en: 'Breakfast daily', ar: 'إفطار يومي' },
    ],
    highlight: false,
  },
  {
    id: 'vip',
    badge: { en: 'Most Popular', ar: 'الأكثر طلباً' },
    icon: '👑',
    color: '#22d3ee',
    price: 3500,
    duration: { en: '7 days', ar: '٧ أيام' },
    name: { en: 'VIP Türkiye', ar: 'تركيا VIP' },
    desc: {
      en: 'The ultimate Gulf traveler experience — 5-star hotels, private driver, exclusive tours across 2 cities.',
      ar: 'التجربة المثالية للمسافر الخليجي — فنادق ٥ نجوم، سائق خاص، وجولات حصرية.',
    },
    includes: [
      { en: 'VIP airport meet & greet', ar: 'استقبال VIP في المطار' },
      { en: 'Private chauffeur', ar: 'سائق خاص' },
      { en: '5-star hotel suite', ar: 'جناح فندق ٥ نجوم' },
      { en: 'Bosphorus private yacht', ar: 'يخت خاص في البوسفور' },
      { en: 'Cappadocia balloon', ar: 'بالون كابادوكيا' },
      { en: 'Arabic-speaking guide', ar: 'مرشد يتحدث العربية' },
      { en: 'Fine dining reservations', ar: 'حجوزات مطاعم فاخرة' },
    ],
    highlight: true,
  },
  {
    id: 'honeymoon',
    badge: { en: 'Romantic', ar: 'رومانسي' },
    icon: '💑',
    color: '#c96090',
    price: 4200,
    duration: { en: '8 days', ar: '٨ أيام' },
    name: { en: 'Honeymoon Escape', ar: 'شهر العسل الحلم' },
    desc: {
      en: 'Crafted for newlyweds — cave hotel in Cappadocia, Sapanca lake retreat, sunset Bosphorus dinner.',
      ar: 'مصمم لحديثي الزواج — فندق كهفي، بحيرة سابانجا، وعشاء غروب البوسفور.',
    },
    includes: [
      { en: 'Cave hotel suite', ar: 'جناح فندق كهفي' },
      { en: 'Balloon flight at dawn', ar: 'رحلة بالون عند الفجر' },
      { en: 'Sapanca lake cabin', ar: 'كابينة بحيرة سابانجا' },
      { en: 'Couples spa sessions', ar: 'جلسات سبا للزوجين' },
      { en: 'Private sunset dinner', ar: 'عشاء غروب خاص' },
      { en: 'Surprise gestures', ar: 'مفاجآت رومانسية' },
    ],
    highlight: false,
  },
  {
    id: 'family',
    badge: { en: 'Family', ar: 'عائلي' },
    icon: '👨‍👩‍👧‍👦',
    color: '#4cad8c',
    price: 2800,
    duration: { en: '9 days', ar: '٩ أيام' },
    name: { en: 'Family Türkiye', ar: 'تركيا العائلية' },
    desc: {
      en: 'Fun for every generation — theme parks, Bosphorus cruise, Cappadocia, aquarium, and more.',
      ar: 'متعة لكل الأعمار — مدن ملاهي، بوسفور، كابادوكيا، أكواريوم، والمزيد.',
    },
    includes: [
      { en: 'Family suite hotel', ar: 'جناح عائلي' },
      { en: 'VIP 7-seat vehicle', ar: 'سيارة ٧ مقاعد VIP' },
      { en: 'Aquarium tickets', ar: 'تذاكر أكواريوم' },
      { en: 'Kids entertainment', ar: 'ترفيه للأطفال' },
      { en: 'Bosphorus cruise', ar: 'رحلة بوسفور' },
      { en: 'Cappadocia day trip', ar: 'رحلة يوم كابادوكيا' },
    ],
    highlight: false,
  },
];

export default function TourPackages() {
  const { language, currency } = useAppStore();
  const [selected, setSelected] = useState('vip');
  const isAr = language === 'ar';

  return (
    <section
      id="packages"
      className="relative py-24 md:py-36 overflow-hidden bg-canvas-muted bg-editorial-grid"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.9, ease: EASE_OUT }}
          className="mb-14 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-accent" />
            <span className="text-[10px] uppercase tracking-[0.38em] text-accent font-bold">
              {isAr ? 'باقاتنا' : 'Our Packages'}
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-accent" />
          </div>
          <h2
            className="text-[clamp(28px,4vw,54px)] font-light text-white mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-display, serif)' }}
          >
            {isAr ? 'باقات' : 'Travel'}{' '}
            <span className="text-gradient-gold">{isAr ? 'السفر' : 'Packages'}</span>
          </h2>
          <p className="text-white/48 text-base max-w-lg mx-auto leading-relaxed">
            {isAr
              ? 'لكل مسافر باقة مثالية — من الرحلات الكلاسيكية حتى تجارب VIP الحصرية.'
              : 'For every traveler a perfect package — from classic tours to exclusive VIP experiences.'}
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
        >
          {packages.map((pkg) => {
            const isActive = selected === pkg.id;
            return (
              <motion.div
                key={pkg.id}
                variants={staggerItem}
                onClick={() => setSelected(pkg.id)}
                className="relative rounded-2xl p-6 border cursor-pointer transition-all duration-500 flex flex-col"
                style={{
                  background: isActive
                    ? `radial-gradient(ellipse at 50% 0%, ${pkg.color}18 0%, rgba(2,18,45,0.9) 70%)`
                    : 'rgba(255,255,255,0.03)',
                  borderColor: isActive ? `${pkg.color}50` : 'rgba(255,255,255,0.07)',
                  boxShadow: isActive ? `0 0 40px ${pkg.color}18` : 'none',
                  transform: isActive && pkg.highlight ? 'scale(1.02)' : 'scale(1)',
                }}
                whileHover={{ y: -6, transition: { duration: 0.32, ease: EASE_OUT } }}
              >
                {/* Top glow line */}
                <div
                  className="absolute top-0 left-0 right-0 h-px rounded-t-2xl transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(to right, transparent, ${pkg.color}70, transparent)`,
                    opacity: isActive ? 1 : 0,
                  }}
                />

                {/* Badge */}
                <span
                  className="self-start text-[9px] font-bold uppercase tracking-[0.22em] px-2.5 py-1 rounded-full mb-5"
                  style={{
                    background: `${pkg.color}18`,
                    color: pkg.color,
                    border: `1px solid ${pkg.color}35`,
                  }}
                >
                  {pkg.badge[language]}
                </span>

                {/* Icon + name */}
                <div className="text-3xl mb-3">{pkg.icon}</div>
                <h3
                  className="text-lg font-semibold text-white mb-1"
                  style={{ fontFamily: 'var(--font-display, serif)' }}
                >
                  {pkg.name[language]}
                </h3>
                <p className="text-[10px] uppercase tracking-[0.2em] mb-3" style={{ color: pkg.color }}>
                  {pkg.duration[language]}
                </p>
                <p className="text-xs text-white/45 leading-relaxed mb-5 flex-1">{pkg.desc[language]}</p>

                {/* Includes */}
                <ul className="space-y-2 mb-6">
                  {pkg.includes.map((item) => (
                    <li key={item.en} className="flex items-start gap-2 text-xs text-white/55">
                      <span className="mt-0.5 w-3.5 h-3.5 rounded-full flex-shrink-0 flex items-center justify-center text-[8px]"
                        style={{ background: `${pkg.color}25`, color: pkg.color }}>✓</span>
                      {item[language]}
                    </li>
                  ))}
                </ul>

                {/* Price + CTA */}
                <div className="mt-auto">
                  <p className="text-[10px] text-white/38 mb-0.5">{isAr ? 'يبدأ من' : 'Starting from'}</p>
                  <p
                    className="text-2xl font-semibold mb-4"
                    style={{ fontFamily: 'var(--font-display, serif)', color: pkg.color }}
                  >
                    {formatPrice(pkg.price, currency)}
                  </p>
                  <a
                    href="https://wa.me/905300000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase text-center transition-all duration-300"
                    style={isActive
                      ? { background: `linear-gradient(135deg, ${pkg.color}dd, ${pkg.color}88)`, color: '#02122d' }
                      : { border: `1px solid ${pkg.color}40`, color: pkg.color }
                    }
                  >
                    {isAr ? 'احجز الآن' : 'Book Now'}
                  </a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-center text-xs text-white/30 mt-8"
        >
          {isAr
            ? '* الأسعار للشخص الواحد بناءً على غرفة مزدوجة. تُحسب الرحلات الجوية بشكل منفصل.'
            : '* Prices per person based on double occupancy. Flights calculated separately.'}
        </motion.p>
      </div>
    </section>
  );
}
