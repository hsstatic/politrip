'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from '@/hooks/useTranslations';
import { pathWithLocale, getLocaleFromPathname } from '@/lib/locale-path';
import type { TranslationKey } from '@/lib/i18n';
import type { MarketingSlug } from '@/lib/marketing-slugs';

export function MarketingArticle({ slug }: { slug: MarketingSlug }) {
  const { t } = useTranslations();
  const pathname = usePathname();
  const homeHref = pathWithLocale('/', getLocaleFromPathname(pathname));

  return (
    <section className="relative border-b border-ink/8 px-6 pb-24 pt-28 md:px-10 bg-canvas bg-editorial-grid">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">
          PoliTrip
        </p>
        <h1
          className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-4xl"
          style={{ fontFamily: 'var(--font-display, serif)' }}
        >
          {t(`slug.${slug}.headline` as TranslationKey)}
        </h1>
        <p className="mt-6 text-base leading-relaxed text-ink-secondary">
          {t(`slug.${slug}.body` as TranslationKey)}
        </p>
        <Link
          href={homeHref}
          className="mt-10 inline-flex rounded-full border border-ink/15 px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:border-accent/50 hover:bg-accent/8"
        >
          {t('marketing.backHome')}
        </Link>
      </div>
    </section>
  );
}
