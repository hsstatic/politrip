'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Id } from '../../../../../convex/_generated/dataModel';
import { api } from '../../../../../convex/_generated/api';
import { useAdminMutation, useAdminQuery, useSession } from '@/components/admin/AdminAuthProvider';
import RequirePermission from '@/components/admin/RequirePermission';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <RequirePermission permission="customers.view">
      <CustomerDetail id={id as Id<'users'>} />
    </RequirePermission>
  );
}

function CustomerDetail({ id }: { id: Id<'users'> }) {
  const router = useRouter();
  const { hasPermission, isOwner } = useSession();
  const customer = useAdminQuery(api.customers.get, { id });
  const activity = useAdminQuery(api.customers.activity, { id });
  const bookings = useAdminQuery(api.bookings.listForUser, { userId: id });
  const update = useAdminMutation(api.customers.update);
  const setStatus = useAdminMutation(api.customers.setStatus);
  const remove = useAdminMutation(api.customers.remove);

  const [form, setForm] = useState<Record<string, string> | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [confirm, setConfirm] = useState<'disable' | 'activate' | 'delete' | null>(null);
  const [resetUrl, setResetUrl] = useState('');

  const values = form ?? {
    firstName: customer?.firstName ?? '',
    lastName: customer?.lastName ?? '',
    email: customer?.email ?? '',
    phone: customer?.phone ?? '',
    address: customer?.address ?? '',
    city: customer?.city ?? '',
    country: customer?.country ?? '',
  };

  const customerBookings = bookings ?? [];

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!hasPermission('customers.edit')) return;
    setSaving(true);
    setMessage('');
    try {
      await update({
        id,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city,
        country: values.country,
      });
      setMessage('Saved.');
      setForm(null);
    } catch {
      setMessage('Could not save changes.');
    } finally {
      setSaving(false);
    }
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

  if (customer === undefined) return <p className="p-8 text-sm text-ink/40">Loading…</p>;
  if (customer === null) return <p className="p-8 text-sm text-ink/50">Customer not found.</p>;

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8 max-w-4xl">
      <Link href="/admin/customers" className="text-sm text-ink/50 hover:text-accent">
        ← Customers
      </Link>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink" style={{ fontFamily: 'var(--font-instrument)' }}>
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-sm text-ink/40">{customer.email}</p>
        </div>
        <span className="self-start rounded-full bg-ink/5 px-3 py-1 text-xs uppercase tracking-widest text-ink/50">
          {customer.status}
        </span>
      </div>

      <form onSubmit={save} className="mt-8 grid gap-4 sm:grid-cols-2">
        {(['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'country'] as const).map((key) => (
          <label key={key} className="text-xs uppercase tracking-widest text-ink/40">
            {key}
            <input
              value={values[key]}
              disabled={!hasPermission('customers.edit')}
              onChange={(e) => setForm({ ...values, [key]: e.target.value })}
              className="mt-1 w-full rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm normal-case tracking-normal text-ink disabled:opacity-60"
            />
          </label>
        ))}
        {hasPermission('customers.edit') ? (
          <div className="sm:col-span-2">
            <button type="submit" disabled={saving} className="rounded-lg bg-accent px-4 py-2 text-sm text-on-accent">
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            {message ? <span className="ms-3 text-sm text-ink/50">{message}</span> : null}
          </div>
        ) : null}
      </form>

      <div className="mt-8 flex flex-wrap gap-2">
        {hasPermission('customers.edit') && customer.status === 'active' ? (
          <button type="button" onClick={() => setConfirm('disable')} className="rounded-lg border border-warning/30 px-3 py-2 text-sm text-warning">
            Disable account
          </button>
        ) : null}
        {hasPermission('customers.edit') && customer.status !== 'active' ? (
          <button type="button" onClick={() => setConfirm('activate')} className="rounded-lg border border-success/30 px-3 py-2 text-sm text-success">
            Reactivate
          </button>
        ) : null}
        {hasPermission('customers.edit') ? (
          <button type="button" onClick={() => void issueReset()} className="rounded-lg border border-ink/10 px-3 py-2 text-sm">
            Issue password reset link
          </button>
        ) : null}
        {(hasPermission('customers.delete') || isOwner) ? (
          <button type="button" onClick={() => setConfirm('delete')} className="rounded-lg border border-danger/30 px-3 py-2 text-sm text-danger">
            Delete customer
          </button>
        ) : null}
      </div>

      {resetUrl ? (
        <div className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm">
          <p className="text-ink/70">One-time reset link (copy and send privately — it will not be shown again):</p>
          <code className="mt-2 block break-all text-xs text-ink">{resetUrl}</code>
        </div>
      ) : null}

      <h2 className="mt-10 text-lg font-semibold text-ink">Bookings</h2>
      <div className="mt-3 overflow-x-auto rounded-xl border border-ink/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-ink/40">
              <th className="px-4 py-2 text-left font-medium">Item</th>
              <th className="px-4 py-2 text-left font-medium">Dates</th>
              <th className="px-4 py-2 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {(customerBookings ?? []).length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-ink/40">No linked bookings.</td>
              </tr>
            ) : (
              customerBookings?.map((b) => (
                <tr key={b._id} className="border-b border-ink/5">
                  <td className="px-4 py-2">{b.itemTitle ?? b.itemId}</td>
                  <td className="px-4 py-2 text-ink/60">{b.startDate} → {b.endDate}</td>
                  <td className="px-4 py-2">{b.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-lg font-semibold text-ink">Activity</h2>
      <ul className="mt-3 space-y-2">
        {(activity ?? []).length === 0 ? (
          <li className="text-sm text-ink/40">No recorded activity.</li>
        ) : (
          activity?.map((row) => (
            <li key={row._id} className="rounded-lg border border-ink/10 px-3 py-2 text-sm">
              <span className="font-medium text-ink">{row.action}</span>
              <span className="ms-2 text-ink/40">{new Date(row.createdAt).toLocaleString()}</span>
            </li>
          ))
        )}
      </ul>

      <ConfirmDialog
        open={confirm !== null}
        danger={confirm !== 'activate'}
        title={confirm === 'delete' ? 'Delete this customer?' : confirm === 'disable' ? 'Disable this account?' : 'Reactivate this account?'}
        description={
          confirm === 'delete'
            ? 'This permanently removes the customer record. Prefer disable unless you are sure.'
            : confirm === 'disable'
              ? 'They will no longer be able to sign in. You can reactivate later.'
              : 'The customer will be able to sign in again.'
        }
        confirmLabel={confirm === 'delete' ? 'Delete' : confirm === 'disable' ? 'Disable' : 'Reactivate'}
        onClose={() => setConfirm(null)}
        onConfirm={async () => {
          try {
            if (confirm === 'delete') {
              await remove({ id });
              router.push('/admin/customers');
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
