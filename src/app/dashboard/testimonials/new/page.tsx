'use client';

import TestimonialForm from '@/components/dashboard/TestimonialForm';

export default function NewTestimonialPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-1" style={{ fontFamily: 'var(--font-instrument)' }}>
        New Testimonial
      </h1>
      <p className="text-sm text-white/40 mb-8">Add a guest review to the site.</p>
      <TestimonialForm mode="new" />
    </div>
  );
}
