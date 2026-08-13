'use client';

import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { AdminAuthProvider } from '@/components/admin/AdminAuthProvider';
import AccountSidebar from '@/components/account/AccountSidebar';

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL ?? '';
const convex = CONVEX_URL ? new ConvexReactClient(CONVEX_URL) : null;

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-canvas text-ink" dir="ltr" lang="en">
      <AccountSidebar />
      <main className="min-w-0 flex-1 overflow-auto">{children}</main>
    </div>
  );
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const body = (
    <AdminAuthProvider>
      <Shell>{children}</Shell>
    </AdminAuthProvider>
  );
  if (!convex) return body;
  return <ConvexProvider client={convex}>{body}</ConvexProvider>;
}
