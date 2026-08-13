/**
 * HMAC-signed multi-role sessions + short-lived Convex identity tokens.
 * Runs in Node API routes and Edge `proxy.ts`.
 */

export const SESSION_COOKIE = "politrip_session";
export const LEGACY_SESSION_COOKIE = "admin_session";

const SESSION_TTL_REMEMBER_SEC = 60 * 60 * 24 * 7;
const SESSION_TTL_SHORT_SEC = 60 * 60 * 12;
const CONVEX_TOKEN_TTL_SEC = 60 * 60;

export type UserKind = "customer" | "employee" | "owner";

export type SessionClaims = {
  userId: string;
  kind: UserKind;
  tokenVersion: number;
  exp: number;
  sessionId: string;
};

function getSigningSecret(): string | undefined {
  return process.env.ADMIN_SECRET || process.env.DASHBOARD_PASSWORD || undefined;
}

export function getAdminSigningSecret(): string | undefined {
  return getSigningSecret();
}

export function getAdminEmail(): string | undefined {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return email || undefined;
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function isUserKind(value: string): value is UserKind {
  return value === "customer" || value === "employee" || value === "owner";
}

async function mintV1(secret: string, ttlSec: number): Promise<{ token: string; exp: number }> {
  const exp = Math.floor(Date.now() / 1000) + ttlSec;
  const nonce = randomNonce();
  const payload = `v1.${exp}.${nonce}`;
  const sig = await hmacHex(secret, payload);
  return { token: `${payload}.${sig}`, exp };
}

export async function mintServerToken(ttlSec = 120): Promise<{ token: string; exp: number } | null> {
  const secret = getSigningSecret();
  if (!secret) return null;
  return mintV1(secret, ttlSec);
}

export async function verifyServerToken(token: string | undefined | null): Promise<boolean> {
  const secret = getSigningSecret();
  if (!secret || !token) return false;
  const parts = token.split(".");
  if (parts.length !== 4 || parts[0] !== "v1") return false;
  const [, expStr, nonce, sig] = parts;
  if (!/^\d+$/.test(expStr) || !/^[0-9a-f]+$/i.test(nonce) || !/^[0-9a-f]+$/i.test(sig)) {
    return false;
  }
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;
  const expected = await hmacHex(secret, `v1.${expStr}.${nonce}`);
  return timingSafeEqualHex(sig.toLowerCase(), expected);
}

export async function mintSessionCookie(claims: {
  userId: string;
  kind: UserKind;
  tokenVersion: number;
  sessionId: string;
  rememberMe?: boolean;
}): Promise<{ token: string; maxAge: number; exp: number } | null> {
  const secret = getSigningSecret();
  if (!secret) return null;
  const ttl = claims.rememberMe ? SESSION_TTL_REMEMBER_SEC : SESSION_TTL_SHORT_SEC;
  const exp = Math.floor(Date.now() / 1000) + ttl;
  const payload = `v2.${claims.userId}.${claims.kind}.${claims.tokenVersion}.${exp}.${claims.sessionId}`;
  const sig = await hmacHex(secret, payload);
  return { token: `${payload}.${sig}`, maxAge: ttl, exp };
}

export async function readSession(token: string | undefined | null): Promise<SessionClaims | null> {
  const secret = getSigningSecret();
  if (!secret || !token) return null;
  const parts = token.split(".");
  if (parts.length !== 7 || parts[0] !== "v2") return null;
  const [, userId, kind, tokenVersionStr, expStr, sessionId, sig] = parts;
  if (!userId || !isUserKind(kind) || !/^[a-z0-9_-]{8,64}$/i.test(userId)) return null;
  if (!/^\d+$/.test(tokenVersionStr) || !/^\d+$/.test(expStr)) return null;
  if (!/^[a-z0-9_-]{8,64}$/i.test(sessionId) || !/^[0-9a-f]+$/i.test(sig)) return null;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return null;
  const expected = await hmacHex(secret, `v2.${userId}.${kind}.${tokenVersionStr}.${expStr}.${sessionId}`);
  if (!timingSafeEqualHex(sig.toLowerCase(), expected)) return null;
  return {
    userId,
    kind,
    tokenVersion: Number(tokenVersionStr),
    exp,
    sessionId,
  };
}

export async function mintConvexUserToken(claims: {
  userId: string;
  kind: UserKind;
  tokenVersion: number;
  sessionId: string;
}): Promise<{ token: string; exp: number } | null> {
  const secret = getSigningSecret();
  if (!secret) return null;
  const exp = Math.floor(Date.now() / 1000) + CONVEX_TOKEN_TTL_SEC;
  const payload = `v2.${claims.userId}.${claims.kind}.${claims.tokenVersion}.${exp}.${claims.sessionId}`;
  const sig = await hmacHex(secret, payload);
  return { token: `${payload}.${sig}`, exp };
}

export async function emailsMatch(provided: unknown, expected: string): Promise<boolean> {
  if (typeof provided !== "string") return false;
  const a = provided.trim().toLowerCase();
  const b = expected.trim().toLowerCase();
  if (!a || !b) return false;
  const enc = new TextEncoder();
  const ha = new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(`politrip-email:${a}`)));
  const hb = new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(`politrip-email:${b}`)));
  if (ha.length !== hb.length) return false;
  let out = 0;
  for (let i = 0; i < ha.length; i++) out |= ha[i] ^ hb[i];
  return out === 0;
}

export async function passwordsMatch(provided: unknown, expected: string): Promise<boolean> {
  if (typeof provided !== "string" || provided.length === 0) return false;
  const enc = new TextEncoder();
  const a = await crypto.subtle.digest("SHA-256", enc.encode(`politrip-pw:${provided}`));
  const b = await crypto.subtle.digest("SHA-256", enc.encode(`politrip-pw:${expected}`));
  const ha = new Uint8Array(a);
  const hb = new Uint8Array(b);
  if (ha.length !== hb.length) return false;
  let out = 0;
  for (let i = 0; i < ha.length; i++) out |= ha[i] ^ hb[i];
  return out === 0;
}

export function sessionCookieOptions(maxAge?: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    ...(typeof maxAge === "number" ? { maxAge } : {}),
    secure: process.env.NODE_ENV === "production",
  };
}

/** Legacy boolean check used by older pages. */
export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  return (await readSession(token)) !== null;
}
