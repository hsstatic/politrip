'use client';

import { ConvexReactClient } from 'convex/react';
import { ConvexProvider } from 'convex/react';
import Sidebar from '@/components/dashboard/Sidebar';
import { DashLangProvider, useDashLang } from '@/lib/dashboardI18n';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { isRTL } = useDashLang();
  return (
    <div className={`flex min-h-screen bg-[#02122d] text-white${isRTL ? ' rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Sidebar />
      <main className="flex-1 overflow-auto min-w-0">{children}</main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <DashLangProvider>
        <DashboardShell>{children}</DashboardShell>
      </DashLangProvider>
    </ConvexProvider>
  );
}
