'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { motion } from 'framer-motion';
import LenisProvider from '@/components/providers/LenisProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useTranslations } from '@/hooks/useTranslations';
import { EASE_OUT, EASE_EXPO_OUT, viewportOnce } from '@/lib/motion';
import type { Language } from '@/types';

const CATEGORY_STYLES: Record<string, { color: string; label: Record<Language, string> }> = {
  'ultra-luxury': { color: '#fcd34d', label: { en: 'Ultra Luxury', ar: 'فاخر جداً', tr: 'Ultra Lüks' } },
  luxury:         { color: '#67e8f9', label: { en: 'Luxury',       ar: 'فاخر',      tr: 'Lüks' } },
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
    accentColor: '#22d3ee',
    region:      { en: 'Marmara Region',    ar: 'منطقة مرمرة',    tr: 'Marmara Bölgesi' },
    tagline:     { en: 'The Heart of Two Worlds', ar: 'قلب العالمين', tr: 'İki Dünyanın Kalbi' },
    description: {
      en: 'Where East meets West across the Bosphorus — a city of Byzantine grandeur, Ottoman splendour, and electrifying modern energy.',
      ar: 'حيث يلتقي الشرق بالغرب عبر مضيق البوسفور — مدينة تجمع الروعة البيزنطية والعظمة العثمانية والطاقة العصرية.',
      tr: 'Boğaz'ın iki yakasında Doğu ile Batı'nın buluştuğu şehir — Bizans ihtişamı, Osmanlı görkemi ve çarpıcı modern enerjisi.',
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
    tagline:     { en: 'The Black Sea Pearl', ar: 'لؤلؤة البحر الأسود', tr: 'Karadeniz'in İncisi' },
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
      tr: 'Badanalı villalar, süperyat marinaları ve canlı gece hayatı, turkuaz Ege'deki antik Aziz Petrus Kalesi'nin etrafında.',
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

function HotelCard({
  hotel, lang, index, isRTL,
}: {
  hotel: {
    _id: string;
    name_en: string; name_ar: string; name_tr: string;
    city: string; stars: number; price: number; category: string;
    images: string[]; amenities: string[]; isVIP: boolean; rating: number;
  };
  lang: Language;
  index: number;
  isRTL: boolean;
}) {
  const name = lang === 'ar' ? hotel.name_ar : lang === 'tr' ? hotel.name_tr : hotel.name_en;
  const image = hotel.images[0];
  const cat = CATEGORY_STYLES[hotel.category] ?? {
    color: 'rgba(255,255,255,0.4)',
    label: { en: hotel.category, ar: hotel.category, tr: hotel.category },
  };
  const from     = lang === 'ar' ? 'من' : lang === 'tr' ? 'Başlangıç' : 'From';
  const perNight = lang === 'ar' ? '/ ليلة' : lang === 'tr' ? '/ gece' : '/ night';
  const reserve  = lang === 'ar' ? 'احجز الآن' : lang === 'tr' ? 'Rezervasyon' : 'Reserve';

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.8, ease: EASE_EXPO_OUT, delay: (index % 3) * 0.09 }}
      className="group relative rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.02] flex flex-col hover:border-white/[0.15] transition-colors duration-500"
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
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/[0.03]">
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
          className={`text-white text-xl font-light mb-3 group-hover:text-accent transition-colors duration-300 ${isRTL ? 'leading-[1.4]' : 'leading-snug'}`}
          style={isRTL
            ? { fontFamily: 'var(--font-arabic), sans-serif' }
            : { fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.02em' }}
        >
          {name}
        </h3>

        {hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {hotel.amenities.slice(0, 4).map((a) => (
              <span key={a} className="text-[9px] text-white/35 border border-white/[0.07] px-2.5 py-1 rounded-full">
                {a}
              </span>
            ))}
            {hotel.amenities.length > 4 && (
              <span className="text-[9px] text-white/20 self-center">+{hotel.amenities.length - 4}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.06]">
          <div>
            <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] block mb-0.5">{from}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-white text-2xl font-light">${hotel.price}</span>
              <span className="text-white/30 text-[11px]">{perNight}</span>
            </div>
          </div>
          <a
            href="https://wa.me/905300000000"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full text-[10px] font-bold tracking-[0.22em] uppercase bg-gradient-to-br from-accent-light via-accent to-accent-dark text-on-accent hover:scale-105 hover:brightness-110 transition-all duration-200"
          >
            {reserve}
          </a>
        </div>
      </div>
    </motion.article>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02]">
      <div className="aspect-[4/3] bg-white/[0.04] animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-16 bg-white/[0.04] rounded animate-pulse" />
        <div className="h-6 w-44 bg-white/[0.05] rounded animate-pulse" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-5 w-16 bg-white/[0.03] rounded-full animate-pulse" />)}
        </div>
        <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between">
          <div className="h-7 w-20 bg-white/[0.04] rounded animate-pulse" />
          <div className="h-8 w-20 bg-white/[0.04] rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function CityHotelsPage({ params }: { params: Promise<{ lang: string; city: string }> }) {
  const { lang, city } = use(params);
  const language = lang as Language;
  const hotels = useQuery(api.hotels.getByCity, { city });
  const { isRTL } = useTranslations();

  const cityLabel = city.charAt(0).toUpperCase() + city.slice(1);
  const cityMeta = CITY_META[city.toLowerCase()] ?? {
    accentColor: '#22d3ee',
    region:      { en: 'Türkiye', ar: 'تركيا', tr: 'Türkiye' },
    tagline:     { en: 'Discover the city', ar: 'اكتشف المدينة', tr: 'Şehri keşfet' },
    description: {
      en: 'Explore our handpicked selection of luxury hotels in this destination.',
      ar: 'استكشف مجموعتنا المنتقاة من الفنادق الفاخرة في هذه الوجهة.',
      tr: 'Bu destinasyondaki özenle seçilmiş lüks otellerimizi keşfedin.',
    },
  };

  const allDest    = language === 'ar' ? 'كل الوجهات'  : language === 'tr' ? 'Tüm Destinasyonlar' : 'All Destinations';
  const loadingTxt = language === 'ar' ? 'جارٍ التحميل…' : language === 'tr' ? 'Yükleniyor…'         : 'Loading hotels…';
  const noHotels   = language === 'ar' ? 'لا توجد فنادق بعد' : language === 'tr' ? 'Henüz otel yok'  : 'No hotels listed yet';
  const propCount  = hotels === undefined ? loadingTxt
    : hotels.length === 0 ? noHotels
    : language === 'ar' ? `${hotels.length} عقار متاح`
    : language === 'tr' ? `${hotels.length} tesis mevcut`
    : `${hotels.length} ${hotels.length === 1 ? 'property' : 'properties'} available`;

  const ctaLabel   = language === 'ar' ? 'تواصل مع فريقنا' : language === 'tr' ? 'Ekibimize Yazın' : 'WhatsApp Our Team';
  const allHotels  = language === 'ar' ? 'كل الفنادق'      : language === 'tr' ? 'Tüm Oteller'     : 'All Hotels';
  const helpTitle  = language === 'ar' ? 'هل تحتاج مساعدة في اختيار الفندق؟'
    : language === 'tr' ? 'Doğru oteli seçmekte yardım ister misiniz?'
    : 'Need help choosing the right hotel?';
  const helpSub    = language === 'ar' ? 'منتقى خصيصاً لك'
    : language === 'tr' ? 'Sizin için özenle seçildi'
    : 'Curated just for you';
  const comingSoon = language === 'ar' ? 'قريباً' : language === 'tr' ? 'Yakında' : 'Coming Soon';
  const comingBody = language === 'ar'
    ? `نعمل على انتقاء أفضل الفنادق في ${cityLabel}. تواصل معنا وسنختار لك المكان المثالي.`
    : language === 'tr'
    ? `${cityLabel} için otel seçimimizi tamamlıyoruz. Bize ulaşın, size mükemmel tesisi bulalım.`
    : `We are finalising our hotel selection for ${cityLabel}. Contact us and we will hand-pick the perfect property for you.`;
  const whatsappUs = language === 'ar' ? 'واتساب' : language === 'tr' ? 'WhatsApp' : 'WhatsApp Us';

  return (
    <LenisProvider>
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
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-white/30 hover:text-white/60 transition-colors mb-10"
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
              className="text-[clamp(52px,8vw,120px)] font-light text-white leading-[0.92] tracking-[-0.03em] mb-4"
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
              className="text-white/45 text-base lg:text-lg max-w-2xl leading-[1.8] mb-10"
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

        <div className="h-px mx-6 sm:mx-10 lg:mx-20 mb-16" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)' }} />

        {/* ── Hotel grid ── */}
        <div className="px-6 sm:px-10 lg:px-20 pb-28 lg:pb-40 max-w-7xl mx-auto w-full">
          {hotels === undefined && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0,1,2,3,4,5].map((i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {hotels?.length === 0 && (
            <div className="text-center py-28">
              <p className="text-[64px] mb-5 opacity-20">🏨</p>
              <p className="text-2xl font-light mb-3" style={{ fontFamily: 'var(--font-display, serif)' }}>
                {comingSoon}
              </p>
              <p className="text-white/30 text-sm max-w-xs mx-auto leading-relaxed">{comingBody}</p>
              <a
                href="https://wa.me/905300000000"
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
                <HotelCard key={hotel._id} hotel={hotel} lang={language} index={i} isRTL={isRTL} />
              ))}
            </div>
          )}
        </div>

        {/* ── CTA strip ── */}
        <section className="border-t border-white/[0.07]">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-20 lg:py-28 flex flex-col lg:flex-row items-center justify-between gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: EASE_OUT }}
            >
              <p className="text-white/35 text-[10px] uppercase tracking-[0.32em] mb-2">{helpSub}</p>
              <h2
                className={`font-light text-white ${isRTL ? 'text-[clamp(20px,2.5vw,36px)] leading-[1.35]' : 'text-[clamp(26px,3vw,44px)] leading-tight tracking-[-0.02em]'}`}
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
                href="https://wa.me/905300000000"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full text-[11px] font-bold tracking-[0.28em] uppercase text-[#02122d] transition-all duration-300 hover:scale-105 hover:brightness-110 text-center"
                style={{ background: 'linear-gradient(135deg, #67e8f9 0%, #22d3ee 50%, #0e7490 100%)', boxShadow: '0 0 32px rgba(34,211,238,0.22)' }}
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
