import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { SESSION_COOKIE, readSession } from '@/lib/authSession';
import { defaultHome } from '@/lib/safeRedirect';

export const metadata: Metadata = {
  title: 'Forgot password',
  robots: { index: false, follow: false },
};

export default async function ForgotPasswordPage() {
  const cookieStore = await cookies();
  const session = await readSession(cookieStore.get(SESSION_COOKIE)?.value);
  if (session) redirect(defaultHome(session.kind));
  return <ForgotPasswordForm />;
}
