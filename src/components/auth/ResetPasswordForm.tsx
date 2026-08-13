'use client';

import { useId, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { passwordRequirements, validatePassword } from '@/lib/password';

const inputClass =
  'w-full rounded-xl border border-ink/10 bg-ink/5 px-4 py-3 text-sm text-ink placeholder:text-ink/30 outline-none transition-all focus:border-accent/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60';

export default function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const errorId = useId();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    const passwordErr = validatePassword(password);
    if (passwordErr) {
      setError(passwordErr);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'This reset link is invalid or expired.');
        return;
      }
      setDone(true);
    } catch {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass relative overflow-hidden rounded-2xl border border-accent/20 p-6 sm:p-8">
      <div className="divider-gold absolute top-0 right-0 left-0" aria-hidden />
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">Recovery</p>
      <h1 className="text-3xl font-light tracking-tight text-ink" style={{ fontFamily: 'var(--font-display, serif)' }}>
        {done ? 'Password updated' : 'Set a new password'}
      </h1>
      {done ? (
        <div className="mt-8">
          <p className="text-sm text-ink/60">You can now sign in with your new password.</p>
          <Link href="/sign-in" className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-accent px-4 py-3 text-[11px] font-bold uppercase tracking-[0.28em] text-on-accent">
            Sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4" noValidate>
          <ul className="text-[11px] text-ink/40">
            {passwordRequirements().map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
          <label className="text-[11px] uppercase tracking-[0.28em] text-ink/40">
            New password
            <div className="relative mt-1.5">
              <input className={`${inputClass} pe-12`} type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} required />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute top-1/2 right-2 -translate-y-1/2 text-xs text-ink/40" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>
          <label className="text-[11px] uppercase tracking-[0.28em] text-ink/40">
            Confirm password
            <input className={`${inputClass} mt-1.5`} type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} required />
          </label>
          {error ? (
            <p id={errorId} role="alert" className="rounded-xl border border-danger/20 bg-danger/10 px-3 py-2.5 text-xs text-danger">
              {error}
            </p>
          ) : null}
          <button type="submit" disabled={loading} className="min-h-12 rounded-xl bg-gradient-to-br from-accent-light via-accent to-accent-dark text-[11px] font-bold uppercase tracking-[0.28em] text-on-accent disabled:opacity-55">
            {loading ? 'Saving…' : 'Update password'}
          </button>
        </form>
      )}
    </div>
  );
}
