import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseAnonKey, getSupabaseUrl } from './env';

/**
 * Refreshes the Supabase auth session and forwards cookies on the response.
 * Used from `src/proxy.ts` (Next.js 16 proxy convention).
 * Pass `initialResponse` when the proxy already chose redirect or rewrite.
 */
export async function updateSession(
  request: NextRequest,
  initialResponse?: NextResponse
) {
  const response = initialResponse ?? NextResponse.next({ request });

  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) {
    return response;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        Object.entries(headers).forEach(([name, value]) => {
          response.headers.set(name, value);
        });
      },
    },
  });

  await supabase.auth.getClaims();

  return response;
}
