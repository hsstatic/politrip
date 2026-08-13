'use client';

import TripForm from '@/components/admin/TripForm';
import RequirePermission from '@/components/admin/RequirePermission';
import { useDashLang } from '@/lib/adminI18n';

export default function NewTripPage() {
  const { labels } = useDashLang();
  return (
    <RequirePermission permission="content.create">
      <div className="p-4 sm:p-8 pt-14 sm:pt-8">
        <h1 className="text-2xl font-semibold text-ink mb-6" style={{ fontFamily: 'var(--font-instrument)' }}>
          {labels.trip.createTitle}
        </h1>
        <TripForm mode="new" />
      </div>
    </RequirePermission>
  );
}
