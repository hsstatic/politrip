import { NextRequest, NextResponse } from "next/server";
import { mintConvexUserToken, readSession } from "@/lib/authSession";
import { isValidEmail, normalizeEmail } from "@/lib/emailFormat";
import { hashPassword, validateName, validatePassword } from "@/lib/password";
import { isValidPhone, normalizePhone } from "@/lib/phoneFormat";
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

  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const firstName = typeof record.firstName === "string" ? record.firstName : "";
  const lastName = typeof record.lastName === "string" ? record.lastName : "";
  const email = typeof record.email === "string" ? normalizeEmail(record.email) : "";
  const phone = typeof record.phone === "string" ? normalizePhone(record.phone) : "";
  const password = typeof record.password === "string" ? record.password : "";
  const employeeRoleId = typeof record.employeeRoleId === "string" ? record.employeeRoleId : undefined;

  const errors: Record<string, string> = {};
  const firstErr = validateName(firstName, "First name");
  if (firstErr) errors.firstName = firstErr;
  const lastErr = validateName(lastName, "Last name");
  if (lastErr) errors.lastName = lastErr;
  if (!isValidEmail(email)) errors.email = "Enter a valid email.";
  if (!isValidPhone(phone)) errors.phone = "Enter a valid phone number.";
  const passwordErr = validatePassword(password);
  if (passwordErr) errors.password = passwordErr;
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed", fields: errors }, { status: 400 });
  }

  const convex = getConvexClient();
  const minted = await mintConvexUserToken(claims);
  if (!convex || !minted) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const passwordHash = await hashPassword(password);
    const created = await convex.mutation(api.employees.create, {
      adminToken: minted.token,
      email,
      passwordHash,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone,
      employeeRoleId: employeeRoleId as Id<"employeeRoles"> | undefined,
    });
    return NextResponse.json({ ok: true, user: created });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.toLowerCase().includes("already")) {
      return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    }
    if (message.toLowerCase().includes("forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Could not create employee." }, { status: 503 });
  }
}
