'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import TripForm from '@/components/admin/TripForm';
import RequirePermission from '@/components/admin/RequirePermission';
import { useParams } from 'next/navigation';
import { useDashLang } from '@/lib/adminI18n';

export default function EditTripPage() {
  const { id } = useParams<{ id: string }>();
  const { labels } = useDashLang();
  const trip = useQuery(api.trips.getById, { id: id as Id<'trips'> });

  return (
    <RequirePermission permission="content.edit">
      {trip === undefined ? (
        <div className="p-4 sm:p-8 pt-14 sm:pt-8 text-ink/40 text-sm">{labels.common.loading}</div>
      ) : trip === null ? (
        <div className="p-4 sm:p-8 pt-14 sm:pt-8 text-danger text-sm">Trip not found.</div>
      ) : (
        <div className="p-4 sm:p-8 pt-14 sm:pt-8">
          <h1 className="text-2xl font-semibold text-ink mb-6" style={{ fontFamily: 'var(--font-instrument)' }}>
            {labels.trip.editTitle}
          </h1>
          <TripForm
            mode="edit"
            id={trip._id}
            defaults={{
              title_en: trip.title_en, title_ar: trip.title_ar, title_tr: trip.title_tr,
              description_en: trip.description_en, description_ar: trip.description_ar, description_tr: trip.description_tr,
              highlights_en: trip.highlights_en, highlights_ar: trip.highlights_ar, highlights_tr: trip.highlights_tr,
              location: trip.location, duration: trip.duration, price: trip.price,
              currency: trip.currency, category: trip.category,
              rating: trip.rating, reviews: trip.reviews,
              images: trip.images, capacity: trip.capacity,
              nextAvailable: trip.nextAvailable, isVIP: trip.isVIP, isPopular: trip.isPopular,
            }}
          />
        </div>
      )}
    </RequirePermission>
  );
}
