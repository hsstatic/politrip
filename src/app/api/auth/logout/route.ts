import { NextRequest, NextResponse } from "next/server";
import {
  LEGACY_SESSION_COOKIE,
  readSession,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/authSession";
import { api, withServerToken } from "@/lib/convexServer";
import type { Id } from "../../../../../convex/_generated/dataModel";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const claims = await readSession(token);
  if (claims) {
    try {
      await withServerToken(async (convex, serverToken) => {
        await convex.mutation(api.users.revokeSession, {
          serverToken,
          sessionId: claims.sessionId as Id<"sessions">,
          userId: claims.userId as Id<"users">,
        });
      });
    } catch {
      // still clear the cookie
    }
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0));
  res.cookies.set(LEGACY_SESSION_COOKIE, "", sessionCookieOptions(0));
  return res;
}
