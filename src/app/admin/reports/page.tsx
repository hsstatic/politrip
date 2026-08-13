'use client';

import { api } from '../../../../convex/_generated/api';
import { useAdminQuery } from '@/components/admin/AdminAuthProvider';
import RequirePermission from '@/components/admin/RequirePermission';
import { useDashLang } from '@/lib/adminI18n';

export default function ReportsPage() {
  return (
    <RequirePermission anyOf={['bookings.view', 'finance.view']}>
      <ReportsBody />
    </RequirePermission>
  );
}

function ReportsBody() {
  const { labels } = useDashLang();
  const L = labels.reports;
  const data = useAdminQuery(api.reports.bookings);

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8">
      <h1 className="text-2xl font-semibold text-ink" style={{ fontFamily: 'var(--font-instrument)' }}>
        {L.title}
      </h1>
      <p className="mt-1 text-sm text-ink/40">{L.subtitle}</p>

      {data === undefined ? <p className="mt-8 text-sm text-ink/40">{labels.common.loading}</p> : null}
      {data && data.total === 0 ? <p className="mt-8 text-sm text-ink/40">{L.empty}</p> : null}

      {data && data.total > 0 ? (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label={L.total} value={String(data.total)} />
            {(['pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => (
              <Stat key={status} label={status} value={String(data.byStatus[status] ?? 0)} />
            ))}
          </div>

          <section className="mt-10">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-widest text-ink/40">{L.byType}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(data.byType).map(([type, count]) => (
                <div key={type} className="rounded-xl border border-ink/10 px-4 py-3">
                  <p className="text-xs uppercase tracking-widest text-ink/40">{type}</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums">{count}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-widest text-ink/40">{L.volume}</h2>
            {data.volumeByCurrency ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(data.volumeByCurrency).map(([currency, amount]) => (
                  <div key={currency} className="rounded-xl border border-ink/10 px-4 py-3">
                    <p className="text-xs uppercase tracking-widest text-ink/40">{currency}</p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums">
                      {formatMoney(amount)} {currency}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink/50">{L.financeHidden}</p>
            )}
          </section>

          <section className="mt-10">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-widest text-ink/40">{L.monthly}</h2>
            <div className="overflow-x-auto rounded-xl border border-ink/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink/10 text-ink/40">
                    <th className="px-4 py-3 text-left font-medium">Month</th>
                    <th className="px-4 py-3 text-left font-medium">{L.bookings}</th>
                    <th className="px-4 py-3 text-left font-medium">{L.value}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.months.map((row) => (
                    <tr key={row.month} className="border-b border-ink/5">
                      <td className="px-4 py-3">{row.month}</td>
                      <td className="px-4 py-3 tabular-nums">{row.count}</td>
                      <td className="px-4 py-3 tabular-nums">
                        {row.volume == null ? '—' : formatMoney(row.volume)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ink/10 px-4 py-4">
      <p className="text-xs uppercase tracking-widest text-ink/40">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function formatMoney(value: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);
}
