import { NextResponse } from "next/server";
import {
  LEGACY_SESSION_COOKIE,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/authSession";

export function applySessionCookie(
  res: NextResponse,
  token: string,
  maxAge: number,
) {
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(maxAge));
  res.cookies.set(LEGACY_SESSION_COOKIE, "", sessionCookieOptions(0));
}

export function clearSessionCookies(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0));
  res.cookies.set(LEGACY_SESSION_COOKIE, "", sessionCookieOptions(0));
}
