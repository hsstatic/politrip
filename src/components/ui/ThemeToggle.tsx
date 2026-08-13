'use client';

import { useTheme } from '@/components/providers/ThemeProvider';

/**
 * Sun/moon theme switch. `useTheme` reads the <html> class through
 * useSyncExternalStore, so the icon re-syncs right after hydration without a
 * mounted guard.
 */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={`relative flex h-8 w-8 items-center justify-center rounded-full border border-edge text-ink-muted transition-colors duration-300 hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      {/* Sun */}
      <svg
        className={`absolute h-4 w-4 transition-all duration-300 ${isDark ? 'scale-0 opacity-0 -rotate-90' : 'scale-100 opacity-100 rotate-0'}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <circle cx="12" cy="12" r="4" />
        <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      {/* Moon */}
      <svg
        className={`absolute h-4 w-4 transition-all duration-300 ${isDark ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 rotate-90'}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
