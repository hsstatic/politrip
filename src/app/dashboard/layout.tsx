'use client';

import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexReactClient } from 'convex/react';
import { useAuth } from '@clerk/nextjs';
import Sidebar from '@/components/dashboard/Sidebar';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <div className="flex min-h-screen bg-[#02122d] text-white">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </ConvexProviderWithClerk>
  );
}
