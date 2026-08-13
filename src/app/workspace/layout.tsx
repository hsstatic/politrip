'use client';

import { ConvexProvider, ConvexReactClient } from 'convex/react';
import Sidebar from '@/components/admin/Sidebar';
import { DashLangProvider, useDashLang } from '@/lib/adminI18n';
import { AdminAuthProvider } from '@/components/admin/AdminAuthProvider';

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL ?? '';
const convex = CONVEX_URL ? new ConvexReactClient(CONVEX_URL) : null;

function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const { isRTL } = useDashLang();
  return (
    <div className={`flex min-h-screen bg-canvas text-ink${isRTL ? ' rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-auto">{children}</main>
    </div>
  );
}

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const body = (
    <DashLangProvider>
      <AdminAuthProvider>
        <WorkspaceShell>{children}</WorkspaceShell>
      </AdminAuthProvider>
    </DashLangProvider>
  );
  if (!convex) return body;
  return <ConvexProvider client={convex}>{body}</ConvexProvider>;
}
