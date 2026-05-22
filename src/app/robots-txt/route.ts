import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.politrip.com.tr";

export const dynamic = "force-static";

export function GET() {
  const txt = `User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /api/

Sitemap: ${BASE_URL}/sitemap.xml`;

  return new NextResponse(txt, {
    headers: { "Content-Type": "text/plain" },
  });
}
