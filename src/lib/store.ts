'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language, Currency, Booking } from '@/types';

interface AppState {
  language: Language;
  currency: Currency;
  wishlist: string[];
  recentlyViewed: string[];
  bookings: Booking[];
  isBookingModalOpen: boolean;
  bookingItem: { type: string; id: string } | null;
  isMobileMenuOpen: boolean;
  setLanguage: (lang: Language) => void;
  setCurrency: (currency: Currency) => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  addRecentlyViewed: (id: string) => void;
  openBookingModal: (type: string, id: string) => void;
  closeBookingModal: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  addBooking: (booking: Booking) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'tr',
      currency: 'USD',
      wishlist: [],
      recentlyViewed: [],
      bookings: [],
      isBookingModalOpen: false,
      bookingItem: null,
      isMobileMenuOpen: false,

      setLanguage: (lang) => set({ language: lang }),
      setCurrency: (currency) => set({ currency }),

      toggleWishlist: (id) =>
        set((state) => ({
          wishlist: state.wishlist.includes(id)
            ? state.wishlist.filter((w) => w !== id)
            : [...state.wishlist, id],
        })),

      isWishlisted: (id) => get().wishlist.includes(id),

      addRecentlyViewed: (id) =>
        set((state) => {
          const filtered = state.recentlyViewed.filter((r) => r !== id);
          return { recentlyViewed: [id, ...filtered].slice(0, 10) };
        }),

      openBookingModal: (type, id) =>
        set({ isBookingModalOpen: true, bookingItem: { type, id } }),

      closeBookingModal: () =>
        set({ isBookingModalOpen: false, bookingItem: null }),

      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

      addBooking: (booking) =>
        set((state) => ({ bookings: [...state.bookings, booking] })),
    }),
    {
      name: 'politrip-store',
      partialize: (state) => ({
        language: state.language,
        currency: state.currency,
        wishlist: state.wishlist,
        recentlyViewed: state.recentlyViewed,
      }),
    }
  )
);

export const currencyRates: Record<Currency, number> = {
  USD: 1,
  SAR: 3.75,
  AED: 3.67,
  TRY: 32.5,
  QAR: 3.64,
  KWD: 0.31,
};

export const currencySymbols: Record<Currency, string> = {
  USD: '$',
  SAR: 'ر.س',
  AED: 'د.إ',
  TRY: '₺',
  QAR: 'ر.ق',
  KWD: 'د.ك',
};

export function formatPrice(usdPrice: number, currency: Currency): string {
  const rate = currencyRates[currency];
  const symbol = currencySymbols[currency];
  const converted = Math.round(usdPrice * rate);
  return `${symbol}${converted.toLocaleString()}`;
}
