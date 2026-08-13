import LenisProvider from '@/components/providers/LenisProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hotels from '@/components/sections/Hotels';

export default function HotelsPage() {
  return (
    <LenisProvider>
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col pt-20">
        <Hotels standalone />
      </main>
      <Footer />
    </LenisProvider>
  );
}
