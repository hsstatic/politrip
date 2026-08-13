'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDashLang, DASH_LANGS, type DashLang } from '@/lib/adminI18n';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useSession } from '@/components/admin/AdminAuthProvider';

type NavItem = {
  href: string;
  key: keyof typeof import('@/lib/adminI18n').LABELS.en.nav;
  icon: string;
  permission?: string;
  anyPermission?: string[];
  ownerOnly?: boolean;
};

const NAV: NavItem[] = [
  { href: '/admin', key: 'overview', icon: '▦' },
  { href: '/admin/customers', key: 'customers', icon: '👤', permission: 'customers.view' },
  { href: '/admin/employees', key: 'employees', icon: '👥', permission: 'employees.view' },
  { href: '/admin/roles', key: 'roles', icon: '🛡', permission: 'roles.view', ownerOnly: true },
  { href: '/admin/hotels', key: 'hotels', icon: '🏨', permission: 'content.edit' },
  { href: '/admin/destinations', key: 'destinations', icon: '🗺', permission: 'content.edit' },
  { href: '/admin/trips', key: 'trips', icon: '✈', permission: 'content.edit' },
  { href: '/admin/bookings', key: 'bookings', icon: '📋', permission: 'bookings.view' },
  { href: '/admin/reports', key: 'reports', icon: '📊', anyPermission: ['bookings.view', 'finance.view'] },
  { href: '/admin/newsletter', key: 'newsletter', icon: '✉', permission: 'newsletter.view' },
  { href: '/admin/testimonials', key: 'testimonials', icon: '💬', permission: 'content.edit' },
  { href: '/admin/gallery', key: 'gallery', icon: '🖼', permission: 'content.edit' },
  { href: '/admin/notifications', key: 'notifications', icon: '🔔' },
  { href: '/admin/audit', key: 'audit', icon: '📜', permission: 'audit.view', ownerOnly: true },
  { href: '/admin/settings', key: 'settings', icon: '⚙', permission: 'settings.view' },
  { href: '/admin/security', key: 'security', icon: '🔒', ownerOnly: true },
];

const LANG_LABELS: Record<DashLang, string> = { en: 'EN', ar: 'AR', tr: 'TR' };

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang, labels } = useDashLang();
  const { user, hasPermission, isOwner, signOut } = useSession();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  async function handleSignOut() {
    await signOut();
    router.push('/sign-in');
    router.refresh();
  }

  const visibleNav = NAV.filter((item) => {
    if (item.ownerOnly && !isOwner) return false;
    if (item.anyPermission && !item.anyPermission.some((p) => hasPermission(p))) return false;
    if (item.permission && !hasPermission(item.permission) && !hasPermission(item.permission.replace('.edit', '.view')) && !hasPermission(item.permission.replace('.edit', '.create'))) {
      if (item.permission === 'content.edit') {
        return (
          hasPermission('content.view') ||
          hasPermission('content.create') ||
          hasPermission('content.delete')
        );
      }
      return false;
    }
    return true;
  });

  const sidebarContent = (
    <aside className="w-56 shrink-0 bg-canvas-muted border-r border-ink/10 flex flex-col min-h-screen">
      <div className="px-6 py-5 border-b border-ink/10 flex items-center justify-between">
        <div>
          <span className="text-xl font-semibold text-ink" style={{ fontFamily: 'var(--font-instrument)' }}>
            PoliTrip
          </span>
          <p className="text-[11px] text-ink/40 mt-0.5 uppercase tracking-widest">
            {user?.kind === 'owner' ? 'Owner' : user?.kind === 'employee' ? 'Staff' : 'Admin'}
          </p>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="md:hidden text-ink/40 hover:text-ink transition-colors text-xl leading-none"
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      {user ? (
        <div className="px-4 py-3 border-b border-ink/10">
          <p className="truncate text-sm font-medium text-ink">
            {user.firstName} {user.lastName}
          </p>
          <p className="truncate text-[11px] text-ink/40">{user.email}</p>
        </div>
      ) : null}

      <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
        {user?.kind === 'employee' ? (
          <Link
            href="/workspace"
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              pathname.startsWith('/workspace')
                ? 'bg-accent/15 text-accent font-medium'
                : 'text-ink/60 hover:text-ink hover:bg-ink/5'
            }`}
          >
            <span className="text-base leading-none">▣</span>
            {labels.nav.workspace}
          </Link>
        ) : null}
        {visibleNav.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive(link.href)
                ? 'bg-accent/15 text-accent font-medium'
                : 'text-ink/60 hover:text-ink hover:bg-ink/5'
            }`}
          >
            <span className="text-base leading-none">{link.icon}</span>
            {labels.nav[link.key]}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-ink/10 flex items-center gap-2">
        <div className="flex flex-1 gap-1 p-1 bg-ink/5 rounded-lg">
          {DASH_LANGS.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                lang === l ? 'bg-accent/20 text-accent' : 'text-ink/40 hover:text-ink/70'
              }`}
            >
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>
        <ThemeToggle />
      </div>

      <div className="px-3 py-4 border-t border-ink/10">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ink/60 hover:text-danger hover:bg-danger/10 transition-colors"
        >
          <span className="text-base leading-none">⎋</span>
          {labels.nav.signOut}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 w-9 h-9 flex items-center justify-center rounded-lg bg-canvas-muted border border-ink/10 text-ink/70 hover:text-ink transition-colors"
        aria-label="Open menu"
      >
        ☰
      </button>

      <div className="hidden md:flex md:flex-col md:shrink-0">{sidebarContent}</div>

      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative z-10 flex flex-col">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}
