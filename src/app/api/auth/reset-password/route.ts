import { NextRequest, NextResponse } from "next/server";
import { hashOpaqueToken, hashPassword, validatePassword } from "@/lib/password";
import { getClientIp, takeLoginSlot } from "@/lib/loginRateLimit";
import { api, withServerToken } from "@/lib/convexServer";

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > 4096) {
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
  const token = typeof record.token === "string" ? record.token.trim() : "";
  const password = typeof record.password === "string" ? record.password : "";
  const confirmPassword = typeof record.confirmPassword === "string" ? record.confirmPassword : "";

  if (!token || token.length < 32) {
    return NextResponse.json({ error: "This reset link is invalid or expired." }, { status: 400 });
  }
  const passwordErr = validatePassword(password);
  if (passwordErr) {
    return NextResponse.json({ error: passwordErr }, { status: 400 });
  }
  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
  }

  try {
    const tokenHash = await hashOpaqueToken(token);
    const passwordHash = await hashPassword(password);
    await withServerToken(async (convex, serverToken) =>
      convex.mutation(api.users.consumePasswordReset, {
        serverToken,
        tokenHash,
        passwordHash,
      }),
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "This reset link is invalid or expired." }, { status: 400 });
  }
}
