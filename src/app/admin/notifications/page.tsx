'use client';

import { useState } from 'react';
import { api } from '../../../../convex/_generated/api';
import { useAdminMutation, useAuthMutation, useAuthQuery, useSession } from '@/components/admin/AdminAuthProvider';
import RequirePermission from '@/components/admin/RequirePermission';

export default function NotificationsPage() {
  return (
    <RequirePermission>
      <NotificationsManager />
    </RequirePermission>
  );
}

function NotificationsManager() {
  const { hasPermission } = useSession();
  const notifications = useAuthQuery(api.notifications.listMine);
  const markRead = useAuthMutation(api.notifications.markRead);
  const markAll = useAuthMutation(api.notifications.markAllRead);
  const send = useAdminMutation(api.notifications.send);
  const [targetId, setTargetId] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div className="p-4 sm:p-8 pt-14 sm:pt-8 max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink" style={{ fontFamily: 'var(--font-instrument)' }}>
          Notifications
        </h1>
        <button type="button" onClick={() => void markAll({})} className="text-sm text-accent hover:underline">
          Mark all read
        </button>
      </div>

      <ul className="space-y-2">
        {(notifications ?? []).length === 0 ? (
          <li className="rounded-xl border border-ink/10 py-12 text-center text-sm text-ink/40">No notifications yet.</li>
        ) : (
          notifications?.map((n) => (
            <li key={n._id} className={`rounded-xl border px-4 py-3 ${n.readAt ? 'border-ink/10' : 'border-accent/30 bg-accent/5'}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">{n.title}</p>
                  <p className="mt-1 text-sm text-ink/60">{n.body}</p>
                  <p className="mt-1 text-[11px] text-ink/40">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.readAt ? (
                  <button type="button" onClick={() => void markRead({ id: n._id })} className="text-xs text-accent">
                    Mark read
                  </button>
                ) : null}
              </div>
            </li>
          ))
        )}
      </ul>

      {hasPermission('notifications.manage') ? (
        <form
          className="mt-10 rounded-xl border border-ink/10 p-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setMessage('');
            try {
              await send({ userId: targetId as never, title, body });
              setTitle('');
              setBody('');
              setTargetId('');
              setMessage('Sent.');
            } catch {
              setMessage('Could not send. Check the user id and your permission.');
            }
          }}
        >
          <h2 className="text-sm font-semibold text-ink">Send a notification</h2>
          <input value={targetId} onChange={(e) => setTargetId(e.target.value)} placeholder="User id" required className="mt-3 w-full rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm" />
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required className="mt-2 w-full rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm" />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Message" required className="mt-2 w-full rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-sm" />
          <button type="submit" className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm text-on-accent">Send</button>
          {message ? <p className="mt-2 text-sm text-ink/50">{message}</p> : null}
        </form>
      ) : null}
    </div>
  );
}
