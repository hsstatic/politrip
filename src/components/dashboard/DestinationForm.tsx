'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

interface DestinationFormProps {
  mode: 'new' | 'edit';
  id?: Id<'destinations'>;
  defaults?: Record<string, string | number>;
}

const emptyDefaults = {
  name_en: '', name_ar: '', name_tr: '',
  tag_en: '', tag_ar: '', tag_tr: '',
  badge_en: '', badge_ar: '', badge_tr: '',
  desc_en: '', desc_ar: '', desc_tr: '',
  flightTime_en: '', flightTime_ar: '', flightTime_tr: '',
  climate_en: '', climate_ar: '', climate_tr: '',
  signature_en: '', signature_ar: '', signature_tr: '',
  color: '#1a3d63', accent: '#22d3ee', icon: '🏙', imageUrl: '', lat: 0, lng: 0,
};

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-cyan-500/50 transition-colors';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">{label}</span>
      {children}
    </label>
  );
}

function LocalizedRow({
  labelBase, keyBase, values, onChange, textarea,
}: {
  labelBase: string;
  keyBase: string;
  values: Record<string, string | number>;
  onChange: (key: string, value: string) => void;
  textarea?: boolean;
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {(['en', 'ar', 'tr'] as const).map((lang) => (
        <Field key={lang} label={`${labelBase} (${lang.toUpperCase()})`}>
          {textarea ? (
            <textarea
              className={inputCls}
              rows={2}
              value={values[`${keyBase}_${lang}`] as string}
              onChange={(e) => onChange(`${keyBase}_${lang}`, e.target.value)}
              dir={lang === 'ar' ? 'rtl' : undefined}
            />
          ) : (
            <input
              className={inputCls}
              value={values[`${keyBase}_${lang}`] as string}
              onChange={(e) => onChange(`${keyBase}_${lang}`, e.target.value)}
              dir={lang === 'ar' ? 'rtl' : undefined}
            />
          )}
        </Field>
      ))}
    </div>
  );
}

export default function DestinationForm({ mode, id, defaults }: DestinationFormProps) {
  const d = { ...emptyDefaults, ...defaults };
  const router = useRouter();
  const create = useMutation(api.destinations.create);
  const update = useMutation(api.destinations.update);

  const [f, setF] = useState<Record<string, string | number>>(d);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(key: string, value: string) {
    setF((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      name_en: f.name_en as string, name_ar: f.name_ar as string, name_tr: f.name_tr as string,
      tag_en: f.tag_en as string, tag_ar: f.tag_ar as string, tag_tr: f.tag_tr as string,
      badge_en: f.badge_en as string, badge_ar: f.badge_ar as string, badge_tr: f.badge_tr as string,
      desc_en: f.desc_en as string, desc_ar: f.desc_ar as string, desc_tr: f.desc_tr as string,
      flightTime_en: f.flightTime_en as string, flightTime_ar: f.flightTime_ar as string, flightTime_tr: f.flightTime_tr as string,
      climate_en: f.climate_en as string, climate_ar: f.climate_ar as string, climate_tr: f.climate_tr as string,
      signature_en: f.signature_en as string, signature_ar: f.signature_ar as string, signature_tr: f.signature_tr as string,
      color: f.color as string, accent: f.accent as string, icon: f.icon as string,
      imageUrl: (f.imageUrl as string) || undefined,
      lat: Number(f.lat), lng: Number(f.lng),
    };
    try {
      if (mode === 'new') {
        await create(payload);
      } else {
        await update({ id: id!, ...payload });
      }
      router.push('/dashboard/destinations');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <section className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">Name</h2>
        <LocalizedRow labelBase="Name" keyBase="name" values={f} onChange={set} />
      </section>

      <section className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">Tag & Badge</h2>
        <LocalizedRow labelBase="Tag" keyBase="tag" values={f} onChange={set} />
        <LocalizedRow labelBase="Badge" keyBase="badge" values={f} onChange={set} />
      </section>

      <section className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">Description</h2>
        <LocalizedRow labelBase="Description" keyBase="desc" values={f} onChange={set} textarea />
      </section>

      <section className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">Details</h2>
        <LocalizedRow labelBase="Flight time" keyBase="flightTime" values={f} onChange={set} />
        <LocalizedRow labelBase="Climate" keyBase="climate" values={f} onChange={set} />
        <LocalizedRow labelBase="Signature experience" keyBase="signature" values={f} onChange={set} textarea />
      </section>

      <section className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider">Appearance & Coordinates</h2>
        <div className="grid grid-cols-4 gap-3">
          <Field label="Color (hex)"><input className={inputCls} type="color" value={f.color as string} onChange={(e) => set('color', e.target.value)} /></Field>
          <Field label="Accent (hex)"><input className={inputCls} type="color" value={f.accent as string} onChange={(e) => set('accent', e.target.value)} /></Field>
          <Field label="Icon (emoji)"><input className={inputCls} value={f.icon as string} onChange={(e) => set('icon', e.target.value)} placeholder="🏙" /></Field>
          <div />
          <Field label="Latitude"><input className={inputCls} type="number" step="any" value={f.lat as number} onChange={(e) => set('lat', e.target.value)} /></Field>
          <Field label="Longitude"><input className={inputCls} type="number" step="any" value={f.lng as number} onChange={(e) => set('lng', e.target.value)} /></Field>
        </div>
        <Field label="Image URL">
          <input
            className={inputCls}
            type="url"
            value={f.imageUrl as string}
            onChange={(e) => set('imageUrl', e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </Field>
        {f.imageUrl && (
          <div className="mt-2">
            <img
              src={f.imageUrl as string}
              alt="Preview"
              className="h-40 w-full object-cover rounded-lg border border-white/10"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}
      </section>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {saving ? 'Saving…' : mode === 'new' ? 'Create Destination' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/dashboard/destinations')}
          className="px-5 py-2.5 border border-white/10 text-white/60 hover:text-white text-sm rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
