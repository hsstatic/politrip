'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import HotelForm from '@/components/admin/HotelForm';
import RequirePermission from '@/components/admin/RequirePermission';
import { useParams } from 'next/navigation';
import { useDashLang } from '@/lib/adminI18n';

export default function EditHotelPage() {
  const { id } = useParams<{ id: string }>();
  const { labels } = useDashLang();
  const hotel = useQuery(api.hotels.getById, { id: id as Id<'hotels'> });

  return (
    <RequirePermission permission="content.edit">
      {hotel === undefined ? (
        <div className="p-4 sm:p-8 pt-14 sm:pt-8 text-ink/40 text-sm">{labels.common.loading}</div>
      ) : hotel === null ? (
        <div className="p-4 sm:p-8 pt-14 sm:pt-8 text-danger text-sm">Hotel not found.</div>
      ) : (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8">
      <h1
        className="text-2xl font-semibold text-ink mb-6"
        style={{ fontFamily: 'var(--font-instrument)' }}
      >
        {labels.hotel.editTitle}
      </h1>
      <HotelForm
        mode="edit"
        id={hotel._id}
        defaults={{
          name_en: hotel.name_en, name_ar: hotel.name_ar, name_tr: hotel.name_tr,
          description_en: hotel.description_en, description_ar: hotel.description_ar, description_tr: hotel.description_tr,
          city: hotel.city, stars: hotel.stars, rating: hotel.rating,
          reviews: hotel.reviews, price: hotel.price,
          images: hotel.images, amenities: hotel.amenities,
          category: hotel.category, isVIP: hotel.isVIP,
          lat: hotel.lat, lng: hotel.lng,
        }}
      />
    </div>
      )}
    </RequirePermission>
  );
}
