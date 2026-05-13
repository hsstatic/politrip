import type { Metadata } from 'next';
import LenisProvider from '@/components/providers/LenisProvider';
import CustomCursor from '@/components/providers/CustomCursor';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp';
import TourPackages from '@/components/sections/TourPackages';

export const metadata: Metadata = {
  title: 'Travel Packages',
  description:
    'Curated PoliTrip packages — from Classic Türkiye to VIP, Honeymoon, and Family escapes. Per-person pricing, transparent inclusions, instant WhatsApp booking.',
};

export default function PackagesPage() {
  return (
    <LenisProvider>
      <CustomCursor />
      <Navbar />
      <main className="relative flex min-h-0 flex-1 flex-col">
        <TourPackages />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </LenisProvider>
  );
}
