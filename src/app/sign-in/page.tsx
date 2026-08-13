import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SignInForm from '@/components/auth/SignInForm';
import { SESSION_COOKIE, readSession } from '@/lib/authSession';
import { safeRedirectPath } from '@/lib/safeRedirect';

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next: nextParam } = await searchParams;
  const cookieStore = await cookies();
  const session = await readSession(cookieStore.get(SESSION_COOKIE)?.value);

  if (session) {
    redirect(safeRedirectPath(nextParam, session.kind));
  }

  return <SignInForm next={nextParam ?? ''} />;
}
