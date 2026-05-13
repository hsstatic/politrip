import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, Cairo } from "next/font/google";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "PoliTrip | VIP tourism & luxury travel in Türkiye",
    template: "%s | PoliTrip",
  },
  description:
    "PoliTrip crafts premium Gulf-facing journeys across Türkiye — VIP experiences, five-star hotels, nightlife, and seamless transfers with Arabic- and English-speaking concierge support.",
  keywords: [
    "PoliTrip",
    "Türkiye tourism",
    "VIP travel Turkey",
    "Gulf travelers",
    "luxury hotels Istanbul",
    "Cappadocia VIP",
    "رحلات تركيا",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "PoliTrip",
    title: "PoliTrip | VIP tourism & luxury travel in Türkiye",
    description:
      "Premium itineraries, luxury stays, and on-the-ground care for guests from the Gulf and beyond.",
  },
};

export const viewport: Viewport = {
  themeColor: "#02122d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${dmSans.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas">{children}</body>
    </html>
  );
}
