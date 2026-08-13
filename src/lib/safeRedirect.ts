export type UserKind = "customer" | "employee" | "owner";

const ALLOWED_PREFIXES = ["/admin", "/account", "/workspace"];

export function defaultHome(kind: UserKind): string {
  if (kind === "owner") return "/admin";
  if (kind === "employee") return "/workspace";
  return "/account";
}

function sanitizePath(next: string | null | undefined): string | null {
  if (!next) return null;
  let decoded = next.trim();
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    return null;
  }
  if (!decoded.startsWith("/")) return null;
  if (decoded.startsWith("//") || decoded.includes("\\") || /[a-z]+:\/\//i.test(decoded)) {
    return null;
  }
  if (decoded.includes("..")) return null;
  const pathOnly = decoded.split("?")[0] ?? decoded;
  if (pathOnly === "/admin/login" || pathOnly.startsWith("/admin/login?")) return "/admin";
  if (!ALLOWED_PREFIXES.some((prefix) => pathOnly === prefix || pathOnly.startsWith(`${prefix}/`))) {
    return null;
  }
  return decoded.startsWith("/") ? decoded : `/${decoded}`;
}

export function safeRedirectPath(next: string | null | undefined, kind: UserKind): string {
  const fallback = defaultHome(kind);
  const path = sanitizePath(next);
  if (!path) return fallback;

  const pathOnly = path.split("?")[0] ?? path;
  if (kind === "owner") {
    if (
      pathOnly === "/account" ||
      pathOnly.startsWith("/account/") ||
      pathOnly === "/workspace" ||
      pathOnly.startsWith("/workspace/")
    ) {
      return "/admin";
    }
  }
  if (kind === "employee") {
    if (pathOnly === "/account" || pathOnly.startsWith("/account/")) {
      return "/workspace";
    }
  }
  if (kind === "customer") {
    if (pathOnly === "/admin" || pathOnly.startsWith("/admin/") || pathOnly === "/workspace" || pathOnly.startsWith("/workspace/")) {
      return "/account";
    }
  }
  return path;
}

/** @deprecated Use safeRedirectPath with the authenticated user's kind. */
export function safeAdminPath(next: string | null | undefined): string {
  return safeRedirectPath(next, "owner");
}
