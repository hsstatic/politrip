'use server';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export type NewsletterState = { ok: boolean; error?: 'invalid' | 'server' };

export async function subscribeNewsletter(
  _prev: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const email = String(formData.get('email') ?? '').trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'invalid' };
  }

  if (!isSupabaseConfigured()) {
    return { ok: true };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { ok: true };
  }

  const { error } = await supabase.from('newsletter_subscribers').insert({ email });

  if (!error) {
    return { ok: true };
  }

  // Unique violation — treat as success
  if (error.code === '23505') {
    return { ok: true };
  }

  // Missing table or RLS — devs see it in server logs
  console.error('[newsletter]', error.message);
  return { ok: false, error: 'server' };
}
