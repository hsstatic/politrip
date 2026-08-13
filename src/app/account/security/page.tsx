'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../../convex/_generated/api';
import { useAuthMutation, useAuthQuery, useSession } from '@/components/admin/AdminAuthProvider';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { passwordRequirements } from '@/lib/password';

export default function AccountSecurityPage() {
  const router = useRouter();
  const { user } = useSession();
  const sessions = useAuthQuery(api.users.listMySessions);
  const revoke = useAuthMutation(api.users.revokeMySession);
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
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
      router.push('/sign-in');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function deactivate() {
    const res = await fetch('/api/auth/deactivate', { method: 'POST' });
    if (res.ok) {
      router.push('/sign-in');
      router.refresh();
    }
  }

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8 max-w-xl">
      <h1 className="text-2xl font-semibold text-ink" style={{ fontFamily: 'var(--font-instrument)' }}>
        Security
      </h1>

      <form onSubmit={changePassword} className="mt-8 grid gap-3 rounded-xl border border-ink/10 p-4">
        <h2 className="text-lg font-semibold">Change password</h2>
        <ul className="text-xs text-ink/40">
          {passwordRequirements().map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
        <input type="password" required autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password" className="rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm" />
        <input type="password" required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" className="rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm" />
        <input type="password" required autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm" />
        {error ? <p className="text-xs text-danger" role="alert">{error}</p> : null}
        <button type="submit" disabled={loading} className="justify-self-start rounded-lg bg-accent px-4 py-2 text-sm text-on-accent">
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </form>

      <h2 className="mt-10 text-lg font-semibold">Active sessions</h2>
      <ul className="mt-3 space-y-2">
        {(sessions ?? []).map((s) => (
          <li key={s.id} className="flex items-center justify-between gap-3 rounded-lg border border-ink/10 px-3 py-2 text-sm">
            <span>
              {s.current ? <span className="me-2 text-accent">Current</span> : null}
              {s.userAgent ?? 'Unknown device'}
            </span>
            {!s.current ? (
              <button type="button" onClick={() => void revoke({ sessionId: s.id })} className="text-xs text-danger">
                Revoke
              </button>
            ) : null}
          </li>
        ))}
      </ul>

      {user?.kind !== 'owner' ? (
        <div className="mt-10 rounded-xl border border-danger/20 p-4">
          <h2 className="text-lg font-semibold text-danger">Deactivate account</h2>
          <p className="mt-1 text-sm text-ink/50">You will be signed out and will not be able to log in until an operator reactivates the account.</p>
          <button type="button" onClick={() => setDeactivateOpen(true)} className="mt-3 rounded-lg border border-danger/30 px-4 py-2 text-sm text-danger">
            Deactivate
          </button>
        </div>
      ) : null}

      <ConfirmDialog
        open={deactivateOpen}
        danger
        title="Deactivate your account?"
        description="This signs you out immediately. Contact PoliTrip if you want the account restored."
        confirmLabel="Deactivate"
        onClose={() => setDeactivateOpen(false)}
        onConfirm={() => void deactivate()}
      />
    </div>
  );
}
