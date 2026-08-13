'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from '@/hooks/useTranslations';
import type { PublicUser } from '@/lib/authTypes';
import { defaultHome } from '@/lib/safeRedirect';

export default function NavAuthLink({ className = '' }: { className?: string }) {
  const { t } = useTranslations();
  const [user, setUser] = useState<PublicUser | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch('/api/auth/token', { cache: 'no-store' });
        if (cancelled) return;
        if (!res.ok) {
          setUser(null);
          return;
        }
        const data = (await res.json()) as { user?: PublicUser };
        setUser(data.user ?? null);
      } catch {
        if (!cancelled) setUser(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (user) {
    return (
      <Link
        href={user.kind === 'customer' ? '/account' : defaultHome(user.kind)}
        className={className}
      >
        {t('nav.account')}
      </Link>
    );
  }

  return (
    <Link href="/sign-in" className={className}>
      {t('nav.signIn')}
    </Link>
  );
}
