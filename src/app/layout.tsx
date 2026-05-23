import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GA_ID = "G-2GVB5Q3K3H";

const displayFont = Inter({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmSans = Inter({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const cairo = Noto_Sans_Arabic({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.politrip.com.tr"
  ),
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
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
      lang="ar"
      suppressHydrationWarning
      className={`${displayFont.variable} ${dmSans.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas">
        {children}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}</Script>
      </body>
    </html>
  );
}
