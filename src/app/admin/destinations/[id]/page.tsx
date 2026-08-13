'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import DestinationForm from '@/components/admin/DestinationForm';
import RequirePermission from '@/components/admin/RequirePermission';
import { useParams } from 'next/navigation';
import { useDashLang } from '@/lib/adminI18n';

export default function EditDestinationPage() {
  const { id } = useParams<{ id: string }>();
  const { labels } = useDashLang();
  const dest = useQuery(api.destinations.getById, { id: id as Id<'destinations'> });

  return (
    <RequirePermission permission="content.edit">
      {dest === undefined ? (
        <div className="p-4 sm:p-8 pt-14 sm:pt-8 text-ink/40 text-sm">{labels.common.loading}</div>
      ) : dest === null ? (
        <div className="p-4 sm:p-8 pt-14 sm:pt-8 text-danger text-sm">Destination not found.</div>
      ) : (
        <div className="p-4 sm:p-8 pt-14 sm:pt-8">
          <h1 className="text-2xl font-semibold text-ink mb-6" style={{ fontFamily: 'var(--font-instrument)' }}>
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
      )}
    </RequirePermission>
  );
}
