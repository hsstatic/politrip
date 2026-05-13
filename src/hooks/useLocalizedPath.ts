'use client';

import { usePathname } from 'next/navigation';
import { getLocaleFromPathname, pathWithLocale } from '@/lib/locale-path';

export function useLocalizedPath() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const withLocale = (path: string) => pathWithLocale(path, locale);
  return { locale, withLocale };
}
