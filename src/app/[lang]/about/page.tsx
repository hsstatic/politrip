import type { Metadata } from 'next';
import LenisProvider from '@/components/providers/LenisProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AboutContent from '@/components/sections/AboutContent';

export const metadata: Metadata = {
  title: 'About Us | PoliTrip',
  description: 'PoliTrip is a Turkish luxury travel agency built exclusively for Gulf guests — bespoke itineraries, five-star hotels, and 24/7 concierge care.',
};

export default function AboutPage() {
  return (
    <LenisProvider>
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col">
        <AboutContent />
      </main>
      <Footer />
    </LenisProvider>
  );
}
