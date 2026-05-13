'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import DestinationForm from '@/components/dashboard/DestinationForm';
import { useParams } from 'next/navigation';

export default function EditDestinationPage() {
  const { id } = useParams<{ id: string }>();
  const dest = useQuery(api.destinations.getById, { id: id as Id<'destinations'> });

  if (dest === undefined) return <div className="p-8 text-white/40 text-sm">Loading…</div>;
  if (dest === null) return <div className="p-8 text-red-400 text-sm">Destination not found.</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-instrument)' }}>
        Edit Destination
      </h1>
      <DestinationForm mode="edit" id={dest._id} defaults={dest} />
    </div>
  );
}
