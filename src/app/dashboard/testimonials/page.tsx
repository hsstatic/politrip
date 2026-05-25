'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import Link from 'next/link';
import { useState } from 'react';
import { useDashLang } from '@/lib/dashboardI18n';

export default function TestimonialsPage() {
  const { labels } = useDashLang();
  const L = labels.testimonial;
  const items = useQuery(api.testimonials.getAll);
  const remove = useMutation(api.testimonials.remove);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: Id<'testimonials'>) {
    if (!confirm('Delete this testimonial? This cannot be undone.')) return;
    setDeleting(id);
    await remove({ id });
    setDeleting(null);
  }

  const sorted = items ? [...items].sort((a, b) => a.order - b.order) : undefined;

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: 'var(--font-instrument)' }}>
            {L.pageTitle}
          </h1>
          <p className="text-sm text-white/40 mt-0.5">{sorted?.length ?? 0} {labels.common.total}</p>
        </div>
        <Link
          href="/dashboard/testimonials/new"
          className="self-start sm:self-auto px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {L.addNew}
        </Link>
      </div>

      {sorted === undefined && <p className="text-white/40 text-sm">{labels.common.loading}</p>}

      {sorted?.length === 0 && (
        <div className="text-center py-16 text-white/30">
          <p className="text-4xl mb-3">💬</p>
          <p>{L.noItems}</p>
        </div>
      )}

      {sorted && sorted.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
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
                <tr key={item._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3 text-white/30 tabular-nums">{item.order}</td>
                  <td className="px-4 py-3 text-white font-medium">
                    <span className="mr-2">{item.flag}</span>{item.name}
                  </td>
                  <td className="px-4 py-3 text-white/60">{item.country_en}</td>
                  <td className="px-4 py-3 text-white/60">{item.trip_en}</td>
                  <td className="px-4 py-3 text-yellow-400">{'★'.repeat(item.rating)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/dashboard/testimonials/${item._id}`}
                        className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
                      >
                        {labels.common.edit}
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        disabled={deleting === item._id}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400/70 hover:text-red-400 hover:border-red-500/40 transition-colors disabled:opacity-40"
                      >
                        {deleting === item._id ? '...' : labels.common.delete}
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
