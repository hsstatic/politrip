'use client';

import DestinationForm from '@/components/dashboard/DestinationForm';
import { useDashLang } from '@/lib/dashboardI18n';

export default function NewDestinationPage() {
  const { labels } = useDashLang();
  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8">
      <h1 className="text-2xl font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-instrument)' }}>
        {labels.destination.createTitle}
      </h1>
      <DestinationForm mode="new" />
    </div>
  );
}
