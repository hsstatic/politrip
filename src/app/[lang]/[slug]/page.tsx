import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CustomCursor from '@/components/providers/CustomCursor';
import LenisProvider from '@/components/providers/LenisProvider';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { MarketingArticle } from '@/components/marketing/MarketingArticle';
import { ContactPage } from '@/components/marketing/ContactPage';
import VIPExperience from '@/components/sections/VIPExperience';
import { isMarketingSlug, MARKETING_SLUGS } from '@/lib/marketing-slugs';
import en from '@/locales/en.json';
import type { Language } from '@/types';

const locales: Language[] = ['tr', 'en', 'ar'];

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    MARKETING_SLUGS.map((slug) => ({ lang, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isMarketingSlug(slug)) return {};
  const title = en[`slug.${slug}.title` as keyof typeof en] as string;
  const description = en[`slug.${slug}.body` as keyof typeof en] as string;
  return {
    title,
    description,
  };
}

export default async function MarketingSubPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!locales.includes(lang as Language) || !isMarketingSlug(slug)) notFound();

  return (
    <LenisProvider>
      <CustomCursor />
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col">
        {slug === 'vip' ? <VIPExperience /> : slug === 'contact' ? <ContactPage /> : <MarketingArticle slug={slug} />}
      </main>
      <Footer />
    </LenisProvider>
  );
}
