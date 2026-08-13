'use client';

import Link from 'next/link';
import { api } from '../../../convex/_generated/api';
import { useAuthQuery, useSession } from '@/components/admin/AdminAuthProvider';

export default function AccountDashboardPage() {
  const { user } = useSession();
  const bookings = useAuthQuery(api.bookings.listMine);
  const notifications = useAuthQuery(api.notifications.listMine, { unreadOnly: true });

  const upcoming = (bookings ?? []).filter((b) => b.status === 'pending' || b.status === 'confirmed');
  const recent = (bookings ?? []).slice(0, 5);

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">Traveller account</p>
      <h1 className="mt-2 text-3xl font-light text-ink" style={{ fontFamily: 'var(--font-display, serif)' }}>
        Welcome{user ? `, ${user.firstName}` : ''}
      </h1>
      <p className="mt-2 max-w-xl text-sm text-ink/50">
        Your PoliTrip space for upcoming journeys, profile details, and account security.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-ink/10 bg-ink/5 p-5">
          <p className="text-xs uppercase tracking-widest text-ink/40">Upcoming</p>
          <p className="mt-2 text-3xl font-semibold">{upcoming.length}</p>
        </div>
        <div className="rounded-xl border border-ink/10 bg-ink/5 p-5">
          <p className="text-xs uppercase tracking-widest text-ink/40">All bookings</p>
          <p className="mt-2 text-3xl font-semibold">{bookings?.length ?? '—'}</p>
        </div>
        <div className="rounded-xl border border-ink/10 bg-ink/5 p-5">
          <p className="text-xs uppercase tracking-widest text-ink/40">Alerts</p>
          <p className="mt-2 text-3xl font-semibold">{notifications?.length ?? '—'}</p>
        </div>
      </div>

      {(notifications ?? []).length > 0 ? (
        <div className="mt-8 rounded-xl border border-warning/20 bg-warning/5 p-4 text-sm text-warning">
          You have {notifications!.length} unread notification{notifications!.length === 1 ? '' : 's'}.
        </div>
      ) : null}

      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent activity</h2>
          <Link href="/account/bookings" className="text-sm text-accent hover:underline">View bookings</Link>
        </div>
        <div className="overflow-x-auto rounded-xl border border-ink/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-ink/40">
                <th className="px-4 py-2 text-left font-medium">Trip / stay</th>
                <th className="px-4 py-2 text-left font-medium">Dates</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-ink/40">
                    No bookings yet. When you plan a trip with PoliTrip, it will appear here.
                  </td>
                </tr>
              ) : recent.map((b) => (
                <tr key={b._id} className="border-b border-ink/5">
                  <td className="px-4 py-2">{b.itemTitle ?? b.itemId}</td>
                  <td className="px-4 py-2 text-ink/60">{b.startDate} → {b.endDate}</td>
                  <td className="px-4 py-2 capitalize">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
