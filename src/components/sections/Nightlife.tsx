'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import SectionHeader from '@/components/ui/SectionHeader';
import GlassCard from '@/components/ui/GlassCard';

const categories = [
  {
    key: 'all',
    label: { en: 'All', ar: 'الكل' },
    icon: '✨',
  },
  {
    key: 'restaurant',
    label: { en: 'Restaurants', ar: 'المطاعم' },
    icon: '🍽️',
  },
  {
    key: 'cruise',
    label: { en: 'Cruises', ar: 'الرحلات البحرية' },
    icon: '⛴️',
  },
  {
    key: 'cafe',
    label: { en: 'Cafes', ar: 'المقاهي' },
    icon: '☕',
  },
  {
    key: 'cultural',
    label: { en: 'Cultural', ar: 'ثقافي' },
    icon: '🕌',
  },
  {
    key: 'family',
    label: { en: 'Family', ar: 'عائلي' },
    icon: '👨‍👩‍👧‍👦',
  },
];

const activities = [
  {
    id: '1',
    title: { en: 'Nusr-Et Steakhouse', ar: 'مطعم نصرت للمشاوي' },
    description: {
      en: 'The world-famous Salt Bae experience with premium Wagyu and extraordinary theatrical dining.',
      ar: 'تجربة نصرت الشهيرة عالمياً مع واغيو مميز وتناول طعام مسرحي استثنائي.',
    },
    category: 'restaurant',
    city: 'Istanbul',
    priceRange: '$$$',
    icon: '🥩',
    rating: 4.7,
    tags: ['Fine Dining', 'Wagyu', 'Celebrity'],
    color: '#C9A96E',
  },
  {
    id: '2',
    title: { en: 'Bosphorus Private Cruise', ar: 'رحلة خاصة في البوسفور' },
    description: {
      en: 'An intimate sunset cruise on the Bosphorus with live music, meze, and endless sea views.',
      ar: 'رحلة غروب حميمة على البوسفور مع موسيقى حية ومازة ومناظر بحرية لا نهاية لها.',
    },
    category: 'cruise',
    city: 'Istanbul',
    priceRange: '$$$$',
    icon: '⛴️',
    rating: 5.0,
    tags: ['Private', 'Sunset', 'Live Music'],
    color: '#1E90FF',
  },
  {
    id: '3',
    title: { en: 'Hagia Sophia Night Tour', ar: 'جولة ليلية في آيا صوفيا' },
    description: {
      en: 'An exclusive after-hours private tour of the iconic Hagia Sophia with expert historian guide.',
      ar: 'جولة خاصة حصرية بعد ساعات العمل في آيا صوفيا الشهيرة مع مرشد مؤرخ خبير.',
    },
    category: 'cultural',
    city: 'Istanbul',
    priceRange: '$$$',
    icon: '🕌',
    rating: 4.9,
    tags: ['Exclusive', 'Historical', 'Private'],
    color: '#6C3FC5',
  },
  {
    id: '4',
    title: { en: 'Bebek Cafe Culture', ar: 'ثقافة مقاهي بيبك' },
    description: {
      en: 'Discover the charming Bebek neighborhood, home to Istanbul\'s most scenic Bosphorus-side cafes.',
      ar: 'اكتشف حي بيبك الساحر، موطن أجمل مقاهي إسطنبول على ضفة البوسفور.',
    },
    category: 'cafe',
    city: 'Istanbul',
    priceRange: '$$',
    icon: '☕',
    rating: 4.8,
    tags: ['Bosphorus View', 'Scenic', 'Relaxed'],
    color: '#A07840',
  },
  {
    id: '5',
    title: { en: 'Istanbul Aquarium', ar: 'أكواريوم إسطنبول' },
    description: {
      en: 'The largest aquarium in Europe — a magical journey through underwater worlds, perfect for families.',
      ar: 'أكبر أكواريوم في أوروبا — رحلة سحرية عبر العوالم تحت الماء، مثالية للعائلات.',
    },
    category: 'family',
    city: 'Istanbul',
    priceRange: '$$',
    icon: '🐠',
    rating: 4.6,
    tags: ['Family', 'Kids', 'Educational'],
    color: '#2ECC71',
  },
  {
    id: '6',
    title: { en: 'Mikla Restaurant', ar: 'مطعم ميكلا' },
    description: {
      en: 'Sky-high fine dining with panoramic Istanbul views — modern Turkish-Nordic cuisine at its finest.',
      ar: 'تناول طعام فاخر على ارتفاع عالٍ مع مناظر بانورامية لإسطنبول — مطبخ تركي-نوردي حديث بامتياز.',
    },
    category: 'restaurant',
    city: 'Istanbul',
    priceRange: '$$$$',
    icon: '🌟',
    rating: 4.9,
    tags: ['Rooftop', 'Fine Dining', 'Nordic'],
    color: '#E67E22',
  },
];

export default function Nightlife() {
  const { language } = useAppStore();
  const tr = (key: Parameters<typeof t>[0]) => t(key, language);
  const [activeCategory, setActiveCategory] = useState('all');

  const l = (obj: { en: string; ar: string }) => obj[language];

  const filtered = activeCategory === 'all'
    ? activities
    : activities.filter((a) => a.category === activeCategory);

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <section
      id="nightlife"
      className="relative py-32 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #030812, #0A1628, #030812)' }}
      dir={dir}
    >
      {/* Mood lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#6C3FC5] opacity-[0.05] blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#C9A96E] opacity-[0.03] blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <SectionHeader
          eyebrow={language === 'ar' ? 'الترفيه والثقافة' : 'Entertainment & Culture'}
          title={tr('nightlife.title')}
          subtitle={tr('nightlife.subtitle')}
        />

        {/* Category filter */}
        <div className="flex gap-3 mb-12 justify-center flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium tracking-wider transition-all duration-300 ${
                activeCategory === cat.key
                  ? 'bg-gradient-to-r from-[#E8CC9A] to-[#C9A96E] text-[#030812] font-bold'
                  : 'glass border border-[rgba(201,169,110,0.2)] text-[rgba(245,240,232,0.6)] hover:text-[#C9A96E]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label[language]}</span>
            </button>
          ))}
        </div>

        {/* Activities Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((activity, i) => (
              <motion.div
                key={activity.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <GlassCard className="group h-full flex flex-col" tilt>
                  {/* Activity header */}
                  <div
                    className="relative h-44 flex items-center justify-center overflow-hidden"
                    style={{
                      background: `radial-gradient(ellipse at 50% 50%, ${activity.color}20 0%, transparent 70%), #0D1F3C`,
                    }}
                  >
                    <motion.div
                      className="text-6xl"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {activity.icon}
                    </motion.div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 rounded-full text-xs font-bold glass border border-[rgba(255,255,255,0.1)] text-[rgba(245,240,232,0.7)]">
                        {activity.priceRange}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[rgba(3,8,18,0.8)] to-transparent" />
                  </div>

                  {/* Activity info */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1.5">
                          <span style={{ color: activity.color }}>●</span>
                          <span className="text-[rgba(245,240,232,0.4)]">{activity.city}</span>
                        </p>
                        <h3
                          className="text-base font-bold text-[rgba(245,240,232,0.95)] leading-snug"
                          style={{ fontFamily: 'var(--font-display, serif)' }}
                        >
                          {l(activity.title)}
                        </h3>
                      </div>
                      <div
                        className="flex items-center gap-1 ml-3 px-2 py-1 rounded-lg text-xs font-bold"
                        style={{ background: `${activity.color}22`, color: activity.color }}
                      >
                        ★ {activity.rating}
                      </div>
                    </div>

                    <p className="text-xs text-[rgba(245,240,232,0.5)] leading-relaxed mb-4 flex-1">
                      {l(activity.description)}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {activity.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full text-[9px] font-medium"
                          style={{
                            background: `${activity.color}15`,
                            color: activity.color,
                            border: `1px solid ${activity.color}40`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button className="w-full py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 glass border hover:border-[rgba(201,169,110,0.6)] hover:text-[#C9A96E] text-[rgba(245,240,232,0.7)] border-[rgba(201,169,110,0.2)]">
                      {tr('common.learnMore')}
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 glass-gold rounded-3xl p-10 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(201,169,110,0.05)] to-[rgba(108,63,197,0.05)] pointer-events-none" />
          <div className="relative">
            <p className="text-[10px] uppercase tracking-[5px] text-[#C9A96E] mb-3">
              {language === 'ar' ? 'تجارب مخصصة' : 'Personalized Experiences'}
            </p>
            <h3
              className="text-3xl font-black text-[rgba(245,240,232,0.95)] mb-4"
              style={{ fontFamily: 'var(--font-display, serif)' }}
            >
              {language === 'ar' ? 'دعنا نخطط ليلتك المثالية' : 'Let Us Plan Your Perfect Night'}
            </h3>
            <p className="text-[rgba(245,240,232,0.55)] mb-6 max-w-xl mx-auto text-sm">
              {language === 'ar'
                ? 'يعمل خبراؤنا على تصميم تجارب ترفيهية مخصصة تناسب تفضيلاتك وعائلتك.'
                : 'Our experts design custom entertainment experiences tailored to your preferences and family.'}
            </p>
            <button className="px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase text-[#030812] bg-gradient-to-r from-[#E8CC9A] to-[#C9A96E] hover:opacity-90 transition-opacity glow-gold">
              {language === 'ar' ? 'احجز عبر واتساب' : 'Book via WhatsApp'}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
