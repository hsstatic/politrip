import type { MutationCtx, QueryCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { ALL_PERMISSIONS, type Permission } from "./permissions";

type Ctx = QueryCtx | MutationCtx;

export type Identity = {
  user: Doc<"users">;
  permissions: Set<string>;
  sessionId?: Id<"sessions">;
};

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
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

export async function requireServerToken(token: string): Promise<void> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("Unauthorized");
  const parts = token.split(".");
  if (parts.length !== 4 || parts[0] !== "v1") throw new Error("Unauthorized");
  const [, expStr, nonce, sig] = parts;
  if (!/^\d+$/.test(expStr) || !/^[0-9a-f]+$/i.test(nonce) || !/^[0-9a-f]+$/i.test(sig)) {
    throw new Error("Unauthorized");
  }
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Unauthorized");
  }
  const expected = await hmacHex(secret, `v1.${expStr}.${nonce}`);
  if (!timingSafeEqualHex(sig.toLowerCase(), expected)) {
    throw new Error("Unauthorized");
  }
}

export async function requireIdentity(ctx: Ctx, token: string): Promise<Identity> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("Unauthorized");
  const parts = token.split(".");
  if (parts.length !== 7 || parts[0] !== "v2") throw new Error("Unauthorized");
  const [, userId, kind, tokenVersionStr, expStr, sessionId, sig] = parts;
  if (!userId || (kind !== "customer" && kind !== "employee" && kind !== "owner")) {
    throw new Error("Unauthorized");
  }
  if (!/^\d+$/.test(tokenVersionStr) || !/^\d+$/.test(expStr) || !/^[0-9a-f]+$/i.test(sig)) {
    throw new Error("Unauthorized");
  }
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Unauthorized");
  }
  const expected = await hmacHex(
    secret,
    `v2.${userId}.${kind}.${tokenVersionStr}.${expStr}.${sessionId}`,
  );
  if (!timingSafeEqualHex(sig.toLowerCase(), expected)) {
    throw new Error("Unauthorized");
  }

  const user = await ctx.db.get(userId as Id<"users">);
  if (!user || user.status !== "active") throw new Error("Unauthorized");
  if (user.kind !== kind) throw new Error("Unauthorized");
  if (user.tokenVersion !== Number(tokenVersionStr)) throw new Error("Unauthorized");

  let validSessionId: Id<"sessions"> | undefined;
  if (sessionId) {
    const session = await ctx.db.get(sessionId as Id<"sessions">);
    if (
      !session ||
      session.userId !== user._id ||
      session.revokedAt ||
      session.expiresAt < Date.now()
    ) {
      throw new Error("Unauthorized");
    }
    validSessionId = session._id;
  }

  return {
    user,
    permissions: await resolvePermissions(ctx, user),
    sessionId: validSessionId,
  };
}

export async function resolvePermissions(ctx: Ctx, user: Doc<"users">): Promise<Set<string>> {
  if (user.kind === "owner") return new Set(ALL_PERMISSIONS);
  if (user.kind !== "employee" || !user.employeeRoleId) return new Set();
  const role = await ctx.db.get(user.employeeRoleId);
  if (!role) return new Set();
  return new Set(role.permissions);
}

export async function requirePermission(
  ctx: Ctx,
  token: string,
  permission: Permission,
): Promise<Identity> {
  const identity = await requireIdentity(ctx, token);
  if (identity.user.kind === "owner") return identity;
  if (!identity.permissions.has(permission)) throw new Error("Forbidden");
  return identity;
}

export async function requireOwner(ctx: Ctx, token: string): Promise<Identity> {
  const identity = await requireIdentity(ctx, token);
  if (identity.user.kind !== "owner") throw new Error("Forbidden");
  return identity;
}

export async function requireStaff(ctx: Ctx, token: string): Promise<Identity> {
  const identity = await requireIdentity(ctx, token);
  if (identity.user.kind === "customer") throw new Error("Forbidden");
  return identity;
}

export function toPublicUser(user: Doc<"users">) {
  return {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    address: user.address,
    city: user.city,
    country: user.country,
    kind: user.kind,
    employeeRoleId: user.employeeRoleId,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLoginAt: user.lastLoginAt,
    deactivatedAt: user.deactivatedAt,
  };
}

export function buildSearchText(input: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}): string {
  return `${input.firstName} ${input.lastName} ${input.email} ${input.phone}`.trim().toLowerCase();
}

export async function writeAudit(
  ctx: MutationCtx,
  args: {
    actor?: Doc<"users"> | null;
    action: string;
    entityType: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
  },
) {
  await ctx.db.insert("auditLogs", {
    actorUserId: args.actor?._id,
    actorEmail: args.actor?.email,
    actorKind: args.actor?.kind,
    action: args.action,
    entityType: args.entityType,
    entityId: args.entityId,
    metadata: args.metadata ? JSON.stringify(args.metadata) : undefined,
    createdAt: Date.now(),
  });
}

export async function notify(
  ctx: MutationCtx,
  args: {
    userId: Id<"users">;
    type: string;
    title: string;
    body: string;
    href?: string;
  },
) {
  await ctx.db.insert("notifications", {
    ...args,
    createdAt: Date.now(),
  });
}
