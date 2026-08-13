'use server';

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

export type NewsletterState = { ok: boolean; error?: 'invalid' | 'server' };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeNewsletter(
  _prev: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const email = String(formData.get('email') ?? '').trim();
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return { ok: false, error: 'invalid' };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return { ok: false, error: 'server' };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);
    await client.mutation(api.newsletter.subscribe, { email });
    return { ok: true };
  } catch {
    return { ok: false, error: 'server' };
  }
}
