'use client';

import { use, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { motion, AnimatePresence } from 'framer-motion';
import LenisProvider from '@/components/providers/LenisProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useTranslations } from '@/hooks/useTranslations';
import { EASE_OUT, EASE_EXPO_OUT, viewportOnce } from '@/lib/motion';
import type { Language } from '@/types';

const CATEGORY_STYLES: Record<string, { color: string; label: Record<Language, string> }> = {
  'ultra-luxury': { color: '#fcd34d', label: { en: 'Ultra Luxury', ar: 'فاخر جداً', tr: 'Ultra Lüks' } },
  luxury:         { color: '#fcd34d', label: { en: 'Luxury',       ar: 'فاخر',      tr: 'Lüks' } },
  boutique:       { color: '#c4b5fd', label: { en: 'Boutique',     ar: 'بوتيك',     tr: 'Butik' } },
  resort:         { color: '#6ee7b7', label: { en: 'Resort',       ar: 'منتجع',     tr: 'Resort' } },
};

const CITY_META: Record<string, {
  tagline: Record<Language, string>;
  description: Record<Language, string>;
  accentColor: string;
  region: Record<Language, string>;
}> = {
  istanbul: {
    accentColor: '#f59e0b',
    region:      { en: 'Marmara Region',    ar: 'منطقة مرمرة',    tr: 'Marmara Bölgesi' },
    tagline:     { en: 'The Heart of Two Worlds', ar: 'قلب العالمين', tr: 'İki Dünyanın Kalbi' },
    description: {
      en: 'Where East meets West across the Bosphorus — a city of Byzantine grandeur, Ottoman splendour, and electrifying modern energy.',
      ar: 'حيث يلتقي الشرق بالغرب عبر مضيق البوسفور — مدينة تجمع الروعة البيزنطية والعظمة العثمانية والطاقة العصرية.',
      tr: "Boğaz'ın iki yakasında Doğu ile Batı'nın buluştuğu şehir — Bizans ihtişamı, Osmanlı görkemi ve çarpıcı modern enerjisi.",
    },
  },
  antalya: {
    accentColor: '#34d399',
    region:      { en: 'Mediterranean Coast', ar: 'الساحل المتوسط',   tr: 'Akdeniz Kıyısı' },
    tagline:     { en: 'The Turquoise Coast', ar: 'الساحل الفيروزي', tr: 'Turkuaz Kıyı' },
    description: {
      en: 'Dramatic limestone cliffs plunge into crystalline Mediterranean waters, framing ancient Roman ruins and world-class beach resorts.',
      ar: 'جروف جيرية درامية تنحدر إلى المياه الزرقاء الصافية، تُطوّق آثاراً رومانية وعقارات شاطئية عالمية المستوى.',
      tr: 'Dramatik kireçtaşı kayalıklar kristal Akdeniz sularına iniyor — antik Roma kalıntıları ve dünya standartlarında plaj tatil köyleri.',
    },
  },
  cappadocia: {
    accentColor: '#fb923c',
    region:      { en: 'Central Anatolia',    ar: 'وسط الأناضول',    tr: 'İç Anadolu' },
    tagline:     { en: 'Valleys of Stone & Sky', ar: 'وديان الحجر والسماء', tr: 'Taş ve Gökyüzü Vadileri' },
    description: {
      en: 'A lunar landscape of fairy chimneys, cave hotels, and hot-air balloons drifting above rose-tinted valleys at dawn.',
      ar: 'مشهد قمري من المداخن الساحرة وفنادق الكهوف والمناطيد الطائرة فوق الوديان الوردية عند الفجر.',
      tr: 'Peri bacaları, mağara oteller ve şafakta gül tonlu vadilerin üzerinde süzülen sıcak hava balonları.',
    },
  },
  trabzon: {
    accentColor: '#4ade80',
    region:      { en: 'Black Sea Region', ar: 'منطقة البحر الأسود', tr: 'Karadeniz Bölgesi' },
    tagline:     { en: 'The Black Sea Pearl', ar: 'لؤلؤة البحر الأسود', tr: "Karadeniz'in İncisi" },
    description: {
      en: 'Lush green mountains tumble toward the sea. Ancient monasteries cling to cliffsides above valleys thick with hazelnut orchards.',
      ar: 'جبال خضراء مورقة تنحدر نحو البحر. أديرة قديمة تتشبث بالجروف فوق وديان عامرة ببساتين البندق.',
      tr: 'Yemyeşil dağlar denize doğru uzanır. Antik manastırlar, fındık bahçeleriyle kaplı vadilerin üzerindeki kayalıklara tutunur.',
    },
  },
  bodrum: {
    accentColor: '#818cf8',
    region:      { en: 'Aegean Coast',      ar: 'الساحل الأيوني',   tr: 'Ege Kıyısı' },
    tagline:     { en: 'The Aegean Riviera', ar: 'ريفييرا بحر إيجه', tr: 'Ege Rivierası' },
    description: {
      en: 'Whitewashed villas, superyacht marinas, and vibrant nightlife orbit the ancient Castle of St Peter on the turquoise Aegean.',
      ar: 'فيلات مطلية بالجير ومراسٍ لليخوت الفاخرة وحياة ليلية نابضة حول قلعة القديس بطرس العتيقة على إيجه الفيروزية.',
      tr: "Badanalı villalar, süperyat marinaları ve canlı gece hayatı, turkuaz Ege'deki antik Aziz Petrus Kalesi'nin etrafında.",
    },
  },
  bursa: {
    accentColor: '#a3e635',
    region:      { en: 'Marmara Region',  ar: 'منطقة مرمرة',  tr: 'Marmara Bölgesi' },
    tagline:     { en: 'The Green City', ar: 'المدينة الخضراء', tr: 'Yeşil Şehir' },
    description: {
      en: "Turkey's first Ottoman capital cradles thermal spas, snow-capped Uludağ, and a magnificent silk bazaar beneath centuries-old mosques.",
      ar: 'أولى عواصم الدولة العثمانية تحتضن حمامات حرارية وجبل أولوداغ الثلجي وبازار الحرير الرائع تحت مساجد تاريخية.',
      tr: "Türkiye'nin ilk Osmanlı başkenti; termal kaplıcalar, karlı Uludağ ve yüzyıllık camilerin altındaki muhteşem ipek çarşısı.",
    },
  },
  sapanca: {
    accentColor: '#2dd4bf',
    region:      { en: 'Marmara Region', ar: 'منطقة مرمرة',  tr: 'Marmara Bölgesi' },
    tagline:     { en: "Nature's Escape", ar: 'ملاذ الطبيعة', tr: 'Doğanın Sığınağı' },
    description: {
      en: 'A serene lake ringed by forested hills offers the perfect retreat — thermal springs, farm-to-table cuisine, and mountain air.',
      ar: 'بحيرة هادئة تحيط بها تلال مشجرة تقدم المنتجع المثالي — ينابيع حرارية ومطبخ طازج وهواء جبلي نقي.',
      tr: 'Ormanlık tepelerle çevrili sakin bir göl, mükemmel bir kaçış sunar — termal kaynaklar, çiftlikten sofraya mutfak ve dağ havası.',
    },
  },
};

function StarRow({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: Math.min(count, 5) }, (_, i) => (
        <svg key={i} width="10" height="10" viewBox="0 0 10 10" fill="#fbbf24">
          <path d="M5 0l1.12 3.44H9.76L6.82 5.57l1.12 3.44L5 7l-2.94 2.01L3.18 5.57.24 3.44H3.88z" />
        </svg>
      ))}
    </span>
  );
}

type HotelDoc = {
  _id: string;
  name_en: string; name_ar: string; name_tr: string;
  city: string; stars: number; price: number; category: string;
  images: string[]; amenities: string[]; isVIP: boolean; rating: number;
  description_en?: string; description_ar?: string; description_tr?: string;
};

function HotelModal({ hotel, lang, isRTL, t, onClose }: {
  hotel: HotelDoc; lang: Language; isRTL: boolean;
  t: (key: import('@/lib/i18n').TranslationKey) => string;
  onClose: () => void;
}) {
  const name = lang === 'ar' ? hotel.name_ar : lang === 'tr' ? hotel.name_tr : hotel.name_en;
  const desc = lang === 'ar' ? hotel.description_ar : lang === 'tr' ? hotel.description_tr : hotel.description_en;
  const [imgIdx, setImgIdx] = useState(0);
  const images = hotel.images.filter(Boolean);
  const cat = CATEGORY_STYLES[hotel.category] ?? { color: '#94a3b8', label: { en: hotel.category, ar: hotel.category, tr: hotel.category } };

  const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }, [onClose]);
  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };
  }, [handleKey]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-canvas-muted border border-edge shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <button onClick={onClose} className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-ink/10 hover:bg-ink/20 flex items-center justify-center text-ink/60 hover:text-ink transition-all duration-200">✕</button>

          {/* Image gallery */}
          <div className="relative aspect-[16/9] overflow-hidden rounded-t-3xl bg-ink/5">
            {images.length > 0 ? (
              <>
                <img src={images[imgIdx]} alt={name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300" />
                {images.length > 1 && (
                  <>
                    <button onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-all">‹</button>
                    <button onClick={() => setImgIdx((i) => (i + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-all">›</button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => <button key={i} onClick={() => setImgIdx(i)} className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-white' : 'bg-white/30'}`} />)}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-ink/10 text-6xl">🏨</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            {hotel.isVIP && <span className="absolute top-4 left-4 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-amber-500/90 text-black">{t('hotels.vip')}</span>}
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] font-bold tracking-[0.3em] uppercase px-2.5 py-1 rounded-full" style={{ color: cat.color, background: `${cat.color}18`, border: `1px solid ${cat.color}35` }}>{cat.label[lang]}</span>
              </div>
              <h2 className="text-ink text-2xl sm:text-3xl font-light leading-tight mb-2" style={{ fontFamily: isRTL ? 'var(--font-arabic), sans-serif' : 'var(--font-display, serif)', letterSpacing: '-0.02em' }}>{name}</h2>
              <div className="flex items-center gap-3">
                <StarRow count={hotel.stars} />
                <span className="text-ink/40 text-xs uppercase tracking-widest">{hotel.city}</span>
                {hotel.rating > 0 && <span className="text-ink/40 text-xs">· {hotel.rating.toFixed(1)} ★</span>}
              </div>
            </div>
            {desc && <p className="text-ink/60 text-sm leading-[1.8]">{desc}</p>}
            {hotel.amenities.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-ink/30 mb-2.5">{isRTL ? 'المرافق' : lang === 'tr' ? 'Olanaklar' : 'Amenities'}</p>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.map((a) => <span key={a} className="text-[11px] text-ink/50 border border-ink/10 px-3 py-1.5 rounded-full">{a}</span>)}
                </div>
              </div>
            )}
            <a
              href={`https://wa.me/905300709555?text=${encodeURIComponent(`Hi PoliTrip, I'm interested in ${name}. Can you help me book?`)}`}
              target="_blank" rel="noopener noreferrer"
              className="mt-2 w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-[11px] font-bold tracking-[0.22em] uppercase bg-gradient-to-br from-accent-light via-accent to-accent-dark text-on-accent hover:scale-[1.02] hover:brightness-110 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              {t('hotels.book')}
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function HotelCard({
  hotel, lang, index, isRTL, t, onClick,
}: {
  hotel: HotelDoc;
  lang: Language;
  index: number;
  isRTL: boolean;
  t: (key: import('@/lib/i18n').TranslationKey) => string;
  onClick: () => void;
}) {
  const name = lang === 'ar' ? hotel.name_ar : lang === 'tr' ? hotel.name_tr : hotel.name_en;
  const image = hotel.images[0];
  const cat = CATEGORY_STYLES[hotel.category] ?? {
    color: '#94a3b8',
    label: { en: hotel.category, ar: hotel.category, tr: hotel.category },
  };
  const reserve  = t('hotels.book');

  return (
    <motion.article
      onClick={onClick}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.8, ease: EASE_EXPO_OUT, delay: (index % 3) * 0.09 }}
      className="group relative rounded-2xl overflow-hidden border border-ink/10 bg-ink/5 flex flex-col hover:border-accent/40 transition-colors duration-500 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
            style={{ willChange: 'transform' }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink/5">
            <span className="text-4xl mb-2 opacity-30">🏨</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span
            className="text-[9px] font-bold tracking-[0.3em] uppercase px-2.5 py-1 rounded-full backdrop-blur-sm"
            style={{ color: cat.color, background: `${cat.color}18`, border: `1px solid ${cat.color}35` }}
          >
            {cat.label[lang]}
          </span>
          {hotel.isVIP && (
            <span className="text-[9px] font-black tracking-[0.3em] uppercase px-2.5 py-1 rounded-full bg-amber-500/90 text-black shadow-[0_0_14px_rgba(245,158,11,0.45)]">
              VIP
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-4">
          <StarRow count={hotel.stars} />
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className={`text-ink text-xl font-light mb-3 group-hover:text-accent transition-colors duration-300 ${isRTL ? 'leading-[1.4]' : 'leading-snug'}`}
          style={isRTL
            ? { fontFamily: 'var(--font-arabic), sans-serif' }
            : { fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.02em' }}
        >
          {name}
        </h3>

        {hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {hotel.amenities.slice(0, 4).map((a) => (
              <span key={a} className="text-[9px] text-ink/35 border border-ink/10 px-2.5 py-1 rounded-full">
                {a}
              </span>
            ))}
            {hotel.amenities.length > 4 && (
              <span className="text-[9px] text-ink/20 self-center">+{hotel.amenities.length - 4}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-end mt-auto pt-4 border-t border-ink/10">
          <a
            href="https://wa.me/905300709555"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-5 py-2.5 rounded-full text-[10px] font-bold tracking-[0.22em] uppercase bg-gradient-to-br from-accent-light via-accent to-accent-dark text-on-accent hover:scale-105 hover:brightness-110 transition-all duration-200"
          >
            {reserve}
          </a>
        </div>
      </div>
    </motion.article>
  );
}


export default function CityHotelsPage({ params }: { params: Promise<{ lang: string; city: string }> }) {
  const { lang, city } = use(params);
  const language = lang as Language;
  const hotels = useQuery(api.hotels.getByCity, { city });
  const { isRTL, t } = useTranslations();
  const [selectedHotel, setSelectedHotel] = useState<HotelDoc | null>(null);

  const cityLabel = city.charAt(0).toUpperCase() + city.slice(1);
  const cityMeta = CITY_META[city.toLowerCase()] ?? {
    accentColor: '#f59e0b',
    region:      { en: 'Türkiye', ar: 'تركيا', tr: 'Türkiye' },
    tagline:     { en: 'Discover the city', ar: 'اكتشف المدينة', tr: 'Şehri keşfet' },
    description: {
      en: 'Explore our handpicked selection of luxury hotels in this destination.',
      ar: 'استكشف مجموعتنا المنتقاة من الفنادق الفاخرة في هذه الوجهة.',
      tr: 'Bu destinasyondaki özenle seçilmiş lüks otellerimizi keşfedin.',
    },
  };

  const allDest    = t('destinations.allDestinations');
  const propCount  = hotels === undefined
    ? t('city.loading')
    : hotels.length === 0
    ? t('city.noHotels')
    : `${hotels.length} ${hotels.length === 1 ? t('city.propProperty') : t('city.propProperties')} ${t('city.propAvailable')}`;

  const ctaLabel   = t('city.ctaLabel');
  const allHotels  = t('city.allHotels');
  const helpTitle  = t('city.helpTitle');
  const helpSub    = t('city.helpSub');
  const comingSoon = t('city.comingSoon');
  const comingBody = `${t('city.comingBodyPre')} ${cityLabel}${t('city.comingBodyPost')}`;
  const whatsappUs = t('city.whatsappUs');

  return (
    <LenisProvider>
      {selectedHotel && (
        <HotelModal hotel={selectedHotel} lang={language} isRTL={isRTL} t={t} onClose={() => setSelectedHotel(null)} />
      )}
      <Navbar />
      <main className="relative flex min-h-0 flex-1 flex-col bg-canvas" dir={isRTL ? 'rtl' : 'ltr'}>

        {/* ── Hero ── */}
        <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28 px-6 sm:px-10 lg:px-20">
          <div
            className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none"
            style={{ background: `radial-gradient(ellipse 70% 55% at 50% 0%, ${cityMeta.accentColor}10 0%, transparent 65%)` }}
            aria-hidden
          />
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: `linear-gradient(to right, transparent, ${cityMeta.accentColor}45, transparent)` }}
            aria-hidden
          />

          <div className="relative z-10 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE_OUT }}>
              <Link
                href={`/${lang}#destinations`}
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-ink/30 hover:text-ink/60 transition-colors mb-10"
              >
                <span>{isRTL ? '→' : '←'}</span>
                <span>{allDest}</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isRTL ? 14 : -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.05 }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="h-px w-10" style={{ background: `linear-gradient(to right, transparent, ${cityMeta.accentColor})` }} />
              <span className="text-[10px] uppercase tracking-[0.42em] font-bold" style={{ color: cityMeta.accentColor }}>
                {cityMeta.region[language]}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: EASE_EXPO_OUT, delay: 0.1 }}
              className="text-[clamp(52px,8vw,120px)] font-light text-ink leading-[0.92] tracking-[-0.03em] mb-4"
              style={{ fontFamily: 'var(--font-display, serif)' }}
            >
              {cityLabel}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE_EXPO_OUT, delay: 0.2 }}
              className={`font-light mb-2 max-w-xl ${isRTL ? 'text-[clamp(14px,1.6vw,18px)]' : 'text-[clamp(15px,1.8vw,20px)]'}`}
              style={{ color: cityMeta.accentColor, fontFamily: isRTL ? 'var(--font-arabic), sans-serif' : undefined }}
            >
              {cityMeta.tagline[language]}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE_EXPO_OUT, delay: 0.28 }}
              className="text-ink/45 text-base lg:text-lg max-w-2xl leading-[1.8] mb-10"
            >
              {cityMeta.description[language]}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE_EXPO_OUT, delay: 0.35 }}
              className="inline-flex items-center gap-3"
            >
              <span
                className="px-4 py-2 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase border"
                style={{ color: cityMeta.accentColor, borderColor: `${cityMeta.accentColor}35`, background: `${cityMeta.accentColor}0d` }}
              >
                {propCount}
              </span>
            </motion.div>
          </div>
        </section>

        <div className="h-px mx-6 sm:mx-10 lg:mx-20 mb-16" style={{ background: 'linear-gradient(to right, transparent, color-mix(in srgb, var(--ink) 8%, transparent), transparent)' }} />

        {/* ── Hotel grid ── */}
        <div className="px-6 sm:px-10 lg:px-20 pb-28 lg:pb-40 max-w-7xl mx-auto w-full">
{hotels?.length === 0 && (
            <div className="text-center py-28">
              <p className="text-[64px] mb-5 opacity-20">🏨</p>
              <p className="text-2xl font-light mb-3" style={{ fontFamily: 'var(--font-display, serif)' }}>
                {comingSoon}
              </p>
              <p className="text-ink/30 text-sm max-w-xs mx-auto leading-relaxed">{comingBody}</p>
              <a
                href="https://wa.me/905300709555"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full text-[11px] font-bold tracking-[0.22em] uppercase border border-accent/35 text-accent hover:bg-accent/10 transition-colors"
              >
                {whatsappUs}
              </a>
            </div>
          )}

          {hotels && hotels.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel, i) => (
                <HotelCard key={hotel._id} hotel={hotel} lang={language} index={i} isRTL={isRTL} t={t} onClick={() => setSelectedHotel(hotel as HotelDoc)} />
              ))}
            </div>
          )}
        </div>

        {/* ── CTA strip ── */}
        <section className="border-t border-ink/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-20 lg:py-28 flex flex-col lg:flex-row items-center justify-between gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: EASE_OUT }}
            >
              <p className="text-ink/35 text-[10px] uppercase tracking-[0.32em] mb-2">{helpSub}</p>
              <h2
                className={`font-light text-ink ${isRTL ? 'text-[clamp(20px,2.5vw,36px)] leading-[1.35]' : 'text-[clamp(26px,3vw,44px)] leading-tight tracking-[-0.02em]'}`}
                style={{ fontFamily: isRTL ? 'var(--font-arabic), sans-serif' : 'var(--font-display, serif)' }}
              >
                {helpTitle}
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.7, ease: EASE_EXPO_OUT, delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-4 shrink-0"
            >
              <a
                href="https://wa.me/905300709555"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full text-[11px] font-bold tracking-[0.28em] uppercase bg-gradient-to-br from-accent-light via-accent to-accent-dark text-on-accent transition-all duration-300 hover:scale-105 hover:brightness-110 text-center"
                style={{ boxShadow: '0 0 32px color-mix(in srgb, var(--accent) 22%, transparent)' }}
              >
                {ctaLabel}
              </a>
              <Link
                href={`/${lang}#hotels`}
                className="px-8 py-4 rounded-full text-[11px] font-bold tracking-[0.28em] uppercase text-accent border border-accent/30 hover:bg-accent/10 hover:border-accent/55 transition-all duration-300 hover:scale-105 text-center"
              >
                {allHotels}
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </LenisProvider>
  );
}
