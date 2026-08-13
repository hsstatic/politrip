/**
 * Staff gate for existing content mutations.
 * Identity tokens are HMAC v2 (user-bound). Server tokens remain HMAC v1.
 */
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { requireStaff } from "./authz";

export async function requireAdmin(
  ctx: QueryCtx | MutationCtx,
  token: string,
): Promise<void> {
  await requireStaff(ctx, token);
}
