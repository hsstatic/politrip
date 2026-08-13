'use client';

import { useMemo } from 'react';
import { usePaginatedQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useSession } from '@/components/admin/AdminAuthProvider';
import RequirePermission from '@/components/admin/RequirePermission';

export default function AuditPage() {
  return (
    <RequirePermission permission="audit.view" ownerOnly>
      <AuditLog />
    </RequirePermission>
  );
}

function AuditLog() {
  const { token } = useSession();
  const args = useMemo(() => (!token ? 'skip' : { adminToken: token }), [token]);
  const { results, status, loadMore } = usePaginatedQuery(api.audit.list, args, { initialNumItems: 30 });

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8">
      <h1 className="text-2xl font-semibold text-ink" style={{ fontFamily: 'var(--font-instrument)' }}>
        Audit log
      </h1>
      <p className="mt-1 text-sm text-ink/40">Important administrative actions. Records cannot be deleted by staff.</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-ink/10">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-ink/40">
              <th className="px-4 py-3 text-left font-medium">When</th>
              <th className="px-4 py-3 text-left font-medium">Actor</th>
              <th className="px-4 py-3 text-left font-medium">Action</th>
              <th className="px-4 py-3 text-left font-medium">Entity</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row) => (
              <tr key={row._id} className="border-b border-ink/5">
                <td className="px-4 py-3 text-ink/50 whitespace-nowrap">{new Date(row.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="text-ink">{row.actorEmail ?? 'System'}</div>
                  <div className="text-[11px] text-ink/40">{row.actorKind}</div>
                </td>
                <td className="px-4 py-3 font-medium">{row.action}</td>
                <td className="px-4 py-3 text-ink/60">
                  {row.entityType}
                  {row.entityId ? ` · ${row.entityId.slice(0, 8)}…` : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {status === 'CanLoadMore' || status === 'LoadingMore' ? (
        <button type="button" onClick={() => loadMore(30)} className="mt-4 rounded-lg border border-ink/10 px-4 py-2 text-sm">
          Load more
        </button>
      ) : null}
    </div>
  );
}
