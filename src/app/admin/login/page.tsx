import { redirect } from 'next/navigation';
import { safeAdminPath } from '@/lib/safeAdminPath';

export default async function AdminLoginRedirect({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const dest = safeAdminPath(next);
  redirect(dest === '/admin' ? '/sign-in' : `/sign-in?next=${encodeURIComponent(dest)}`);
}
