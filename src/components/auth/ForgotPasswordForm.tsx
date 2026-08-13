'use client';

import { useId, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { isValidEmail } from '@/lib/emailFormat';

const WA_HREF =
  'https://wa.me/905300709555?text=' +
  encodeURIComponent('Hello PoliTrip, I need help restoring access to the operator console.');
const MAIL_HREF =
  'mailto:info@politrip.com.tr?subject=' +
  encodeURIComponent('PoliTrip console access recovery') +
  '&body=' +
  encodeURIComponent('Hello PoliTrip,\n\nI need help restoring access to the operator console.\n\nEmail on the account:\n');

const inputClass =
  'w-full rounded-xl border border-ink/10 bg-ink/5 px-4 py-3 text-sm text-ink placeholder:text-ink/30 outline-none transition-all duration-200 focus:border-accent/50 focus:bg-ink/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60';

export default function ForgotPasswordForm() {
  const emailId = useId();
  const emailErrorId = useId();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;

    setFormError('');
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError('Please enter your email.');
      return;
    }
    if (!isValidEmail(trimmed)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });

      if (res.status === 429) {
        setFormError('Too many attempts. Please wait a few minutes and try again.');
        return;
      }
      if (!res.ok && res.status >= 500) {
        setFormError('Recovery is temporarily unavailable. Please try again.');
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (typeof data.resetUrl === 'string') setDevResetUrl(data.resetUrl);
      setSubmitted(true);
    } catch {
      setFormError('Network error. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass relative overflow-hidden rounded-2xl border border-accent/20 p-6 sm:p-8">
      <div className="divider-gold absolute top-0 right-0 left-0" aria-hidden />

      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">Recovery</p>
      <h1
        className="text-3xl font-light tracking-tight text-ink"
        style={{ fontFamily: 'var(--font-display, serif)' }}
      >
        {submitted ? 'Check next steps' : 'Forgot password'}
      </h1>
      <p className="mt-2 text-sm text-ink/50">
        {submitted
          ? 'If that email is on a PoliTrip account, we sent a reset link. Check your inbox and spam folder. You can also contact us below. We never confirm whether an account exists.'
          : 'Enter the email on your PoliTrip account. If it exists, we will email a reset link. We will not reveal whether an account exists.'}
      </p>

      {submitted ? (
        <div className="mt-8 flex flex-col gap-3">
          {devResetUrl ? (
            <Link
              href={devResetUrl}
              className="flex min-h-12 items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm text-on-accent"
            >
              Continue to reset password
            </Link>
          ) : null}
          <a
            href={WA_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 items-center justify-center rounded-xl border border-ink/10 bg-ink/5 px-4 py-3 text-sm text-ink transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Message PoliTrip on WhatsApp
          </a>
          <a
            href={MAIL_HREF}
            className="flex min-h-12 items-center justify-center rounded-xl border border-ink/10 bg-ink/5 px-4 py-3 text-sm text-ink transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Email info@politrip.com.tr
          </a>
          <Link
            href="/sign-in"
            className="mt-2 text-center text-sm text-ink/50 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={emailId} className="text-[11px] uppercase tracking-[0.28em] text-ink/40">
              Email
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
                if (formError) setFormError('');
              }}
              placeholder="you@politrip.com.tr"
              required
              aria-invalid={emailError ? true : undefined}
              aria-describedby={emailError ? emailErrorId : undefined}
              disabled={loading}
              className={inputClass}
            />
            {emailError ? (
              <p id={emailErrorId} className="text-xs text-danger" role="alert">
                {emailError}
              </p>
            ) : null}
          </div>

          {formError ? (
            <p className="rounded-xl border border-danger/20 bg-danger/10 px-3 py-2.5 text-xs text-danger" role="alert">
              {formError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-accent-light via-accent to-accent-dark px-4 py-3 text-[11px] font-bold uppercase tracking-[0.28em] text-on-accent transition-all duration-300 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-55"
          >
            {loading ? 'Sending...' : 'Continue'}
          </button>

          <Link
            href="/sign-in"
            className="text-center text-sm text-ink/50 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Back to sign in
          </Link>
        </form>
      )}
    </div>
  );
}
