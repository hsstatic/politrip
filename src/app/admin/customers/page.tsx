'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePaginatedQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useAdminQuery, useSession } from '@/components/admin/AdminAuthProvider';
import RequirePermission from '@/components/admin/RequirePermission';

type StatusFilter = '' | 'active' | 'disabled' | 'deactivated';

export default function CustomersPage() {
  return (
    <RequirePermission permission="customers.view">
      <CustomersManager />
    </RequirePermission>
  );
}

function CustomersManager() {
  const { token, hasPermission } = useSession();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<StatusFilter>('');
  const [openCreate, setOpenCreate] = useState(false);
  const summary = useAdminQuery(api.customers.summary);

  const args = useMemo(
    () =>
      !token
        ? 'skip'
        : {
            adminToken: token,
            query: q.trim() || undefined,
            status: status || undefined,
          },
    [q, status, token],
  );

  const { results, status: pageStatus, loadMore } = usePaginatedQuery(
    api.customers.list,
    args,
    { initialNumItems: 20 },
  );

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink" style={{ fontFamily: 'var(--font-instrument)' }}>
            Customers
          </h1>
          <p className="mt-1 text-sm text-ink/40">
            {summary ? `${summary.total} total · ${summary.active} active · ${summary.newThisWeek} new this week` : 'Loading…'}
          </p>
        </div>
        {hasPermission('customers.create') ? (
          <button
            type="button"
            onClick={() => setOpenCreate(true)}
            className="self-start rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:bg-accent-light"
          >
            + Add customer
          </button>
        ) : null}
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email, phone"
          className="w-full rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm text-ink outline-none focus:border-accent/50"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
          className="rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm text-ink"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="disabled">Disabled</option>
          <option value="deactivated">Deactivated</option>
        </select>
      </div>

      {pageStatus === 'LoadingFirstPage' ? <p className="text-sm text-ink/40">Loading…</p> : null}
      {results.length === 0 && pageStatus !== 'LoadingFirstPage' ? (
        <div className="rounded-xl border border-ink/10 py-16 text-center text-ink/40">No customers found.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink/10">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-ink/40">
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Phone</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Joined</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {results.map((row) => (
                <tr key={row.id} className="border-b border-ink/5 hover:bg-ink/3">
                  <td className="px-4 py-3 font-medium text-ink">
                    {row.firstName} {row.lastName}
                  </td>
                  <td className="px-4 py-3 text-ink/60">{row.email}</td>
                  <td className="px-4 py-3 text-ink/60">{row.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${
                      row.status === 'active'
                        ? 'bg-success/15 text-success'
                        : row.status === 'disabled'
                          ? 'bg-danger/15 text-danger'
                          : 'bg-ink/10 text-ink/50'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink/50">{new Date(row.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/customers/${row.id}`} className="text-xs text-accent hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pageStatus === 'CanLoadMore' || pageStatus === 'LoadingMore' ? (
        <button
          type="button"
          onClick={() => loadMore(20)}
          disabled={pageStatus === 'LoadingMore'}
          className="mt-4 rounded-lg border border-ink/10 px-4 py-2 text-sm text-ink/70 hover:text-ink"
        >
          {pageStatus === 'LoadingMore' ? 'Loading…' : 'Load more'}
        </button>
      ) : null}

      {openCreate ? <CreateCustomerDialog onClose={() => setOpenCreate(false)} /> : null}
    </div>
  );
}

function CreateCustomerDialog({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/staff/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Could not create customer.');
        return;
      }
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center">
      <button type="button" className="absolute inset-0 bg-black/60" aria-label="Close" onClick={onClose} />
      <form
        onSubmit={submit}
        className="relative z-10 w-full max-w-md rounded-2xl border border-ink/10 bg-canvas p-6"
      >
        <h2 className="text-lg font-semibold text-ink">New customer</h2>
        <div className="mt-4 grid gap-3">
          {(['firstName', 'lastName', 'email', 'phone', 'password'] as const).map((key) => (
            <label key={key} className="text-xs uppercase tracking-widest text-ink/40">
              {key === 'firstName' ? 'First name' : key === 'lastName' ? 'Last name' : key === 'email' ? 'Email' : key === 'phone' ? 'Phone' : 'Temporary password'}
              <input
                required
                type={key === 'password' ? 'password' : key === 'email' ? 'email' : 'text'}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm text-ink"
              />
            </label>
          ))}
        </div>
        {error ? <p className="mt-3 text-xs text-danger">{error}</p> : null}
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-ink/10 px-4 py-2 text-sm">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="rounded-lg bg-accent px-4 py-2 text-sm text-on-accent">
            {loading ? 'Creating…' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}
