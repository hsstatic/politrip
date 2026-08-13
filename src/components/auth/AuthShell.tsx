'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { EASE_OUT } from '@/lib/motion';

export default function AuthShell({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const html = document.documentElement;
    const prevLang = html.lang;
    const prevDir = html.dir;
    html.lang = 'en';
    html.dir = 'ltr';
    return () => {
      html.lang = prevLang;
      html.dir = prevDir;
    };
  }, []);

  return (
    <div className="relative flex min-h-dvh flex-col bg-canvas text-ink" dir="ltr" lang="en">
      <div
        className="pointer-events-none absolute inset-0 bg-editorial-grid opacity-40 dark:opacity-25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, color-mix(in srgb, var(--accent) 14%, transparent) 0%, transparent 60%)',
        }}
        aria-hidden
      />
      <div className="noise-overlay pointer-events-none absolute inset-0" aria-hidden />

      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8">
        <Link
          href="/"
          aria-label="PoliTrip — Home"
          className="-m-2 inline-flex items-center gap-2.5 rounded-lg p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span className="flex h-9 w-9 shrink-0 sm:h-10 sm:w-10">
            <Image
              src="/textures/earth/logo.svg"
              alt=""
              width={1024}
              height={1024}
              priority
              unoptimized
              className="h-full w-full object-contain object-left"
            />
          </span>
          <span
            className="text-gradient-brand translate-y-[0.5px] text-base font-bold uppercase sm:text-[1.0625rem]"
            style={{
              fontFamily: 'var(--font-display, serif)',
              letterSpacing: '0.22em',
            }}
          >
            POLITRIP
          </span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
        <motion.div
          className="w-full max-w-[26rem]"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          {children}
        </motion.div>
      </main>

      <footer className="relative z-10 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 text-center sm:px-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ink/35">
          Secure account ·{' '}
          <Link href="/" className="text-ink/50 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
            Back to site
          </Link>
        </p>
      </footer>
    </div>
  );
}
