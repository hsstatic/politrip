export type Language = 'en' | 'ar';
export type Currency = 'USD' | 'SAR' | 'AED' | 'TRY' | 'QAR' | 'KWD';

export interface Trip {
  id: string;
  slug: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  location: string;
  duration: string;
  price: number;
  currency: Currency;
  category: TripCategory;
  rating: number;
  reviews: number;
  images: string[];
  highlights: { en: string[]; ar: string[] };
  includes: { en: string[]; ar: string[] };
  isVIP: boolean;
  isPopular: boolean;
  capacity: number;
  nextAvailable: string;
}

export type TripCategory = 'cultural' | 'adventure' | 'luxury' | 'nature' | 'yacht' | 'helicopter' | 'balloon';

export interface Hotel {
  id: string;
  slug: string;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  city: TurkishCity;
  stars: number;
  rating: number;
  reviews: number;
  price: number;
  images: string[];
  amenities: string[];
  category: HotelCategory;
  isVIP: boolean;
  coordinates: { lat: number; lng: number };
}

export type HotelCategory = 'ultra-luxury' | 'luxury' | 'boutique' | 'resort';
export type TurkishCity = 'istanbul' | 'antalya' | 'trabzon' | 'bursa' | 'cappadocia' | 'bodrum' | 'sapanca';

export interface Activity {
  id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  category: ActivityCategory;
  city: TurkishCity;
  price: number;
  duration: string;
  images: string[];
  rating: number;
  isPopular: boolean;
}

export type ActivityCategory = 'restaurant' | 'cruise' | 'cafe' | 'nightlife' | 'cultural' | 'family';

export interface Transportation {
  id: string;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  type: TransportationType;
  price: number;
  capacity: number;
  features: string[];
  image: string;
}

export type TransportationType = 'vip-sedan' | 'suv' | 'van' | 'limousine' | 'bus' | 'helicopter';

export interface Testimonial {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  avatar: string;
  rating: number;
  text: { en: string; ar: string };
  trip: string;
  date: string;
}

export interface VIPPackage {
  id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  price: number;
  duration: string;
  includes: string[];
  image: string;
  badge: string;
}

export interface Booking {
  id: string;
  userId: string;
  type: 'trip' | 'hotel' | 'activity' | 'transportation';
  itemId: string;
  startDate: string;
  endDate: string;
  guests: number;
  totalPrice: number;
  currency: Currency;
  status: BookingStatus;
  createdAt: string;
  notes?: string;
  contactPhone?: string;
  whatsapp?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country: string;
  role: 'user' | 'staff' | 'admin';
  createdAt: string;
  wishlist: string[];
  bookings: string[];
}

export interface CurrencyRate {
  USD: number;
  SAR: number;
  AED: number;
  TRY: number;
  QAR: number;
  KWD: number;
}

export interface NavItem {
  label: { en: string; ar: string };
  href: string;
  children?: NavItem[];
}

export interface MapCity {
  id: TurkishCity;
  name: { en: string; ar: string };
  coordinates: { x: number; y: number };
  description: { en: string; ar: string };
  image: string;
  highlights: string[];
  tripsCount: number;
  hotelsCount: number;
}
