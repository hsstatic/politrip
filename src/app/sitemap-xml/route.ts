import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.politrip.com.tr";
const ROUTES = ["", "/about", "/destination", "/hotels"];

export const dynamic = "force-static";

function locFor(lang: "en" | "tr" | "ar", route: string) {
  if (lang === "tr") return `${BASE_URL}${route || "/"}`;
  return `${BASE_URL}/${lang}${route}`;
}

export function GET() {
  const now = new Date().toISOString();
  const langs = ["tr", "en", "ar"] as const;
  const urls = langs
    .flatMap((lang) =>
      ROUTES.map((route) => {
        const isHome = route === "";
        return `  <url>
    <loc>${locFor(lang, route)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${isHome ? "daily" : "weekly"}</changefreq>
    <priority>${isHome ? "1.0" : "0.8"}</priority>
  </url>`;
      }),
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
