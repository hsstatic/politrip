import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BASE_URL = "https://www.politrip.com.tr";
const LANGS = ["en", "tr", "ar"];
const ROUTES = ["", "/about", "/destination", "/hotels"];

function buildSitemap(): string {
  const now = new Date().toISOString();
  const urls = LANGS.flatMap((lang) =>
    ROUTES.map((route) => {
      const isHome = route === "";
      return `  <url>
    <loc>${BASE_URL}/${lang}${route}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${isHome ? "daily" : "weekly"}</changefreq>
    <priority>${isHome ? "1.0" : "0.8"}</priority>
  </url>`;
    })
  ).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

function buildRobots(): string {
  return `User-agent: *\nAllow: /\nDisallow: /dashboard/\nDisallow: /api/\n\nSitemap: ${BASE_URL}/sitemap.xml`;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/sitemap.xml") {
    return new NextResponse(buildSitemap(), {
      headers: { "Content-Type": "application/xml" },
    });
  }

  if (pathname === "/robots.txt") {
    return new NextResponse(buildRobots(), {
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sitemap.xml", "/robots.txt"],
};
