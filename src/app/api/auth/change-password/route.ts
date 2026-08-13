import { NextRequest, NextResponse } from "next/server";
import {
  LEGACY_SESSION_COOKIE,
  readSession,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/authSession";
import { hashPassword, validatePassword, verifyPassword } from "@/lib/password";
import { api, withServerToken } from "@/lib/convexServer";
import type { Id } from "../../../../../convex/_generated/dataModel";

export async function POST(req: NextRequest) {
  const claims = await readSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!claims) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const currentPassword = typeof record.currentPassword === "string" ? record.currentPassword : "";
  const password = typeof record.password === "string" ? record.password : "";
  const confirmPassword = typeof record.confirmPassword === "string" ? record.confirmPassword : "";

  if (!currentPassword) {
    return NextResponse.json({ error: "Current password is required." }, { status: 400 });
  }
  const passwordErr = validatePassword(password);
  if (passwordErr) return NextResponse.json({ error: passwordErr }, { status: 400 });
  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
  }

  try {
    const result = await withServerToken(async (convex, serverToken) => {
      const me = await convex.query(api.users.getPublicById, {
        serverToken,
        userId: claims.userId as Id<"users">,
      });
      if (!me) return { error: "Unauthorized" as const };
      const auth = await convex.query(api.users.getAuthRecord, {
        serverToken,
        email: me.email,
      });
      if (!auth) return { error: "Unauthorized" as const };
      const match = await verifyPassword(currentPassword, auth.passwordHash);
      if (!match) return { error: "Current password is incorrect." as const };
      const passwordHash = await hashPassword(password);
      await convex.mutation(api.users.updatePasswordHash, {
        serverToken,
        userId: claims.userId as Id<"users">,
        passwordHash,
        revokeSessions: true,
      });
      return { ok: true as const };
    });

    if ("error" in result) {
      const status = result.error === "Current password is incorrect." ? 400 : 401;
      return NextResponse.json({ error: result.error }, { status });
    }

    const res = NextResponse.json({ ok: true, relogin: true });
    res.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0));
    res.cookies.set(LEGACY_SESSION_COOKIE, "", sessionCookieOptions(0));
    return res;
  } catch {
    return NextResponse.json({ error: "Could not update password." }, { status: 503 });
  }
}
