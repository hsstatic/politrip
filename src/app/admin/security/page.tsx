'use client';

import { useState } from 'react';
import { api } from '../../../../convex/_generated/api';
import { useAdminQuery, useAuthQuery } from '@/components/admin/AdminAuthProvider';
import RequirePermission from '@/components/admin/RequirePermission';

export default function SecurityPage() {
  return (
    <RequirePermission ownerOnly>
      <SecurityPanel />
    </RequirePermission>
  );
}

function SecurityPanel() {
  const overview = useAdminQuery(api.settings.securityOverview);
  const sessions = useAuthQuery(api.users.listMySessions);
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, password, confirmPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Could not change password.');
        return;
      }
      window.location.assign('/sign-in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8 max-w-2xl">
      <h1 className="text-2xl font-semibold text-ink" style={{ fontFamily: 'var(--font-instrument)' }}>
        Security
      </h1>
      <p className="mt-1 text-sm text-ink/40">Owner-only account and session controls.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-ink/10 p-4">
          <p className="text-xs uppercase tracking-widest text-ink/40">Active sessions</p>
          <p className="mt-2 text-2xl font-semibold">{overview?.activeSessions ?? '—'}</p>
        </div>
        <div className="rounded-xl border border-ink/10 p-4">
          <p className="text-xs uppercase tracking-widest text-ink/40">Owner accounts</p>
          <p className="mt-2 text-2xl font-semibold">{overview?.owners.length ?? '—'}</p>
        </div>
      </div>

      <h2 className="mt-10 text-lg font-semibold">Your sessions</h2>
      <ul className="mt-3 space-y-2">
        {(sessions ?? []).map((s) => (
          <li key={s.id} className="rounded-lg border border-ink/10 px-3 py-2 text-sm">
            {s.current ? <span className="me-2 text-accent">Current</span> : null}
            {s.userAgent ?? 'Unknown device'} · expires {new Date(s.expiresAt).toLocaleString()}
          </li>
        ))}
      </ul>

      <form onSubmit={changePassword} className="mt-10 grid gap-3 rounded-xl border border-ink/10 p-4">
        <h2 className="text-lg font-semibold">Change password</h2>
        <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password" className="rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm" />
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" className="rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm" />
        <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm" />
        {error ? <p className="text-xs text-danger">{error}</p> : null}
        {message ? <p className="text-xs text-ink/50">{message}</p> : null}
        <button type="submit" disabled={loading} className="justify-self-start rounded-lg bg-accent px-4 py-2 text-sm text-on-accent">
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
