'use client';

import { useEffect } from 'react';

export default function ErrorPage({
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
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center bg-canvas text-ink">
      <p className="text-[11px] uppercase tracking-[0.28em] text-accent font-bold mb-4">PoliTrip</p>
      <h1 className="text-2xl sm:text-3xl font-light mb-3" style={{ fontFamily: 'var(--font-display, serif)' }}>
        Something went wrong
      </h1>
      <p className="text-sm text-ink/50 max-w-md mb-8">
        Please try again. If the problem continues, contact us on WhatsApp.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.22em] bg-accent text-on-accent hover:brightness-110 transition-all"
      >
        Try again
      </button>
    </div>
  );
}
