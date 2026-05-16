import type { Metadata } from 'next';
import LenisProvider from '@/components/providers/LenisProvider';
import CustomCursor from '@/components/providers/CustomCursor';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hotels from '@/components/sections/Hotels';

export const metadata: Metadata = {
  title: 'Partner Hotels | PoliTrip',
  description: 'Browse our handpicked luxury hotels across Türkiye — from Istanbul palaces to Cappadocia retreats and Antalya resorts.',
};

export default function HotelsPage() {
  return (
    <LenisProvider>
      <CustomCursor />
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col pt-20">
        <Hotels />
      </main>
      <Footer />
    </LenisProvider>
  );
}
