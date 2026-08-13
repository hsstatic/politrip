'use client';

import { useRef, useState } from 'react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { useAuthMutation, useSession } from '@/components/admin/AdminAuthProvider';

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);

export default function AvatarUpload() {
  const { user, refresh } = useSession();
  const generateUrl = useAuthMutation(api.users.generateUploadUrl);
  const setAvatar = useAuthMutation(api.users.setAvatar);
  const clearAvatar = useAuthMutation(api.users.clearAvatar);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const initials =
    `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || '?';

  async function onFile(file: File) {
    setError('');
    if (!ALLOWED.has(file.type)) {
      setError('Use a JPEG, PNG, or WebP image.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('Image must be 2 MB or smaller.');
      return;
    }
    setBusy(true);
    try {
      const uploadUrl = await generateUrl({});
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!res.ok) throw new Error('upload failed');
      const payload = (await res.json()) as { storageId?: string };
      if (!payload.storageId) throw new Error('missing storage id');
      await setAvatar({ storageId: payload.storageId as Id<'_storage'> });
      refresh();
    } catch {
      setError('Could not upload the photo. Try again.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function remove() {
    setBusy(true);
    setError('');
    try {
      await clearAvatar({});
      refresh();
    } catch {
      setError('Could not remove the photo.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-start gap-4 rounded-xl border border-ink/10 p-4">
      <div className="h-16 w-16 overflow-hidden rounded-full bg-accent/15 text-accent">
        {user?.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-lg font-semibold">{initials}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">Profile photo</p>
        <p className="mt-0.5 text-xs text-ink/40">JPEG, PNG, or WebP · max 2 MB</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onFile(file);
            }}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-ink/10 px-3 py-1.5 text-xs text-ink/70 hover:border-accent/40 hover:text-accent disabled:opacity-50"
          >
            {busy ? 'Uploading…' : user?.avatarUrl ? 'Replace photo' : 'Upload photo'}
          </button>
          {user?.avatarUrl ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void remove()}
              className="rounded-lg border border-danger/20 px-3 py-1.5 text-xs text-danger/70 hover:border-danger/40 hover:text-danger disabled:opacity-50"
            >
              Remove
            </button>
          ) : null}
        </div>
        {error ? <p className="mt-2 text-xs text-danger" role="alert">{error}</p> : null}
      </div>
    </div>
  );
}
