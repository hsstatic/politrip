import { notFound } from 'next/navigation';
import { LanguageSync } from '@/components/providers/LanguageSync';
import { HtmlLang } from '@/components/providers/HtmlLang';
import ConvexClientProvider from '@/components/providers/ConvexClientProvider';
import type { Language } from '@/types';

const locales: Language[] = ['tr', 'en', 'ar'];

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!locales.includes(lang as Language)) {
    notFound();
  }

  const locale = lang as Language;

  return (
    <ConvexClientProvider>
      <LanguageSync lang={lang} />
      <HtmlLang lang={locale} />
      {children}
    </ConvexClientProvider>
  );
}
