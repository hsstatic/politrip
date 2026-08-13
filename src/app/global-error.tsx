'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[#faf8f4] text-[#1a1a1a]">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#c9a84c] font-bold mb-4">PoliTrip</p>
        <h1 className="text-2xl sm:text-3xl font-light mb-3">Something went wrong</h1>
        <p className="text-sm text-black/50 max-w-md mb-8">
          Please refresh the page. If this keeps happening, contact us on WhatsApp.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.22em] bg-[#c9a84c] text-white"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
