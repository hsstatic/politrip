'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from '@/types';

interface AppState {
  language: Language;
  isMobileMenuOpen: boolean;
  setLanguage: (lang: Language) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'ar',
      isMobileMenuOpen: false,
      setLanguage: (lang) => set({ language: lang }),
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
    }),
    {
      name: 'politrip-store',
      partialize: (state) => ({ language: state.language }),
    }
  )
);
