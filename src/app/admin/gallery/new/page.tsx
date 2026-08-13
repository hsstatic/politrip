'use client';

import GalleryPhotoForm from '@/components/admin/GalleryPhotoForm';
import RequirePermission from '@/components/admin/RequirePermission';
import { useDashLang } from '@/lib/adminI18n';

export default function NewGalleryPhotoPage() {
  const { labels } = useDashLang();
  return (
    <RequirePermission permission="content.create">
      <div className="p-4 sm:p-8 pt-14 sm:pt-8">
        <h1 className="text-2xl font-semibold text-ink mb-1" style={{ fontFamily: 'var(--font-instrument)' }}>
          {labels.gallery.createTitle}
        </h1>
        <GalleryPhotoForm mode="new" />
      </div>
    </RequirePermission>
  );
}
