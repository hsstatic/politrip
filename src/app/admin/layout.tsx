'use client';

import { usePathname } from 'next/navigation';
import { ConvexReactClient } from 'convex/react';
import { ConvexProvider } from 'convex/react';
import Sidebar from '@/components/admin/Sidebar';
import { DashLangProvider, useDashLang } from '@/lib/adminI18n';
import { AdminAuthProvider } from '@/components/admin/AdminAuthProvider';

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL ?? '';
const convex = CONVEX_URL ? new ConvexReactClient(CONVEX_URL) : null;

function AdminShell({ children }: { children: React.ReactNode }) {
  const { isRTL } = useDashLang();
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className={`flex min-h-screen bg-canvas text-ink${isRTL ? ' rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Sidebar />
      <main className="flex-1 overflow-auto min-w-0">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const body = (
    <DashLangProvider>
      <AdminAuthProvider>
        <AdminShell>{children}</AdminShell>
      </AdminAuthProvider>
    </DashLangProvider>
  );

  if (!convex) {
    return body;
  }

  return <ConvexProvider client={convex}>{body}</ConvexProvider>;
}
