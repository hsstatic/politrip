'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useDashLang } from '@/lib/adminI18n';
import { useAdminMutation, useSession } from '@/components/admin/AdminAuthProvider';
import RequirePermission, { Can } from '@/components/admin/RequirePermission';

export default function DestinationsPage() {
  return (
    <RequirePermission permission="content.view">
      <DestinationsManager />
    </RequirePermission>
  );
}

function DestinationsManager() {
  const { labels } = useDashLang();
  const { hasPermission } = useSession();
  const L = labels.destination;
  const destinations = useQuery(api.destinations.getAll);
  const remove = useAdminMutation(api.destinations.remove);
  const reorder = useAdminMutation(api.destinations.reorder);
  const [deleting, setDeleting] = useState<string | null>(null);
  // Optimistic reorder: derived during render, discarded once fresh data arrives
  const [optimistic, setOptimistic] = useState<{
    base: typeof destinations;
    list: NonNullable<typeof destinations>;
  } | null>(null);

  const sorted = useMemo(
    () =>
      destinations
        ? [...destinations].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        : undefined,
    [destinations]
  );
  const ordered = optimistic && optimistic.base === destinations ? optimistic.list : sorted;

  async function handleDelete(id: Id<'destinations'>) {
    if (!confirm('Delete this destination?')) return;
    setDeleting(id);
    try {
      await remove({ id });
    } catch {
      alert('Could not delete this destination. Please try again.');
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
    setOptimistic({ base: destinations, list: next });
    await reorder({ orderedIds: next.map((d) => d._id) });
  }

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink" style={{ fontFamily: 'var(--font-instrument)' }}>
            {L.pageTitle}
          </h1>
          <p className="text-sm text-ink/40 mt-0.5">{destinations?.length ?? 0} {labels.common.total}</p>
        </div>
        <Can permission="content.create">
          <Link
            href="/admin/destinations/new"
            className="self-start sm:self-auto px-4 py-2 bg-accent hover:bg-accent-light text-on-accent text-sm font-medium rounded-lg transition-colors"
          >
            {L.addNew}
          </Link>
        </Can>
      </div>

      {destinations === undefined && <p className="text-ink/40 text-sm">{labels.common.loading}</p>}

      {destinations?.length === 0 && (
        <div className="text-center py-16 text-ink/30">
          <p className="text-4xl mb-3">🗺</p>
          <p>{L.noItems}</p>
        </div>
      )}

      {ordered && ordered.length > 0 && (
        <div className="flex flex-col gap-2">
          {ordered.map((dest, index) => (
            <div
              key={dest._id}
              className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 bg-ink/5 border border-ink/10 rounded-xl"
            >
              {hasPermission('content.edit') ? (
                <div className="flex flex-col items-center gap-0.5 shrink-0">
                  <button
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="text-ink/30 hover:text-ink/80 disabled:opacity-20 disabled:cursor-not-allowed transition-colors leading-none text-xs"
                    title={labels.common.moveUp}
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => move(index, 1)}
                    disabled={index === ordered.length - 1}
                    className="text-ink/30 hover:text-ink/80 disabled:opacity-20 disabled:cursor-not-allowed transition-colors leading-none text-xs"
                    title={labels.common.moveDown}
                  >
                    ▼
                  </button>
                </div>
              ) : null}

              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-lg sm:text-xl shrink-0"
                style={{ backgroundColor: dest.color + '40' }}
              >
                {dest.icon}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-ink font-medium text-sm truncate">{dest.name_en}</p>
                <p className="text-ink/40 text-xs truncate">{dest.tag_en}</p>
              </div>

              <span
                className="hidden sm:inline text-xs px-2 py-0.5 rounded-full shrink-0"
                style={{ backgroundColor: dest.accent + '20', color: dest.accent }}
              >
                {dest.badge_en}
              </span>

              <div className="flex gap-2 shrink-0">
                <Can permission="content.edit">
                  <Link
                    href={`/admin/destinations/${dest._id}`}
                    className="text-xs px-3 py-1.5 rounded-lg border border-ink/10 text-ink/60 hover:text-ink transition-colors"
                  >
                    {labels.common.edit}
                  </Link>
                </Can>
                <Can permission="content.delete">
                  <button
                    onClick={() => handleDelete(dest._id)}
                    disabled={deleting === dest._id}
                    className="text-xs px-3 py-1.5 rounded-lg border border-danger/20 text-danger/70 hover:text-danger transition-colors disabled:opacity-40"
                  >
                    {deleting === dest._id ? '...' : labels.common.delete}
                  </button>
                </Can>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
