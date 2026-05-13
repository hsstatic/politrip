'use client';

import { useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { isRTL, t, type TranslationKey } from '@/lib/i18n';

export function useTranslations() {
  const language = useAppStore((s) => s.language);
  const translate = useCallback((key: TranslationKey) => t(key, language), [language]);
  const rtl = isRTL(language);
  return {
    t: translate,
    language,
    isRTL: rtl,
    dir: rtl ? ('rtl' as const) : ('ltr' as const),
  };
}
