'use client';

import { api } from '../../../../convex/_generated/api';
import { useAuthQuery } from '@/components/admin/AdminAuthProvider';

export default function AccountBookingsPage() {
  const bookings = useAuthQuery(api.bookings.listMine);

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8">
      <h1 className="text-2xl font-semibold text-ink" style={{ fontFamily: 'var(--font-instrument)' }}>
        Your bookings
      </h1>
      <p className="mt-1 text-sm text-ink/40">Only requests linked to your account or email are shown.</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-ink/10">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-ink/40">
              <th className="px-4 py-3 text-left font-medium">Item</th>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-left font-medium">Dates</th>
              <th className="px-4 py-3 text-left font-medium">Guests</th>
              <th className="px-4 py-3 text-left font-medium">Total</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {(bookings ?? []).length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-ink/40">No bookings yet.</td>
              </tr>
            ) : (
              bookings?.map((b) => (
                <tr key={b._id} className="border-b border-ink/5">
                  <td className="px-4 py-3 font-medium">{b.itemTitle ?? b.itemId}</td>
                  <td className="px-4 py-3 capitalize text-ink/60">{b.type}</td>
                  <td className="px-4 py-3 text-ink/60 whitespace-nowrap">{b.startDate} → {b.endDate}</td>
                  <td className="px-4 py-3 text-ink/60">{b.guests}</td>
                  <td className="px-4 py-3 text-ink/60">{b.totalPrice} {b.currency}</td>
                  <td className="px-4 py-3 capitalize">{b.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
