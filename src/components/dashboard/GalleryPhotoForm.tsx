'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

interface GalleryPhotoFormProps {
  mode: 'new' | 'edit';
  id?: Id<'gallery'>;
  defaults?: { src: string; label: string; span: string; order: number };
}

const SPAN_OPTIONS = [
  { value: '', label: 'Normal (1×1)' },
  { value: 'lg:col-span-2 lg:row-span-2', label: 'Wide + Tall (2×2)' },
  { value: 'lg:col-span-2', label: 'Wide (2×1)' },
  { value: 'lg:row-span-2', label: 'Tall (1×2)' },
];

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

export default function GalleryPhotoForm({ mode, id, defaults }: GalleryPhotoFormProps) {
  const router = useRouter();
  const create = useMutation(api.gallery.create);
  const update = useMutation(api.gallery.update);
  const [f, setF] = useState(defaults ?? { src: '', label: '', span: '', order: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(key: string, value: unknown) {
    setF((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = { ...f, order: Number(f.order) };
    try {
      if (mode === 'new') await create(payload);
      else await update({ id: id!, ...payload });
      router.push('/dashboard/gallery');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <section className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">Photo</h2>
        <Field label="Image URL or path">
          <input className={inputCls} value={f.src} onChange={(e) => set('src', e.target.value)} required placeholder="/destinations/istanbul.jpg" />
        </Field>
        {f.src && (
          <div className="relative h-40 rounded-lg overflow-hidden bg-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={f.src} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        )}
        <Field label="Label (displayed on hover)">
          <input className={inputCls} value={f.label} onChange={(e) => set('label', e.target.value)} required placeholder="Istanbul" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Grid span">
            <select className={selectCls} value={f.span} onChange={(e) => set('span', e.target.value)}>
              {SPAN_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Order (display position)">
            <input className={inputCls} type="number" min={0} value={f.order} onChange={(e) => set('order', e.target.value)} />
          </Field>
        </div>
      </section>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
          {saving ? 'Saving…' : mode === 'new' ? 'Add Photo' : 'Save Changes'}
        </button>
        <button type="button" onClick={() => router.push('/dashboard/gallery')} className="px-5 py-2.5 border border-white/10 text-white/60 hover:text-white text-sm rounded-lg transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
