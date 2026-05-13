'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import Link from 'next/link';
import { useState } from 'react';

export default function HotelsPage() {
  const hotels = useQuery(api.hotels.getAll);
  const remove = useMutation(api.hotels.remove);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: Id<'hotels'>) {
    if (!confirm('Delete this hotel? This cannot be undone.')) return;
    setDeleting(id);
    await remove({ id });
    setDeleting(null);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-semibold text-white"
            style={{ fontFamily: 'var(--font-instrument)' }}
          >
            Hotels
          </h1>
          <p className="text-sm text-white/40 mt-0.5">{hotels?.length ?? 0} total</p>
        </div>
        <Link
          href="/dashboard/hotels/new"
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Add Hotel
        </Link>
      </div>

      {hotels === undefined && (
        <p className="text-white/40 text-sm">Loading...</p>
      )}

      {hotels?.length === 0 && (
        <div className="text-center py-16 text-white/30">
          <p className="text-4xl mb-3">🏨</p>
          <p>No hotels yet. Add your first one.</p>
        </div>
      )}

      {hotels && hotels.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">City</th>
                <th className="text-left px-4 py-3 font-medium">Category</th>
                <th className="text-left px-4 py-3 font-medium">Stars</th>
                <th className="text-left px-4 py-3 font-medium">Price / night</th>
                <th className="text-left px-4 py-3 font-medium">VIP</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <tr
                  key={hotel._id}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors"
                >
                  <td className="px-4 py-3 text-white font-medium">{hotel.name_en}</td>
                  <td className="px-4 py-3 text-white/60 capitalize">{hotel.city}</td>
                  <td className="px-4 py-3 text-white/60 capitalize">{hotel.category}</td>
                  <td className="px-4 py-3 text-yellow-400">{'★'.repeat(hotel.stars)}</td>
                  <td className="px-4 py-3 text-white/60">${hotel.price}</td>
                  <td className="px-4 py-3">
                    {hotel.isVIP ? (
                      <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">VIP</span>
                    ) : (
                      <span className="text-white/20">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2 justify-end">
                    <Link
                      href={`/dashboard/hotels/${hotel._id}`}
                      className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(hotel._id)}
                      disabled={deleting === hotel._id}
                      className="text-xs px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400/70 hover:text-red-400 hover:border-red-500/40 transition-colors disabled:opacity-40"
                    >
                      {deleting === hotel._id ? '...' : 'Delete'}
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
