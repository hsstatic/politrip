'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

type HotelCategory = 'ultra-luxury' | 'luxury' | 'boutique' | 'resort';

const KNOWN_CITIES = ['istanbul', 'antalya', 'trabzon', 'bursa', 'cappadocia', 'bodrum', 'sapanca'];

interface HotelFormProps {
  mode: 'new' | 'edit';
  id?: Id<'hotels'>;
  defaults?: {
    name_en: string; name_ar: string; name_tr: string;
    description_en: string; description_ar: string; description_tr: string;
    city: string; stars: number; rating: number; reviews: number; price: number;
    images: string[]; amenities: string[]; category: HotelCategory;
    isVIP: boolean; lat: number; lng: number;
  };
}

const emptyDefaults = {
  name_en: '', name_ar: '', name_tr: '',
  description_en: '', description_ar: '', description_tr: '',
  city: 'istanbul', stars: 5, rating: 0, reviews: 0, price: 0,
  images: [], amenities: [], category: 'luxury' as HotelCategory,
  isVIP: false, lat: 0, lng: 0,
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
const selectCls = `${inputCls} cursor-pointer`;

export default function HotelForm({ mode, id, defaults }: HotelFormProps) {
  const d = defaults ?? emptyDefaults;
  const router = useRouter();
  const create = useMutation(api.hotels.create);
  const update = useMutation(api.hotels.update);

  const [f, setF] = useState({
    name_en: d.name_en, name_ar: d.name_ar, name_tr: d.name_tr,
    description_en: d.description_en, description_ar: d.description_ar, description_tr: d.description_tr,
    city: d.city, stars: d.stars, rating: d.rating, reviews: d.reviews, price: d.price,
    imagesRaw: d.images.join('\n'),
    amenitiesRaw: d.amenities.join(', '),
    category: d.category, isVIP: d.isVIP,
    lat: d.lat, lng: d.lng,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(key: string, value: unknown) {
    setF((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      name_en: f.name_en, name_ar: f.name_ar, name_tr: f.name_tr,
      description_en: f.description_en, description_ar: f.description_ar, description_tr: f.description_tr,
      city: f.city, stars: Number(f.stars), rating: Number(f.rating),
      reviews: Number(f.reviews), price: Number(f.price),
      images: f.imagesRaw.split('\n').map((s) => s.trim()).filter(Boolean),
      amenities: f.amenitiesRaw.split(',').map((s) => s.trim()).filter(Boolean),
      category: f.category, isVIP: f.isVIP,
      lat: Number(f.lat), lng: Number(f.lng),
    };
    try {
      if (mode === 'new') {
        await create(payload);
      } else {
        await update({ id: id!, ...payload });
      }
      router.push('/dashboard/hotels');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <section className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">Names</h2>
        <div className="grid grid-cols-3 gap-3">
          <Field label="English"><input className={inputCls} value={f.name_en} onChange={(e) => set('name_en', e.target.value)} required placeholder="Grand Bosphorus" /></Field>
          <Field label="Arabic"><input className={inputCls} value={f.name_ar} onChange={(e) => set('name_ar', e.target.value)} required placeholder="جراند بوسفور" dir="rtl" /></Field>
          <Field label="Turkish"><input className={inputCls} value={f.name_tr} onChange={(e) => set('name_tr', e.target.value)} required placeholder="Grand Boğaz" /></Field>
        </div>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">Descriptions</h2>
        <Field label="English"><textarea className={inputCls} rows={3} value={f.description_en} onChange={(e) => set('description_en', e.target.value)} /></Field>
        <Field label="Arabic"><textarea className={inputCls} rows={3} value={f.description_ar} onChange={(e) => set('description_ar', e.target.value)} dir="rtl" /></Field>
        <Field label="Turkish"><textarea className={inputCls} rows={3} value={f.description_tr} onChange={(e) => set('description_tr', e.target.value)} /></Field>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">Details</h2>
        <div className="grid grid-cols-2 gap-3">
          <Field label="City">
            <>
              <input
                className={inputCls}
                list="city-options"
                value={f.city}
                onChange={(e) => set('city', e.target.value.toLowerCase().trim())}
                placeholder="e.g. istanbul, antalya, mardin…"
                required
              />
              <datalist id="city-options">
                {KNOWN_CITIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </datalist>
            </>
          </Field>
          <Field label="Category">
            <select className={selectCls} value={f.category} onChange={(e) => set('category', e.target.value)}>
              {['ultra-luxury','luxury','boutique','resort'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Stars (1–5)"><input className={inputCls} type="number" min={1} max={5} value={f.stars} onChange={(e) => set('stars', e.target.value)} /></Field>
          <Field label="Price / night (USD)"><input className={inputCls} type="number" min={0} value={f.price} onChange={(e) => set('price', e.target.value)} /></Field>
          <Field label="Rating (0–5)"><input className={inputCls} type="number" min={0} max={5} step={0.1} value={f.rating} onChange={(e) => set('rating', e.target.value)} /></Field>
          <Field label="Reviews count"><input className={inputCls} type="number" min={0} value={f.reviews} onChange={(e) => set('reviews', e.target.value)} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Latitude"><input className={inputCls} type="number" step="any" value={f.lat} onChange={(e) => set('lat', e.target.value)} /></Field>
          <Field label="Longitude"><input className={inputCls} type="number" step="any" value={f.lng} onChange={(e) => set('lng', e.target.value)} /></Field>
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={f.isVIP} onChange={(e) => set('isVIP', e.target.checked)} className="accent-cyan-500 w-4 h-4" />
          <span className="text-sm text-white/70">VIP property</span>
        </label>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">Images & Amenities</h2>
        <Field label="Image URLs (one per line)">
          <textarea className={inputCls} rows={4} value={f.imagesRaw} onChange={(e) => set('imagesRaw', e.target.value)} placeholder="https://..." />
        </Field>
        <Field label="Amenities (comma-separated)">
          <input className={inputCls} value={f.amenitiesRaw} onChange={(e) => set('amenitiesRaw', e.target.value)} placeholder="Pool, Spa, Gym, Restaurant" />
        </Field>
      </section>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {saving ? 'Saving…' : mode === 'new' ? 'Create Hotel' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/dashboard/hotels')}
          className="px-5 py-2.5 border border-white/10 text-white/60 hover:text-white text-sm rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
