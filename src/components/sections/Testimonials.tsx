'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useTranslations } from '@/hooks/useTranslations';
import { viewportOnce, EASE_OUT } from '@/lib/motion';

const testimonials = [
  {
    name: 'Khalid Al-Rashidi',
    country: { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية', tr: 'Suudi Arabistan' },
    flag: '🇸🇦',
    role: { en: 'Businessman', ar: 'رجل أعمال', tr: 'İş insanı' },
    rating: 5,
    text: {
      en: 'PoliTrip turned what I thought would be a standard trip to Istanbul into an unforgettable VIP adventure. The private driver, the rooftop dinner, the Bosphorus yacht — all flawless. Will be back every year.',
      ar: 'حوّل PoliTrip ما ظننته رحلة عادية إلى إسطنبول إلى مغامرة VIP لا تُنسى. السائق الخاص، العشاء على السطح، يخت البوسفور — كل شيء كان مثالياً. سأعود كل عام.',
      tr: 'PoliTrip, İstanbul\'u sıradan bir seyahat sanırken beni unutulmaz bir VIP macerasına dönüştürdü. Özel şoför, teras akşam yemeği, Boğaz yatı — kusursuzdu. Her yıl tekrar geleceğim.',
    },
    trip: { en: 'VIP Istanbul', ar: 'إسطنبول VIP', tr: 'VIP İstanbul' },
    date: { en: 'March 2025', ar: 'مارس ٢٠٢٥', tr: 'Mart 2025' },
  },
  {
    name: 'Maryam Al-Zaabi',
    country: { en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة', tr: 'Birleşik Arap Emirlikleri' },
    flag: '🇦🇪',
    role: { en: 'Travel Enthusiast', ar: 'عاشقة السفر', tr: 'Seyahat tutkunu' },
    rating: 5,
    text: {
      en: 'My honeymoon in Cappadocia and Sapanca was a dream come true. The cave hotel, the balloon at sunrise, the lakeside cabin — every moment felt magical. PoliTrip understood exactly what we wanted.',
      ar: 'كان شهر عسلي في كابادوكيا وسابانجا حلماً تحقق. الفندق الكهفي، البالون عند الشروق، الكابينة على البحيرة — كل لحظة كانت سحرية. فهم PoliTrip تماماً ما أردناه.',
      tr: 'Kapadokya ve Sapanca\'daki balayı hayalimizin ötesindeydi. Mağara otel, gün doğumunda balon, göl kenarı kulübe — her an büyülüydü. PoliTrip tam olarak ne istediğimizi anladı.',
    },
    trip: { en: 'Honeymoon Package', ar: 'باقة شهر العسل', tr: 'Balayı paketi' },
    date: { en: 'January 2025', ar: 'يناير ٢٠٢٥', tr: 'Ocak 2025' },
  },
  {
    name: 'Mohammed Al-Dosari',
    country: { en: 'Qatar', ar: 'قطر', tr: 'Katar' },
    flag: '🇶🇦',
    role: { en: 'Family Traveler', ar: 'مسافر عائلي', tr: 'Aile gezgini' },
    rating: 5,
    text: {
      en: "Traveling with 4 kids can be challenging, but PoliTrip handled everything seamlessly. The VIP van, the aquarium, the kids' entertainment — my children still talk about this trip. Exceptional service.",
      ar: 'السفر مع ٤ أطفال يمكن أن يكون صعباً، لكن PoliTrip تعامل مع كل شيء بسلاسة. الحافلة الفاخرة، الأكواريوم، الترفيه للأطفال — أطفالي لا يزالون يتحدثون عن هذه الرحلة.',
      tr: '4 çocukla seyahat zor olabilir ama PoliTrip her şeyi sorunsuz halletti. VIP minibüs, akvaryum, çocuk eğlencesi — çocuklarım hâlâ bu geziden bahsediyor. Olağanüstü hizmet.',
    },
    trip: { en: 'Family Package', ar: 'الباقة العائلية', tr: 'Aile paketi' },
    date: { en: 'April 2025', ar: 'أبريل ٢٠٢٥', tr: 'Nisan 2025' },
  },
  {
    name: 'Fatima Al-Mutairi',
    country: { en: 'Kuwait', ar: 'الكويت', tr: 'Kuveyt' },
    flag: '🇰🇼',
    role: { en: 'Luxury Traveler', ar: 'مسافرة فاخرة', tr: 'Lüks seyahatsever' },
    rating: 5,
    text: {
      en: 'The attention to detail was extraordinary. Our Arabic-speaking guide knew every hidden gem in Istanbul. The helicopter transfer over the Bosphorus was absolutely breathtaking. PoliTrip is simply the best.',
      ar: 'الاهتمام بالتفاصيل كان استثنائياً. مرشدنا العربي كان يعرف كل كنز خفي في إسطنبول. الانتقال بالهليكوبتر فوق البوسفور كان خلاباً. PoliTrip هو الأفضل ببساطة.',
      tr: 'Detaylara özen olağanüstüydü. Arapça konuşan rehberimiz İstanbul\'daki her gizli hazneyi biliyordu. Boğaz üzerinde helikopter transferi nefes kesiciydi. PoliTrip tartışmasız en iyisi.',
    },
    trip: { en: 'VIP Türkiye 7-Day', ar: 'تركيا VIP ٧ أيام', tr: 'VIP Türkiye 7 gün' },
    date: { en: 'February 2025', ar: 'فبراير ٢٠٢٥', tr: 'Şubat 2025' },
  },
  {
    name: 'Sultan Al-Busaidi',
    country: { en: 'Oman', ar: 'سلطنة عُمان', tr: 'Umman' },
    flag: '🇴🇲',
    role: { en: 'Adventure Traveler', ar: 'مسافر المغامرة', tr: 'Maceraperest' },
    rating: 5,
    text: {
      en: "Istanbul, Trabzon, and Cappadocia in 10 days — PoliTrip made it feel effortless. The Black Sea mountains, Sumela Monastery, and the sunrise balloon are forever in my memory. Absolutely outstanding.",
      ar: 'إسطنبول وطرابزون وكابادوكيا في ١٠ أيام — جعلها PoliTrip تبدو سهلة. جبال البحر الأسود ودير سوميلا وبالون الشروق ستبقى في ذاكرتي للأبد.',
      tr: '10 günde İstanbul, Trabzon ve Kapadokya — PoliTrip her şeyi zahmetsiz hissettirdi. Karadeniz dağları, Sumela Manastırı ve gün doğumu balonu hafızamda kaldı. Kesinlikle eşsiz.',
    },
    trip: { en: 'Classic Türkiye', ar: 'تركيا الكلاسيكية', tr: 'Klasik Türkiye' },
    date: { en: 'May 2025', ar: 'مايو ٢٠٢٥', tr: 'Mayıs 2025' },
  },
];

const NOISE_PATTERN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

function ProgressBar({ current, total }: { current: number; total: number }) {
  const raw = current / Math.max(total - 1, 1);
  const spring = useSpring(raw, { stiffness: 120, damping: 24 });
  const width = useTransform(spring, (v) => `${v * 100}%`);

  useEffect(() => {
    spring.set(raw);
  }, [raw, spring]);

  return (
    <div className="relative h-px w-32 bg-white/12 rounded-full overflow-hidden">
      <motion.div className="absolute inset-y-0 left-0 bg-accent rounded-full" style={{ width }} />
    </div>
  );
}

export default function Testimonials() {
  const { language } = useAppStore();
  const { t, isRTL } = useTranslations();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  const row = testimonials[current];
  const counterLabel = `${String(current + 1).padStart(2, '0')} / ${String(testimonials.length).padStart(2, '0')}`;

  return (
    <section
      className="relative py-24 md:py-36 overflow-hidden bg-canvas"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Noise grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.028]"
        style={{ backgroundImage: NOISE_PATTERN, backgroundRepeat: 'repeat', backgroundSize: '200px 200px' }}
        aria-hidden
      />

      <div className="relative max-w-5xl mx-auto px-5 sm:px-8">
        {/* Section header */}
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
              {t('testimonials.kicker')}
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-accent" />
          </div>
          <h2
            className="text-[clamp(28px,4vw,54px)] font-light text-white mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.025em' }}
          >
            {t('testimonials.titleWhat')}{' '}
            <span className="text-gradient-gold">{t('testimonials.titleGold')}</span>
          </h2>
        </motion.div>

        {/* Quote area — flat, no card box */}
        <div className="relative min-h-[320px] flex items-start">
          {/* Oversized decorative quote mark */}
          <div
            className="select-none pointer-events-none absolute -top-6 left-0 text-[180px] md:text-[220px] leading-none z-0"
            style={{
              fontFamily: 'var(--font-display, serif)',
              color: 'rgba(34,211,238,0.07)',
              lineHeight: 1,
            }}
            aria-hidden
          >
            {'"'}
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: direction * -60, filter: 'blur(4px)' }}
              transition={{ duration: 0.58, ease: EASE_OUT }}
              className="relative z-10 w-full pt-16 md:pt-20"
            >
              {/* Quote text */}
              <p
                className="text-white/80 text-xl md:text-2xl leading-[1.85] mb-10"
                style={{ fontFamily: 'var(--font-display, serif)' }}
              >
                {row.text[language]}
              </p>

              {/* Guest row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                {/* Identity */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{row.flag}</span>
                  <div>
                    <p className="font-semibold text-white text-sm leading-tight">{row.name}</p>
                    <p className="text-[11px] text-white/40">{row.country[language]} · {row.role[language]}</p>
                  </div>
                </div>

                {/* Vertical rule */}
                <div className="hidden sm:block w-px h-8 bg-white/15 flex-shrink-0" />

                {/* Trip + stars */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.22em] px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(34,211,238,0.10)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.22)' }}
                  >
                    {row.trip[language]}
                  </span>
                  <span className="text-xs text-white/25">{row.date[language]}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: row.rating }).map((_, i) => (
                      <svg key={i} className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation — counter + progress bar + arrows */}
        <div className="flex items-center gap-5 mt-12">
          <button
            type="button"
            onClick={prev}
            className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-accent hover:border-accent/35 transition-all text-sm"
            aria-label="Previous"
          >
            {isRTL ? '→' : '←'}
          </button>

          <span className="text-[10px] tracking-[0.3em] text-white/30 tabular-nums">
            {counterLabel}
          </span>

          <ProgressBar current={current} total={testimonials.length} />

          <button
            type="button"
            onClick={next}
            className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-accent hover:border-accent/35 transition-all text-sm"
            aria-label="Next"
          >
            {isRTL ? '←' : '→'}
          </button>
        </div>
      </div>
    </section>
  );
}
