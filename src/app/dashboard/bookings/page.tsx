'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';

type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

const statusStyles: Record<BookingStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-400',
  confirmed: 'bg-green-500/15 text-green-400',
  cancelled: 'bg-red-500/15 text-red-400',
  completed: 'bg-blue-500/15 text-blue-400',
};

export default function BookingsPage() {
  const bookings = useQuery(api.bookings.getAll);
  const updateStatus = useMutation(api.bookings.updateStatus);

  async function handleStatus(id: Id<'bookings'>, status: BookingStatus) {
    await updateStatus({ id, status });
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: 'var(--font-instrument)' }}>
          Bookings
        </h1>
        <p className="text-sm text-white/40 mt-0.5">{bookings?.length ?? 0} total</p>
      </div>

      {bookings === undefined && <p className="text-white/40 text-sm">Loading…</p>}

      {bookings?.length === 0 && (
        <div className="text-center py-16 text-white/30">
          <p className="text-4xl mb-3">📋</p>
          <p>No bookings yet.</p>
        </div>
      )}

      {bookings && bookings.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="text-left px-4 py-3 font-medium">Customer</th>
                <th className="text-left px-4 py-3 font-medium">Phone</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Item</th>
                <th className="text-left px-4 py-3 font-medium">Dates</th>
                <th className="text-left px-4 py-3 font-medium">Guests</th>
                <th className="text-left px-4 py-3 font-medium">Price</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b border-white/5 hover:bg-white/3 transition-colors align-top">
                  <td className="px-4 py-3 text-white font-medium">{booking.contactName}</td>
                  <td className="px-4 py-3 text-white/60">
                    {booking.whatsapp ? (
                      <a
                        href={`https://wa.me/${booking.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:underline"
                      >
                        {booking.contactPhone}
                      </a>
                    ) : (
                      booking.contactPhone
                    )}
                  </td>
                  <td className="px-4 py-3 text-white/60 capitalize">{booking.type}</td>
                  <td className="px-4 py-3 text-white/60 max-w-[140px] truncate">
                    {booking.itemTitle ?? booking.itemId}
                  </td>
                  <td className="px-4 py-3 text-white/60 whitespace-nowrap">
                    {booking.startDate}
                    {booking.endDate && booking.endDate !== booking.startDate && (
                      <> → {booking.endDate}</>
                    )}
                  </td>
                  <td className="px-4 py-3 text-white/60">{booking.guests}</td>
                  <td className="px-4 py-3 text-white/60 whitespace-nowrap">
                    {booking.totalPrice} {booking.currency}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatus(booking._id, e.target.value as BookingStatus)}
                      className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer outline-none ${statusStyles[booking.status]}`}
                    >
                      {(['pending', 'confirmed', 'completed', 'cancelled'] as BookingStatus[]).map((s) => (
                        <option key={s} value={s} className="bg-[#02122d] text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-white/40 max-w-[160px] text-xs">
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
