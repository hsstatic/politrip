'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import Link from 'next/link';
import { useState } from 'react';

export default function TestimonialsPage() {
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
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: 'var(--font-instrument)' }}>
            Testimonials
          </h1>
          <p className="text-sm text-white/40 mt-0.5">{sorted?.length ?? 0} total</p>
        </div>
        <Link
          href="/dashboard/testimonials/new"
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Add Testimonial
        </Link>
      </div>

      {sorted === undefined && <p className="text-white/40 text-sm">Loading...</p>}

      {sorted?.length === 0 && (
        <div className="text-center py-16 text-white/30">
          <p className="text-4xl mb-3">💬</p>
          <p>No testimonials yet. Add your first one.</p>
        </div>
      )}

      {sorted && sorted.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="text-left px-4 py-3 font-medium">#</th>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Country</th>
                <th className="text-left px-4 py-3 font-medium">Trip</th>
                <th className="text-left px-4 py-3 font-medium">Rating</th>
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
                  <td className="px-4 py-3 flex items-center gap-2 justify-end">
                    <Link
                      href={`/dashboard/testimonials/${item._id}`}
                      className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={deleting === item._id}
                      className="text-xs px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400/70 hover:text-red-400 hover:border-red-500/40 transition-colors disabled:opacity-40"
                    >
                      {deleting === item._id ? '...' : 'Delete'}
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
