'use client';

import GalleryPhotoForm from '@/components/dashboard/GalleryPhotoForm';
import { useDashLang } from '@/lib/dashboardI18n';

export default function NewGalleryPhotoPage() {
  const { labels } = useDashLang();
  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8">
      <h1 className="text-2xl font-semibold text-white mb-1" style={{ fontFamily: 'var(--font-instrument)' }}>
        {labels.gallery.createTitle}
      </h1>
      <GalleryPhotoForm mode="new" />
    </div>
  );
}
