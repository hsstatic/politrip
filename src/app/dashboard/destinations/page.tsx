'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import Link from 'next/link';
import { useState } from 'react';

export default function DestinationsPage() {
  const destinations = useQuery(api.destinations.getAll);
  const remove = useMutation(api.destinations.remove);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: Id<'destinations'>) {
    if (!confirm('Delete this destination?')) return;
    setDeleting(id);
    await remove({ id });
    setDeleting(null);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: 'var(--font-instrument)' }}>
            Destinations
          </h1>
          <p className="text-sm text-white/40 mt-0.5">{destinations?.length ?? 0} total</p>
        </div>
        <Link
          href="/dashboard/destinations/new"
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Add Destination
        </Link>
      </div>

      {destinations === undefined && <p className="text-white/40 text-sm">Loading…</p>}

      {destinations?.length === 0 && (
        <div className="text-center py-16 text-white/30">
          <p className="text-4xl mb-3">🗺</p>
          <p>No destinations yet. Add your first one.</p>
        </div>
      )}

      {destinations && destinations.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest) => (
            <div
              key={dest._id}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
              style={{ borderColor: dest.accent + '30' }}
            >
              <div className="p-4" style={{ backgroundColor: dest.color + '40' }}>
                <span className="text-3xl">{dest.icon}</span>
              </div>
              <div className="p-4">
                <p className="text-white font-medium">{dest.name_en}</p>
                <p className="text-white/40 text-xs mt-0.5">{dest.tag_en}</p>
                <p className="text-xs mt-1 inline-block px-2 py-0.5 rounded-full" style={{ backgroundColor: dest.accent + '20', color: dest.accent }}>
                  {dest.badge_en}
                </p>
                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/dashboard/destinations/${dest._id}`}
                    className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(dest._id)}
                    disabled={deleting === dest._id}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400/70 hover:text-red-400 transition-colors disabled:opacity-40"
                  >
                    {deleting === dest._id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
