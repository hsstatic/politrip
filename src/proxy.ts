import { type NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://www.politrip.com.tr';
const LANGS = ['en', 'tr', 'ar'];
const ROUTES = ['', '/about', '/destination', '/hotels'];

function buildSitemap(): string {
  const now = new Date().toISOString();
  const urls = LANGS.flatMap((lang) =>
    ROUTES.map((route) => {
      const isHome = route === '';
      return `  <url>\n    <loc>${BASE_URL}/${lang}${route}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${isHome ? 'daily' : 'weekly'}</changefreq>\n    <priority>${isHome ? '1.0' : '0.8'}</priority>\n  </url>`;
    })
  ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

function buildRobots(): string {
  return `User-agent: *\nAllow: /\nDisallow: /dashboard/\nDisallow: /api/\n\nSitemap: ${BASE_URL}/sitemap.xml`;
}

const PREFIXED_LOCALE_SEGMENTS = new Set(['en', 'ar']);

function isPrefixedLocalePath(pathname: string): boolean {
  const first = pathname.split('/').filter(Boolean)[0];
  return first != null && PREFIXED_LOCALE_SEGMENTS.has(first);
}

function handleLocaleRouting(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname;

  // Redirect /tr/... → /... (canonical URLs have no /tr prefix)
  if (pathname === '/tr' || pathname.startsWith('/tr/')) {
    const url = request.nextUrl.clone();
    const stripped = pathname === '/tr' ? '/' : pathname.slice(3) || '/';
    url.pathname = stripped.startsWith('/') ? stripped : `/${stripped}`;
    return NextResponse.redirect(url, 308);
  }

  // Pass /en/... and /ar/... through unchanged
  if (isPrefixedLocalePath(pathname)) {
    return NextResponse.next({ request });
  }

  // On bare root with no explicit lang choice, default new visitors to /ar
  if (pathname === '/') {
    const chosen = request.cookies.get('politrip_lang')?.value;
    if (!chosen || chosen === 'ar') {
      const url = request.nextUrl.clone();
      url.pathname = '/ar';
      return NextResponse.redirect(url, 307);
    }
    if (chosen === 'en') {
      const url = request.nextUrl.clone();
      url.pathname = '/en';
      return NextResponse.redirect(url, 307);
    }
    // chosen === 'tr' — fall through to rewrite below
  }

  // Rewrite all unprefixed paths → /tr/... internally (URL stays clean)
  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' ? '/tr' : `/tr${pathname}`;
  return NextResponse.rewrite(url);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/sitemap.xml') {
    return new NextResponse(buildSitemap(), {
      headers: { 'Content-Type': 'application/xml' },
    });
  }

  if (pathname === '/robots.txt') {
    return new NextResponse(buildRobots(), {
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // Protect /dashboard/* but allow the login page through
  if (pathname.startsWith('/dashboard') && pathname !== '/dashboard/login') {
    const auth = request.cookies.get('dashboard_auth')?.value;
    if (auth !== 'true') {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/dashboard/login';
      return NextResponse.redirect(loginUrl);
    }
  }

  // Skip locale routing for dashboard and API routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  return handleLocaleRouting(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
