import { type NextRequest, NextResponse } from "next/server";
import { readSession, SESSION_COOKIE } from "@/lib/authSession";
import { defaultHome } from "@/lib/safeRedirect";

const PREFIXED_LOCALE_SEGMENTS = new Set(["en", "ar"]);

const AUTH_PAGES = new Set([
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
]);

function isPrefixedLocalePath(pathname: string): boolean {
  const first = pathname.split("/").filter(Boolean)[0];
  return first != null && PREFIXED_LOCALE_SEGMENTS.has(first);
}

function handleLocaleRouting(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/tr" || pathname.startsWith("/tr/")) {
    const url = request.nextUrl.clone();
    const stripped = pathname === "/tr" ? "/" : pathname.slice(3) || "/";
    url.pathname = stripped.startsWith("/") ? stripped : `/${stripped}`;
    return NextResponse.redirect(url, 308);
  }

  if (isPrefixedLocalePath(pathname)) {
    return NextResponse.next({ request });
  }

  if (pathname === "/") {
    const chosen = request.cookies.get("politrip_lang")?.value;
    if (!chosen || chosen === "ar") {
      const url = request.nextUrl.clone();
      url.pathname = "/ar";
      return NextResponse.redirect(url, 307);
    }
    if (chosen === "en") {
      const url = request.nextUrl.clone();
      url.pathname = "/en";
      return NextResponse.redirect(url, 307);
    }
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/tr" : `/tr${pathname}`;
  return NextResponse.rewrite(url);
}

function loginRedirect(request: NextRequest, pathname: string) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/sign-in";
  const nextPath = `${pathname}${request.nextUrl.search}`;
  loginUrl.search = `?next=${encodeURIComponent(nextPath)}`;
  return NextResponse.redirect(loginUrl);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/sitemap.xml" || pathname === "/robots.txt") {
    return NextResponse.next();
  }

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/dashboard/, "/admin");
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/admin/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url);
  }

  const session = await readSession(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname.startsWith("/admin")) {
    if (!session) return loginRedirect(request, pathname);
    if (session.kind === "customer") {
      const url = request.nextUrl.clone();
      url.pathname = "/account";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname === "/workspace" || pathname.startsWith("/workspace/")) {
    if (!session) return loginRedirect(request, pathname);
    if (session.kind === "customer") {
      const url = request.nextUrl.clone();
      url.pathname = "/account";
      url.search = "";
      return NextResponse.redirect(url);
    }
    if (session.kind === "owner") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname === "/account" || pathname.startsWith("/account/")) {
    if (!session) return loginRedirect(request, pathname);
    return NextResponse.next();
  }

  if (AUTH_PAGES.has(pathname) || pathname.startsWith("/reset-password")) {
    if (session && (pathname === "/sign-in" || pathname === "/sign-up" || pathname === "/forgot-password")) {
      const url = request.nextUrl.clone();
      url.pathname = defaultHome(session.kind);
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  return handleLocaleRouting(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
