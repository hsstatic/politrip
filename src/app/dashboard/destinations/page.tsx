'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function DestinationsPage() {
  const destinations = useQuery(api.destinations.getAll);
  const remove = useMutation(api.destinations.remove);
  const reorder = useMutation(api.destinations.reorder);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [ordered, setOrdered] = useState<typeof destinations>([]);

  useEffect(() => {
    if (!destinations) return;
    const sorted = [...destinations].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    setOrdered(sorted);
  }, [destinations]);

  async function handleDelete(id: Id<'destinations'>) {
    if (!confirm('Delete this destination?')) return;
    setDeleting(id);
    await remove({ id });
    setDeleting(null);
  }

  async function move(index: number, direction: -1 | 1) {
    if (!ordered) return;
    const next = [...ordered];
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= next.length) return;
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
    setOrdered(next);
    await reorder({ orderedIds: next.map((d) => d._id) });
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

      {ordered && ordered.length > 0 && (
        <div className="flex flex-col gap-2">
          {ordered.map((dest, index) => (
            <div
              key={dest._id}
              className="flex items-center gap-4 px-4 py-3 bg-white/5 border border-white/10 rounded-xl"
            >
              <div className="flex flex-col items-center gap-0.5 shrink-0">
                <button
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="text-white/30 hover:text-white/80 disabled:opacity-20 disabled:cursor-not-allowed transition-colors leading-none text-xs"
                  title="Move up"
                >
                  ▲
                </button>
                <button
                  onClick={() => move(index, 1)}
                  disabled={index === ordered.length - 1}
                  className="text-white/30 hover:text-white/80 disabled:opacity-20 disabled:cursor-not-allowed transition-colors leading-none text-xs"
                  title="Move down"
                >
                  ▼
                </button>
              </div>

              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: dest.color + '40' }}
              >
                {dest.icon}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{dest.name_en}</p>
                <p className="text-white/40 text-xs truncate">{dest.tag_en}</p>
              </div>

              <span
                className="text-xs px-2 py-0.5 rounded-full shrink-0"
                style={{ backgroundColor: dest.accent + '20', color: dest.accent }}
              >
                {dest.badge_en}
              </span>

              <div className="flex gap-2 shrink-0">
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
          ))}
        </div>
      )}
    </div>
  );
}
