'use client';

import type { ReactNode } from 'react';
import { useSession } from '@/components/admin/AdminAuthProvider';

export default function RequirePermission({
  permission,
  anyOf,
  ownerOnly = false,
  children,
}: {
  permission?: string;
  anyOf?: string[];
  ownerOnly?: boolean;
  children: ReactNode;
}) {
  const { ready, user, hasPermission, isOwner } = useSession();

  if (!ready) {
    return <p className="p-8 text-sm text-ink/40">Loading…</p>;
  }

  const permitted =
    (!permission || hasPermission(permission)) &&
    (!anyOf || anyOf.some((p) => hasPermission(p)));

  if (!user || (ownerOnly && !isOwner) || !permitted) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold text-ink" style={{ fontFamily: 'var(--font-instrument)' }}>
          Access denied
        </h1>
        <p className="mt-2 max-w-md text-sm text-ink/50">
          You do not have permission to view this section. Ask the owner if you need access.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

export function Can({
  permission,
  anyOf,
  children,
}: {
  permission?: string;
  anyOf?: string[];
  children: ReactNode;
}) {
  const { hasPermission } = useSession();
  const allowed = permission
    ? hasPermission(permission)
    : Boolean(anyOf?.some((p) => hasPermission(p)));
  if (!allowed) return null;
  return <>{children}</>;
}
