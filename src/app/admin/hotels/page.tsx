'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useDashLang } from '@/lib/adminI18n';
import { useAdminMutation, useSession } from '@/components/admin/AdminAuthProvider';
import RequirePermission, { Can } from '@/components/admin/RequirePermission';

export default function HotelsPage() {
  return (
    <RequirePermission permission="content.view">
      <HotelsManager />
    </RequirePermission>
  );
}

function HotelsManager() {
  const { labels } = useDashLang();
  const { hasPermission } = useSession();
  const L = labels.hotel;
  const hotels = useQuery(api.hotels.getAll);
  const remove = useAdminMutation(api.hotels.remove);
  const reorder = useAdminMutation(api.hotels.reorder);
  const [deleting, setDeleting] = useState<string | null>(null);
  // Optimistic reorder: derived during render, discarded once fresh data arrives
  const [optimistic, setOptimistic] = useState<{
    base: typeof hotels;
    list: NonNullable<typeof hotels>;
  } | null>(null);

  const sorted = useMemo(
    () =>
      hotels
        ? [...hotels].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        : undefined,
    [hotels]
  );
  const ordered = optimistic && optimistic.base === hotels ? optimistic.list : sorted;

  async function handleDelete(id: Id<'hotels'>) {
    if (!confirm('Delete this hotel? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await remove({ id });
    } catch {
      alert('Could not delete this hotel. Please try again.');
    } finally {
      setDeleting(null);
    }
  }

  async function move(index: number, direction: -1 | 1) {
    if (!ordered) return;
    const next = [...ordered];
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= next.length) return;
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
    setOptimistic({ base: hotels, list: next });
    await reorder({ orderedIds: next.map((h) => h._id) });
  }

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1
            className="text-2xl font-semibold text-ink"
            style={{ fontFamily: 'var(--font-instrument)' }}
          >
            {L.pageTitle}
          </h1>
          <p className="text-sm text-ink/40 mt-0.5">{hotels?.length ?? 0} {labels.common.total}</p>
        </div>
        <Can permission="content.create">
          <Link
            href="/admin/hotels/new"
            className="self-start sm:self-auto px-4 py-2 bg-accent hover:bg-accent-light text-on-accent text-sm font-medium rounded-lg transition-colors"
          >
            {L.addNew}
          </Link>
        </Can>
      </div>

      {hotels === undefined && (
        <p className="text-ink/40 text-sm">{labels.common.loading}</p>
      )}

      {hotels?.length === 0 && (
        <div className="text-center py-16 text-ink/30">
          <p className="text-4xl mb-3">🏨</p>
          <p>{L.noItems}</p>
        </div>
      )}

      {ordered && ordered.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-ink/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-ink/40">
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
                  className="border-b border-ink/5 hover:bg-ink/3 transition-colors"
                >
                  <td className="px-4 py-3">
                    {hasPermission('content.edit') ? (
                      <div className="flex flex-col items-center gap-0.5">
                        <button
                          onClick={() => move(index, -1)}
                          disabled={index === 0}
                          className="text-ink/30 hover:text-ink/80 disabled:opacity-20 disabled:cursor-not-allowed transition-colors leading-none"
                          title={labels.common.moveUp}
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => move(index, 1)}
                          disabled={index === ordered.length - 1}
                          className="text-ink/30 hover:text-ink/80 disabled:opacity-20 disabled:cursor-not-allowed transition-colors leading-none"
                          title={labels.common.moveDown}
                        >
                          ▼
                        </button>
                      </div>
                    ) : (
                      <span className="block text-center text-ink/30 tabular-nums">{index + 1}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink font-medium">{hotel.name_en}</td>
                  <td className="px-4 py-3 text-ink/60 capitalize">{hotel.city}</td>
                  <td className="px-4 py-3 text-ink/60 capitalize">{hotel.category}</td>
                  <td className="px-4 py-3 text-yellow-600 dark:text-yellow-400">{'★'.repeat(hotel.stars)}</td>
                  <td className="px-4 py-3 text-ink/60">${hotel.price}</td>
                  <td className="px-4 py-3">
                    {hotel.isVIP ? (
                      <span className="text-xs bg-warning/20 text-warning px-2 py-0.5 rounded-full">VIP</span>
                    ) : (
                      <span className="text-ink/20">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Can permission="content.edit">
                        <Link
                          href={`/admin/hotels/${hotel._id}`}
                          className="text-xs px-3 py-1.5 rounded-lg border border-ink/10 text-ink/60 hover:text-ink hover:border-ink/30 transition-colors"
                        >
                          {labels.common.edit}
                        </Link>
                      </Can>
                      <Can permission="content.delete">
                        <button
                          onClick={() => handleDelete(hotel._id)}
                          disabled={deleting === hotel._id}
                          className="text-xs px-3 py-1.5 rounded-lg border border-danger/20 text-danger/70 hover:text-danger hover:border-danger/40 transition-colors disabled:opacity-40"
                        >
                          {deleting === hotel._id ? '...' : labels.common.delete}
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
