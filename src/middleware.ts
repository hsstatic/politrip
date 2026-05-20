import { NextRequest, NextResponse } from 'next/server';

const PREFIXED_LANGS = ['en', 'ar'];
const DEFAULT_LANG = 'tr';

function startsWithLang(pathname: string, lang: string) {
  return pathname === `/${lang}` || pathname.startsWith(`/${lang}/`);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Next.js internals and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/dashboard') ||
    /\.(.+)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Redirect /tr/... → /... (canonical URLs have no /tr prefix)
  if (startsWithLang(pathname, DEFAULT_LANG)) {
    const rest = pathname.slice(`/${DEFAULT_LANG}`.length) || '/';
    const url = request.nextUrl.clone();
    url.pathname = rest;
    return NextResponse.redirect(url, { status: 308 });
  }

  // Pass through /en/... and /ar/... unchanged
  for (const lang of PREFIXED_LANGS) {
    if (startsWithLang(pathname, lang)) {
      return NextResponse.next();
    }
  }

  // Rewrite unprefixed paths → /tr/... internally (URL stays clean)
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LANG}${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
