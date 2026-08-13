import { NextRequest, NextResponse } from "next/server";
import {
  emailsMatch,
  getAdminEmail,
  LEGACY_SESSION_COOKIE,
  mintSessionCookie,
  passwordsMatch,
  SESSION_COOKIE,
  sessionCookieOptions,
  type UserKind,
} from "@/lib/authSession";
import { isValidEmail, normalizeEmail } from "@/lib/emailFormat";
import { hashPassword, verifyPassword } from "@/lib/password";
import { clearLoginSlot, getClientIp, takeLoginSlot } from "@/lib/loginRateLimit";
import { defaultHome, safeRedirectPath } from "@/lib/safeRedirect";
import { api, withServerToken } from "@/lib/convexServer";
import type { Id } from "../../../../../convex/_generated/dataModel";

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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const email = typeof record.email === "string" ? normalizeEmail(record.email) : "";
  const password = typeof record.password === "string" ? record.password : "";
  const rememberMe = record.rememberMe === true;
  const nextRaw = typeof record.next === "string" ? record.next : undefined;

  if (!isValidEmail(email) || !password) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await withServerToken(async (convex, serverToken) => {
      try {
        await convex.mutation(api.users.ensureDefaultRoles, { serverToken });
      } catch (err) {
        console.error("[auth/login] ensureDefaultRoles failed", err);
      }
      const record = await convex.query(api.users.getAuthRecord, { serverToken, email });

      const adminEmail = getAdminEmail();
      const envPassword = process.env.DASHBOARD_PASSWORD;
      const envEmailOk = adminEmail ? await emailsMatch(email, adminEmail) : false;
      const envPassOk = envPassword ? await passwordsMatch(password, envPassword) : false;

      let identity: {
        id: string;
        kind: UserKind;
        status: string;
        tokenVersion: number;
      } | null = record
        ? {
            id: record.id,
            kind: record.kind as UserKind,
            status: record.status,
            tokenVersion: record.tokenVersion,
          }
        : null;

      if (!record) {
        if (!adminEmail && envPassOk && process.env.NODE_ENV !== "production") {
          return { error: "admin_email_missing" as const };
        }
        if (!envEmailOk || !envPassOk || !adminEmail) {
          return { error: "Unauthorized" as const };
        }
        const passwordHash = await hashPassword(password);
        const owner = await convex.mutation(api.users.ensureOwner, {
          serverToken,
          email: adminEmail,
          passwordHash,
          firstName: "Owner",
          lastName: "PoliTrip",
        });
        identity = {
          id: owner.id,
          kind: owner.kind as UserKind,
          status: owner.status,
          tokenVersion: owner.tokenVersion,
        };
      } else {
        const hashOk = await verifyPassword(password, record.passwordHash);
        const ownerEnvOk = record.kind === "owner" && envEmailOk && envPassOk;
        if (!hashOk && !ownerEnvOk) return { error: "Unauthorized" as const };
        if (!hashOk && ownerEnvOk) {
          const passwordHash = await hashPassword(password);
          const owner = await convex.mutation(api.users.ensureOwner, {
            serverToken,
            email: record.email,
            passwordHash,
            firstName: record.firstName,
            lastName: record.lastName,
            phone: record.phone,
          });
          identity = {
            id: owner.id,
            kind: owner.kind as UserKind,
            status: owner.status,
            tokenVersion: owner.tokenVersion,
          };
        }
      }

      if (!identity || identity.status !== "active") {
        return { error: identity?.status === "disabled" ? "disabled" : "Unauthorized" };
      }

      const ttlMs = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 12 * 60 * 60 * 1000;
      const session = await convex.mutation(api.users.createSession, {
        serverToken,
        userId: identity.id as Id<"users">,
        expiresAt: Date.now() + ttlMs,
        userAgent: req.headers.get("user-agent")?.slice(0, 300) ?? undefined,
        ip,
      });

      return {
        user: {
          id: identity.id,
          kind: identity.kind,
          tokenVersion: identity.tokenVersion,
          sessionId: session.sessionId as string,
        },
      };
    });

    if ("error" in result) {
      if (result.error === "admin_email_missing") {
        return NextResponse.json(
          { error: "Set ADMIN_EMAIL in .env.local to the owner email, then sign in with that address." },
          { status: 503 },
        );
      }
      const status = result.error === "disabled" ? 403 : 401;
      return NextResponse.json(
        { error: result.error === "disabled" ? "This account is disabled." : "Unauthorized" },
        { status },
      );
    }

    const cookie = await mintSessionCookie({
      userId: result.user.id,
      kind: result.user.kind,
      tokenVersion: result.user.tokenVersion,
      sessionId: result.user.sessionId,
      rememberMe,
    });
    if (!cookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    clearLoginSlot(ip);
    const next = safeRedirectPath(nextRaw, result.user.kind) || defaultHome(result.user.kind);
    const res = NextResponse.json({ ok: true, next, kind: result.user.kind });
    res.cookies.set(SESSION_COOKIE, cookie.token, sessionCookieOptions(cookie.maxAge));
    res.cookies.set(LEGACY_SESSION_COOKIE, "", sessionCookieOptions(0));
    return res;
  } catch (err) {
    console.error("[auth/login]", err);
    return NextResponse.json({ error: "Sign-in is temporarily unavailable." }, { status: 503 });
  }
}
