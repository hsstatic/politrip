'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import Link from 'next/link';
import { useState } from 'react';

const SPAN_LABELS: Record<string, string> = {
  '': 'Normal',
  'lg:col-span-2 lg:row-span-2': 'Wide + Tall (2×2)',
  'lg:col-span-2': 'Wide (2×1)',
  'lg:row-span-2': 'Tall (1×2)',
};

export default function GalleryPage() {
  const items = useQuery(api.gallery.getAll);
  const remove = useMutation(api.gallery.remove);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: Id<'gallery'>) {
    if (!confirm('Delete this photo? This cannot be undone.')) return;
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
            Gallery
          </h1>
          <p className="text-sm text-white/40 mt-0.5">{sorted?.length ?? 0} photos</p>
        </div>
        <Link
          href="/dashboard/gallery/new"
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Add Photo
        </Link>
      </div>

      {sorted === undefined && <p className="text-white/40 text-sm">Loading...</p>}

      {sorted?.length === 0 && (
        <div className="text-center py-16 text-white/30">
          <p className="text-4xl mb-3">🖼</p>
          <p>No gallery photos yet. Add your first one.</p>
        </div>
      )}

      {sorted && sorted.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((item) => (
            <div key={item._id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="relative h-40 bg-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.label}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <p className="text-white text-sm font-medium mb-0.5">{item.label}</p>
                <p className="text-white/35 text-xs mb-3">
                  Order: {item.order} · {SPAN_LABELS[item.span] ?? (item.span || 'Normal')}
                </p>
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/gallery/${item._id}`}
                    className="flex-1 text-center text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deleting === item._id}
                    className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400/70 hover:text-red-400 hover:border-red-500/40 transition-colors disabled:opacity-40"
                  >
                    {deleting === item._id ? '...' : 'Delete'}
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
