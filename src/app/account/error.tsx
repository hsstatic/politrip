'use client';

import { useEffect } from 'react';

export default function AccountErrorPage({
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
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">Account</p>
      <h1
        className="mb-3 text-2xl font-light text-ink"
        style={{ fontFamily: 'var(--font-display, serif)' }}
      >
        Couldn’t load this page
      </h1>
      <p className="mb-8 max-w-md text-sm text-ink/50">
        Please refresh or sign in again. If this continues, contact PoliTrip.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-lg bg-accent px-6 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-on-accent hover:brightness-110"
      >
        Try again
      </button>
    </div>
  );
}
