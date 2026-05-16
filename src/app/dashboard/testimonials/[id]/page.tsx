'use client';

import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import TestimonialForm from '@/components/dashboard/TestimonialForm';

export default function EditTestimonialPage() {
  const { id } = useParams<{ id: string }>();
  const item = useQuery(api.testimonials.getById, { id: id as Id<'testimonials'> });

  if (item === undefined) return <div className="p-8 text-white/40 text-sm">Loading...</div>;
  if (item === null) return <div className="p-8 text-red-400 text-sm">Testimonial not found.</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-1" style={{ fontFamily: 'var(--font-instrument)' }}>
        Edit Testimonial
      </h1>
      <p className="text-sm text-white/40 mb-8">{item.name}</p>
      <TestimonialForm
        mode="edit"
        id={item._id}
        defaults={{
          name: item.name,
          country_en: item.country_en, country_ar: item.country_ar, country_tr: item.country_tr,
          flag: item.flag,
          role_en: item.role_en, role_ar: item.role_ar, role_tr: item.role_tr,
          text_en: item.text_en, text_ar: item.text_ar, text_tr: item.text_tr,
          trip_en: item.trip_en, trip_ar: item.trip_ar, trip_tr: item.trip_tr,
          date_en: item.date_en, date_ar: item.date_ar, date_tr: item.date_tr,
          rating: item.rating,
          order: item.order,
        }}
      />
    </div>
  );
}
