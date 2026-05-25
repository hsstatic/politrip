'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import Link from 'next/link';
import { useState } from 'react';
import { useDashLang } from '@/lib/dashboardI18n';

const categoryColors: Record<string, string> = {
  cultural: 'bg-blue-500/15 text-blue-400',
  adventure: 'bg-orange-500/15 text-orange-400',
  luxury: 'bg-amber-500/15 text-amber-400',
  nature: 'bg-green-500/15 text-green-400',
  yacht: 'bg-cyan-500/15 text-cyan-400',
  helicopter: 'bg-purple-500/15 text-purple-400',
  balloon: 'bg-pink-500/15 text-pink-400',
};

export default function TripsPage() {
  const { labels } = useDashLang();
  const L = labels.trip;
  const trips = useQuery(api.trips.getAll);
  const remove = useMutation(api.trips.remove);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: Id<'trips'>) {
    if (!confirm('Delete this trip?')) return;
    setDeleting(id);
    await remove({ id });
    setDeleting(null);
  }

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: 'var(--font-instrument)' }}>{L.pageTitle}</h1>
          <p className="text-sm text-white/40 mt-0.5">{trips?.length ?? 0} {labels.common.total}</p>
        </div>
        <Link href="/dashboard/trips/new" className="self-start sm:self-auto px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-medium rounded-lg transition-colors">
          {L.addNew}
        </Link>
      </div>

      {trips === undefined && <p className="text-white/40 text-sm">{labels.common.loading}</p>}

      {trips?.length === 0 && (
        <div className="text-center py-16 text-white/30">
          <p className="text-4xl mb-3">✈</p>
          <p>{L.noItems}</p>
        </div>
      )}

      {trips && trips.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
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
                <tr key={trip._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{trip.title_en}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[trip.category] ?? 'bg-white/10 text-white/60'}`}>
                      {trip.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/60">{trip.location}</td>
                  <td className="px-4 py-3 text-white/60">{trip.duration}</td>
                  <td className="px-4 py-3 text-white/60">{trip.price} {trip.currency}</td>
                  <td className="px-4 py-3 flex gap-1 flex-wrap">
                    {trip.isVIP && <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">VIP</span>}
                    {trip.isPopular && <span className="text-xs bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full">Popular</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/dashboard/trips/${trip._id}`} className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white transition-colors">
                        {labels.common.edit}
                      </Link>
                      <button
                        onClick={() => handleDelete(trip._id)}
                        disabled={deleting === trip._id}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400/70 hover:text-red-400 transition-colors disabled:opacity-40"
                      >
                        {deleting === trip._id ? '...' : labels.common.delete}
                      </button>
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
