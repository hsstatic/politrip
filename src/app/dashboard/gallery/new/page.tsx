'use client';

import GalleryPhotoForm from '@/components/dashboard/GalleryPhotoForm';

export default function NewGalleryPhotoPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-1" style={{ fontFamily: 'var(--font-instrument)' }}>
        Add Photo
      </h1>
      <p className="text-sm text-white/40 mb-8">Add a photo to the gallery section.</p>
      <GalleryPhotoForm mode="new" />
    </div>
  );
}
