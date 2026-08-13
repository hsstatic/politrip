'use client';

import { useId, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { isValidEmail } from '@/lib/emailFormat';
import { isValidPhone } from '@/lib/phoneFormat';
import { passwordRequirements, validatePassword } from '@/lib/password';

const inputClass =
  'w-full rounded-xl border border-ink/10 bg-ink/5 px-4 py-3 text-sm text-ink placeholder:text-ink/30 outline-none transition-all duration-200 focus:border-accent/50 focus:bg-ink/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60';

export default function SignUpForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const formErrorId = useId();

  function setField<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    if (fields[key]) setFields((f) => ({ ...f, [key]: '' }));
    if (formError) setFormError('');
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.firstName.trim()) next.firstName = 'First name is required.';
    if (!form.lastName.trim()) next.lastName = 'Last name is required.';
    if (!isValidEmail(form.email)) next.email = 'Please enter a valid email address.';
    if (!isValidPhone(form.phone)) next.phone = 'Please enter a valid phone number.';
    const passwordErr = validatePassword(form.password);
    if (passwordErr) next.password = passwordErr;
    if (form.password !== form.confirmPassword) next.confirmPassword = 'Passwords do not match.';
    setFields(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading || !validate()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        window.location.assign('/account');
        return;
      }
      if (res.status === 429) {
        setFormError('Too many attempts. Please wait a few minutes and try again.');
      } else if (data.fields && typeof data.fields === 'object') {
        setFields(data.fields as Record<string, string>);
        setFormError(typeof data.error === 'string' ? data.error : 'Please check the highlighted fields.');
      } else {
        setFormError(typeof data.error === 'string' ? data.error : 'Could not create your account.');
      }
    } catch {
      setFormError('Network error. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass relative overflow-hidden rounded-2xl border border-accent/20 p-6 sm:p-8">
      <div className="divider-gold absolute top-0 right-0 left-0" aria-hidden />
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">Join PoliTrip</p>
      <h1 className="text-3xl font-light tracking-tight text-ink" style={{ fontFamily: 'var(--font-display, serif)' }}>
        Create your account
      </h1>
      <p className="mt-2 text-sm text-ink/50">Traveller registration only. Staff accounts are invited by the owner.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4" noValidate aria-describedby={formError ? formErrorId : undefined}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" error={fields.firstName}>
            <input className={inputClass} autoComplete="given-name" value={form.firstName} onChange={(e) => setField('firstName', e.target.value)} disabled={loading} required />
          </Field>
          <Field label="Last name" error={fields.lastName}>
            <input className={inputClass} autoComplete="family-name" value={form.lastName} onChange={(e) => setField('lastName', e.target.value)} disabled={loading} required />
          </Field>
        </div>
        <Field label="Email" error={fields.email}>
          <input className={inputClass} type="email" autoComplete="email" value={form.email} onChange={(e) => setField('email', e.target.value)} disabled={loading} required />
        </Field>
        <Field label="Phone number" error={fields.phone}>
          <input className={inputClass} type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setField('phone', e.target.value)} disabled={loading} required />
        </Field>
        <Field label="Password" error={fields.password}>
          <div className="relative">
            <input className={`${inputClass} pe-12`} type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={form.password} onChange={(e) => setField('password', e.target.value)} disabled={loading} required />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg px-2 text-xs text-ink/40 hover:text-ink" aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </Field>
        <ul className="text-[11px] text-ink/40">
          {passwordRequirements().map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
        <Field label="Confirm password" error={fields.confirmPassword}>
          <input className={inputClass} type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={form.confirmPassword} onChange={(e) => setField('confirmPassword', e.target.value)} disabled={loading} required />
        </Field>
        {formError ? (
          <p id={formErrorId} role="alert" className="rounded-xl border border-danger/20 bg-danger/10 px-3 py-2.5 text-xs text-danger">
            {formError}
          </p>
        ) : null}
        <button type="submit" disabled={loading} aria-busy={loading} className="mt-1 inline-flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-light via-accent to-accent-dark px-4 py-3 text-[11px] font-bold uppercase tracking-[0.28em] text-on-accent disabled:opacity-55">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/50">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-accent underline-offset-2 hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[11px] uppercase tracking-[0.28em] text-ink/40">{label}</label>
      <div id={id}>{children}</div>
      {error ? <p className="text-xs text-danger" role="alert">{error}</p> : null}
    </div>
  );
}
