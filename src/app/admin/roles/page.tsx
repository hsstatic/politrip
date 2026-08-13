'use client';

import { useState } from 'react';
import { api } from '../../../../convex/_generated/api';
import { PERMISSION_GROUPS } from '../../../../convex/permissions';
import { useAdminMutation, useAdminQuery, useSession } from '@/components/admin/AdminAuthProvider';
import RequirePermission from '@/components/admin/RequirePermission';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import type { Id } from '../../../../convex/_generated/dataModel';

export default function RolesPage() {
  return (
    <RequirePermission permission="roles.view" ownerOnly>
      <RolesManager />
    </RequirePermission>
  );
}

function RolesManager() {
  const { hasPermission, isOwner } = useSession();
  const roles = useAdminQuery(api.roles.list);
  const create = useAdminMutation(api.roles.create);
  const update = useAdminMutation(api.roles.update);
  const remove = useAdminMutation(api.roles.remove);
  const [selected, setSelected] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [draftSlug, setDraftSlug] = useState('');
  const [draftDescription, setDraftDescription] = useState('');
  const [draftPerms, setDraftPerms] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const current = roles?.find((r) => r._id === selected);

  function selectRole(id: string) {
    const role = roles?.find((r) => r._id === id);
    setSelected(id);
    setCreating(false);
    setDraftName(role?.name ?? '');
    setDraftDescription(role?.description ?? '');
    setDraftPerms(role?.permissions ?? []);
  }

  function togglePerm(perm: string) {
    setDraftPerms((prev) => (prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]));
  }

  async function save() {
    if (!selected || !isOwner) return;
    await update({
      id: selected as Id<'employeeRoles'>,
      name: draftName,
      description: draftDescription,
      permissions: draftPerms,
    });
    setMessage('Role updated. Assigned employees will need to refresh their session.');
  }

  async function createRole(e: React.FormEvent) {
    e.preventDefault();
    if (!isOwner) return;
    const id = await create({
      name: draftName,
      slug: draftSlug || draftName.toLowerCase().replace(/\s+/g, '-'),
      description: draftDescription,
      permissions: draftPerms,
    });
    setCreating(false);
    selectRole(id);
  }

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink" style={{ fontFamily: 'var(--font-instrument)' }}>
            Roles & permissions
          </h1>
          <p className="text-sm text-ink/40">Owner-only. Employees only receive the permissions you assign.</p>
        </div>
        {hasPermission('roles.edit') ? (
          <button
            type="button"
            onClick={() => {
              setCreating(true);
              setSelected(null);
              setDraftName('');
              setDraftSlug('');
              setDraftDescription('');
              setDraftPerms([]);
            }}
            className="rounded-lg bg-accent px-4 py-2 text-sm text-on-accent"
          >
            + New role
          </button>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
        <div className="rounded-xl border border-ink/10 p-2">
          {(roles ?? []).map((role) => (
            <button
              key={role._id}
              type="button"
              onClick={() => selectRole(role._id)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                selected === role._id ? 'bg-accent/15 text-accent' : 'text-ink/70 hover:bg-ink/5'
              }`}
            >
              {role.name}
              <span className="mt-0.5 block text-[11px] text-ink/40">{role.permissions.length} permissions</span>
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-ink/10 p-5">
          {!creating && !current ? (
            <p className="text-sm text-ink/40">Select a role to edit permissions.</p>
          ) : (
            <form onSubmit={creating ? createRole : (e) => { e.preventDefault(); void save(); }}>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-xs uppercase tracking-widest text-ink/40">
                  Name
                  <input value={draftName} onChange={(e) => setDraftName(e.target.value)} required className="mt-1 w-full rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm normal-case text-ink" />
                </label>
                {creating ? (
                  <label className="text-xs uppercase tracking-widest text-ink/40">
                    Slug
                    <input value={draftSlug} onChange={(e) => setDraftSlug(e.target.value)} placeholder="support" className="mt-1 w-full rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm normal-case text-ink" />
                  </label>
                ) : null}
                <label className="text-xs uppercase tracking-widest text-ink/40 sm:col-span-2">
                  Description
                  <input value={draftDescription} onChange={(e) => setDraftDescription(e.target.value)} className="mt-1 w-full rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm normal-case text-ink" />
                </label>
              </div>

              <div className="mt-6 space-y-5">
                {PERMISSION_GROUPS.map((group) => (
                  <fieldset key={group.id}>
                    <legend className="mb-2 text-sm font-medium text-ink">{group.label}</legend>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {group.permissions.map((perm) => (
                        <label key={perm} className="flex items-center gap-2 text-sm text-ink/70">
                          <input
                            type="checkbox"
                            checked={draftPerms.includes(perm)}
                            onChange={() => togglePerm(perm)}
                            className="accent-accent"
                          />
                          {perm}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-sm text-on-accent">
                  {creating ? 'Create role' : 'Save permissions'}
                </button>
                {!creating && current ? (
                  <button type="button" onClick={() => setDeleteId(current._id)} className="rounded-lg border border-danger/30 px-4 py-2 text-sm text-danger">
                    Delete role
                  </button>
                ) : null}
              </div>
              {message ? <p className="mt-3 text-sm text-ink/50">{message}</p> : null}
            </form>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        danger
        title="Delete this role?"
        description="Employees must be reassigned first. This cannot be undone."
        confirmLabel="Delete"
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            await remove({ id: deleteId as Id<'employeeRoles'> });
            setSelected(null);
          } catch {
            setMessage('Reassign employees before deleting this role.');
          } finally {
            setDeleteId(null);
          }
        }}
      />
    </div>
  );
}
