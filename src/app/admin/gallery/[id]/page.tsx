'use client';

import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import GalleryPhotoForm from '@/components/admin/GalleryPhotoForm';
import RequirePermission from '@/components/admin/RequirePermission';
import { useDashLang } from '@/lib/adminI18n';

export default function EditGalleryPhotoPage() {
  const { id } = useParams<{ id: string }>();
  const { labels } = useDashLang();
  const item = useQuery(api.gallery.getById, { id: id as Id<'gallery'> });

  return (
    <RequirePermission permission="content.edit">
      {item === undefined ? (
        <div className="p-4 sm:p-8 pt-14 sm:pt-8 text-ink/40 text-sm">{labels.common.loading}</div>
      ) : item === null ? (
        <div className="p-4 sm:p-8 pt-14 sm:pt-8 text-danger text-sm">Photo not found.</div>
      ) : (
        <div className="p-4 sm:p-8 pt-14 sm:pt-8">
          <h1 className="text-2xl font-semibold text-ink mb-1" style={{ fontFamily: 'var(--font-instrument)' }}>
            {labels.gallery.editTitle}
          </h1>
          <p className="text-sm text-ink/40 mb-8">{item.label}</p>
          <GalleryPhotoForm
            mode="edit"
            id={item._id}
            defaults={{ src: item.src, label: item.label, span: item.span, order: item.order }}
          />
        </div>
      )}
    </RequirePermission>
  );
}
