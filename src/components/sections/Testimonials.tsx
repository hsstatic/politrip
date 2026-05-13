'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { viewportOnce, EASE_OUT } from '@/lib/motion';

const testimonials = [
  {
    name: 'Khalid Al-Rashidi',
    country: { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' },
    flag: '🇸🇦',
    role: { en: 'Businessman', ar: 'رجل أعمال' },
    rating: 5,
    text: {
      en: 'PoliTrip turned what I thought would be a standard trip to Istanbul into an unforgettable VIP adventure. The private driver, the rooftop dinner, the Bosphorus yacht — all flawless. Will be back every year.',
      ar: 'حوّل PoliTrip ما ظننته رحلة عادية إلى إسطنبول إلى مغامرة VIP لا تُنسى. السائق الخاص، العشاء على السطح، يخت البوسفور — كل شيء كان مثالياً. سأعود كل عام.',
    },
    trip: { en: 'VIP Istanbul', ar: 'إسطنبول VIP' },
    date: { en: 'March 2025', ar: 'مارس ٢٠٢٥' },
  },
  {
    name: 'Maryam Al-Zaabi',
    country: { en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة' },
    flag: '🇦🇪',
    role: { en: 'Travel Enthusiast', ar: 'عاشقة السفر' },
    rating: 5,
    text: {
      en: 'My honeymoon in Cappadocia and Sapanca was a dream come true. The cave hotel, the balloon at sunrise, the lakeside cabin — every moment felt magical. PoliTrip understood exactly what we wanted.',
      ar: 'كان شهر عسلي في كابادوكيا وسابانجا حلماً تحقق. الفندق الكهفي، البالون عند الشروق، الكابينة على البحيرة — كل لحظة كانت سحرية. فهم PoliTrip تماماً ما أردناه.',
    },
    trip: { en: 'Honeymoon Package', ar: 'باقة شهر العسل' },
    date: { en: 'January 2025', ar: 'يناير ٢٠٢٥' },
  },
  {
    name: 'Mohammed Al-Dosari',
    country: { en: 'Qatar', ar: 'قطر' },
    flag: '🇶🇦',
    role: { en: 'Family Traveler', ar: 'مسافر عائلي' },
    rating: 5,
    text: {
      en: "Traveling with 4 kids can be challenging, but PoliTrip handled everything seamlessly. The VIP van, the aquarium, the kids' entertainment — my children still talk about this trip. Exceptional service.",
      ar: 'السفر مع ٤ أطفال يمكن أن يكون صعباً، لكن PoliTrip تعامل مع كل شيء بسلاسة. الحافلة الفاخرة، الأكواريوم، الترفيه للأطفال — أطفالي لا يزالون يتحدثون عن هذه الرحلة.',
    },
    trip: { en: 'Family Package', ar: 'الباقة العائلية' },
    date: { en: 'April 2025', ar: 'أبريل ٢٠٢٥' },
  },
  {
    name: 'Fatima Al-Mutairi',
    country: { en: 'Kuwait', ar: 'الكويت' },
    flag: '🇰🇼',
    role: { en: 'Luxury Traveler', ar: 'مسافرة فاخرة' },
    rating: 5,
    text: {
      en: 'The attention to detail was extraordinary. Our Arabic-speaking guide knew every hidden gem in Istanbul. The helicopter transfer over the Bosphorus was absolutely breathtaking. PoliTrip is simply the best.',
      ar: 'الاهتمام بالتفاصيل كان استثنائياً. مرشدنا العربي كان يعرف كل كنز خفي في إسطنبول. الانتقال بالهليكوبتر فوق البوسفور كان خلاباً. PoliTrip هو الأفضل ببساطة.',
    },
    trip: { en: 'VIP Türkiye 7-Day', ar: 'تركيا VIP ٧ أيام' },
    date: { en: 'February 2025', ar: 'فبراير ٢٠٢٥' },
  },
  {
    name: 'Sultan Al-Busaidi',
    country: { en: 'Oman', ar: 'سلطنة عُمان' },
    flag: '🇴🇲',
    role: { en: 'Adventure Traveler', ar: 'مسافر المغامرة' },
    rating: 5,
    text: {
      en: "Istanbul, Trabzon, and Cappadocia in 10 days — PoliTrip made it feel effortless. The Black Sea mountains, Sumela Monastery, and the sunrise balloon are forever in my memory. Absolutely outstanding.",
      ar: 'إسطنبول وطرابزون وكابادوكيا في ١٠ أيام — جعلها PoliTrip تبدو سهلة. جبال البحر الأسود ودير سوميلا وبالون الشروق ستبقى في ذاكرتي للأبد.',
    },
    trip: { en: 'Classic Türkiye', ar: 'تركيا الكلاسيكية' },
    date: { en: 'May 2025', ar: 'مايو ٢٠٢٥' },
  },
];

export default function Testimonials() {
  const { language } = useAppStore();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const isAr = language === 'ar';

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  }, []);

  // Auto-advance
  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  const t = testimonials[current];

  return (
    <section
      className="relative py-24 md:py-36 overflow-hidden bg-canvas"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-5 sm:px-8">
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
              {isAr ? 'قصص ضيوفنا' : 'Guest Stories'}
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-accent" />
          </div>
          <h2
            className="text-[clamp(28px,4vw,54px)] font-light text-white mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-display, serif)' }}
          >
            {isAr ? 'ماذا يقول' : 'What Our'}{' '}
            <span className="text-gradient-gold">{isAr ? 'ضيوفنا' : 'Guests Say'}</span>
          </h2>
        </motion.div>

        {/* Testimonial card */}
        <div className="relative min-h-[340px] flex items-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.55, ease: EASE_OUT }}
              className="w-full"
            >
              <div
                className="relative rounded-3xl p-8 md:p-12 border border-white/8"
                style={{
                  background: 'radial-gradient(ellipse at 30% 0%, rgba(34,211,238,0.10) 0%, rgba(2,18,45,0.92) 65%)',
                }}
              >
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent rounded-t-3xl" />

                {/* Quote mark */}
                <div
                  className="text-7xl md:text-9xl font-serif leading-none text-accent/15 absolute top-4 left-8 select-none"
                  style={{ fontFamily: 'var(--font-display, serif)' }}
                >
                  "
                </div>

                <div className="relative flex flex-col md:flex-row gap-8 md:gap-12">
                  {/* Author info */}
                  <div className="flex-shrink-0 flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-3 md:w-44">
                    {/* Avatar */}
                    <div
                      className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                      style={{ background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.25)' }}
                    >
                      {t.flag}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{t.name}</p>
                      <p className="text-[11px] text-white/45">{t.country[language]}</p>
                      <p className="text-[10px] text-accent/70 mt-0.5">{t.role[language]}</p>
                    </div>

                    {/* Stars */}
                    <div className="flex gap-0.5 md:mt-2">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="flex-1">
                    <p
                      className="text-white/75 text-base md:text-lg leading-relaxed mb-6"
                      style={{ fontFamily: 'var(--font-display, serif)' }}
                    >
                      "{t.text[language]}"
                    </p>
                    <div className="flex items-center gap-4">
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.22em] px-3 py-1.5 rounded-full"
                        style={{ background: 'rgba(34,211,238,0.12)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.30)' }}
                      >
                        {t.trip[language]}
                      </span>
                      <span className="text-xs text-white/30">{t.date[language]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-white/12 flex items-center justify-center text-white/50 hover:text-accent hover:border-accent/40 transition-all"
          >
            {isAr ? '→' : '←'}
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                className="h-1 rounded-full transition-all duration-400"
                style={{
                  width: i === current ? '24px' : '6px',
                  background: i === current ? '#22d3ee' : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-white/12 flex items-center justify-center text-white/50 hover:text-accent hover:border-accent/40 transition-all"
          >
            {isAr ? '←' : '→'}
          </button>
        </div>
      </div>
    </section>
  );
}
