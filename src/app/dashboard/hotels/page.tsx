'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useDashLang } from '@/lib/dashboardI18n';

export default function HotelsPage() {
  const { labels } = useDashLang();
  const L = labels.hotel;
  const hotels = useQuery(api.hotels.getAll);
  const remove = useMutation(api.hotels.remove);
  const reorder = useMutation(api.hotels.reorder);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [ordered, setOrdered] = useState<typeof hotels>([]);

  useEffect(() => {
    if (!hotels) return;
    const sorted = [...hotels].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    setOrdered(sorted);
  }, [hotels]);

  async function handleDelete(id: Id<'hotels'>) {
    if (!confirm('Delete this hotel? This cannot be undone.')) return;
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
    await reorder({ orderedIds: next.map((h) => h._id) });
  }

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1
            className="text-2xl font-semibold text-white"
            style={{ fontFamily: 'var(--font-instrument)' }}
          >
            {L.pageTitle}
          </h1>
          <p className="text-sm text-white/40 mt-0.5">{hotels?.length ?? 0} {labels.common.total}</p>
        </div>
        <Link
          href="/dashboard/hotels/new"
          className="self-start sm:self-auto px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {L.addNew}
        </Link>
      </div>

      {hotels === undefined && (
        <p className="text-white/40 text-sm">{labels.common.loading}</p>
      )}

      {hotels?.length === 0 && (
        <div className="text-center py-16 text-white/30">
          <p className="text-4xl mb-3">🏨</p>
          <p>{L.noItems}</p>
        </div>
      )}

      {ordered && ordered.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="w-16 px-4 py-3 font-medium text-center">{labels.common.order}</th>
                <th className="text-left px-4 py-3 font-medium">{L.table.name}</th>
                <th className="text-left px-4 py-3 font-medium">{L.table.city}</th>
                <th className="text-left px-4 py-3 font-medium">{L.table.category}</th>
                <th className="text-left px-4 py-3 font-medium">{L.table.stars}</th>
                <th className="text-left px-4 py-3 font-medium">{L.table.price}</th>
                <th className="text-left px-4 py-3 font-medium">{L.table.vip}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {ordered.map((hotel, index) => (
                <tr
                  key={hotel._id}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-center gap-0.5">
                      <button
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        className="text-white/30 hover:text-white/80 disabled:opacity-20 disabled:cursor-not-allowed transition-colors leading-none"
                        title={labels.common.moveUp}
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => move(index, 1)}
                        disabled={index === ordered.length - 1}
                        className="text-white/30 hover:text-white/80 disabled:opacity-20 disabled:cursor-not-allowed transition-colors leading-none"
                        title={labels.common.moveDown}
                      >
                        ▼
                      </button>
                    </div>
                  </td>
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
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/dashboard/hotels/${hotel._id}`}
                        className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
                      >
                        {labels.common.edit}
                      </Link>
                      <button
                        onClick={() => handleDelete(hotel._id)}
                        disabled={deleting === hotel._id}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400/70 hover:text-red-400 hover:border-red-500/40 transition-colors disabled:opacity-40"
                      >
                        {deleting === hotel._id ? '...' : labels.common.delete}
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
