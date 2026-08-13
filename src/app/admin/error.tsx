'use client';

import { useEffect } from 'react';

export default function AdminErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">Console</p>
      <h1
        className="mb-3 text-2xl font-light text-ink"
        style={{ fontFamily: 'var(--font-display, serif)' }}
      >
        Couldn’t load this page
      </h1>
      <p className="mb-8 max-w-md text-sm text-ink/50">
        The admin session is valid, but Convex rejected the request. Confirm{' '}
        <code className="text-ink/70">ADMIN_SECRET</code> matches in Next.js and Convex, then try again.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-lg bg-gradient-to-br from-accent-light via-accent to-accent-dark px-6 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-on-accent transition-all hover:brightness-110"
      >
        Try again
      </button>
    </div>
  );
}
