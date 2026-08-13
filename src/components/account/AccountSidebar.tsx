'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useSession } from '@/components/admin/AdminAuthProvider';

const NAV = [
  { href: '/account', label: 'Dashboard' },
  { href: '/account/bookings', label: 'Bookings' },
  { href: '/account/profile', label: 'Profile' },
  { href: '/account/security', label: 'Security' },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useSession();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    router.push('/sign-in');
    router.refresh();
  }

  const content = (
    <aside className="flex min-h-screen w-56 shrink-0 flex-col border-r border-ink/10 bg-canvas-muted">
      <div className="flex items-center justify-between border-b border-ink/10 px-5 py-5">
        <div>
          <p className="text-lg font-semibold text-ink" style={{ fontFamily: 'var(--font-instrument)' }}>PoliTrip</p>
          <p className="text-[11px] uppercase tracking-widest text-ink/40">My account</p>
        </div>
        <button type="button" className="md:hidden text-ink/40" onClick={() => setOpen(false)} aria-label="Close menu">✕</button>
      </div>
      {user ? (
        <div className="flex items-center gap-3 border-b border-ink/10 px-4 py-3">
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-accent/15 text-accent">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs font-semibold">
                {`${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase() || '?'}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user.firstName} {user.lastName}</p>
            <p className="truncate text-[11px] text-ink/40">{user.email}</p>
          </div>
        </div>
      ) : null}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`rounded-lg px-3 py-2.5 text-sm ${
              pathname === item.href ? 'bg-accent/15 font-medium text-accent' : 'text-ink/60 hover:bg-ink/5 hover:text-ink'
            }`}
          >
            {item.label}
          </Link>
        ))}
        {user?.kind !== 'customer' ? (
          <Link href={user?.kind === 'owner' ? '/admin' : '/workspace'} className="rounded-lg px-3 py-2.5 text-sm text-ink/60 hover:bg-ink/5 hover:text-ink">
            {user?.kind === 'owner' ? 'Owner console' : 'Staff workspace'}
          </Link>
        ) : null}
      </nav>
      <div className="flex items-center justify-between border-t border-ink/10 px-3 py-3">
        <ThemeToggle />
        <button type="button" onClick={() => void handleSignOut()} className="text-sm text-ink/50 hover:text-danger">Sign out</button>
      </div>
    </aside>
  );

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="fixed left-4 top-4 z-40 flex h-9 w-9 items-center justify-center rounded-lg border border-ink/10 bg-canvas-muted md:hidden" aria-label="Open menu">☰</button>
      <div className="hidden md:flex">{content}</div>
      {open ? (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative z-10">{content}</div>
        </div>
      ) : null}
    </>
  );
}
