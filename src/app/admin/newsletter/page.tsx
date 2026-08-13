'use client';

import { useAdminQuery } from '@/components/admin/AdminAuthProvider';
import RequirePermission from '@/components/admin/RequirePermission';
import { api } from '../../../../convex/_generated/api';
import { useDashLang } from '@/lib/adminI18n';

export default function NewsletterPage() {
  return (
    <RequirePermission permission="newsletter.view">
      <NewsletterManager />
    </RequirePermission>
  );
}

function NewsletterManager() {
  const { labels } = useDashLang();
  const L = labels.newsletter;
  const subscribers = useAdminQuery(api.newsletter.getAll);

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink" style={{ fontFamily: 'var(--font-instrument)' }}>
          {L.pageTitle}
        </h1>
        <p className="text-sm text-ink/40 mt-0.5">
          {subscribers?.length ?? 0} {labels.common.total}
        </p>
      </div>

      {subscribers === undefined && <p className="text-ink/40 text-sm">{labels.common.loading}</p>}

      {subscribers?.length === 0 && (
        <div className="text-center py-16 text-ink/30">
          <p className="text-4xl mb-3">✉</p>
          <p>{L.empty}</p>
        </div>
      )}

      {subscribers && subscribers.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-ink/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-ink/40">
                <th className="text-left px-4 py-3 font-medium">{L.email}</th>
                <th className="text-left px-4 py-3 font-medium">{L.date}</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((row) => (
                <tr key={row._id} className="border-b border-ink/5 hover:bg-ink/3 transition-colors">
                  <td className="px-4 py-3 text-ink font-medium">
                    <a href={`mailto:${row.email}`} className="hover:text-accent">
                      {row.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-ink/60 whitespace-nowrap">
                    {new Date(row.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
