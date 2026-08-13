'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import Link from 'next/link';
import { useState } from 'react';
import { useDashLang } from '@/lib/adminI18n';
import { useAdminMutation } from '@/components/admin/AdminAuthProvider';
import RequirePermission, { Can } from '@/components/admin/RequirePermission';

const SPAN_LABELS: Record<string, string> = {
  '': 'Normal',
  'lg:col-span-2 lg:row-span-2': 'Wide + Tall (2×2)',
  'lg:col-span-2': 'Wide (2×1)',
  'lg:row-span-2': 'Tall (1×2)',
};

export default function GalleryPage() {
  return (
    <RequirePermission permission="content.view">
      <GalleryManager />
    </RequirePermission>
  );
}

function GalleryManager() {
  const { labels } = useDashLang();
  const L = labels.gallery;
  const items = useQuery(api.gallery.getAll);
  const remove = useAdminMutation(api.gallery.remove);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: Id<'gallery'>) {
    if (!confirm('Delete this photo? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await remove({ id });
    } catch {
      alert('Could not delete this photo. Please try again.');
    } finally {
      setDeleting(null);
    }
  }

  const sorted = items ? [...items].sort((a, b) => a.order - b.order) : undefined;

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink" style={{ fontFamily: 'var(--font-instrument)' }}>
            {L.pageTitle}
          </h1>
          <p className="text-sm text-ink/40 mt-0.5">{sorted?.length ?? 0} {labels.common.total}</p>
        </div>
        <Can permission="content.create">
          <Link
            href="/admin/gallery/new"
            className="self-start sm:self-auto px-4 py-2 bg-accent hover:bg-accent-light text-on-accent text-sm font-medium rounded-lg transition-colors"
          >
            {L.addNew}
          </Link>
        </Can>
      </div>

      {sorted === undefined && <p className="text-ink/40 text-sm">{labels.common.loading}</p>}

      {sorted?.length === 0 && (
        <div className="text-center py-16 text-ink/30">
          <p className="text-4xl mb-3">🖼</p>
          <p>{L.noItems}</p>
        </div>
      )}

      {sorted && sorted.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((item) => (
            <div key={item._id} className="bg-ink/5 border border-ink/10 rounded-xl overflow-hidden">
              <div className="relative h-40 bg-ink/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.label}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <p className="text-ink text-sm font-medium mb-0.5">{item.label}</p>
                <p className="text-ink/35 text-xs mb-3">
                  {labels.common.order}: {item.order} · {SPAN_LABELS[item.span] ?? (item.span || 'Normal')}
                </p>
                <div className="flex gap-2">
                  <Can permission="content.edit">
                    <Link
                      href={`/admin/gallery/${item._id}`}
                      className="flex-1 text-center text-xs px-3 py-1.5 rounded-lg border border-ink/10 text-ink/60 hover:text-ink hover:border-ink/30 transition-colors"
                    >
                      {labels.common.edit}
                    </Link>
                  </Can>
                  <Can permission="content.delete">
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={deleting === item._id}
                      className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-danger/20 text-danger/70 hover:text-danger hover:border-danger/40 transition-colors disabled:opacity-40"
                    >
                      {deleting === item._id ? '...' : labels.common.delete}
                    </button>
                  </Can>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
