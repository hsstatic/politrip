'use client';

import { motion } from 'framer-motion';
import { useTranslations } from '@/hooks/useTranslations';
import { EASE_EXPO_OUT, EASE_OUT, viewportOnce } from '@/lib/motion';

const STATS = [
  { value: '15+',  label: { en: 'Years of Expertise',    tr: 'Yıllık Uzmanlık',        ar: 'سنة من الخبرة'     } },
  { value: '12+',  label: { en: 'Destination Cities',    tr: 'Destinasyon Şehri',      ar: 'مدينة وجهة'        } },
  { value: '98%',  label: { en: 'Client Satisfaction',   tr: 'Müşteri Memnuniyeti',    ar: 'رضا العملاء'       } },
  { value: '24/7', label: { en: 'Concierge Support',     tr: 'Concierge Desteği',      ar: 'دعم الكونسيرج'     } },
];

const VALUES = [
  {
    icon: '✦',
    title: { en: 'Bespoke Experiences',    tr: 'Özel Deneyimler',          ar: 'تجارب مخصصة'       },
    body: {
      en: 'Every itinerary is crafted from scratch around your preferences, travel style, and the moments that matter most to you.',
      tr: 'Her güzergah, tercihleriniz, seyahat tarzınız ve sizin için en önemli anlar etrafında sıfırdan hazırlanır.',
      ar: 'كل مسار رحلة يُصمَّم من الصفر حول تفضيلاتك وأسلوب سفرك واللحظات الأكثر أهمية بالنسبة لك.',
    },
  },
  {
    icon: '◈',
    title: { en: 'Five-Star Standards',    tr: 'Beş Yıldızlı Standartlar', ar: 'معايير خمس نجوم'   },
    body: {
      en: 'We partner exclusively with vetted luxury hotels, private transfer providers, and certified local guides across Türkiye.',
      tr: 'Türkiye genelinde yalnızca seçkin lüks oteller, özel transfer sağlayıcıları ve sertifikalı yerel rehberlerle çalışıyoruz.',
      ar: 'نتعاون حصراً مع فنادق فاخرة مختارة ومزودي نقل خاص ومرشدين محليين معتمدين في جميع أنحاء تركيا.',
    },
  },
  {
    icon: '❋',
    title: { en: 'End-to-End Care',        tr: 'Uçtan Uca Hizmet',         ar: 'رعاية شاملة'        },
    body: {
      en: 'From airport pickup to farewell transfer, our concierge team is reachable 24/7 throughout your entire journey.',
      tr: 'Havalimanı karşılamasından veda transferine kadar, concierge ekibimiz tüm yolculuğunuz boyunca 7/24 ulaşılabilir.',
      ar: 'من الاستقبال في المطار إلى نقل الوداع، يكون فريق الكونسيرج لدينا متاحاً على مدار الساعة طوال رحلتك.',
    },
  },
];

const CITIES = ['Istanbul', 'Cappadocia', 'Antalya', 'Trabzon', 'Bodrum', 'Sapanca'];

function headingStyle(isRTL: boolean): React.CSSProperties {
  return isRTL
    ? { fontFamily: 'var(--font-arabic), sans-serif' }
    : { fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.02em' };
}

export default function AboutContent() {
  const { language, isRTL } = useTranslations();
  const lang = language as 'en' | 'tr' | 'ar';

  return (
    <div className="bg-canvas text-white" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── Story ── */}
      <section className="relative pt-36 pb-28 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34,211,238,0.06) 0%, transparent 65%)' }}
          aria-hidden
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
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
                className={`font-[350] text-white mb-8 ${isRTL ? 'text-[clamp(1.5rem,2.5vw,2.5rem)] leading-[1.3]' : 'text-[clamp(1.8rem,3vw,3rem)] leading-tight'}`}
                style={headingStyle(isRTL)}
              >
                {lang === 'ar'
                  ? 'ولدنا من شغف السفر'
                  : lang === 'tr'
                  ? 'Seyahat Tutkusundan Doğduk'
                  : 'Born from a passion for travel'}
              </h2>
              <div className="space-y-5 text-white/55 text-[15px] leading-[1.8]">
                {lang === 'ar' ? (
                  <>
                    <p>أُسس PoliTrip بهدف واحد: تقديم Türkiye بشكل صحيح للضيوف العرب. ليس مجرد مواقع سياحية، بل لحظات حقيقية مصممة بعناية مع أشخاص يعرفون البلد ويتحدثون لغتك.</p>
                    <p>خلف الشركة رؤية مؤسسها <strong className="text-white font-medium">ريبار هاجيوغلو</strong>، الرئيس التنفيذي الذي يمتلك أكثر من 15 عاماً من الخبرة في قطاع السياحة التركية — خبرة حوّلها إلى تجارب سفر استثنائية لضيوف الخليج.</p>
                  </>
                ) : lang === 'tr' ? (
                  <>
                    <p>PoliTrip, tek bir amaçla kuruldu: Türkiye&apos;yi Körfez misafirlerine doğru şekilde sunmak. Sadece turistik yerler değil, ülkeyi bilen ve dilinizi konuşan insanlarla özenle tasarlanmış gerçek anlar.</p>
                    <p>Şirketin arkasında, Türk turizm sektöründe <strong className="text-white font-medium">15 yılı aşkın deneyime</strong> sahip CEO <strong className="text-white font-medium">Rebar Hacıoğlu</strong>&apos;nun vizyonu yatıyor. Bu derin birikim, her seyahati Körfez misafirleri için olağanüstü bir deneyime dönüştürüyor.</p>
                  </>
                ) : (
                  <>
                    <p>PoliTrip was founded with a single purpose: to present Türkiye properly to Gulf guests. Not just tourist sites, but real moments crafted carefully with people who know the country and speak your language.</p>
                    <p>Behind the company is the vision of CEO <strong className="text-white font-medium">Rebar Hacıoğlu</strong>, who brings over <strong className="text-white font-medium">15 years of experience</strong> in the Turkish tourism industry — expertise he has channeled into crafting extraordinary journeys for Gulf travelers.</p>
                  </>
                )}
              </div>
            </motion.div>

            {/* Decorative destinations panel */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.9, ease: EASE_EXPO_OUT, delay: 0.1 }}
              className="cinema-panel cinema-panel--accent p-10 rounded-2xl"
            >
              <p className="text-[10px] uppercase tracking-[0.38em] text-accent font-bold mb-6">
                {lang === 'ar' ? 'وجهاتنا' : lang === 'tr' ? 'Destinasyonlarımız' : 'Our Destinations'}
              </p>
              <div className="space-y-4">
                {CITIES.map((city, i) => (
                  <div key={city} className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-white/20 w-5 shrink-0 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="h-px flex-1 bg-white/[0.07]" />
                    <span className="text-white/75 text-sm tracking-wide" style={{ fontFamily: 'var(--font-display, serif)' }}>
                      {city}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-white/[0.07]">
                <p className="text-[10px] uppercase tracking-[0.32em] text-accent mb-1">
                  {lang === 'ar' ? 'الوجهة الرئيسية' : lang === 'tr' ? 'Ana Destinasyon' : 'Primary Destination'}
                </p>
                <p className="text-white text-xl font-[350]" style={{ fontFamily: 'var(--font-display, serif)' }}>Türkiye</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
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
                  className="text-[clamp(2.2rem,4vw,3.8rem)] font-[350] text-gradient-gold leading-none mb-3"
                  style={{ fontFamily: 'var(--font-display, serif)' }}
                >
                  {s.value}
                </p>
                <p className="text-white/45 text-[11px] uppercase tracking-[0.24em]">{s.label[lang]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Us ── */}
      <section className="py-24">
        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 lg:px-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: EASE_EXPO_OUT }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent" />
            <span className="text-[10px] uppercase tracking-[0.42em] text-accent font-bold">
              {lang === 'ar' ? 'من نحن' : lang === 'tr' ? 'Hakkımızda' : 'About Us'}
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-accent" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 1.0, ease: EASE_EXPO_OUT, delay: 0.1 }}
            className={`font-[350] mb-6 ${isRTL ? 'text-[clamp(1.8rem,4vw,3rem)] leading-[1.25]' : 'text-[clamp(2rem,4vw,3.5rem)] leading-[1.1]'}`}
            style={headingStyle(isRTL)}
          >
            {lang === 'ar'
              ? 'نصنع رحلات لا تُنسى'
              : lang === 'tr'
              ? 'Unutulmaz Yolculuklar\nYaratıyoruz'
              : 'Crafting Journeys Worth Remembering'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.9, ease: EASE_EXPO_OUT, delay: 0.22 }}
            className="text-white/55 text-base lg:text-lg leading-[1.75] max-w-2xl mx-auto"
          >
            {lang === 'ar'
              ? 'PoliTrip وكالة سياحة فاخرة تركية مخصصة لضيوف الخليج العربي. نحول Türkiye إلى تجربة شخصية — من إسطنبول إلى كابادوكيا، من الساحل الفيروزي إلى سواحل البحر الأسود.'
              : lang === 'tr'
              ? "PoliTrip, Körfez misafirleri için özel olarak tasarlanmış bir Türk lüks turizm ajansıdır. Türkiye'yi kişisel bir deneyime dönüştürüyoruz — İstanbul'dan Kapadokya'ya, Ege kıyılarından Karadeniz'e."
              : "PoliTrip is a Turkish luxury travel agency built exclusively for Gulf guests. We transform Türkiye into a personal experience — from Istanbul to Cappadocia, the Aegean coast to the Black Sea."}
          </motion.p>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.8, ease: EASE_EXPO_OUT }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-accent" />
              <span className="text-[10px] uppercase tracking-[0.38em] text-accent font-bold">
                {lang === 'ar' ? 'قيمنا' : lang === 'tr' ? 'Değerlerimiz' : 'Our Values'}
              </span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-accent" />
            </div>
            <h2
              className={`font-[350] text-white ${isRTL ? 'text-[clamp(1.5rem,2.5vw,2.5rem)] leading-[1.3]' : 'text-[clamp(1.8rem,3vw,3rem)]'}`}
              style={headingStyle(isRTL)}
            >
              {lang === 'ar' ? 'ما يميزنا' : lang === 'tr' ? 'Bizi Farklı Kılan' : 'What sets us apart'}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: i * 0.1 }}
                className="cinema-panel cinema-panel--accent p-8 rounded-2xl flex flex-col gap-4"
              >
                <span className="text-accent text-3xl leading-none">{v.icon}</span>
                <h3
                  className={`text-white font-light ${isRTL ? 'text-base leading-[1.5]' : 'text-lg'}`}
                  style={headingStyle(isRTL)}
                >
                  {v.title[lang]}
                </h3>
                <p className="text-white/50 text-[13px] leading-[1.75]">{v.body[lang]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(34,211,238,0.05) 0%, transparent 65%)' }}
          aria-hidden
        />
        <div className="relative z-10 max-w-xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.8, ease: EASE_EXPO_OUT }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-accent" />
              <span className="text-[10px] uppercase tracking-[0.38em] text-accent font-bold">
                {lang === 'ar' ? 'ابدأ رحلتك' : lang === 'tr' ? 'Yolculuğuna Başla' : "Let's Talk"}
              </span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-accent" />
            </div>
            <h2
              className={`font-[350] text-white mb-4 ${isRTL ? 'text-[clamp(1.4rem,2.5vw,2.2rem)] leading-[1.35]' : 'text-[clamp(1.6rem,3vw,2.8rem)] leading-tight'}`}
              style={headingStyle(isRTL)}
            >
              {lang === 'ar' ? 'هل أنت مستعد للسفر؟' : lang === 'tr' ? 'Seyahate Hazır Mısınız?' : 'Ready to travel?'}
            </h2>
            <p className="text-white/45 text-[14px] leading-relaxed mb-10">
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
              className="inline-flex items-center gap-3 px-9 py-4 rounded-full text-[11px] font-bold tracking-[0.28em] uppercase bg-gradient-to-br from-accent-light via-accent to-accent-dark text-on-accent glow-gold hover:scale-105 transition-transform duration-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
