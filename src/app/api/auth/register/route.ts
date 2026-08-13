import { NextRequest, NextResponse } from "next/server";
import {
  LEGACY_SESSION_COOKIE,
  mintSessionCookie,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/authSession";
import { isValidEmail, normalizeEmail } from "@/lib/emailFormat";
import { hashPassword, validateName, validatePassword } from "@/lib/password";
import { isValidPhone, normalizePhone } from "@/lib/phoneFormat";
import { clearLoginSlot, getClientIp, takeLoginSlot } from "@/lib/loginRateLimit";
import { api, withServerToken } from "@/lib/convexServer";
import type { Id } from "../../../../../convex/_generated/dataModel";

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > 8192) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  const ip = getClientIp(req.headers);
  const slot = takeLoginSlot(ip);
  if (!slot.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(slot.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const firstName = typeof record.firstName === "string" ? record.firstName : "";
  const lastName = typeof record.lastName === "string" ? record.lastName : "";
  const email = typeof record.email === "string" ? normalizeEmail(record.email) : "";
  const phone = typeof record.phone === "string" ? normalizePhone(record.phone) : "";
  const password = typeof record.password === "string" ? record.password : "";
  const confirmPassword = typeof record.confirmPassword === "string" ? record.confirmPassword : "";

  const errors: Record<string, string> = {};
  const firstErr = validateName(firstName, "First name");
  if (firstErr) errors.firstName = firstErr;
  const lastErr = validateName(lastName, "Last name");
  if (lastErr) errors.lastName = lastErr;
  if (!isValidEmail(email)) errors.email = "Please enter a valid email address.";
  if (!isValidPhone(phone)) errors.phone = "Please enter a valid phone number.";
  const passwordErr = validatePassword(password);
  if (passwordErr) errors.password = passwordErr;
  if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed", fields: errors }, { status: 400 });
  }

  try {
    const passwordHash = await hashPassword(password);
    const created = await withServerToken(async (convex, serverToken) => {
      try {
        await convex.mutation(api.users.ensureDefaultRoles, { serverToken });
      } catch (err) {
        console.error("[auth/register] ensureDefaultRoles failed", err);
      }
      return await convex.mutation(api.users.registerCustomer, {
        serverToken,
        email,
        passwordHash,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone,
      });
    });

    const ttlMs = 12 * 60 * 60 * 1000;
    const session = await withServerToken(async (convex, serverToken) =>
      convex.mutation(api.users.createSession, {
        serverToken,
        userId: created.id as Id<"users">,
        expiresAt: Date.now() + ttlMs,
        userAgent: req.headers.get("user-agent")?.slice(0, 300) ?? undefined,
        ip,
      }),
    );

    const cookie = await mintSessionCookie({
      userId: created.id,
      kind: "customer",
      tokenVersion: created.tokenVersion,
      sessionId: session.sessionId as string,
      rememberMe: false,
    });
    if (!cookie) {
      return NextResponse.json({ error: "Could not complete sign-up." }, { status: 503 });
    }

    clearLoginSlot(ip);
    const res = NextResponse.json({ ok: true, next: "/account" });
    res.cookies.set(SESSION_COOKIE, cookie.token, sessionCookieOptions(cookie.maxAge));
    res.cookies.set(LEGACY_SESSION_COOKIE, "", sessionCookieOptions(0));
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.toLowerCase().includes("already")) {
      return NextResponse.json(
        { error: "An account with this email already exists.", fields: { email: "This email is already registered." } },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "Could not create your account. Please try again." }, { status: 503 });
  }
}
