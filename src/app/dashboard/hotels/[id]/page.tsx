'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import HotelForm from '@/components/dashboard/HotelForm';
import { useParams } from 'next/navigation';

export default function EditHotelPage() {
  const { id } = useParams<{ id: string }>();
  const hotel = useQuery(api.hotels.getById, { id: id as Id<'hotels'> });

  if (hotel === undefined) {
    return <div className="p-8 text-white/40 text-sm">Loading…</div>;
  }
  if (hotel === null) {
    return <div className="p-8 text-red-400 text-sm">Hotel not found.</div>;
  }

  return (
    <div className="p-8">
      <h1
        className="text-2xl font-semibold text-white mb-6"
        style={{ fontFamily: 'var(--font-instrument)' }}
      >
        Edit Hotel
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
  );
}
