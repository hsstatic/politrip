import type { Metadata } from 'next';
import AuthShell from '@/components/auth/AuthShell';

export const metadata: Metadata = {
  title: 'Create account',
  robots: { index: false, follow: false },
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <AuthShell>{children}</AuthShell>;
}
