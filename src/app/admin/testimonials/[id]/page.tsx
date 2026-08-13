'use client';

import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import TestimonialForm from '@/components/admin/TestimonialForm';
import RequirePermission from '@/components/admin/RequirePermission';
import { useDashLang } from '@/lib/adminI18n';

export default function EditTestimonialPage() {
  const { id } = useParams<{ id: string }>();
  const { labels } = useDashLang();
  const item = useQuery(api.testimonials.getById, { id: id as Id<'testimonials'> });

  return (
    <RequirePermission permission="content.edit">
      {item === undefined ? (
        <div className="p-4 sm:p-8 pt-14 sm:pt-8 text-ink/40 text-sm">{labels.common.loading}</div>
      ) : item === null ? (
        <div className="p-4 sm:p-8 pt-14 sm:pt-8 text-danger text-sm">Testimonial not found.</div>
      ) : (
        <div className="p-4 sm:p-8 pt-14 sm:pt-8">
          <h1 className="text-2xl font-semibold text-ink mb-1" style={{ fontFamily: 'var(--font-instrument)' }}>
            {labels.testimonial.editTitle}
          </h1>
          <p className="text-sm text-ink/40 mb-8">{item.name}</p>
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
      )}
    </RequirePermission>
  );
}
