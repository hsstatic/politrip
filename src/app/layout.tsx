import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    "PoliTrip crafts premium Gulf-facing journeys across Türkiye—VIP experiences, five-star hotels, nightlife, and seamless transfers with Arabic- and English-speaking concierge support.",
  keywords: [
    "PoliTrip",
    "Türkiye tourism",
    "VIP travel Turkey",
    "Gulf travelers",
    "luxury hotels Istanbul",
    "Cappadocia VIP",
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
  themeColor: "#030812",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
