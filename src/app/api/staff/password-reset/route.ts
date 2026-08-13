import { NextRequest, NextResponse } from "next/server";
import { mintConvexUserToken, readSession } from "@/lib/authSession";
import { hashOpaqueToken, randomUrlToken } from "@/lib/password";
import { api, getConvexClient } from "@/lib/convexServer";
import type { Id } from "../../../../../convex/_generated/dataModel";

export async function POST(req: NextRequest) {
  const claims = await readSession(req.cookies.get("politrip_session")?.value);
  if (!claims || claims.kind === "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const userId = typeof (body as { userId?: unknown }).userId === "string"
    ? (body as { userId: string }).userId
    : "";
  if (!userId) {
    return NextResponse.json({ error: "User is required." }, { status: 400 });
  }

  const convex = getConvexClient();
  const minted = await mintConvexUserToken(claims);
  if (!convex || !minted) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const raw = randomUrlToken();
    const tokenHash = await hashOpaqueToken(raw);
    await convex.mutation(api.users.issueResetForUser, {
      adminToken: minted.token,
      userId: userId as Id<"users">,
      tokenHash,
      expiresAt: Date.now() + 60 * 60 * 1000,
    });
    const origin = req.nextUrl.origin;
    return NextResponse.json({
      ok: true,
      resetUrl: `${origin}/reset-password?token=${raw}`,
    });
  } catch {
    return NextResponse.json({ error: "Could not issue a reset link." }, { status: 403 });
  }
}
