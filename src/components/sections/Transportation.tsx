'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore, formatPrice } from '@/lib/store';
import { t } from '@/lib/i18n';
import SectionHeader from '@/components/ui/SectionHeader';
import GlassCard from '@/components/ui/GlassCard';

const vehicles = [
  {
    id: 'rolls-royce',
    name: { en: 'Rolls-Royce Phantom', ar: 'رولز رويس فانتوم' },
    description: { en: 'The pinnacle of luxury — ultra-exclusive private transfers in the world\'s finest automobile.', ar: 'قمة الفخامة — انتقالات خاصة حصرية في أفخم سيارة في العالم.' },
    type: 'limousine',
    pricePerTrip: 450,
    capacity: 3,
    features: ['Champagne on board', 'Red carpet service', 'Private chauffeur', 'Meet & Greet'],
    icon: '🎩',
    badge: 'Ultra VIP',
    color: '#C9A96E',
  },
  {
    id: 'mercedes-s',
    name: { en: 'Mercedes-Benz S-Class', ar: 'مرسيدس S-كلاس' },
    description: { en: 'Executive class comfort — perfect for airport transfers, business, and leisure trips.', ar: 'راحة الدرجة التنفيذية — مثالية لانتقالات المطار وتنقلات الأعمال والترفيه.' },
    type: 'vip-sedan',
    pricePerTrip: 180,
    capacity: 3,
    features: ['WiFi', 'Bottled water', 'Climate control', 'Professional driver'],
    icon: '🚗',
    badge: 'Executive',
    color: '#1E90FF',
  },
  {
    id: 'bmw-x7',
    name: { en: 'BMW X7 Premium SUV', ar: 'BMW X7 SUV فاخرة' },
    description: { en: 'Spacious and powerful — ideal for families and groups wanting premium comfort across Türkiye.', ar: 'فسيحة وقوية — مثالية للعائلات والمجموعات التي تريد راحة متميزة في تركيا.' },
    type: 'suv',
    pricePerTrip: 220,
    capacity: 6,
    features: ['7 Seats', 'Child seats available', 'Panoramic roof', 'Entertainment system'],
    icon: '🚙',
    badge: 'Family VIP',
    color: '#6C3FC5',
  },
  {
    id: 'vip-van',
    name: { en: 'Mercedes V-Class VIP Van', ar: 'مرسيدس V-كلاس فان VIP' },
    description: { en: 'Luxurious group travel — premium minivan with captain seats and privacy partition.', ar: 'سفر جماعي فاخر — ميني فان متميز بمقاعد كابتن وفاصل للخصوصية.' },
    type: 'van',
    pricePerTrip: 280,
    capacity: 7,
    features: ['Captain seats', 'Privacy partition', 'Fridge', 'USB charging'],
    icon: '🚐',
    badge: 'Group VIP',
    color: '#A07840',
  },
  {
    id: 'helicopter-transfer',
    name: { en: 'Helicopter Transfer', ar: 'انتقال بالهليكوبتر' },
    description: { en: 'Skip traffic entirely — private helicopter transfers between Istanbul, Bodrum, Antalya and more.', ar: 'تجاوز الازدحام تمامًا — انتقالات هليكوبتر خاصة بين إسطنبول وبودروم وأنطاليا والمزيد.' },
    type: 'helicopter',
    pricePerTrip: 2200,
    capacity: 5,
    features: ['Door-to-door', 'VIP lounge', 'Champagne', 'Luggage handling'],
    icon: '🚁',
    badge: 'Ultimate',
    color: '#E67E22',
  },
  {
    id: 'luxury-bus',
    name: { en: 'VIP Tour Coach', ar: 'حافلة سياحية VIP' },
    description: { en: 'Premier group transportation — luxury coach with reclining seats, WiFi, and refreshments.', ar: 'نقل جماعي من الدرجة الأولى — حافلة فاخرة بمقاعد متكئة وواي فاي ومرطبات.' },
    type: 'bus',
    pricePerTrip: 400,
    capacity: 25,
    features: ['25 seats', 'Onboard WiFi', 'Air-conditioned', 'Refreshment service'],
    icon: '🚌',
    badge: 'Group',
    color: '#2ECC71',
  },
];

const bookingSteps = [
  { step: 1, title: { en: 'Choose Vehicle', ar: 'اختر المركبة' }, icon: '🚗' },
  { step: 2, title: { en: 'Select Route', ar: 'حدد المسار' }, icon: '📍' },
  { step: 3, title: { en: 'Pick Date & Time', ar: 'اختر التاريخ والوقت' }, icon: '📅' },
  { step: 4, title: { en: 'Confirm & Pay', ar: 'أكد وادفع' }, icon: '✅' },
];

export default function Transportation() {
  const { language, currency, openBookingModal } = useAppStore();
  const tr = (key: Parameters<typeof t>[0]) => t(key, language);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  const l = (obj: { en: string; ar: string }) => obj[language];
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <section
      id="transport"
      className="relative py-32 overflow-hidden"
      style={{ background: '#030812' }}
      dir={dir}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.2), transparent)' }} />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-[#C9A96E] opacity-[0.02] blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <SectionHeader
          eyebrow={language === 'ar' ? 'انتقالات فاخرة' : 'Luxury Transfers'}
          title={tr('transport.title')}
          subtitle={tr('transport.subtitle')}
        />

        {/* Booking Steps */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {bookingSteps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full glass border border-[rgba(201,169,110,0.3)] flex items-center justify-center text-lg">
                  {step.icon}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#C9A96E]">Step {step.step}</p>
                  <p className="text-xs text-[rgba(245,240,232,0.7)] font-medium">{l(step.title)}</p>
                </div>
              </div>
              {i < bookingSteps.length - 1 && (
                <div className="hidden md:block h-px w-8 bg-gradient-to-r from-[rgba(201,169,110,0.4)] to-transparent mx-2" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {vehicles.map((vehicle, i) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <GlassCard
                className={`h-full flex flex-col cursor-none transition-all duration-300 ${
                  selectedVehicle === vehicle.id ? 'border-[rgba(201,169,110,0.5)]' : ''
                }`}
                onClick={() => setSelectedVehicle(vehicle.id === selectedVehicle ? null : vehicle.id)}
              >
                {/* Vehicle visual */}
                <div
                  className="relative h-44 flex items-center justify-center overflow-hidden"
                  style={{
                    background: `radial-gradient(ellipse at 50% 50%, ${vehicle.color}18 0%, transparent 70%), #0D1F3C`,
                  }}
                >
                  <motion.div
                    className="text-6xl"
                    animate={selectedVehicle === vehicle.id ? { scale: 1.15, y: -5 } : { scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {vehicle.icon}
                  </motion.div>

                  <div className="absolute top-3 left-3">
                    <span
                      className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
                      style={{ background: `${vehicle.color}25`, color: vehicle.color, border: `1px solid ${vehicle.color}40` }}
                    >
                      {vehicle.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 text-right">
                    <p className="text-xl font-black text-gradient-gold">{formatPrice(vehicle.pricePerTrip, currency)}</p>
                    <p className="text-[10px] text-[rgba(245,240,232,0.4)]">/{language === 'ar' ? 'رحلة' : 'per trip'}</p>
                  </div>

                  {selectedVehicle === vehicle.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 border-2 rounded-2xl pointer-events-none"
                      style={{ borderColor: vehicle.color }}
                    />
                  )}
                </div>

                {/* Vehicle info */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3
                      className="text-base font-bold text-[rgba(245,240,232,0.95)]"
                      style={{ fontFamily: 'var(--font-display, serif)' }}
                    >
                      {l(vehicle.name)}
                    </h3>
                    <span className="text-xs text-[rgba(245,240,232,0.4)]">
                      👥 {vehicle.capacity}
                    </span>
                  </div>

                  <p className="text-xs text-[rgba(245,240,232,0.5)] leading-relaxed mb-4 flex-1">
                    {l(vehicle.description)}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {vehicle.features.map((f) => (
                      <span
                        key={f}
                        className="px-2 py-0.5 rounded text-[9px] glass border border-[rgba(255,255,255,0.08)] text-[rgba(245,240,232,0.5)]"
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); openBookingModal('transport', vehicle.id); }}
                    className="w-full py-3 rounded-xl text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-[#E8CC9A] to-[#C9A96E] text-[#030812] hover:opacity-90 transition-opacity"
                  >
                    {tr('transport.book')}
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Airport pickup CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl p-10"
          style={{ background: 'linear-gradient(135deg, rgba(13,31,60,0.8), rgba(3,8,18,0.9))' }}
        >
          <div className="absolute inset-0 border border-[rgba(201,169,110,0.15)] rounded-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 text-[140px] opacity-5 flex items-center justify-center">✈️</div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[5px] text-[#C9A96E] mb-3">
                {language === 'ar' ? 'خدمة مميزة' : 'Special Service'}
              </p>
              <h3
                className="text-3xl font-black text-[rgba(245,240,232,0.95)] mb-4"
                style={{ fontFamily: 'var(--font-display, serif)' }}
              >
                {language === 'ar' ? 'استقبال VIP من المطار' : 'VIP Airport Meet & Greet'}
              </h3>
              <p className="text-[rgba(245,240,232,0.55)] text-sm leading-relaxed mb-6">
                {language === 'ar'
                  ? 'يستقبلك فريقنا في الصالة الدولية بلافتة مخصصة، يساعدك في الأمتعة، وينقلك مباشرة إلى مركبتك الفاخرة.'
                  : 'Our team greets you at the international terminal with a personalized sign, assists with luggage, and transfers you directly to your luxury vehicle.'}
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  language === 'ar' ? '✓ جميع مطارات تركيا' : '✓ All Turkish airports',
                  language === 'ar' ? '✓ متاح 24/7' : '✓ 24/7 availability',
                  language === 'ar' ? '✓ دعم عربي' : '✓ Arabic support',
                ].map((f) => (
                  <span key={f} className="text-xs text-[rgba(245,240,232,0.7)] flex items-center gap-1">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => openBookingModal('transport', 'airport-pickup')}
                className="w-full py-4 rounded-xl text-sm font-bold tracking-widest uppercase text-[#030812] bg-gradient-to-r from-[#E8CC9A] to-[#C9A96E] hover:opacity-90 transition-opacity glow-gold"
              >
                {language === 'ar' ? 'احجز الاستقبال' : 'Book Airport Transfer'}
              </button>
              <button className="w-full py-4 rounded-xl text-sm font-bold tracking-widest uppercase glass border border-[rgba(201,169,110,0.3)] text-[rgba(245,240,232,0.7)] hover:text-[#C9A96E] hover:border-[rgba(201,169,110,0.6)] transition-all duration-300">
                {language === 'ar' ? 'واتساب' : 'WhatsApp Us'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
