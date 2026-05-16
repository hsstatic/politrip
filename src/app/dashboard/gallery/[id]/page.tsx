'use client';

import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import GalleryPhotoForm from '@/components/dashboard/GalleryPhotoForm';

export default function EditGalleryPhotoPage() {
  const { id } = useParams<{ id: string }>();
  const item = useQuery(api.gallery.getById, { id: id as Id<'gallery'> });

  if (item === undefined) return <div className="p-8 text-white/40 text-sm">Loading...</div>;
  if (item === null) return <div className="p-8 text-red-400 text-sm">Photo not found.</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-1" style={{ fontFamily: 'var(--font-instrument)' }}>
        Edit Photo
      </h1>
      <p className="text-sm text-white/40 mb-8">{item.label}</p>
      <GalleryPhotoForm
        mode="edit"
        id={item._id}
        defaults={{ src: item.src, label: item.label, span: item.span, order: item.order }}
      />
    </div>
  );
}
