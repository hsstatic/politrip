'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import Link from 'next/link';
import { useState } from 'react';
import { useDashLang } from '@/lib/adminI18n';
import { useAdminMutation } from '@/components/admin/AdminAuthProvider';
import RequirePermission, { Can } from '@/components/admin/RequirePermission';

const categoryColors: Record<string, string> = {
  cultural: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  adventure: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
  luxury: 'bg-warning/15 text-warning',
  nature: 'bg-success/15 text-success',
  yacht: 'bg-accent/15 text-accent',
  helicopter: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
  balloon: 'bg-pink-500/15 text-pink-600 dark:text-pink-400',
};

export default function TripsPage() {
  return (
    <RequirePermission permission="content.view">
      <TripsManager />
    </RequirePermission>
  );
}

function TripsManager() {
  const { labels } = useDashLang();
  const L = labels.trip;
  const trips = useQuery(api.trips.getAll);
  const remove = useAdminMutation(api.trips.remove);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: Id<'trips'>) {
    if (!confirm('Delete this trip?')) return;
    setDeleting(id);
    try {
      await remove({ id });
    } catch {
      alert('Could not delete this trip. Please try again.');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink" style={{ fontFamily: 'var(--font-instrument)' }}>{L.pageTitle}</h1>
          <p className="text-sm text-ink/40 mt-0.5">{trips?.length ?? 0} {labels.common.total}</p>
        </div>
        <Can permission="content.create">
          <Link href="/admin/trips/new" className="self-start sm:self-auto px-4 py-2 bg-accent hover:bg-accent-light text-on-accent text-sm font-medium rounded-lg transition-colors">
            {L.addNew}
          </Link>
        </Can>
      </div>

      {trips === undefined && <p className="text-ink/40 text-sm">{labels.common.loading}</p>}

      {trips?.length === 0 && (
        <div className="text-center py-16 text-ink/30">
          <p className="text-4xl mb-3">✈</p>
          <p>{L.noItems}</p>
        </div>
      )}

      {trips && trips.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-ink/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-ink/40">
                <th className="text-left px-4 py-3 font-medium">{L.table.title}</th>
                <th className="text-left px-4 py-3 font-medium">{L.table.category}</th>
                <th className="text-left px-4 py-3 font-medium">{L.table.location}</th>
                <th className="text-left px-4 py-3 font-medium">{L.table.duration}</th>
                <th className="text-left px-4 py-3 font-medium">{L.table.price}</th>
                <th className="text-left px-4 py-3 font-medium">{L.table.flags}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip._id} className="border-b border-ink/5 hover:bg-ink/3 transition-colors">
                  <td className="px-4 py-3 text-ink font-medium">{trip.title_en}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[trip.category] ?? 'bg-ink/10 text-ink/60'}`}>
                      {trip.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink/60">{trip.location}</td>
                  <td className="px-4 py-3 text-ink/60">{trip.duration}</td>
                  <td className="px-4 py-3 text-ink/60">{trip.price} {trip.currency}</td>
                  <td className="px-4 py-3 flex gap-1 flex-wrap">
                    {trip.isVIP && <span className="text-xs bg-warning/20 text-warning px-2 py-0.5 rounded-full">VIP</span>}
                    {trip.isPopular && <span className="text-xs bg-pink-500/20 text-pink-600 dark:text-pink-400 px-2 py-0.5 rounded-full">Popular</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Can permission="content.edit">
                        <Link href={`/admin/trips/${trip._id}`} className="text-xs px-3 py-1.5 rounded-lg border border-ink/10 text-ink/60 hover:text-ink transition-colors">
                          {labels.common.edit}
                        </Link>
                      </Can>
                      <Can permission="content.delete">
                        <button
                          onClick={() => handleDelete(trip._id)}
                          disabled={deleting === trip._id}
                          className="text-xs px-3 py-1.5 rounded-lg border border-danger/20 text-danger/70 hover:text-danger transition-colors disabled:opacity-40"
                        >
                          {deleting === trip._id ? '...' : labels.common.delete}
                        </button>
                      </Can>
                    </div>
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
