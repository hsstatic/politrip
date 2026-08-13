import type { Metadata } from 'next';
import Link from 'next/link';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset password',
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  if (!token || token.length < 32) {
    return (
      <div className="glass rounded-2xl border border-accent/20 p-8 text-center">
        <h1 className="text-2xl font-light text-ink" style={{ fontFamily: 'var(--font-display, serif)' }}>
          Reset link missing
        </h1>
        <p className="mt-2 text-sm text-ink/50">Request a new password reset from the sign-in page.</p>
        <Link href="/forgot-password" className="mt-6 inline-block text-sm text-accent hover:underline">
          Forgot password
        </Link>
      </div>
    );
  }
  return <ResetPasswordForm token={token} />;
}
