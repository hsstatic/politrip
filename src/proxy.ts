import { type NextRequest, NextResponse } from 'next/server';

const PREFIXED_LOCALE_SEGMENTS = new Set(['en', 'ar']);

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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
