'use client';

import HotelForm from '@/components/dashboard/HotelForm';
import { useDashLang } from '@/lib/dashboardI18n';

export default function NewHotelPage() {
  const { labels } = useDashLang();
  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8">
      <h1
        className="text-2xl font-semibold text-white mb-6"
        style={{ fontFamily: 'var(--font-instrument)' }}
      >
        {labels.hotel.createTitle}
      </h1>
      <HotelForm mode="new" />
    </div>
  );
}
