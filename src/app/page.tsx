import CustomCursor from "@/components/providers/CustomCursor";
import LenisProvider from "@/components/providers/LenisProvider";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Hotels from "@/components/sections/Hotels";
import Nightlife from "@/components/sections/Nightlife";
import Transportation from "@/components/sections/Transportation";
import VIPTrips from "@/components/sections/VIPTrips";

export default function Home() {
  return (
    <LenisProvider>
      <CustomCursor />
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col">
        <Hero />
        <VIPTrips />
        <Hotels />
        <Nightlife />
        <Transportation />
      </main>
      <Footer />
    </LenisProvider>
  );
}
