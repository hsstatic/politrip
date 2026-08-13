'use client';

import { useState } from 'react';
import { api } from '../../../../convex/_generated/api';
import { useAuthMutation, useSession } from '@/components/admin/AdminAuthProvider';
import AvatarUpload from '@/components/account/AvatarUpload';

export default function AccountProfilePage() {
  const { user } = useSession();
  const updateMe = useAuthMutation(api.users.updateMe);
  const [dirty, setDirty] = useState<Partial<{
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  }>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const form = {
    firstName: dirty.firstName ?? user?.firstName ?? '',
    lastName: dirty.lastName ?? user?.lastName ?? '',
    phone: dirty.phone ?? user?.phone ?? '',
    address: dirty.address ?? user?.address ?? '',
    city: dirty.city ?? user?.city ?? '',
    country: dirty.country ?? user?.country ?? '',
  };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await updateMe(form);
      setDirty({});
      setMessage('Profile updated.');
    } catch {
      setError('Could not update your profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8 max-w-xl">
      <h1 className="text-2xl font-semibold text-ink" style={{ fontFamily: 'var(--font-instrument)' }}>
        Profile
      </h1>
      <p className="mt-1 text-sm text-ink/40">Email cannot be changed here. Contact PoliTrip if you need a new address.</p>

      <div className="mt-8">
        <AvatarUpload />
      </div>

      <form onSubmit={save} className="mt-8 grid gap-4">
        <label className="text-xs uppercase tracking-widest text-ink/40">
          Email
          <input value={user?.email ?? ''} disabled className="mt-1 w-full rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm normal-case text-ink/50" />
        </label>
        {(['firstName', 'lastName', 'phone', 'address', 'city', 'country'] as const).map((key) => (
          <label key={key} className="text-xs uppercase tracking-widest text-ink/40">
            {key === 'firstName' ? 'First name' : key === 'lastName' ? 'Last name' : key}
            <input
              value={form[key]}
              onChange={(e) => setDirty((d) => ({ ...d, [key]: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm normal-case tracking-normal text-ink"
            />
          </label>
        ))}
        {error ? <p className="text-xs text-danger" role="alert">{error}</p> : null}
        {message ? <p className="text-xs text-success">{message}</p> : null}
        <button type="submit" disabled={saving} className="justify-self-start rounded-lg bg-accent px-4 py-2 text-sm text-on-accent">
          {saving ? 'Saving…' : 'Save profile'}
        </button>
      </form>
    </div>
  );
}
