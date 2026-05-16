'use client';

import { ConvexReactClient } from 'convex/react';
import { ConvexProvider } from 'convex/react';
import Sidebar from '@/components/dashboard/Sidebar';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <div className="flex min-h-screen bg-[#02122d] text-white">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </ConvexProvider>
  );
}
