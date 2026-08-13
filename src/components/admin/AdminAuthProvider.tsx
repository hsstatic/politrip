'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import type { FunctionArgs, FunctionReference } from 'convex/server';
import type { PublicUser } from '@/lib/authTypes';
import { defaultHome } from '@/lib/safeRedirect';

type AdminAuthState = {
  token: string | null;
  ready: boolean;
  user: PublicUser | null;
  permissions: string[];
  roleName?: string;
  hasPermission: (permission: string) => boolean;
  isOwner: boolean;
  refresh: () => void;
  signOut: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthState>({
  token: null,
  ready: false,
  user: null,
  permissions: [],
  hasPermission: () => false,
  isOwner: false,
  refresh: () => {},
  signOut: async () => {},
});

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage =
    pathname === '/admin/login' ||
    pathname === '/sign-in' ||
    pathname === '/sign-up' ||
    pathname === '/forgot-password' ||
    pathname.startsWith('/reset-password');
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<PublicUser | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [roleName, setRoleName] = useState<string | undefined>();
  const [fetched, setFetched] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    if (isAuthPage) return;

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    void (async () => {
      try {
        const res = await fetch('/api/auth/token', { cache: 'no-store' });
        if (cancelled) return;
        if (!res.ok) {
          setToken(null);
          setUser(null);
          setPermissions([]);
          setFetched(true);
          router.replace(`/sign-in?next=${encodeURIComponent(pathname)}`);
          return;
        }
        const data = (await res.json()) as {
          token: string;
          exp: number;
          user: PublicUser;
          permissions: string[];
          roleName?: string;
        };
        if (cancelled) return;
        setToken(data.token);
        setUser(data.user);
        setPermissions(data.permissions ?? []);
        setRoleName(data.roleName);
        setFetched(true);

        if (pathname.startsWith('/admin') && data.user.kind === 'customer') {
          router.replace('/account');
          return;
        }
        if ((pathname === '/account' || pathname.startsWith('/account/')) && data.user.kind === 'owner') {
          router.replace('/admin');
          return;
        }
        if ((pathname === '/account' || pathname.startsWith('/account/')) && data.user.kind === 'employee') {
          router.replace('/workspace');
          return;
        }
        if (pathname.startsWith('/workspace') && data.user.kind === 'owner') {
          router.replace('/admin');
          return;
        }
        if (pathname.startsWith('/workspace') && data.user.kind === 'customer') {
          router.replace('/account');
          return;
        }

        const refreshInMs = Math.max(15_000, data.exp * 1000 - Date.now() - 120_000);
        timeout = setTimeout(() => setRefreshTick((n) => n + 1), refreshInMs);
      } catch {
        if (!cancelled) {
          setToken(null);
          setUser(null);
          setPermissions([]);
          setFetched(true);
        }
      }
    })();

    return () => {
      cancelled = true;
      if (timeout) clearTimeout(timeout);
    };
  }, [isAuthPage, router, refreshTick, pathname]);

  const hasPermission = useCallback(
    (permission: string) => {
      if (!user) return false;
      if (user.kind === 'owner') return true;
      return permissions.includes(permission);
    },
    [permissions, user],
  );

  const refresh = useCallback(() => setRefreshTick((n) => n + 1), []);

  const signOut = useCallback(async () => {
    setToken(null);
    setUser(null);
    setPermissions([]);
    setRoleName(undefined);
    setFetched(true);
    await fetch('/api/auth/logout', { method: 'POST' });
  }, []);

  const value: AdminAuthState = useMemo(
    () =>
      isAuthPage
        ? {
            token: null,
            ready: true,
            user: null,
            permissions: [],
            hasPermission: () => false,
            isOwner: false,
            refresh,
            signOut,
          }
        : {
            token,
            ready: fetched,
            user,
            permissions,
            roleName,
            hasPermission,
            isOwner: user?.kind === 'owner',
            refresh,
            signOut,
          },
    [fetched, hasPermission, isAuthPage, permissions, refresh, roleName, signOut, token, user],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminToken() {
  return useContext(AdminAuthContext);
}

export function useSession() {
  return useContext(AdminAuthContext);
}

export function useAdminMutation<Mutation extends FunctionReference<'mutation'>>(
  mutation: Mutation,
) {
  const { token } = useAdminToken();
  const mutate = useMutation(mutation);
  return useCallback(
    (args: Omit<FunctionArgs<Mutation>, 'adminToken'>) => {
      if (!token) return Promise.reject(new Error('Not authenticated'));
      return mutate({ ...(args as object), adminToken: token } as FunctionArgs<Mutation>);
    },
    [mutate, token],
  );
}

export function useAdminQuery<Query extends FunctionReference<'query'>>(
  query: Query,
  args?: Omit<FunctionArgs<Query>, 'adminToken'>,
) {
  const { token, ready } = useAdminToken();
  const [errored, setErrored] = useState(false);
  const queryArgs =
    !ready || !token || errored ? 'skip' : { ...(args as object), adminToken: token };
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return useQuery(query, queryArgs as any);
  } catch {
    if (!errored) setErrored(true);
    return undefined;
  }
}

export function useAuthMutation<Mutation extends FunctionReference<'mutation'>>(
  mutation: Mutation,
) {
  const { token } = useAdminToken();
  const mutate = useMutation(mutation);
  return useCallback(
    (args: Omit<FunctionArgs<Mutation>, 'authToken'>) => {
      if (!token) return Promise.reject(new Error('Not authenticated'));
      return mutate({ ...(args as object), authToken: token } as FunctionArgs<Mutation>);
    },
    [mutate, token],
  );
}

export function useAuthQuery<Query extends FunctionReference<'query'>>(
  query: Query,
  args?: Omit<FunctionArgs<Query>, 'authToken'>,
) {
  const { token, ready } = useAdminToken();
  const [errored, setErrored] = useState(false);
  const queryArgs = !ready || !token || errored ? 'skip' : { ...(args as object), authToken: token };
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return useQuery(query, queryArgs as any);
  } catch {
    if (!errored) setErrored(true);
    return undefined;
  }
}

export { defaultHome };
