'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';

const links = [
  { href: '/dashboard', label: 'Overview', icon: '▦' },
  { href: '/dashboard/hotels', label: 'Hotels', icon: '🏨' },
  { href: '/dashboard/destinations', label: 'Destinations', icon: '🗺' },
  { href: '/dashboard/trips', label: 'Trips', icon: '✈' },
  { href: '/dashboard/bookings', label: 'Bookings', icon: '📋' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-56 shrink-0 bg-[#020e22] border-r border-white/10 flex flex-col min-h-screen">
      <div className="px-6 py-5 border-b border-white/10">
        <span
          className="text-xl font-semibold text-white"
          style={{ fontFamily: 'var(--font-instrument)' }}
        >
          PoliTrip
        </span>
        <p className="text-[11px] text-white/40 mt-0.5 uppercase tracking-widest">Admin</p>
      </div>

      <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive(link.href)
                ? 'bg-cyan-500/15 text-cyan-400 font-medium'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-base leading-none">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={() => signOut({ redirectUrl: '/sign-in' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <span className="text-base leading-none">⎋</span>
          Sign out
        </button>
      </div>
    </aside>
  );
}
