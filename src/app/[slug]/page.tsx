import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CustomCursor from '@/components/providers/CustomCursor';
import LenisProvider from '@/components/providers/LenisProvider';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

const SLUGS = [
  'about',
  'team',
  'careers',
  'press',
  'help',
  'privacy',
  'terms',
  'contact',
] as const;

type Slug = (typeof SLUGS)[number];

const copy: Record<
  Slug,
  { title: string; headline: string; body: string }
> = {
  about: {
    title: 'About Us',
    headline: 'PoliTrip in brief',
    body: 'We design premium Gulf-facing journeys across Türkiye—VIP experiences, luxury stays, and seamless ground services from arrival to departure.',
  },
  team: {
    title: 'Our Team',
    headline: 'Concierge-first',
    body: 'Arabic- and English-speaking planners, on-call duty staff, and vetted local partners keep every itinerary calm, clear, and on time.',
  },
  careers: {
    title: 'Careers',
    headline: 'Join PoliTrip',
    body: 'We are growing our operations and guest-experience teams in Istanbul and the Gulf. Send your CV to careers@politrip.com—we read every message.',
  },
  press: {
    title: 'Press',
    headline: 'Media & partnerships',
    body: 'For press kits, founder interviews, or partnership inquiries, write to press@politrip.com with your outlet and deadline.',
  },
  help: {
    title: 'Help Center',
    headline: 'Guest support',
    body: 'For changes, refunds policy questions, or on-trip assistance, WhatsApp your duty number or email help@politrip.com with your booking reference.',
  },
  privacy: {
    title: 'Privacy Policy',
    headline: 'How we handle data',
    body: 'We collect only what we need to run your trip—contacts, guest names, and booking references—and protect it with standard industry practices. A detailed policy will appear on this page soon.',
  },
  terms: {
    title: 'Terms of Service',
    headline: 'Booking terms',
    body: 'Each proposal lists deposit, balance, and cancellation rules. A trip is confirmed once you approve the itinerary in writing and the agreed deposit is received.',
  },
  contact: {
    title: 'Contact',
    headline: 'Reach PoliTrip',
    body: 'Email info@politrip.com, call any of the regional numbers in the site footer, or message us on WhatsApp. We typically reply within one business day.',
  },
};

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isSlug(slug)) return {};
  const { title } = copy[slug];
  return {
    title,
    description: copy[slug].body,
  };
}

function isSlug(s: string): s is Slug {
  return (SLUGS as readonly string[]).includes(s);
}

export default async function MarketingSubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isSlug(slug)) notFound();
  const page = copy[slug];

  return (
    <LenisProvider>
      <CustomCursor />
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col">
        <section
          className="relative border-b border-[rgba(201,169,110,0.12)] px-6 pb-24 pt-28 md:px-10"
          style={{
            background:
              'linear-gradient(180deg, #030812 0%, #0A1628 45%, #0D1F3C 100%)',
          }}
        >
          <div className="mx-auto max-w-2xl">
            <p className="text-xs uppercase tracking-[0.25em] text-[#C9A96E]">
              PoliTrip
            </p>
            <h1
              className="mt-4 text-3xl font-semibold tracking-tight text-[#F5F0E8] md:text-4xl"
              style={{ fontFamily: 'var(--font-display, serif)' }}
            >
              {page.headline}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-[rgba(245,240,232,0.65)]">
              {page.body}
            </p>
            <Link
              href="/"
              className="mt-10 inline-flex rounded-full border border-[rgba(201,169,110,0.35)] px-5 py-2.5 text-sm font-medium text-[#E8CC9A] transition-colors hover:border-[rgba(201,169,110,0.6)] hover:bg-[rgba(201,169,110,0.08)]"
            >
              ← Back to home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </LenisProvider>
  );
}
