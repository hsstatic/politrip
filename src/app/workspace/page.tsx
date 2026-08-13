'use client';

import Link from 'next/link';
import { api } from '../../../convex/_generated/api';
import { useAdminQuery, useAuthQuery, useSession } from '@/components/admin/AdminAuthProvider';

export default function WorkspacePage() {
  const { user, hasPermission, roleName } = useSession();
  const stats = useAdminQuery(api.overview.workspaceStats);
  const notifications = useAuthQuery(api.notifications.listMine, { unreadOnly: true });

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">Staff workspace</p>
      <h1 className="mt-2 text-2xl font-semibold text-ink" style={{ fontFamily: 'var(--font-instrument)' }}>
        Hello{user ? `, ${user.firstName}` : ''}
      </h1>
      <p className="mt-1 text-sm text-ink/40">
        {roleName ? `${roleName} · ` : ''}Only the tools assigned to you are shown here.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {hasPermission('bookings.view') ? (
          <Link href="/admin/bookings" className="rounded-xl border border-ink/10 p-5 hover:border-accent/40">
            <p className="text-xs uppercase tracking-widest text-ink/40">Pending bookings</p>
            <p className="mt-2 text-3xl font-semibold">{stats?.pending ?? '—'}</p>
          </Link>
        ) : null}
        {hasPermission('bookings.view') || hasPermission('finance.view') ? (
          <Link href="/admin/reports" className="rounded-xl border border-ink/10 p-5 hover:border-accent/40">
            <p className="text-xs uppercase tracking-widest text-ink/40">Reports</p>
            <p className="mt-2 text-sm text-ink/60">Booking counts and confirmed value from live records.</p>
          </Link>
        ) : null}
        <div className="rounded-xl border border-ink/10 p-5">
          <p className="text-xs uppercase tracking-widest text-ink/40">Unread notifications</p>
          <p className="mt-2 text-3xl font-semibold">{notifications?.length ?? '—'}</p>
        </div>
      </div>

      {hasPermission('bookings.view') ? (
        <div className="mt-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent bookings</h2>
            <Link href="/admin/bookings" className="text-sm text-accent hover:underline">Open bookings</Link>
          </div>
          <div className="overflow-x-auto rounded-xl border border-ink/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-ink/40">
                  <th className="px-4 py-2 text-left font-medium">Guest</th>
                  <th className="px-4 py-2 text-left font-medium">Item</th>
                  <th className="px-4 py-2 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {(stats?.recent ?? []).length === 0 ? (
                  <tr><td colSpan={3} className="px-4 py-6 text-ink/40">No bookings to show.</td></tr>
                ) : (
                  stats?.recent.map((b) => (
                    <tr key={String(b.id)} className="border-b border-ink/5">
                      <td className="px-4 py-2">{String(b.contactName)}</td>
                      <td className="px-4 py-2 text-ink/60">{String(b.itemTitle)}</td>
                      <td className="px-4 py-2">{String(b.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="mt-10 text-sm text-ink/50">
          Your role does not include booking access. Ask the owner if you need additional tools.
        </p>
      )}
    </div>
  );
}
