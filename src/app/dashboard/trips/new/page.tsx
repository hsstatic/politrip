'use client';

import TripForm from '@/components/dashboard/TripForm';
import { useDashLang } from '@/lib/dashboardI18n';

export default function NewTripPage() {
  const { labels } = useDashLang();
  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8">
      <h1 className="text-2xl font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-instrument)' }}>
        {labels.trip.createTitle}
      </h1>
      <TripForm mode="new" />
    </div>
  );
}
