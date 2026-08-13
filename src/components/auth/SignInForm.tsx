'use client';

import { useId, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { isValidEmail } from '@/lib/emailFormat';
import { EASE_OUT } from '@/lib/motion';
import { safeRedirectPath, type UserKind } from '@/lib/safeRedirect';

const inputClass =
  'w-full rounded-xl border border-ink/10 bg-ink/5 px-4 py-3 text-sm text-ink placeholder:text-ink/30 outline-none transition-all duration-200 focus:border-accent/50 focus:bg-ink/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60';

export default function SignInForm({ next }: { next: string }) {
  const reduceMotion = useReducedMotion();
  const emailId = useId();
  const passwordId = useId();
  const rememberId = useId();
  const formErrorId = useId();
  const emailErrorId = useId();
  const passwordErrorId = useId();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    let ok = true;
    const trimmed = email.trim();

    if (!trimmed) {
      setEmailError('Please enter your email.');
      ok = false;
    } else if (!isValidEmail(trimmed)) {
      setEmailError('Please enter a valid email address.');
      ok = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Please enter your password.');
      ok = false;
    } else {
      setPasswordError('');
    }

    return ok;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;

    setFormError('');
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          rememberMe,
          next,
        }),
      });

      if (res.ok) {
        const data = (await res.json().catch(() => null)) as { next?: string; kind?: UserKind } | null;
        const kind = data?.kind === 'employee' || data?.kind === 'owner' || data?.kind === 'customer' ? data.kind : 'customer';
        window.location.assign(safeRedirectPath(typeof data?.next === 'string' ? data.next : next, kind));
        return;
      }

      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (res.status === 429) {
        setFormError('Too many attempts. Please wait a few minutes and try again.');
      } else if (res.status >= 500) {
        setFormError(
          data?.error && data.error !== 'Unauthorized'
            ? data.error
            : 'Sign-in is temporarily unavailable. Please try again.',
        );
      } else {
        setFormError('Incorrect email or password.');
      }
      setLoading(false);
    } catch {
      setFormError('Network error. Check your connection and try again.');
      setLoading(false);
    }
  }

  return (
    <div className="glass relative overflow-hidden rounded-2xl border border-accent/20 p-6 sm:p-8">
      <div className="divider-gold absolute top-0 right-0 left-0" aria-hidden />

      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">PoliTrip</p>
      <h1
        className="text-3xl font-light tracking-tight text-ink"
        style={{ fontFamily: 'var(--font-display, serif)' }}
      >
        Welcome back
      </h1>
      <p className="mt-2 text-sm text-ink/50">Sign in to your traveller account or staff workspace.</p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col gap-5"
        noValidate
        aria-describedby={formError ? formErrorId : undefined}
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor={emailId} className="text-[11px] uppercase tracking-[0.28em] text-ink/40">
            Email
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="username"
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

        <div className="flex flex-col gap-1.5">
          <label htmlFor={passwordId} className="text-[11px] uppercase tracking-[0.28em] text-ink/40">
            Password
          </label>
          <div className="relative">
            <input
              id={passwordId}
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
                if (formError) setFormError('');
              }}
              placeholder="Enter your password"
              required
              aria-invalid={passwordError ? true : undefined}
              aria-describedby={passwordError ? passwordErrorId : undefined}
              disabled={loading}
              className={`${inputClass} pe-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              aria-controls={passwordId}
              className="absolute top-1/2 right-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-ink/40 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {passwordError ? (
            <p id={passwordErrorId} className="text-xs text-danger" role="alert">
              {passwordError}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label htmlFor={rememberId} className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-ink/70">
            <input
              id={rememberId}
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
              className="h-4 w-4 shrink-0 rounded border-ink/20 accent-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
            Remember me
          </label>
          <Link
            href="/forgot-password"
            className="min-h-11 text-sm text-ink/50 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Forgot password?
          </Link>
        </div>

        <AnimatePresence>
          {formError ? (
            <motion.p
              id={formErrorId}
              role="alert"
              initial={reduceMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className="rounded-xl border border-danger/20 bg-danger/10 px-3 py-2.5 text-xs text-danger"
            >
              {formError}
            </motion.p>
          ) : null}
        </AnimatePresence>

        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="mt-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-accent-light via-accent to-accent-dark px-4 py-3 text-[11px] font-bold uppercase tracking-[0.28em] text-on-accent transition-all duration-300 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-55"
        >
          {loading ? (
            <>
              <Spinner />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/50">
        New to PoliTrip?{' '}
        <Link href="/sign-up" className="text-accent underline-offset-2 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-1.2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.9 5.1A11.5 11.5 0 0 1 12 5c6.5 0 10 7 10 7a18.3 18.3 0 0 1-2.2 3.2M6.1 6.1C3.8 7.8 2 12 2 12s3.5 7 10 7c1.5 0 2.9-.3 4.1-.8" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v3a5 5 0 0 0-5 5H4z" />
    </svg>
  );
}
