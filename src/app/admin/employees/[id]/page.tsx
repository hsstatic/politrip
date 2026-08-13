'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Id } from '../../../../../convex/_generated/dataModel';
import { api } from '../../../../../convex/_generated/api';
import { useAdminMutation, useAdminQuery, useSession } from '@/components/admin/AdminAuthProvider';
import RequirePermission from '@/components/admin/RequirePermission';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <RequirePermission permission="employees.view">
      <EmployeeDetail id={id as Id<'users'>} />
    </RequirePermission>
  );
}

function EmployeeDetail({ id }: { id: Id<'users'> }) {
  const router = useRouter();
  const { hasPermission, user: actor } = useSession();
  const employee = useAdminQuery(api.employees.get, { id });
  const roles = useAdminQuery(api.roles.list);
  const activity = useAdminQuery(api.employees.activity, { id });
  const update = useAdminMutation(api.employees.update);
  const setStatus = useAdminMutation(api.employees.setStatus);
  const remove = useAdminMutation(api.employees.remove);

  const [roleId, setRoleId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [confirm, setConfirm] = useState<'disable' | 'activate' | 'delete' | null>(null);
  const [resetUrl, setResetUrl] = useState('');

  async function saveRole() {
    if (!hasPermission('employees.edit')) return;
    await update({
      id,
      employeeRoleId: (roleId || null) as Id<'employeeRoles'> | null,
    });
    setMessage('Role updated. The employee may need to sign in again.');
  }

  async function issueReset() {
    const res = await fetch('/api/staff/password-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && typeof data.resetUrl === 'string') setResetUrl(data.resetUrl);
    else setMessage('Could not issue a reset link.');
  }

  if (employee === undefined) return <p className="p-8 text-sm text-ink/40">Loading…</p>;
  if (employee === null) return <p className="p-8 text-sm text-ink/50">Employee not found.</p>;

  const currentRole = roleId ?? employee.employeeRoleId ?? '';

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8 max-w-3xl">
      <Link href="/admin/employees" className="text-sm text-ink/50 hover:text-accent">← Employees</Link>
      <h1 className="mt-4 text-2xl font-semibold text-ink" style={{ fontFamily: 'var(--font-instrument)' }}>
        {employee.firstName} {employee.lastName}
      </h1>
      <p className="text-sm text-ink/40">{employee.email} · {employee.status}</p>
      <p className="mt-1 text-xs text-ink/40">
        Last login: {employee.lastLoginAt ? new Date(employee.lastLoginAt).toLocaleString() : 'Never'}
      </p>

      <div className="mt-8 rounded-xl border border-ink/10 p-4">
        <label className="text-xs uppercase tracking-widest text-ink/40">
          Assigned role
          <select
            value={currentRole}
            disabled={!hasPermission('employees.edit')}
            onChange={(e) => setRoleId(e.target.value)}
            className="mt-2 block w-full rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm text-ink"
          >
            <option value="">Unassigned</option>
            {(roles ?? []).map((role) => (
              <option key={role._id} value={role._id}>{role.name}</option>
            ))}
          </select>
        </label>
        {employee.role ? (
          <p className="mt-2 text-xs text-ink/50">Current: {employee.role.name} — {employee.role.description}</p>
        ) : null}
        {hasPermission('employees.edit') ? (
          <button type="button" onClick={() => void saveRole()} className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm text-on-accent">
            Save role
          </button>
        ) : null}
        {message ? <p className="mt-2 text-sm text-ink/50">{message}</p> : null}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {hasPermission('employees.edit') && employee.status === 'active' && actor?.id !== employee.id ? (
          <button type="button" onClick={() => setConfirm('disable')} className="rounded-lg border border-warning/30 px-3 py-2 text-sm text-warning">Disable</button>
        ) : null}
        {hasPermission('employees.edit') && employee.status !== 'active' ? (
          <button type="button" onClick={() => setConfirm('activate')} className="rounded-lg border border-success/30 px-3 py-2 text-sm text-success">Reactivate</button>
        ) : null}
        {hasPermission('employees.edit') ? (
          <button type="button" onClick={() => void issueReset()} className="rounded-lg border border-ink/10 px-3 py-2 text-sm">Issue reset link</button>
        ) : null}
        {hasPermission('employees.delete') && actor?.id !== employee.id ? (
          <button type="button" onClick={() => setConfirm('delete')} className="rounded-lg border border-danger/30 px-3 py-2 text-sm text-danger">Remove</button>
        ) : null}
      </div>

      {resetUrl ? (
        <div className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm">
          <p className="text-ink/70">One-time reset link:</p>
          <code className="mt-2 block break-all text-xs">{resetUrl}</code>
        </div>
      ) : null}

      <h2 className="mt-10 text-lg font-semibold">Activity</h2>
      <ul className="mt-3 space-y-2">
        {(activity ?? []).length === 0 ? (
          <li className="text-sm text-ink/40">No recorded activity.</li>
        ) : activity?.map((row) => (
          <li key={row._id} className="rounded-lg border border-ink/10 px-3 py-2 text-sm">
            <span className="font-medium">{row.action}</span>
            <span className="ms-2 text-ink/40">{new Date(row.createdAt).toLocaleString()}</span>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={confirm !== null}
        danger={confirm !== 'activate'}
        title={confirm === 'delete' ? 'Remove this employee?' : confirm === 'disable' ? 'Disable this employee?' : 'Reactivate?'}
        description={
          confirm === 'delete'
            ? 'This permanently removes the staff account. Prefer disable unless you are sure.'
            : confirm === 'disable'
              ? 'They will lose access immediately.'
              : 'They will be able to sign in again.'
        }
        onClose={() => setConfirm(null)}
        onConfirm={async () => {
          try {
            if (confirm === 'delete') {
              await remove({ id });
              router.push('/admin/employees');
              return;
            }
            await setStatus({ id, status: confirm === 'disable' ? 'disabled' : 'active' });
          } finally {
            setConfirm(null);
          }
        }}
      />
    </div>
  );
}
