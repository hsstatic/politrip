import { NextRequest, NextResponse } from "next/server";
import {
  LEGACY_SESSION_COOKIE,
  mintConvexUserToken,
  readSession,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/authSession";
import { api, getConvexClient } from "@/lib/convexServer";

export async function POST(req: NextRequest) {
  const claims = await readSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!claims) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (claims.kind === "owner") {
    return NextResponse.json({ error: "Owner accounts cannot be self-deactivated." }, { status: 403 });
  }

  const convex = getConvexClient();
  const minted = await mintConvexUserToken(claims);
  if (!convex || !minted) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await convex.mutation(api.users.deactivateMe, { authToken: minted.token });
  } catch {
    return NextResponse.json({ error: "Could not deactivate account." }, { status: 503 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0));
  res.cookies.set(LEGACY_SESSION_COOKIE, "", sessionCookieOptions(0));
  return res;
}
