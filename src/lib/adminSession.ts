/**
 * Compatibility re-exports. New auth lives in `authSession.ts`.
 */
export {
  SESSION_COOKIE,
  LEGACY_SESSION_COOKIE,
  getAdminSigningSecret,
  getAdminEmail,
  emailsMatch,
  passwordsMatch,
  mintServerToken as mintSessionToken,
  mintServerToken as mintConvexAdminToken,
  verifySessionToken,
  readSession,
  sessionCookieOptions,
} from "@/lib/authSession";
