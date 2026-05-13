import type { Language } from '@/types';
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';
import tr from '@/locales/tr.json';

export type TranslationKey = keyof typeof en;

const dictionaries: Record<Language, Record<TranslationKey, string>> = {
  en: en as Record<TranslationKey, string>,
  ar: ar as Record<TranslationKey, string>,
  tr: tr as Record<TranslationKey, string>,
};

export function t(key: TranslationKey, lang: Language): string {
  const dict = dictionaries[lang] ?? dictionaries.en;
  return dict[key] ?? dictionaries.en[key] ?? String(key);
}

export function isRTL(lang: Language): boolean {
  return lang === 'ar';
}
