'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { useDashLang } from '@/lib/adminI18n';
import ImageListEditor from './ImageListEditor';
import { useAdminMutation } from './AdminAuthProvider';

interface DestinationFormProps {
  mode: 'new' | 'edit';
  id?: Id<'destinations'>;
  defaults?: Record<string, string | number | string[]>;
}

const emptyDefaults: Record<string, string | number | string[]> = {
  name_en: '', name_ar: '', name_tr: '',
  tag_en: '', tag_ar: '', tag_tr: '',
  badge_en: '', badge_ar: '', badge_tr: '',
  desc_en: '', desc_ar: '', desc_tr: '',
  flightTime_en: '', flightTime_ar: '', flightTime_tr: '',
  climate_en: '', climate_ar: '', climate_tr: '',
  signature_en: '', signature_ar: '', signature_tr: '',
  color: '#2a1a06', accent: '#f59e0b', icon: '🏙', images: [], lat: 0, lng: 0,
};

const inputCls = 'w-full bg-ink/5 border border-ink/10 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink/25 focus:outline-none focus:border-accent/50 transition-colors';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs text-ink/50 mb-1.5 uppercase tracking-wider">{label}</span>
      {children}
    </label>
  );
}

function LocalizedRow({
  labelBase, keyBase, values, onChange, textarea,
}: {
  labelBase: string;
  keyBase: string;
  values: Record<string, string | number | string[]>;
  onChange: (key: string, value: string) => void;
  textarea?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
  const { labels } = useDashLang();
  const L = labels.destination;
  const create = useAdminMutation(api.destinations.create);
  const update = useAdminMutation(api.destinations.update);

  const [f, setF] = useState<Record<string, string | number | string[]>>(d);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(key: string, value: string | string[]) {
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
      images: (f.images as string[]).filter(Boolean),
      lat: Number(f.lat), lng: Number(f.lng),
    };
    try {
      if (mode === 'new') {
        await create(payload);
      } else {
        await update({ id: id!, ...payload });
      }
      router.push('/admin/destinations');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-3xl">
      <section className="bg-ink/5 border border-ink/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-ink/70 uppercase tracking-wider">{L.sections.name}</h2>
        <LocalizedRow labelBase={L.fields.name} keyBase="name" values={f} onChange={set} />
      </section>

      <section className="bg-ink/5 border border-ink/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-ink/70 uppercase tracking-wider">{L.sections.tagBadge}</h2>
        <LocalizedRow labelBase={L.fields.tag} keyBase="tag" values={f} onChange={set} />
        <LocalizedRow labelBase={L.fields.badge} keyBase="badge" values={f} onChange={set} />
      </section>

      <section className="bg-ink/5 border border-ink/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-ink/70 uppercase tracking-wider">{L.sections.description}</h2>
        <LocalizedRow labelBase={L.fields.desc} keyBase="desc" values={f} onChange={set} textarea />
      </section>

      <section className="bg-ink/5 border border-ink/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-ink/70 uppercase tracking-wider">{L.sections.details}</h2>
        <LocalizedRow labelBase={L.fields.flightTime} keyBase="flightTime" values={f} onChange={set} />
        <LocalizedRow labelBase={L.fields.climate} keyBase="climate" values={f} onChange={set} />
        <LocalizedRow labelBase={L.fields.signature} keyBase="signature" values={f} onChange={set} textarea />
      </section>

      <section className="bg-ink/5 border border-ink/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-ink/70 uppercase tracking-wider">{L.sections.appearance}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Field label={L.fields.color}><input className={inputCls} type="color" value={f.color as string} onChange={(e) => set('color', e.target.value)} /></Field>
          <Field label={L.fields.accent}><input className={inputCls} type="color" value={f.accent as string} onChange={(e) => set('accent', e.target.value)} /></Field>
          <Field label={L.fields.icon}><input className={inputCls} value={f.icon as string} onChange={(e) => set('icon', e.target.value)} placeholder="🏙" /></Field>
          <div />
          <Field label={L.fields.lat}><input className={inputCls} type="number" step="any" value={f.lat as number} onChange={(e) => set('lat', e.target.value)} /></Field>
          <Field label={L.fields.lng}><input className={inputCls} type="number" step="any" value={f.lng as number} onChange={(e) => set('lng', e.target.value)} /></Field>
        </div>
      </section>

      <section className="bg-ink/5 border border-ink/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-ink/70 uppercase tracking-wider">{L.sections.images}</h2>
        <ImageListEditor
          images={f.images as string[]}
          onChange={(imgs) => set('images', imgs)}
        />
      </section>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-accent hover:bg-accent-light disabled:opacity-50 text-on-accent text-sm font-medium rounded-lg transition-colors"
        >
          {saving ? labels.common.saving : mode === 'new' ? L.createBtn : labels.common.save}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/destinations')}
          className="px-5 py-2.5 border border-ink/10 text-ink/60 hover:text-ink text-sm rounded-lg transition-colors"
        >
          {labels.common.cancel}
        </button>
      </div>
    </form>
  );
}
