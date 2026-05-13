'use client';

import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

function StatCard({ label, count }: { label: string; count: number | undefined }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <p className="text-sm text-white/50 mb-1">{label}</p>
      <p className="text-3xl font-semibold text-white">
        {count === undefined ? '—' : count}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const hotels = useQuery(api.hotels.getAll);
  const destinations = useQuery(api.destinations.getAll);
  const trips = useQuery(api.trips.getAll);
  const bookings = useQuery(api.bookings.getAll);

  const pending = bookings?.filter((b) => b.status === 'pending').length ?? 0;

  return (
    <div className="p-8">
      <h1
        className="text-2xl font-semibold text-white mb-1"
        style={{ fontFamily: 'var(--font-instrument)' }}
      >
        Overview
      </h1>
      <p className="text-sm text-white/40 mb-8">Welcome back to your admin panel.</p>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-10">
        <StatCard label="Hotels" count={hotels?.length} />
        <StatCard label="Destinations" count={destinations?.length} />
        <StatCard label="Trips" count={trips?.length} />
        <StatCard label="Bookings" count={bookings?.length} />
      </div>

      {pending > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-amber-400 text-sm">
          You have <strong>{pending}</strong> pending booking{pending !== 1 ? 's' : ''} awaiting confirmation.{' '}
          <Link href="/dashboard/bookings" className="underline hover:text-amber-300">
            View bookings →
          </Link>
        </div>
      )}
    </div>
  );
}
