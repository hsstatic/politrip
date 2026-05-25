'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { useDashLang } from '@/lib/dashboardI18n';

interface TestimonialFormProps {
  mode: 'new' | 'edit';
  id?: Id<'testimonials'>;
  defaults?: {
    name: string;
    country_en: string; country_ar: string; country_tr: string;
    flag: string;
    role_en: string; role_ar: string; role_tr: string;
    text_en: string; text_ar: string; text_tr: string;
    trip_en: string; trip_ar: string; trip_tr: string;
    date_en: string; date_ar: string; date_tr: string;
    rating: number;
    order: number;
  };
}

const empty = {
  name: '', country_en: '', country_ar: '', country_tr: '',
  flag: '', role_en: '', role_ar: '', role_tr: '',
  text_en: '', text_ar: '', text_tr: '',
  trip_en: '', trip_ar: '', trip_tr: '',
  date_en: '', date_ar: '', date_tr: '',
  rating: 5, order: 0,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">{label}</span>
      {children}
    </label>
  );
}

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-cyan-500/50 transition-colors';

export default function TestimonialForm({ mode, id, defaults }: TestimonialFormProps) {
  const d = defaults ?? empty;
  const router = useRouter();
  const { labels } = useDashLang();
  const L = labels.testimonial;
  const create = useMutation(api.testimonials.create);
  const update = useMutation(api.testimonials.update);
  const [f, setF] = useState(d);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(key: string, value: unknown) {
    setF((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = { ...f, rating: Number(f.rating), order: Number(f.order) };
    try {
      if (mode === 'new') await create(payload);
      else await update({ id: id!, ...payload });
      router.push('/dashboard/testimonials');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl">
      <section className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">{L.sections.guest}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Field label={L.fields.fullName}><input className={inputCls} value={f.name} onChange={(e) => set('name', e.target.value)} required placeholder="Khalid Al-Rashidi" /></Field>
          </div>
          <Field label={L.fields.flagEmoji}><input className={inputCls} value={f.flag} onChange={(e) => set('flag', e.target.value)} placeholder="🇸🇦" /></Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label={`${L.fields.country} (EN)`}><input className={inputCls} value={f.country_en} onChange={(e) => set('country_en', e.target.value)} required placeholder="Saudi Arabia" /></Field>
          <Field label={`${L.fields.country} (AR)`}><input className={inputCls} value={f.country_ar} onChange={(e) => set('country_ar', e.target.value)} dir="rtl" placeholder="المملكة العربية السعودية" /></Field>
          <Field label={`${L.fields.country} (TR)`}><input className={inputCls} value={f.country_tr} onChange={(e) => set('country_tr', e.target.value)} placeholder="Suudi Arabistan" /></Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label={`${L.fields.role} (EN)`}><input className={inputCls} value={f.role_en} onChange={(e) => set('role_en', e.target.value)} placeholder="Businessman" /></Field>
          <Field label={`${L.fields.role} (AR)`}><input className={inputCls} value={f.role_ar} onChange={(e) => set('role_ar', e.target.value)} dir="rtl" placeholder="رجل أعمال" /></Field>
          <Field label={`${L.fields.role} (TR)`}><input className={inputCls} value={f.role_tr} onChange={(e) => set('role_tr', e.target.value)} placeholder="İş insanı" /></Field>
        </div>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">{L.sections.reviewText}</h2>
        <Field label={L.fields.reviewEn}><textarea className={inputCls} rows={4} value={f.text_en} onChange={(e) => set('text_en', e.target.value)} required /></Field>
        <Field label={L.fields.reviewAr}><textarea className={inputCls} rows={4} value={f.text_ar} onChange={(e) => set('text_ar', e.target.value)} dir="rtl" /></Field>
        <Field label={L.fields.reviewTr}><textarea className={inputCls} rows={4} value={f.text_tr} onChange={(e) => set('text_tr', e.target.value)} /></Field>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">{L.sections.tripMeta}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label={`${L.fields.tripName} (EN)`}><input className={inputCls} value={f.trip_en} onChange={(e) => set('trip_en', e.target.value)} placeholder="VIP Istanbul" /></Field>
          <Field label={`${L.fields.tripName} (AR)`}><input className={inputCls} value={f.trip_ar} onChange={(e) => set('trip_ar', e.target.value)} dir="rtl" placeholder="إسطنبول VIP" /></Field>
          <Field label={`${L.fields.tripName} (TR)`}><input className={inputCls} value={f.trip_tr} onChange={(e) => set('trip_tr', e.target.value)} placeholder="VIP İstanbul" /></Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label={`${L.fields.date} (EN)`}><input className={inputCls} value={f.date_en} onChange={(e) => set('date_en', e.target.value)} placeholder="March 2025" /></Field>
          <Field label={`${L.fields.date} (AR)`}><input className={inputCls} value={f.date_ar} onChange={(e) => set('date_ar', e.target.value)} dir="rtl" placeholder="مارس ٢٠٢٥" /></Field>
          <Field label={`${L.fields.date} (TR)`}><input className={inputCls} value={f.date_tr} onChange={(e) => set('date_tr', e.target.value)} placeholder="Mart 2025" /></Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label={L.fields.rating}><input className={inputCls} type="number" min={1} max={5} value={f.rating} onChange={(e) => set('rating', e.target.value)} /></Field>
          <Field label={L.fields.order}><input className={inputCls} type="number" min={0} value={f.order} onChange={(e) => set('order', e.target.value)} /></Field>
        </div>
      </section>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving} className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
          {saving ? labels.common.saving : mode === 'new' ? L.createBtn : labels.common.save}
        </button>
        <button type="button" onClick={() => router.push('/dashboard/testimonials')} className="px-5 py-2.5 border border-white/10 text-white/60 hover:text-white text-sm rounded-lg transition-colors">
          {labels.common.cancel}
        </button>
      </div>
    </form>
  );
}
