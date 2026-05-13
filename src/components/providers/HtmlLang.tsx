'use client';

import { useEffect } from 'react';
import type { Language } from '@/types';

export function HtmlLang({ lang }: { lang: Language }) {
  useEffect(() => {
    document.documentElement.lang = lang === 'ar' ? 'ar' : lang === 'tr' ? 'tr' : 'en';
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  return null;
}
