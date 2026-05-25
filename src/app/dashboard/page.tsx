'use client';

import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useDashLang } from '@/lib/dashboardI18n';

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
  const { labels } = useDashLang();
  const L = labels.overview;
  const hotels = useQuery(api.hotels.getAll);
  const destinations = useQuery(api.destinations.getAll);
  const trips = useQuery(api.trips.getAll);
  const bookings = useQuery(api.bookings.getAll);
  const testimonials = useQuery(api.testimonials.getAll);
  const gallery = useQuery(api.gallery.getAll);

  const pending = bookings?.filter((b) => b.status === 'pending').length ?? 0;

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8">
      <h1
        className="text-2xl font-semibold text-white mb-1"
        style={{ fontFamily: 'var(--font-instrument)' }}
      >
        {L.title}
      </h1>
      <p className="text-sm text-white/40 mb-8">{L.subtitle}</p>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 mb-10">
        <StatCard label={L.hotels} count={hotels?.length} />
        <StatCard label={L.destinations} count={destinations?.length} />
        <StatCard label={L.trips} count={trips?.length} />
        <StatCard label={L.bookings} count={bookings?.length} />
        <StatCard label={L.testimonials} count={testimonials?.length} />
        <StatCard label={L.galleryPhotos} count={gallery?.length} />
      </div>

      {pending > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-amber-400 text-sm">
          {L.pendingBookings(pending)}{' '}
          <Link href="/dashboard/bookings" className="underline hover:text-amber-300">
            {L.viewBookings}
          </Link>
        </div>
      )}
    </div>
  );
}
