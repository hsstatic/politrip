import LenisProvider from "@/components/providers/LenisProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import ScrollProgressLine from "@/components/providers/ScrollProgressLine";
import ScrollVignette from "@/components/providers/ScrollVignette";

import Hero from "@/components/sections/Hero";
import Destinations from "@/components/sections/Destinations";
import HomeHotels from "@/components/sections/HomeHotels";
import Gallery from "@/components/sections/Gallery";
import Testimonials from "@/components/sections/Testimonials";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <LenisProvider>
      <ScrollProgressLine />
      <ScrollVignette />
      <Navbar />
      <main className="relative flex min-h-0 flex-1 flex-col">
        <Hero />
        <Destinations />
        <HomeHotels />
        <Gallery />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </LenisProvider>
  );
}
