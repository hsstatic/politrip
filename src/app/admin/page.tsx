'use client';

import Link from 'next/link';
import { useDashLang } from '@/lib/adminI18n';
import { useAdminQuery, useSession } from '@/components/admin/AdminAuthProvider';
import { api } from '../../../convex/_generated/api';

function StatCard({ label, count, href }: { label: string; count: number | null | undefined; href?: string }) {
  if (count === null) return null;
  const inner = (
    <div className="bg-ink/5 border border-ink/10 rounded-xl p-6 h-full">
      <p className="text-sm text-ink/50 mb-1">{label}</p>
      <p className="text-3xl font-semibold text-ink">{count === undefined ? '—' : count.toLocaleString()}</p>
    </div>
  );
  if (!href) return inner;
  return (
    <Link href={href} className="block transition-transform hover:-translate-y-0.5">
      {inner}
    </Link>
  );
}

export default function AdminOverviewPage() {
  const { labels } = useDashLang();
  const L = labels.overview;
  const { user, hasPermission } = useSession();
  const stats = useAdminQuery(api.overview.staffStats);

  const pending = stats?.bookingsPending ?? 0;

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8">
      <h1 className="text-2xl font-semibold text-ink mb-1" style={{ fontFamily: 'var(--font-instrument)' }}>
        {L.title}
      </h1>
      <p className="text-sm text-ink/40 mb-8">
        {user ? `Hello, ${user.firstName}. ` : ''}
        {L.subtitle}
      </p>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 mb-10">
        <StatCard label={L.hotels} count={stats?.hotels} href="/admin/hotels" />
        <StatCard label={L.destinations} count={stats?.destinations} href="/admin/destinations" />
        <StatCard label={L.trips} count={stats?.trips} href="/admin/trips" />
        <StatCard label={L.bookings} count={stats?.bookingsTotal} href="/admin/bookings" />
        <StatCard label={L.testimonials} count={stats?.testimonials} href="/admin/testimonials" />
        <StatCard label={L.galleryPhotos} count={stats?.gallery} href="/admin/gallery" />
        <StatCard label={L.newsletter} count={stats?.newsletterTotal} href="/admin/newsletter" />
        <StatCard label={L.customers} count={stats?.customersTotal} href="/admin/customers" />
        <StatCard label={L.activeCustomers} count={stats?.customersActive} href="/admin/customers" />
        <StatCard label={L.newCustomers} count={stats?.customersNew} href="/admin/customers" />
        <StatCard label={L.employees} count={stats?.employeesTotal} href="/admin/employees" />
        {hasPermission('finance.view') ? (
          <StatCard label={L.bookingVolume} count={stats?.bookingVolume} href="/admin/bookings" />
        ) : null}
      </div>

      {pending > 0 && hasPermission('bookings.view') && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 text-warning text-sm">
          {L.pendingBookings(pending)}{' '}
          <Link href="/admin/bookings" className="underline hover:text-warning">
            {L.viewBookings}
          </Link>
        </div>
      )}
    </div>
  );
}
