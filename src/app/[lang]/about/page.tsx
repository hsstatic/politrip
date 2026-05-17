'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import LenisProvider from '@/components/providers/LenisProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useTranslations } from '@/hooks/useTranslations';
import { EASE_EXPO_OUT, EASE_OUT, viewportOnce } from '@/lib/motion';

const STATS = [
  { value: '5+',    label: { en: 'Years of Experience', tr: 'Yıllık Deneyim',      ar: 'سنوات من الخبرة' } },
  { value: '1,200+', label: { en: 'Trips Organized',   tr: 'Düzenlenen Tur',       ar: 'رحلة منظمة' } },
  { value: '98%',   label: { en: 'Client Satisfaction', tr: 'Müşteri Memnuniyeti', ar: 'رضا العملاء' } },
  { value: '12+',   label: { en: 'Destination Cities', tr: 'Destinasyon Şehri',    ar: 'مدينة وجهة' } },
];

const VALUES = [
  {
    icon: '✦',
    title: { en: 'Bespoke Experiences',  tr: 'Özel Deneyimler',          ar: 'تجارب مخصصة' },
    body: {
      en: 'Every itinerary is crafted from scratch around your preferences, travel style, and the moments that matter most to you.',
      tr: 'Her güzergah, tercihleriniz, seyahat tarzınız ve sizin için en önemli anlar etrafında sıfırdan hazırlanır.',
      ar: 'كل مسار رحلة يُصمَّم من الصفر حول تفضيلاتك وأسلوب سفرك واللحظات الأكثر أهمية بالنسبة لك.',
    },
  },
  {
    icon: '◈',
    title: { en: 'Five-Star Standards', tr: 'Beş Yıldızlı Standartlar', ar: 'معايير خمس نجوم' },
    body: {
      en: 'We partner exclusively with vetted luxury hotels, private transfer providers, and certified local guides across Türkiye.',
      tr: 'Türkiye genelinde yalnızca seçkin lüks oteller, özel transfer sağlayıcıları ve sertifikalı yerel rehberlerle çalışıyoruz.',
      ar: 'نتعاون حصراً مع فنادق فاخرة مختارة ومزودي نقل خاص ومرشدين محليين معتمدين في جميع أنحاء تركيا.',
    },
  },
  {
    icon: '❋',
    title: { en: 'End-to-End Care', tr: 'Uçtan Uca Hizmet', ar: 'رعاية شاملة' },
    body: {
      en: 'From airport pickup to farewell transfer, our concierge team is reachable 24/7 throughout your entire journey.',
      tr: 'Havalimanı karşılamasından veda transferine kadar, concierge ekibimiz tüm yolculuğunuz boyunca 7/24 ulaşılabilir.',
      ar: 'من الاستقبال في المطار إلى نقل الوداع، يكون فريق الكونسيرج لدينا متاحاً على مدار الساعة طوال رحلتك.',
    },
  },
];

function headingStyle(isRTL: boolean): React.CSSProperties {
  return isRTL
    ? { fontFamily: 'var(--font-arabic), sans-serif' }
    : { fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.02em' };
}

export default function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  use(params);
  const { language, isRTL } = useTranslations();
  const lang = language as 'en' | 'tr' | 'ar';

  return (
    <LenisProvider>
      <div className="min-h-screen bg-canvas text-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <Navbar />

        {/* ── Hero ── */}
        <section className="relative pt-40 pb-24 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34,211,238,0.05) 0%, transparent 65%)' }}
            aria-hidden
          />
          <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 lg:px-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_EXPO_OUT }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent" />
              <span className="text-[10px] uppercase tracking-[0.42em] text-accent font-bold">
                {lang === 'ar' ? 'من نحن' : lang === 'tr' ? 'Hakkımızda' : 'About Us'}
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-accent" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: EASE_EXPO_OUT, delay: 0.1 }}
              className={`font-[350] mb-6 ${isRTL ? 'text-[clamp(1.8rem,5vw,4rem)] leading-[1.25]' : 'text-[clamp(2rem,6vw,5rem)] leading-tight'}`}
              style={headingStyle(isRTL)}
            >
              {lang === 'ar'
                ? 'نصنع رحلات لا تُنسى'
                : lang === 'tr'
                ? 'Unutulmaz Yolculuklar Yaratıyoruz'
                : <>Crafting Journeys <span className="text-gradient-gold">Worth Remembering</span></>}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE_EXPO_OUT, delay: 0.2 }}
              className="text-white/55 text-lg leading-relaxed max-w-2xl mx-auto"
            >
              {lang === 'ar'
                ? 'PoliTrip وكالة سياحة فاخرة تركية مخصصة لضيوف الخليج العربي. نحول Türkiye إلى تجربة شخصية — من إسطنبول إلى كابادوكيا، من الساحل الفيروزي إلى سواحل البحر الأسود.'
                : lang === 'tr'
                ? "PoliTrip, Körfez misafirleri için özel olarak tasarlanmış bir Türk lüks turizm ajansıdır. Türkiye'yi kişisel bir deneyime dönüştürüyoruz — İstanbul'dan Kapadokya'ya, Ege kıyılarından Karadeniz'e."
                : "PoliTrip is a Turkish luxury travel agency built exclusively for Gulf guests. We transform Türkiye into a personal experience — from Istanbul to Cappadocia, the Aegean coast to the Black Sea."}
            </motion.p>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="py-16 border-y border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.value}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.7, ease: EASE_OUT, delay: i * 0.08 }}
                  className="text-center"
                >
                  <p
                    className="text-[clamp(2rem,4vw,3.5rem)] font-[350] text-gradient-gold leading-none mb-2"
                    style={{ fontFamily: 'var(--font-display, serif)' }}
                  >
                    {s.value}
                  </p>
                  <p className="text-white/45 text-[12px] uppercase tracking-[0.22em]">{s.label[lang]}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Story ── */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-20">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.9, ease: EASE_EXPO_OUT }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-10 bg-gradient-to-r from-transparent to-accent" />
                  <span className="text-[10px] uppercase tracking-[0.38em] text-accent font-bold">
                    {lang === 'ar' ? 'قصتنا' : lang === 'tr' ? 'Hikayemiz' : 'Our Story'}
                  </span>
                </div>
                <h2
                  className={`font-[350] text-white mb-6 ${isRTL ? 'text-[clamp(1.4rem,2.5vw,2.4rem)] leading-[1.3]' : 'text-[clamp(1.6rem,3vw,2.8rem)] leading-tight'}`}
                  style={headingStyle(isRTL)}
                >
                  {lang === 'ar'
                    ? 'ولدنا من شغف السفر'
                    : lang === 'tr'
                    ? 'Seyahat Tutkusundan Doğduk'
                    : 'Born from a passion for travel'}
                </h2>
                <div className="space-y-4 text-white/55 text-[15px] leading-relaxed">
                  {lang === 'ar' ? (
                    <>
                      <p>أُسس PoliTrip بهدف واحد: تقديم Türkiye بشكل صحيح للضيوف العرب. ليس مجرد مواقع سياحية، بل لحظات حقيقية مصممة بعناية مع أشخاص يعرفون البلد ويتحدثون لغتك.</p>
                      <p>فريقنا من المحترفين السياحيين المحليين يعيشون في المدن التي نخدمها — مما يضمن أن كل توصية، كل فندق، وكل تجربة تأتي من معرفة حقيقية وليس من كتالوج.</p>
                    </>
                  ) : lang === 'tr' ? (
                    <>
                      <p>PoliTrip, tek bir amaçla kuruldu: Türkiye&apos;yi Körfez misafirlerine doğru şekilde sunmak. Sadece turistik yerler değil, ülkeyi bilen ve dilinizi konuşan insanlarla özenle tasarlanmış gerçek anlar.</p>
                      <p>Yerel turizm profesyonellerinden oluşan ekibimiz, hizmet verdiğimiz şehirlerde yaşıyor — her tavsiyenin, her otelin ve her deneyimin bir katalogdan değil, gerçek bilgiden geldiğini garanti ediyor.</p>
                    </>
                  ) : (
                    <>
                      <p>PoliTrip was founded with a single purpose: to present Türkiye properly to Gulf guests. Not just tourist sites, but real moments crafted carefully with people who know the country and speak your language.</p>
                      <p>Our team of local tourism professionals live in the cities we serve — ensuring every recommendation, every hotel, and every experience comes from genuine knowledge, not a catalogue.</p>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Decorative panel */}
              <motion.div
                initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.9, ease: EASE_EXPO_OUT, delay: 0.1 }}
                className="cinema-panel cinema-panel--accent p-10 rounded-2xl"
              >
                <div className="space-y-6">
                  {['Istanbul', 'Cappadocia', 'Antalya', 'Trabzon'].map((city, i) => (
                    <div key={city} className="flex items-center gap-4">
                      <span className="text-[10px] font-mono text-white/20 w-5 shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="h-px flex-1 bg-white/[0.07]" />
                      <span className="text-white/70 text-sm" style={{ fontFamily: 'var(--font-display, serif)' }}>
                        {city}
                      </span>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-white/[0.07]">
                    <p className="text-[10px] uppercase tracking-[0.32em] text-accent mb-1">
                      {lang === 'ar' ? 'الوجهة الرئيسية' : lang === 'tr' ? 'Ana Destinasyon' : 'Primary Destination'}
                    </p>
                    <p className="text-white text-lg" style={{ fontFamily: 'var(--font-display, serif)' }}>Türkiye</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="py-20 border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: EASE_EXPO_OUT }}
              className="text-center mb-14"
            >
              <h2
                className={`font-[350] text-white ${isRTL ? 'text-[clamp(1.4rem,2.5vw,2.4rem)] leading-[1.3]' : 'text-[clamp(1.6rem,3vw,2.8rem)]'}`}
                style={headingStyle(isRTL)}
              >
                {lang === 'ar' ? 'ما يميزنا' : lang === 'tr' ? 'Bizi Farklı Kılan' : 'What sets us apart'}
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {VALUES.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.7, ease: EASE_OUT, delay: i * 0.1 }}
                  className="cinema-panel cinema-panel--accent p-8 rounded-2xl"
                >
                  <span className="text-accent text-2xl mb-4 block">{v.icon}</span>
                  <h3
                    className={`text-white font-light mb-3 ${isRTL ? 'text-base leading-[1.4]' : 'text-lg'}`}
                    style={headingStyle(isRTL)}
                  >
                    {v.title[lang]}
                  </h3>
                  <p className="text-white/50 text-[13px] leading-relaxed">{v.body[lang]}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 text-center">
          <div className="max-w-xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: EASE_EXPO_OUT }}
            >
              <h2
                className={`font-[350] text-white mb-4 ${isRTL ? 'text-[clamp(1.2rem,2.5vw,2rem)] leading-[1.35]' : 'text-[clamp(1.4rem,3vw,2.4rem)]'}`}
                style={headingStyle(isRTL)}
              >
                {lang === 'ar' ? 'هل أنت مستعد للسفر؟' : lang === 'tr' ? 'Seyahate Hazır Mısınız?' : 'Ready to travel?'}
              </h2>
              <p className="text-white/45 text-[14px] mb-8">
                {lang === 'ar'
                  ? 'تواصل معنا على واتساب وسنبدأ في تخطيط رحلتك.'
                  : lang === 'tr'
                  ? "WhatsApp'tan bize ulaşın, yolculuğunuzu planlamaya başlayalım."
                  : "Reach us on WhatsApp and we'll start planning your journey."}
              </p>
              <a
                href="https://wa.me/905300709555"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-[11px] font-bold tracking-[0.28em] uppercase bg-gradient-to-br from-accent-light via-accent to-accent-dark text-on-accent glow-gold hover:scale-105 transition-transform duration-200"
              >
                WhatsApp
              </a>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </LenisProvider>
  );
}
