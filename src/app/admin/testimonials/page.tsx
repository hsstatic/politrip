'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import Link from 'next/link';
import { useState } from 'react';
import { useDashLang } from '@/lib/adminI18n';
import { useAdminMutation } from '@/components/admin/AdminAuthProvider';
import RequirePermission, { Can } from '@/components/admin/RequirePermission';

export default function TestimonialsPage() {
  return (
    <RequirePermission permission="content.view">
      <TestimonialsManager />
    </RequirePermission>
  );
}

function TestimonialsManager() {
  const { labels } = useDashLang();
  const L = labels.testimonial;
  const items = useQuery(api.testimonials.getAll);
  const remove = useAdminMutation(api.testimonials.remove);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: Id<'testimonials'>) {
    if (!confirm('Delete this testimonial? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await remove({ id });
    } catch {
      alert('Could not delete this testimonial. Please try again.');
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
            href="/admin/testimonials/new"
            className="self-start sm:self-auto px-4 py-2 bg-accent hover:bg-accent-light text-on-accent text-sm font-medium rounded-lg transition-colors"
          >
            {L.addNew}
          </Link>
        </Can>
      </div>

      {sorted === undefined && <p className="text-ink/40 text-sm">{labels.common.loading}</p>}

      {sorted?.length === 0 && (
        <div className="text-center py-16 text-ink/30">
          <p className="text-4xl mb-3">💬</p>
          <p>{L.noItems}</p>
        </div>
      )}

      {sorted && sorted.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-ink/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-ink/40">
                <th className="text-left px-4 py-3 font-medium">{L.table.order}</th>
                <th className="text-left px-4 py-3 font-medium">{L.table.name}</th>
                <th className="text-left px-4 py-3 font-medium">{L.table.country}</th>
                <th className="text-left px-4 py-3 font-medium">{L.table.trip}</th>
                <th className="text-left px-4 py-3 font-medium">{L.table.rating}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((item) => (
                <tr key={item._id} className="border-b border-ink/5 hover:bg-ink/3 transition-colors">
                  <td className="px-4 py-3 text-ink/30 tabular-nums">{item.order}</td>
                  <td className="px-4 py-3 text-ink font-medium">
                    <span className="mr-2">{item.flag}</span>{item.name}
                  </td>
                  <td className="px-4 py-3 text-ink/60">{item.country_en}</td>
                  <td className="px-4 py-3 text-ink/60">{item.trip_en}</td>
                  <td className="px-4 py-3 text-yellow-600 dark:text-yellow-400">{'★'.repeat(item.rating)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Can permission="content.edit">
                        <Link
                          href={`/admin/testimonials/${item._id}`}
                          className="text-xs px-3 py-1.5 rounded-lg border border-ink/10 text-ink/60 hover:text-ink hover:border-ink/30 transition-colors"
                        >
                          {labels.common.edit}
                        </Link>
                      </Can>
                      <Can permission="content.delete">
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={deleting === item._id}
                          className="text-xs px-3 py-1.5 rounded-lg border border-danger/20 text-danger/70 hover:text-danger hover:border-danger/40 transition-colors disabled:opacity-40"
                        >
                          {deleting === item._id ? '...' : labels.common.delete}
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
