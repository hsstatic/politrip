'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import Link from 'next/link';
import { useState } from 'react';

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
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: 'var(--font-instrument)' }}>Trips</h1>
          <p className="text-sm text-white/40 mt-0.5">{trips?.length ?? 0} total</p>
        </div>
        <Link href="/dashboard/trips/new" className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-medium rounded-lg transition-colors">
          + Add Trip
        </Link>
      </div>

      {trips === undefined && <p className="text-white/40 text-sm">Loading…</p>}

      {trips?.length === 0 && (
        <div className="text-center py-16 text-white/30">
          <p className="text-4xl mb-3">✈</p>
          <p>No trips yet. Add your first one.</p>
        </div>
      )}

      {trips && trips.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Category</th>
                <th className="text-left px-4 py-3 font-medium">Location</th>
                <th className="text-left px-4 py-3 font-medium">Duration</th>
                <th className="text-left px-4 py-3 font-medium">Price</th>
                <th className="text-left px-4 py-3 font-medium">Flags</th>
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
                  <td className="px-4 py-3 flex items-center gap-2 justify-end">
                    <Link href={`/dashboard/trips/${trip._id}`} className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white transition-colors">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(trip._id)}
                      disabled={deleting === trip._id}
                      className="text-xs px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400/70 hover:text-red-400 transition-colors disabled:opacity-40"
                    >
                      {deleting === trip._id ? '...' : 'Delete'}
                    </button>
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
