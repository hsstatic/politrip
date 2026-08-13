'use client';

import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { useDashLang } from '@/lib/adminI18n';
import { useAdminMutation, useAdminQuery, useSession } from '@/components/admin/AdminAuthProvider';
import RequirePermission from '@/components/admin/RequirePermission';

type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

const statusStyles: Record<BookingStatus, string> = {
  pending: 'bg-warning/15 text-warning',
  confirmed: 'bg-success/15 text-success',
  cancelled: 'bg-danger/15 text-danger',
  completed: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
};

export default function BookingsPage() {
  return (
    <RequirePermission permission="bookings.view">
      <BookingsManager />
    </RequirePermission>
  );
}

function BookingsManager() {
  const { labels } = useDashLang();
  const { hasPermission } = useSession();
  const L = labels.bookings;
  const bookings = useAdminQuery(api.bookings.getAll);
  const updateStatus = useAdminMutation(api.bookings.updateStatus);
  const canEdit = hasPermission('bookings.edit');
  const canCancel = hasPermission('bookings.cancel');
  const canComplete = hasPermission('bookings.complete');
  const canChangeStatus = canEdit || canCancel || canComplete;

  async function handleStatus(id: Id<'bookings'>, status: BookingStatus) {
    try {
      await updateStatus({ id, status });
    } catch {
      alert('Could not update booking status. Please try again.');
    }
  }

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink" style={{ fontFamily: 'var(--font-instrument)' }}>
          {L.pageTitle}
        </h1>
        <p className="text-sm text-ink/40 mt-0.5">{bookings?.length ?? 0} {labels.common.total}</p>
      </div>

      {bookings === undefined && <p className="text-ink/40 text-sm">{labels.common.loading}</p>}

      {bookings?.length === 0 && (
        <div className="text-center py-16 text-ink/30">
          <p className="text-4xl mb-3">📋</p>
          <p>No bookings yet.</p>
        </div>
      )}

      {bookings && bookings.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-ink/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-ink/40">
                <th className="text-left px-4 py-3 font-medium">{L.table.name}</th>
                <th className="text-left px-4 py-3 font-medium">Phone</th>
                <th className="text-left px-4 py-3 font-medium">{L.table.type}</th>
                <th className="text-left px-4 py-3 font-medium">Item</th>
                <th className="text-left px-4 py-3 font-medium">{L.table.dates}</th>
                <th className="text-left px-4 py-3 font-medium">{L.table.guests}</th>
                <th className="text-left px-4 py-3 font-medium">{L.table.price}</th>
                <th className="text-left px-4 py-3 font-medium">{L.table.status}</th>
                <th className="text-left px-4 py-3 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b border-ink/5 hover:bg-ink/3 transition-colors align-top">
                  <td className="px-4 py-3 text-ink font-medium">{booking.contactName}</td>
                  <td className="px-4 py-3 text-ink/60">
                    {booking.whatsapp ? (
                      <a
                        href={`https://wa.me/${booking.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-success hover:underline"
                      >
                        {booking.contactPhone}
                      </a>
                    ) : (
                      booking.contactPhone
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink/60 capitalize">{booking.type}</td>
                  <td className="px-4 py-3 text-ink/60 max-w-[140px] truncate">
                    {booking.itemTitle ?? booking.itemId}
                  </td>
                  <td className="px-4 py-3 text-ink/60 whitespace-nowrap">
                    {booking.startDate}
                    {booking.endDate && booking.endDate !== booking.startDate && (
                      <> → {booking.endDate}</>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink/60">{booking.guests}</td>
                  <td className="px-4 py-3 text-ink/60 whitespace-nowrap">
                    {booking.totalPrice} {booking.currency}
                  </td>
                  <td className="px-4 py-3">
                    {canChangeStatus ? (
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatus(booking._id, e.target.value as BookingStatus)}
                        className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer outline-none ${statusStyles[booking.status]}`}
                      >
                        {(['pending', 'confirmed', 'completed', 'cancelled'] as BookingStatus[]).map((s) => {
                          const allowed =
                            s === booking.status ||
                            (s === 'cancelled' ? canCancel : s === 'completed' ? canComplete : canEdit);
                          return (
                            <option key={s} value={s} disabled={!allowed} className="bg-canvas text-ink">
                              {s}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[booking.status]}`}>
                        {booking.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink/40 max-w-[160px] text-xs">
                    {booking.notes ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
