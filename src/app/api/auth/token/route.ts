import { NextRequest, NextResponse } from "next/server";
import {
  LEGACY_SESSION_COOKIE,
  mintConvexUserToken,
  readSession,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/authSession";
import { api, withServerToken } from "@/lib/convexServer";
import type { Id } from "../../../../../convex/_generated/dataModel";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  const claims = await readSession(cookie);
  if (!claims) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const me = await withServerToken(async (convex, serverToken) => {
      try {
        await convex.mutation(api.users.ensureDefaultRoles, { serverToken });
      } catch {
        // seeding is best-effort so a session refresh still works
      }
      return convex.query(api.users.getMeWithPermissions, {
        serverToken,
        userId: claims.userId as Id<"users">,
        sessionId: claims.sessionId as Id<"sessions">,
      });
    });

    if (!me || me.user.status !== "active") {
      const res = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      res.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0));
      res.cookies.set(LEGACY_SESSION_COOKIE, "", sessionCookieOptions(0));
      return res;
    }

    if (me.user.kind !== claims.kind || me.user.tokenVersion !== claims.tokenVersion) {
      const res = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      res.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0));
      res.cookies.set(LEGACY_SESSION_COOKIE, "", sessionCookieOptions(0));
      return res;
    }

    const minted = await mintConvexUserToken({
      userId: me.user.id,
      kind: me.user.kind,
      tokenVersion: me.user.tokenVersion,
      sessionId: claims.sessionId,
    });
    if (!minted) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      token: minted.token,
      exp: minted.exp,
      user: me.user,
      permissions: me.permissions,
      roleName: me.roleName,
    });
  } catch (err) {
    console.error("[auth/token]", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
