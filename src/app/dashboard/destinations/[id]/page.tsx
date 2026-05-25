'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import DestinationForm from '@/components/dashboard/DestinationForm';
import { useParams } from 'next/navigation';
import { useDashLang } from '@/lib/dashboardI18n';

export default function EditDestinationPage() {
  const { id } = useParams<{ id: string }>();
  const { labels } = useDashLang();
  const dest = useQuery(api.destinations.getById, { id: id as Id<'destinations'> });

  if (dest === undefined) return <div className="p-4 sm:p-8 pt-14 sm:pt-8 text-white/40 text-sm">{labels.common.loading}</div>;
  if (dest === null) return <div className="p-4 sm:p-8 pt-14 sm:pt-8 text-red-400 text-sm">Destination not found.</div>;

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8">
      <h1 className="text-2xl font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-instrument)' }}>
        {labels.destination.editTitle}
      </h1>
      <DestinationForm
        mode="edit"
        id={dest._id}
        defaults={{
          ...dest,
          images: dest.images ?? [],
        }}
      />
    </div>
  );
}
