import type { Language } from '@/types';

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
  // tr is the default — no prefix in the URL
  return 'tr';
}

/** Builds a localized path. Turkish uses no prefix (canonical default). */
export function pathWithLocale(path: string, locale: Language): string {
  const hashIndex = path.indexOf('#');
  const raw = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : '';
  const normalized = raw.startsWith('/') ? raw : `/${raw}`;
  const core = normalized === '//' || normalized === '' ? '/' : normalized;

  if (locale === 'tr') {
    return core + hash;
  }

  const out = core === '/' ? `/${locale}` : `/${locale}${core}`;
  return out + hash;
}
