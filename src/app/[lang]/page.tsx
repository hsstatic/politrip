import LenisProvider from "@/components/providers/LenisProvider";
import CustomCursor from "@/components/providers/CustomCursor";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import GlobeBackground from "@/components/3d/GlobeBackground";

import Hero from "@/components/sections/Hero";
import Destinations from "@/components/sections/Destinations";
import Hotels from "@/components/sections/Hotels";
import Testimonials from "@/components/sections/Testimonials";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <LenisProvider>
      <GlobeBackground />
      <CustomCursor />
      <Navbar />
      <main className="relative flex min-h-0 flex-1 flex-col">
        <Hero />
        <Destinations />
        <Hotels />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </LenisProvider>
  );
}
