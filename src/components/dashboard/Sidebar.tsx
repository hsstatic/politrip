'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDashLang, DASH_LANGS, type DashLang } from '@/lib/dashboardI18n';

const NAV_KEYS = [
  { href: '/dashboard', key: 'overview', icon: '▦' },
  { href: '/dashboard/hotels', key: 'hotels', icon: '🏨' },
  { href: '/dashboard/destinations', key: 'destinations', icon: '🗺' },
  { href: '/dashboard/trips', key: 'trips', icon: '✈' },
  { href: '/dashboard/bookings', key: 'bookings', icon: '📋' },
  { href: '/dashboard/testimonials', key: 'testimonials', icon: '💬' },
  { href: '/dashboard/gallery', key: 'gallery', icon: '🖼' },
] as const;

const LANG_LABELS: Record<DashLang, string> = { en: 'EN', ar: 'AR', tr: 'TR' };

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang, labels } = useDashLang();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  }

  async function handleSignOut() {
    await fetch('/api/dashboard/logout', { method: 'POST' });
    router.push('/dashboard/login');
    router.refresh();
  }

  const sidebarContent = (
    <aside className="w-56 shrink-0 bg-[#020e22] border-r border-white/10 flex flex-col min-h-screen">
      <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <span className="text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-instrument)' }}>
            PoliTrip
          </span>
          <p className="text-[11px] text-white/40 mt-0.5 uppercase tracking-widest">Admin</p>
        </div>
        {/* Close button visible on mobile only */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden text-white/40 hover:text-white transition-colors text-xl leading-none"
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
        {NAV_KEYS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive(link.href)
                ? 'bg-cyan-500/15 text-cyan-400 font-medium'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-base leading-none">{link.icon}</span>
            {labels.nav[link.key]}
          </Link>
        ))}
      </nav>

      {/* Language toggle */}
      <div className="px-3 py-3 border-t border-white/10">
        <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
          {DASH_LANGS.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                lang === l
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>
      </div>

      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <span className="text-base leading-none">⎋</span>
          {labels.nav.signOut}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Hamburger button — mobile only */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 w-9 h-9 flex items-center justify-center rounded-lg bg-[#020e22] border border-white/10 text-white/70 hover:text-white transition-colors"
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* Desktop: always visible inline */}
      <div className="hidden md:flex md:flex-col md:shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile: overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <div className="relative z-10 flex flex-col">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
