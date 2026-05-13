import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { type NextRequest, NextResponse } from 'next/server';

const PREFIXED_LOCALE_SEGMENTS = new Set(['en', 'ar']);
const isDashboard = createRouteMatcher(['/dashboard', '/dashboard/(.*)']);
const isAppRoute = createRouteMatcher(['/dashboard(.*)', '/sign-in(.*)', '/sign-up(.*)']);

function isPrefixedLocalePath(pathname: string): boolean {
  const first = pathname.split('/').filter(Boolean)[0];
  return first != null && PREFIXED_LOCALE_SEGMENTS.has(first);
}

function handleLocaleRouting(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname;

  if (pathname === '/tr' || pathname.startsWith('/tr/')) {
    const url = request.nextUrl.clone();
    const stripped = pathname === '/tr' ? '/' : pathname.slice(3) || '/';
    url.pathname = stripped.startsWith('/') ? stripped : `/${stripped}`;
    return NextResponse.redirect(url, 308);
  }

  if (isPrefixedLocalePath(pathname)) {
    return NextResponse.next({ request });
  }

  const url = request.nextUrl.clone();
  const internalPath = pathname === '/' ? '/tr' : `/tr${pathname}`;
  url.pathname = internalPath;
  return NextResponse.rewrite(url);
}

/**
 * Turkish is the default locale and has no URL prefix. Internally we serve it
 * under /tr/...; /tr in the browser is redirected away (canonical unprefixed).
 * English and Arabic use /en and /ar prefixes.
 * /dashboard routes require Clerk authentication.
 */
export const proxy = clerkMiddleware(async (auth, request) => {
  if (isDashboard(request)) {
    await auth.protect();
  }
  // Skip locale routing for dashboard and auth pages
  if (isAppRoute(request)) {
    return NextResponse.next();
  }
  return handleLocaleRouting(request);

});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
