'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useTranslations } from '@/hooks/useTranslations';
import { pathWithLocale, getLocaleFromPathname } from '@/lib/locale-path';
import { EASE_OUT, EASE_EXPO_OUT, viewportOnce } from '@/lib/motion';
import type { TranslationKey } from '@/lib/i18n';
import type { MarketingSlug } from '@/lib/marketing-slugs';

/* ─── Per-slug rich content ──────────────────────────────────────────────── */

const SLUG_META: Record<
  MarketingSlug,
  {
    eyebrow: string;
    accent: string;
    blocks: Array<{ heading: string; body: string }>;
    stats?: Array<{ value: string; label: string }>;
    cta?: { label: string; href: string };
  }
> = {
  about: {
    eyebrow: 'Our Story',
    accent: '#22d3ee',
    stats: [
      { value: '2019', label: 'Founded' },
      { value: '3,000+', label: 'Happy guests' },
      { value: '15+', label: 'Destinations' },
      { value: '3', label: 'Languages' },
    ],
    blocks: [
      {
        heading: 'Who we are',
        body: 'PoliTrip is a premium boutique travel agency born in Istanbul, dedicated to crafting extraordinary journeys across Türkiye for discerning travelers from the Arab world and beyond. We combine deep local knowledge with white-glove service to deliver trips that feel completely effortless.',
      },
      {
        heading: 'What sets us apart',
        body: 'Every itinerary is designed from scratch — no templates, no group tours. Our Arabic- and English-speaking team oversees every detail: hotel selection, private transfers, curated experiences, and 24/7 on-the-ground support. We measure success by the moment guests stop worrying and start truly experiencing Türkiye.',
      },
      {
        heading: 'Our promise',
        body: 'From the first enquiry to the final airport drop-off, PoliTrip takes ownership of every logistical detail. We work with a curated network of vetted five-star hotels and trusted local partners so that quality is never left to chance.',
      },
    ],
    cta: { label: 'Start planning your trip', href: '#' },
  },

  team: {
    eyebrow: 'The People',
    accent: '#818cf8',
    stats: [
      { value: '12+', label: 'Team members' },
      { value: '5', label: 'Languages spoken' },
      { value: '24/7', label: 'On-call support' },
      { value: '100%', label: 'Personalised service' },
    ],
    blocks: [
      {
        heading: 'Concierge-first culture',
        body: 'Our team is built around a single idea: the guest should never have to worry. Every planner is trained to anticipate needs before they arise — from dietary preferences noted before hotel check-in to a car waiting precisely when the flight lands.',
      },
      {
        heading: 'Multilingual & multicultural',
        body: 'Our core team speaks Arabic, English, and Turkish fluently. We understand the cultural expectations of Gulf and Levantine travelers, which means everything from prayer-time awareness to halal dining is handled without you ever needing to ask.',
      },
      {
        heading: 'Local expertise',
        body: 'Our Istanbul-based operations team has first-hand knowledge of every hotel, restaurant, and experience in our portfolio. We inspect properties personally and only recommend what we would confidently send our own families to.',
      },
    ],
    cta: { label: 'Meet us on WhatsApp', href: 'https://wa.me/905300000000' },
  },

  careers: {
    eyebrow: 'Join Us',
    accent: '#34d399',
    stats: [
      { value: 'Istanbul', label: 'HQ' },
      { value: 'Remote', label: 'Flexible roles' },
      { value: '3+', label: 'Open positions' },
    ],
    blocks: [
      {
        heading: 'Build the future of luxury travel',
        body: 'We are growing our guest-experience, operations, and technology teams. If you are passionate about travel, love getting details exactly right, and want to work in a fast-moving environment, PoliTrip could be the right place for you.',
      },
      {
        heading: 'Open roles',
        body: 'Guest Experience Coordinator (Istanbul, fluent Arabic required) · Senior Operations Executive (Istanbul) · Growth & Partnerships Manager (remote-friendly). More roles are added regularly — even if nothing fits now, we encourage you to reach out.',
      },
      {
        heading: 'How to apply',
        body: 'Send your CV and a short note about why you want to join PoliTrip to careers@politrip.com. We read every message and respond to every qualified candidate within one week.',
      },
    ],
    cta: { label: 'Send your CV', href: 'mailto:careers@politrip.com' },
  },

  press: {
    eyebrow: 'Media',
    accent: '#f472b6',
    stats: [
      { value: '20+', label: 'Press features' },
      { value: '2024', label: 'Latest coverage' },
    ],
    blocks: [
      {
        heading: 'In the media',
        body: 'PoliTrip has been featured across Arabic and Turkish travel publications for our unique positioning at the intersection of Gulf hospitality standards and authentic Turkish culture. We are happy to arrange founder interviews, provide press kits, or facilitate press-trip arrangements for verified journalists.',
      },
      {
        heading: 'Partnership enquiries',
        body: 'We collaborate with lifestyle brands, airlines, credit card concierge programmes, and online travel communities whose audiences align with premium travel. If your brand serves discerning travelers, we would love to explore a partnership.',
      },
      {
        heading: 'Contact our press team',
        body: 'Email press@politrip.com with your outlet name, circulation or reach, and a brief description of the piece or partnership in mind. We aim to respond within two business days.',
      },
    ],
    cta: { label: 'Contact press team', href: 'mailto:press@politrip.com' },
  },

  help: {
    eyebrow: 'Support',
    accent: '#fb923c',
    stats: [
      { value: '24/7', label: 'WhatsApp support' },
      { value: '<1h', label: 'Avg. response time' },
    ],
    blocks: [
      {
        heading: 'Before your trip',
        body: 'Need to adjust your itinerary, add a service, or ask a question about your upcoming booking? WhatsApp your dedicated planner directly — their number is in your confirmation email. Alternatively, email help@politrip.com with your booking reference.',
      },
      {
        heading: 'During your trip',
        body: 'A duty concierge is reachable 24 hours a day, 7 days a week on WhatsApp. Whether you need a last-minute restaurant, have a transport issue, or just need a local recommendation, we are one message away.',
      },
      {
        heading: 'Cancellations & changes',
        body: 'Cancellation and amendment rules vary by hotel and supplier. Your booking confirmation lists the exact deadlines. For time-sensitive requests, always contact us by WhatsApp for the fastest response. We will always do our best to accommodate changes without penalty where the supplier allows it.',
      },
    ],
    cta: { label: 'WhatsApp support', href: 'https://wa.me/905300000000' },
  },

  privacy: {
    eyebrow: 'Legal',
    accent: '#94a3b8',
    blocks: [
      {
        heading: 'What data we collect',
        body: 'We collect only the information necessary to plan and deliver your trip: full name, contact details (phone and email), passport or ID details where required by hotels, travel dates, and any special requests you share with us. We do not collect or store payment card data directly.',
      },
      {
        heading: 'How we use your data',
        body: 'Your data is used exclusively to fulfil your booking, communicate with you about your trip, and send relevant service updates. We share details with hotels, transport suppliers, and tour operators only to the extent necessary for your reservation.',
      },
      {
        heading: 'Your rights',
        body: 'You may request a copy of the data we hold on you, ask us to correct inaccuracies, or request deletion at any time by emailing privacy@politrip.com. We will respond within 14 days. A full GDPR-compliant privacy policy will be published on this page shortly.',
      },
    ],
    cta: { label: 'Contact privacy team', href: 'mailto:privacy@politrip.com' },
  },

  terms: {
    eyebrow: 'Legal',
    accent: '#94a3b8',
    blocks: [
      {
        heading: 'Booking confirmation',
        body: 'A booking is confirmed when you have approved the itinerary in writing (by email or WhatsApp message) and the agreed deposit has been received. Verbal agreements and unsigned quotes do not constitute a reservation.',
      },
      {
        heading: 'Payment schedule',
        body: 'A deposit of 30–50 % (as stated in your proposal) is due at confirmation. The remaining balance is due no later than 14 days before the first service date unless otherwise specified in your proposal. Accepted methods include bank transfer, Wise, and approved card payments.',
      },
      {
        heading: 'Cancellations & refunds',
        body: 'Cancellations made 30+ days before departure are eligible for a full refund minus a 5 % processing fee. Cancellations 15–29 days before departure forfeit the deposit. Cancellations within 14 days of departure are non-refundable unless due to force majeure. Specific hotel and airline rules may apply and will be stated in your proposal.',
      },
    ],
    cta: { label: 'Ask a question', href: 'mailto:info@politrip.com' },
  },

  contact: {
    eyebrow: 'Get in Touch',
    accent: '#22d3ee',
    stats: [
      { value: 'Istanbul', label: 'Operations HQ' },
      { value: 'Dubai', label: 'Gulf office' },
      { value: 'Riyadh', label: 'KSA office' },
    ],
    blocks: [
      {
        heading: 'General enquiries',
        body: 'For trip planning, pricing, and availability, email info@politrip.com or message us on WhatsApp. We typically reply within a few hours during business hours (09:00–21:00 Istanbul time, 7 days a week).',
      },
      {
        heading: 'Phone & WhatsApp',
        body: 'Istanbul: +90 530 000 0000 · Dubai: +971 50 000 0000 · Riyadh: +966 55 000 0000. WhatsApp is the fastest channel for real-time assistance during and before your trip.',
      },
      {
        heading: 'Office visits',
        body: 'Our Istanbul office is available for in-person meetings by appointment. Please email us to schedule a time and we will share the exact address and directions.',
      },
    ],
    cta: { label: 'WhatsApp Us Now', href: 'https://wa.me/905300000000' },
  },

  vision: {
    eyebrow: 'Our Vision',
    accent: '#22d3ee',
    stats: [
      { value: '2030', label: 'Expansion horizon' },
      { value: '10+', label: 'Countries planned' },
      { value: '#1', label: 'Arabic-speaking travel agency in Türkiye' },
    ],
    blocks: [
      {
        heading: 'Where we are going',
        body: 'PoliTrip was founded on the belief that premium travel should feel genuinely effortless — not just marketed that way. Our long-term vision is to become the definitive luxury travel brand for Arabic-speaking travelers exploring Türkiye and the broader region, known for an experience so seamless it feels like having a knowledgeable friend with a black book.',
      },
      {
        heading: 'Technology meets hospitality',
        body: 'We are investing in digital tools that give guests real-time visibility into their itineraries, instant concierge access, and curated destination intelligence — all without replacing the human relationships that make travel memorable.',
      },
      {
        heading: 'Sustainability & community',
        body: 'We are committed to responsible tourism: partnering with locally owned properties, avoiding mass-tourism circuits, and ensuring that the economic benefit of every trip flows into the communities that make Türkiye extraordinary. Premium travel and ethical travel are not opposites.',
      },
    ],
    cta: { label: 'Join the journey', href: '#' },
  },

  vip: {
    eyebrow: 'Exclusive Access',
    accent: '#e2c97e',
    stats: [
      { value: '5★', label: 'Hotels only' },
      { value: '24/7', label: 'Concierge' },
      { value: '100%', label: 'Private' },
      { value: '15+', label: 'Destinations' },
    ],
    blocks: [
      {
        heading: 'Travel without compromise',
        body: "PoliTrip's VIP tier places a dedicated concierge at your side from the moment your flight lands. Every transfer, every suite, every experience — arranged in advance, executed flawlessly.",
      },
      {
        heading: 'What is included',
        body: 'Private jet and helicopter transfers, five-star suite reservations with priority access, Bosphorus yacht charters, exclusive after-hours site visits, private chef dinners, and a dedicated travel manager who knows your preferences before you say a word.',
      },
      {
        heading: 'How to book',
        body: 'VIP experiences are bespoke by definition — there is no template. Contact our VIP team via WhatsApp or email and we will schedule a call to understand exactly what you want and design an itinerary around it.',
      },
    ],
    cta: { label: 'Contact VIP Team', href: 'https://wa.me/905300000000' },
  },
};

/* ─── Component ──────────────────────────────────────────────────────────── */

export function MarketingArticle({ slug }: { slug: MarketingSlug }) {
  const { t } = useTranslations();
  const pathname = usePathname();
  const homeHref = pathWithLocale('/', getLocaleFromPathname(pathname));

  const meta = SLUG_META[slug];
  const headline = t(`slug.${slug}.headline` as TranslationKey);

  return (
    <div className="bg-canvas text-white">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 55% at 50% 0%, ${meta.accent}14 0%, transparent 65%), linear-gradient(180deg, rgba(2,18,45,0.55) 0%, rgba(2,18,45,1) 100%)`,
          }}
          aria-hidden
        />
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: `linear-gradient(to right, transparent, ${meta.accent}50, transparent)` }}
          aria-hidden
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 pt-40 pb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            <Link
              href={homeHref}
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-white/35 hover:text-white/70 transition-colors mb-10"
            >
              <span>←</span>
              <span>Back to home</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.05 }}
            className="flex items-center gap-3 mb-5"
          >
            <div
              className="h-px w-10"
              style={{ background: `linear-gradient(to right, transparent, ${meta.accent})` }}
            />
            <span
              className="text-[10px] uppercase tracking-[0.42em] font-bold"
              style={{ color: meta.accent }}
            >
              {meta.eyebrow}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: EASE_EXPO_OUT, delay: 0.1 }}
            className="text-[clamp(40px,5.5vw,88px)] font-light leading-[0.95] tracking-[-0.025em] max-w-4xl"
            style={{ fontFamily: 'var(--font-display, serif)' }}
          >
            {headline}
          </motion.h1>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────────── */}
      {meta.stats && (
        <section className="border-y border-white/[0.07]">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
            <div
              className="grid divide-x divide-white/[0.07]"
              style={{ gridTemplateColumns: `repeat(${meta.stats.length}, 1fr)` }}
            >
              {meta.stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.7, ease: EASE_OUT, delay: i * 0.07 }}
                  className="py-10 px-8 text-center"
                >
                  <p
                    className="text-[clamp(28px,3.5vw,48px)] font-light leading-none mb-2"
                    style={{
                      fontFamily: 'var(--font-display, serif)',
                      background: `linear-gradient(135deg, ${meta.accent} 0%, rgba(255,255,255,0.9) 50%, ${meta.accent} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {s.value}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/40 font-medium">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Content blocks ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-24 lg:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

          {/* Left sticky label */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32">
              <p
                className="text-[10px] uppercase tracking-[0.42em] font-bold mb-4"
                style={{ color: meta.accent }}
              >
                PoliTrip
              </p>
              <div
                className="h-px w-10"
                style={{ background: `linear-gradient(to right, ${meta.accent}, transparent)` }}
              />
            </div>
          </div>

          {/* Blocks */}
          <div className="lg:col-span-9 space-y-16">
            {meta.blocks.map((block, i) => (
              <motion.div
                key={block.heading}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.8, ease: EASE_EXPO_OUT, delay: i * 0.06 }}
                className="relative pl-8 border-l border-white/[0.07]"
              >
                <div
                  className="absolute left-0 top-0 w-0.5 h-8"
                  style={{ background: `linear-gradient(to bottom, ${meta.accent}, transparent)` }}
                />
                <h2
                  className="text-[clamp(20px,2.5vw,32px)] font-light leading-snug tracking-[-0.02em] text-white mb-4"
                  style={{ fontFamily: 'var(--font-display, serif)' }}
                >
                  {block.heading}
                </h2>
                <p className="text-white/55 text-base leading-[1.85]">
                  {block.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      {meta.cta && (
        <section className="border-t border-white/[0.07]">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-20 lg:py-28 flex flex-col sm:flex-row items-center justify-between gap-8">
            <motion.p
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="text-white/40 text-sm uppercase tracking-[0.22em]"
            >
              PoliTrip · Luxury travel in Türkiye
            </motion.p>
            <motion.a
              href={meta.cta.href}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, ease: EASE_EXPO_OUT, delay: 0.1 }}
              className="px-8 py-4 rounded-full text-[11px] font-bold tracking-[0.28em] uppercase text-[#02122d] transition-all duration-300 hover:scale-105 hover:brightness-110 shrink-0"
              style={{
                background: `linear-gradient(135deg, ${meta.accent} 0%, rgba(255,255,255,0.85) 50%, ${meta.accent} 100%)`,
                boxShadow: `0 0 32px ${meta.accent}33`,
              }}
            >
              {meta.cta.label}
            </motion.a>
          </div>
        </section>
      )}
    </div>
  );
}
