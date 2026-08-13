'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePaginatedQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { useAdminQuery, useSession } from '@/components/admin/AdminAuthProvider';
import RequirePermission from '@/components/admin/RequirePermission';

export default function EmployeesPage() {
  return (
    <RequirePermission permission="employees.view">
      <EmployeesManager />
    </RequirePermission>
  );
}

function EmployeesManager() {
  const { token, hasPermission } = useSession();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [roleId, setRoleId] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const summary = useAdminQuery(api.employees.summary);
  const roles = useAdminQuery(api.roles.list);

  const args = useMemo(
    () =>
      !token
        ? 'skip'
        : {
            adminToken: token,
            query: q.trim() || undefined,
            status: (status || undefined) as 'active' | 'disabled' | 'deactivated' | undefined,
            roleId: (roleId || undefined) as Id<'employeeRoles'> | undefined,
          },
    [q, roleId, status, token],
  );

  const { results, status: pageStatus, loadMore } = usePaginatedQuery(
    api.employees.list,
    args,
    { initialNumItems: 20 },
  );

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink" style={{ fontFamily: 'var(--font-instrument)' }}>
            Employees
          </h1>
          <p className="mt-1 text-sm text-ink/40">
            {summary ? `${summary.total} total · ${summary.active} active` : 'Loading…'}
          </p>
        </div>
        {hasPermission('employees.create') ? (
          <button
            type="button"
            onClick={() => setOpenCreate(true)}
            className="self-start rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent"
          >
            + Add employee
          </button>
        ) : null}
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search employees"
          className="rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="disabled">Disabled</option>
        </select>
        <select value={roleId} onChange={(e) => setRoleId(e.target.value)} className="rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm">
          <option value="">All roles</option>
          {(roles ?? []).map((role) => (
            <option key={role._id} value={role._id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      {results.length === 0 && pageStatus !== 'LoadingFirstPage' ? (
        <div className="rounded-xl border border-ink/10 py-16 text-center text-ink/40">No employees yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink/10">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-ink/40">
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Last login</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {results.map((row) => (
                <tr key={row.id} className="border-b border-ink/5">
                  <td className="px-4 py-3 font-medium">{row.firstName} {row.lastName}</td>
                  <td className="px-4 py-3 text-ink/60">{row.email}</td>
                  <td className="px-4 py-3">{row.status}</td>
                  <td className="px-4 py-3 text-ink/50">
                    {row.lastLoginAt ? new Date(row.lastLoginAt).toLocaleString() : 'Never'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/employees/${row.id}`} className="text-xs text-accent hover:underline">
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pageStatus === 'CanLoadMore' || pageStatus === 'LoadingMore' ? (
        <button type="button" onClick={() => loadMore(20)} className="mt-4 rounded-lg border border-ink/10 px-4 py-2 text-sm">
          Load more
        </button>
      ) : null}

      {openCreate ? <CreateEmployeeDialog roles={roles ?? []} onClose={() => setOpenCreate(false)} /> : null}
    </div>
  );
}

function CreateEmployeeDialog({
  roles,
  onClose,
}: {
  roles: Array<{ _id: string; name: string }>;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    employeeRoleId: '',
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/staff/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, employeeRoleId: form.employeeRoleId || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Could not create employee.');
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
      <form onSubmit={submit} className="relative z-10 w-full max-w-md rounded-2xl border border-ink/10 bg-canvas p-6">
        <h2 className="text-lg font-semibold text-ink">New employee</h2>
        <div className="mt-4 grid gap-3">
          {(['firstName', 'lastName', 'email', 'phone', 'password'] as const).map((key) => (
            <label key={key} className="text-xs uppercase tracking-widest text-ink/40">
              {key}
              <input
                required
                type={key === 'password' ? 'password' : key === 'email' ? 'email' : 'text'}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm normal-case tracking-normal text-ink"
              />
            </label>
          ))}
          <label className="text-xs uppercase tracking-widest text-ink/40">
            Role
            <select
              value={form.employeeRoleId}
              onChange={(e) => setForm((f) => ({ ...f, employeeRoleId: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm normal-case text-ink"
            >
              <option value="">Unassigned</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        {error ? <p className="mt-3 text-xs text-danger">{error}</p> : null}
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-ink/10 px-4 py-2 text-sm">Cancel</button>
          <button type="submit" disabled={loading} className="rounded-lg bg-accent px-4 py-2 text-sm text-on-accent">
            {loading ? 'Creating…' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}
