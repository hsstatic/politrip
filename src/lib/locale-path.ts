import type { Language } from '@/types';

/** Locales that appear as a URL prefix; Turkish uses unprefixed URLs. */
export const LOCALE_PREFIX: Record<Exclude<Language, 'tr'>, string> = {
  en: 'en',
  ar: 'ar',
};

export function stripLocaleFromPathname(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  const first = parts[0];
  if (first === 'en' || first === 'ar') {
    const rest = parts.slice(1).join('/');
    return rest ? `/${rest}` : '/';
  }
  return pathname || '/';
}

export function getLocaleFromPathname(pathname: string): Language {
  const first = pathname.split('/').filter(Boolean)[0];
  if (first === 'en') return 'en';
  if (first === 'ar') return 'ar';
  return 'tr';
}

/**
 * Public URL for a path: Turkish has no prefix; English and Arabic use /en and /ar.
 * Supports hash links e.g. `/#vip`.
 */
export function pathWithLocale(path: string, locale: Language): string {
  const hashIndex = path.indexOf('#');
  const raw = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : '';
  const normalized = raw.startsWith('/') ? raw : `/${raw}`;
  const core = normalized === '//' || normalized === '' ? '/' : normalized;

  let out: string;
  if (locale === 'tr') {
    out = core;
  } else {
    const prefix = LOCALE_PREFIX[locale];
    out =
      core === '/' ? `/${prefix}` : `/${prefix}${core}`;
  }
  return out + hash;
}
