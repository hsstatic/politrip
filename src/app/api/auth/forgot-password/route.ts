import { NextRequest, NextResponse } from "next/server";
import { isValidEmail, normalizeEmail } from "@/lib/emailFormat";
import { hashOpaqueToken, randomUrlToken } from "@/lib/password";
import { getClientIp, takeLoginSlot } from "@/lib/loginRateLimit";
import { api, withServerToken } from "@/lib/convexServer";
import { emailConfigured, passwordResetEmail, sendEmail } from "@/lib/sendEmail";

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > 2048) {
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
    return NextResponse.json({ ok: true });
  }

  const emailRaw =
    body && typeof body === "object" && "email" in body ? (body as { email: unknown }).email : undefined;
  const email = typeof emailRaw === "string" ? normalizeEmail(emailRaw) : "";
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: true });
  }

  try {
    const raw = randomUrlToken();
    const tokenHash = await hashOpaqueToken(raw);
    const created = await withServerToken(async (convex, serverToken) =>
      convex.mutation(api.users.createPasswordReset, {
        serverToken,
        email,
        tokenHash,
        expiresAt: Date.now() + 60 * 60 * 1000,
      }),
    );

    const origin = (process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin).replace(/\/$/, "");
    const resetUrl = `${origin}/reset-password?token=${raw}`;

    if (created.created && emailConfigured()) {
      const copy = passwordResetEmail({
        firstName: created.firstName ?? "",
        resetUrl,
      });
      await sendEmail({ to: email, ...copy });
    }

    const devReturn =
      process.env.NODE_ENV !== "production" || process.env.PASSWORD_RESET_DEV_RETURN === "true";

    return NextResponse.json({
      ok: true,
      ...(devReturn && created.created ? { resetUrl: `/reset-password?token=${raw}` } : {}),
    });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
