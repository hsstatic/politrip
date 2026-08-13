'use client';

import { useState } from 'react';
import { api } from '../../../../convex/_generated/api';
import { useAdminMutation, useAdminQuery, useSession } from '@/components/admin/AdminAuthProvider';
import RequirePermission from '@/components/admin/RequirePermission';

export default function SettingsPage() {
  return (
    <RequirePermission permission="settings.view">
      <SettingsForm />
    </RequirePermission>
  );
}

function SettingsForm() {
  const { hasPermission } = useSession();
  const settings = useAdminQuery(api.settings.getAll);
  const update = useAdminMutation(api.settings.update);
  const [dirty, setDirty] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');

  const form = {
    business_name: dirty.business_name ?? settings?.business_name ?? 'PoliTrip',
    support_email: dirty.support_email ?? settings?.support_email ?? '',
    support_whatsapp: dirty.support_whatsapp ?? settings?.support_whatsapp ?? '',
  };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!hasPermission('settings.edit')) return;
    await Promise.all(
      Object.entries(form).map(([key, value]) => update({ key, value })),
    );
    setDirty({});
    setMessage('Settings saved.');
  }

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8 max-w-xl">
      <h1 className="text-2xl font-semibold text-ink" style={{ fontFamily: 'var(--font-instrument)' }}>
        Settings
      </h1>
      <p className="mt-1 text-sm text-ink/40">Business contact details used by the operator console.</p>
      <form onSubmit={save} className="mt-8 grid gap-4">
        <label className="text-xs uppercase tracking-widest text-ink/40">
          Business name
          <input value={form.business_name} onChange={(e) => setDirty((d) => ({ ...d, business_name: e.target.value }))} disabled={!hasPermission('settings.edit')} className="mt-1 w-full rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm normal-case text-ink" />
        </label>
        <label className="text-xs uppercase tracking-widest text-ink/40">
          Support email
          <input value={form.support_email} onChange={(e) => setDirty((d) => ({ ...d, support_email: e.target.value }))} disabled={!hasPermission('settings.edit')} className="mt-1 w-full rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm normal-case text-ink" />
        </label>
        <label className="text-xs uppercase tracking-widest text-ink/40">
          Support WhatsApp
          <input value={form.support_whatsapp} onChange={(e) => setDirty((d) => ({ ...d, support_whatsapp: e.target.value }))} disabled={!hasPermission('settings.edit')} className="mt-1 w-full rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm normal-case text-ink" />
        </label>
        {hasPermission('settings.edit') ? (
          <button type="submit" className="justify-self-start rounded-lg bg-accent px-4 py-2 text-sm text-on-accent">Save</button>
        ) : (
          <p className="text-sm text-ink/40">You can view these settings but cannot edit them.</p>
        )}
        {message ? <p className="text-sm text-ink/50">{message}</p> : null}
      </form>
    </div>
  );
}
