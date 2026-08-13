import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center bg-canvas text-ink">
      <p className="text-[11px] uppercase tracking-[0.28em] text-accent font-bold mb-4">404</p>
      <h1
        className="text-3xl sm:text-4xl font-light mb-3"
        style={{ fontFamily: 'var(--font-display, serif)' }}
      >
        Page not found
      </h1>
      <p className="text-sm text-ink/50 max-w-md mb-8">
        This page doesn’t exist or may have moved. Return home to continue planning your trip.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.22em] bg-accent text-on-accent hover:brightness-110 transition-all"
      >
        Back to home
      </Link>
    </div>
  );
}
