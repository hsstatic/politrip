'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

type TripCategory = 'cultural' | 'adventure' | 'luxury' | 'nature' | 'yacht' | 'helicopter' | 'balloon';
type TripCurrency = 'USD' | 'SAR' | 'AED' | 'TRY' | 'QAR' | 'KWD';

interface TripFormProps {
  mode: 'new' | 'edit';
  id?: Id<'trips'>;
  defaults?: {
    title_en: string; title_ar: string; title_tr: string;
    description_en: string; description_ar: string; description_tr: string;
    highlights_en: string[]; highlights_ar: string[]; highlights_tr: string[];
    location: string; duration: string; price: number; currency: TripCurrency;
    category: TripCategory; rating: number; reviews: number;
    images: string[]; capacity: number; nextAvailable: string;
    isVIP: boolean; isPopular: boolean;
  };
}

const emptyDefaults = {
  title_en: '', title_ar: '', title_tr: '',
  description_en: '', description_ar: '', description_tr: '',
  highlights_en: [], highlights_ar: [], highlights_tr: [],
  location: '', duration: '', price: 0, currency: 'USD' as TripCurrency,
  category: 'cultural' as TripCategory, rating: 0, reviews: 0,
  images: [], capacity: 10, nextAvailable: '',
  isVIP: false, isPopular: false,
};

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-cyan-500/50 transition-colors';
const selectCls = `${inputCls} cursor-pointer`;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">{label}</span>
      {children}
    </label>
  );
}

export default function TripForm({ mode, id, defaults }: TripFormProps) {
  const d = defaults ?? emptyDefaults;
  const router = useRouter();
  const create = useMutation(api.trips.create);
  const update = useMutation(api.trips.update);

  const [f, setF] = useState({
    title_en: d.title_en, title_ar: d.title_ar, title_tr: d.title_tr,
    description_en: d.description_en, description_ar: d.description_ar, description_tr: d.description_tr,
    highlights_en_raw: d.highlights_en.join('\n'),
    highlights_ar_raw: d.highlights_ar.join('\n'),
    highlights_tr_raw: d.highlights_tr.join('\n'),
    location: d.location, duration: d.duration, price: d.price,
    currency: d.currency, category: d.category,
    rating: d.rating, reviews: d.reviews,
    imagesRaw: d.images.join('\n'),
    capacity: d.capacity, nextAvailable: d.nextAvailable,
    isVIP: d.isVIP, isPopular: d.isPopular,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(key: string, value: unknown) {
    setF((prev) => ({ ...prev, [key]: value }));
  }

  function splitLines(s: string): string[] {
    return s.split('\n').map((l) => l.trim()).filter(Boolean);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      title_en: f.title_en, title_ar: f.title_ar, title_tr: f.title_tr,
      description_en: f.description_en, description_ar: f.description_ar, description_tr: f.description_tr,
      highlights_en: splitLines(f.highlights_en_raw),
      highlights_ar: splitLines(f.highlights_ar_raw),
      highlights_tr: splitLines(f.highlights_tr_raw),
      location: f.location, duration: f.duration,
      price: Number(f.price), currency: f.currency, category: f.category,
      rating: Number(f.rating), reviews: Number(f.reviews),
      images: splitLines(f.imagesRaw),
      capacity: Number(f.capacity), nextAvailable: f.nextAvailable,
      isVIP: f.isVIP, isPopular: f.isPopular,
    };
    try {
      if (mode === 'new') {
        await create(payload);
      } else {
        await update({ id: id!, ...payload });
      }
      router.push('/dashboard/trips');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <section className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">Titles</h2>
        <div className="grid grid-cols-3 gap-3">
          <Field label="English"><input className={inputCls} value={f.title_en} onChange={(e) => set('title_en', e.target.value)} required /></Field>
          <Field label="Arabic"><input className={inputCls} value={f.title_ar} onChange={(e) => set('title_ar', e.target.value)} dir="rtl" /></Field>
          <Field label="Turkish"><input className={inputCls} value={f.title_tr} onChange={(e) => set('title_tr', e.target.value)} /></Field>
        </div>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">Descriptions</h2>
        <Field label="English"><textarea className={inputCls} rows={3} value={f.description_en} onChange={(e) => set('description_en', e.target.value)} /></Field>
        <Field label="Arabic"><textarea className={inputCls} rows={3} value={f.description_ar} onChange={(e) => set('description_ar', e.target.value)} dir="rtl" /></Field>
        <Field label="Turkish"><textarea className={inputCls} rows={3} value={f.description_tr} onChange={(e) => set('description_tr', e.target.value)} /></Field>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">Highlights (one per line)</h2>
        <Field label="English"><textarea className={inputCls} rows={4} value={f.highlights_en_raw} onChange={(e) => set('highlights_en_raw', e.target.value)} /></Field>
        <Field label="Arabic"><textarea className={inputCls} rows={4} value={f.highlights_ar_raw} onChange={(e) => set('highlights_ar_raw', e.target.value)} dir="rtl" /></Field>
        <Field label="Turkish"><textarea className={inputCls} rows={4} value={f.highlights_tr_raw} onChange={(e) => set('highlights_tr_raw', e.target.value)} /></Field>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">Details</h2>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Location"><input className={inputCls} value={f.location} onChange={(e) => set('location', e.target.value)} placeholder="Istanbul, Turkey" /></Field>
          <Field label="Duration"><input className={inputCls} value={f.duration} onChange={(e) => set('duration', e.target.value)} placeholder="5 days" /></Field>
          <Field label="Price">
            <div className="flex gap-2">
              <input className={inputCls} type="number" min={0} value={f.price} onChange={(e) => set('price', e.target.value)} />
              <select className={selectCls} value={f.currency} onChange={(e) => set('currency', e.target.value)}>
                {['USD','SAR','AED','TRY','QAR','KWD'].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </Field>
          <Field label="Category">
            <select className={selectCls} value={f.category} onChange={(e) => set('category', e.target.value)}>
              {['cultural','adventure','luxury','nature','yacht','helicopter','balloon'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Rating (0–5)"><input className={inputCls} type="number" min={0} max={5} step={0.1} value={f.rating} onChange={(e) => set('rating', e.target.value)} /></Field>
          <Field label="Reviews count"><input className={inputCls} type="number" min={0} value={f.reviews} onChange={(e) => set('reviews', e.target.value)} /></Field>
          <Field label="Capacity"><input className={inputCls} type="number" min={1} value={f.capacity} onChange={(e) => set('capacity', e.target.value)} /></Field>
          <Field label="Next available (date)"><input className={inputCls} type="date" value={f.nextAvailable} onChange={(e) => set('nextAvailable', e.target.value)} /></Field>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={f.isVIP} onChange={(e) => set('isVIP', e.target.checked)} className="accent-cyan-500 w-4 h-4" />
            <span className="text-sm text-white/70">VIP trip</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={f.isPopular} onChange={(e) => set('isPopular', e.target.checked)} className="accent-cyan-500 w-4 h-4" />
            <span className="text-sm text-white/70">Popular</span>
          </label>
        </div>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">Images</h2>
        <Field label="Image URLs (one per line)">
          <textarea className={inputCls} rows={4} value={f.imagesRaw} onChange={(e) => set('imagesRaw', e.target.value)} placeholder="https://..." />
        </Field>
      </section>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
          {saving ? 'Saving…' : mode === 'new' ? 'Create Trip' : 'Save Changes'}
        </button>
        <button type="button" onClick={() => router.push('/dashboard/trips')} className="px-5 py-2.5 border border-white/10 text-white/60 hover:text-white text-sm rounded-lg transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
