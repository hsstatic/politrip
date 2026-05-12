/** Public Supabase project URL (Dashboard → Settings → API → Project URL). */
export function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '';
}

/**
 * Publishable (new) or anon (legacy) key for browser + server user-scoped calls.
 * Dashboard → Settings → API → Publishable / anon public key.
 */
export function getSupabaseAnonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    ''
  );
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}
