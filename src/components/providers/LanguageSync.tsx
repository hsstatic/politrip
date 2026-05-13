'use client';

import { useEffect } from 'react';
import type { Language } from '@/types';
import { useAppStore } from '@/lib/store';

const VALID: Language[] = ['tr', 'en', 'ar'];

export function LanguageSync({ lang }: { lang: string }) {
  const setLanguage = useAppStore((s) => s.setLanguage);

  useEffect(() => {
    if (VALID.includes(lang as Language)) {
      setLanguage(lang as Language);
    }
  }, [lang, setLanguage]);

  return null;
}
