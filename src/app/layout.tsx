import type { Metadata, Viewport } from "next";
import { Poppins, Cairo } from "next/font/google";
import "./globals.css";

const displayFont = Poppins({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmSans = Poppins({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.politrip.com.tr"
  ),
  title: {
    default: "PoliTrip | VIP Tourism & Luxury Travel in Türkiye",
    template: "%s | PoliTrip",
  },
  description:
    "PoliTrip crafts premium journeys across Türkiye — VIP experiences, five-star hotels, and seamless transfers with multilingual concierge support.",
  keywords: [
    "PoliTrip",
    "Türkiye tourism",
    "VIP travel Turkey",
    "luxury travel Turkey",
    "luxury hotels Istanbul",
    "Cappadocia VIP tour",
    "Turkey travel agency",
    "سياحة تركيا",
    "رحلات تركيا فاخرة",
    "تور تركيا",
    "Türkiye lüks tatil",
    "İstanbul otel",
  ],
  authors: [{ name: "PoliTrip" }],
  creator: "PoliTrip",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["tr_TR", "ar_AR"],
    siteName: "PoliTrip",
    title: "PoliTrip | VIP Tourism & Luxury Travel in Türkiye",
    description:
      "Premium itineraries, luxury stays, and on-the-ground care for every traveler.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.politrip.com.tr",
  },
  twitter: {
    card: "summary_large_image",
    title: "PoliTrip | VIP Tourism & Luxury Travel in Türkiye",
    description:
      "Premium itineraries, luxury stays, and on-the-ground care for every traveler.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#02122d",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${displayFont.variable} ${dmSans.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas">{children}</body>
    </html>
  );
}
