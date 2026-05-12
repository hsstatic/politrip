import type { Language } from '@/types';

type TranslationKey =
  | 'nav.home' | 'nav.trips' | 'nav.hotels' | 'nav.nightlife' | 'nav.transport'
  | 'nav.about' | 'nav.contact' | 'nav.bookNow'
  | 'hero.subtitle' | 'hero.title1' | 'hero.title2' | 'hero.cta1' | 'hero.cta2'
  | 'hero.stat1' | 'hero.stat2' | 'hero.stat3' | 'hero.stat4'
  | 'trips.title' | 'trips.subtitle' | 'trips.viewAll' | 'trips.bookNow'
  | 'trips.vip' | 'trips.popular' | 'trips.duration' | 'trips.rating'
  | 'hotels.title' | 'hotels.subtitle' | 'hotels.viewAll' | 'hotels.perNight'
  | 'hotels.filter.all' | 'hotels.filter.istanbul' | 'hotels.filter.antalya'
  | 'hotels.filter.cappadocia' | 'hotels.filter.bursa' | 'hotels.filter.trabzon'
  | 'nightlife.title' | 'nightlife.subtitle'
  | 'transport.title' | 'transport.subtitle' | 'transport.book'
  | 'testimonials.title' | 'testimonials.subtitle'
  | 'map.title' | 'map.subtitle'
  | 'footer.tagline' | 'footer.rights' | 'footer.newsletter' | 'footer.subscribe'
  | 'footer.placeholder' | 'footer.subscribeInvalid' | 'footer.subscribeError' | 'common.from' | 'common.guests' | 'common.nights'
  | 'common.learnMore' | 'common.wishlist' | 'common.share'
  | 'booking.title' | 'booking.selectDate' | 'booking.guests' | 'booking.total'
  | 'booking.confirm' | 'booking.whatsapp' | 'booking.call';

type Translations = Record<TranslationKey, string>;

const en: Translations = {
  'nav.home': 'Home',
  'nav.trips': 'VIP Trips',
  'nav.hotels': 'Hotels',
  'nav.nightlife': 'Going Out',
  'nav.transport': 'Transport',
  'nav.about': 'About',
  'nav.contact': 'Contact',
  'nav.bookNow': 'Book Now',
  'hero.subtitle': 'Premium Gulf Tourism',
  'hero.title1': 'Discover',
  'hero.title2': 'Türkiye',
  'hero.cta1': 'Explore VIP Trips',
  'hero.cta2': 'View Packages',
  'hero.stat1': 'Happy Travelers',
  'hero.stat2': 'VIP Trips',
  'hero.stat3': 'Luxury Hotels',
  'hero.stat4': 'Gulf Offices',
  'trips.title': 'VIP Experiences',
  'trips.subtitle': 'Handcrafted journeys for the discerning Gulf traveler',
  'trips.viewAll': 'View All Trips',
  'trips.bookNow': 'Reserve Now',
  'trips.vip': 'VIP',
  'trips.popular': 'Popular',
  'trips.duration': 'Duration',
  'trips.rating': 'Rating',
  'hotels.title': 'Luxury Accommodations',
  'hotels.subtitle': "Türkiye's finest hotels curated for Gulf guests",
  'hotels.viewAll': 'View All Hotels',
  'hotels.perNight': 'per night',
  'hotels.filter.all': 'All Cities',
  'hotels.filter.istanbul': 'Istanbul',
  'hotels.filter.antalya': 'Antalya',
  'hotels.filter.cappadocia': 'Cappadocia',
  'hotels.filter.bursa': 'Bursa',
  'hotels.filter.trabzon': 'Trabzon',
  'nightlife.title': 'Going Out',
  'nightlife.subtitle': 'Discover the best of Istanbul\'s dining, nightlife & culture',
  'transport.title': 'VIP Transportation',
  'transport.subtitle': 'Seamless luxury transfers from touchdown to departure',
  'transport.book': 'Book Transfer',
  'testimonials.title': 'Guest Stories',
  'testimonials.subtitle': 'Words from our Gulf families who traveled with us',
  'map.title': 'Explore Türkiye',
  'map.subtitle': 'Discover remarkable destinations across this magnificent country',
  'footer.tagline': 'Premium Gulf Tourism to Türkiye',
  'footer.rights': 'All rights reserved.',
  'footer.newsletter': 'Newsletter',
  'footer.subscribe': 'Subscribe',
  'footer.placeholder': 'Your email address',
  'footer.subscribeInvalid': 'Please enter a valid email.',
  'footer.subscribeError': 'Something went wrong. Please try again later.',
  'common.from': 'From',
  'common.guests': 'Guests',
  'common.nights': 'Nights',
  'common.learnMore': 'Learn More',
  'common.wishlist': 'Save',
  'common.share': 'Share',
  'booking.title': 'Book Your Experience',
  'booking.selectDate': 'Select Date',
  'booking.guests': 'Number of Guests',
  'booking.total': 'Total',
  'booking.confirm': 'Confirm Booking',
  'booking.whatsapp': 'Book via WhatsApp',
  'booking.call': 'Call Us',
};

const ar: Translations = {
  'nav.home': 'الرئيسية',
  'nav.trips': 'رحلات VIP',
  'nav.hotels': 'الفنادق',
  'nav.nightlife': 'الترفيه',
  'nav.transport': 'المواصلات',
  'nav.about': 'عن الشركة',
  'nav.contact': 'اتصل بنا',
  'nav.bookNow': 'احجز الآن',
  'hero.subtitle': 'سياحة خليجية متميزة',
  'hero.title1': 'اكتشف',
  'hero.title2': 'تركيا',
  'hero.cta1': 'استكشف رحلات VIP',
  'hero.cta2': 'عرض الباقات',
  'hero.stat1': 'مسافر سعيد',
  'hero.stat2': 'رحلات VIP',
  'hero.stat3': 'فنادق فاخرة',
  'hero.stat4': 'مكاتب خليجية',
  'trips.title': 'تجارب VIP',
  'trips.subtitle': 'رحلات مصممة خصيصاً للمسافر الخليجي الراقي',
  'trips.viewAll': 'عرض جميع الرحلات',
  'trips.bookNow': 'احجز الآن',
  'trips.vip': 'VIP',
  'trips.popular': 'الأكثر طلباً',
  'trips.duration': 'المدة',
  'trips.rating': 'التقييم',
  'hotels.title': 'إقامات فاخرة',
  'hotels.subtitle': 'أفضل فنادق تركيا المختارة للضيوف الخليجيين',
  'hotels.viewAll': 'عرض جميع الفنادق',
  'hotels.perNight': 'في الليلة',
  'hotels.filter.all': 'جميع المدن',
  'hotels.filter.istanbul': 'إسطنبول',
  'hotels.filter.antalya': 'أنطاليا',
  'hotels.filter.cappadocia': 'كابادوكيا',
  'hotels.filter.bursa': 'بورصة',
  'hotels.filter.trabzon': 'طرابزون',
  'nightlife.title': 'الترفيه والمطاعم',
  'nightlife.subtitle': 'اكتشف أفضل مطاعم إسطنبول والحياة الليلية والثقافة',
  'transport.title': 'مواصلات VIP',
  'transport.subtitle': 'انتقالات فاخرة سلسة من الوصول حتى المغادرة',
  'transport.book': 'احجز نقل',
  'testimonials.title': 'قصص ضيوفنا',
  'testimonials.subtitle': 'كلمات من عائلاتنا الخليجية التي سافرت معنا',
  'map.title': 'استكشف تركيا',
  'map.subtitle': 'اكتشف وجهات رائعة في أرجاء هذه البلاد الرائعة',
  'footer.tagline': 'سياحة خليجية متميزة إلى تركيا',
  'footer.rights': 'جميع الحقوق محفوظة.',
  'footer.newsletter': 'النشرة البريدية',
  'footer.subscribe': 'اشترك',
  'footer.placeholder': 'بريدك الإلكتروني',
  'footer.subscribeInvalid': 'يرجى إدخال بريد إلكتروني صالح.',
  'footer.subscribeError': 'حدث خطأ. حاول مرة أخرى لاحقًا.',
  'common.from': 'من',
  'common.guests': 'ضيوف',
  'common.nights': 'ليالٍ',
  'common.learnMore': 'اعرف المزيد',
  'common.wishlist': 'حفظ',
  'common.share': 'مشاركة',
  'booking.title': 'احجز تجربتك',
  'booking.selectDate': 'اختر التاريخ',
  'booking.guests': 'عدد الضيوف',
  'booking.total': 'المجموع',
  'booking.confirm': 'تأكيد الحجز',
  'booking.whatsapp': 'احجز عبر واتساب',
  'booking.call': 'اتصل بنا',
};

const translations: Record<Language, Translations> = { en, ar };

export function t(key: TranslationKey, lang: Language): string {
  return translations[lang][key] ?? key;
}

export function useTranslation(lang: Language) {
  return (key: TranslationKey) => t(key, lang);
}
