'use client';

import { useCallback, useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'politrip-theme';

/**
 * Theme state lives on <html> (class set by the inline no-flash script in the
 * root layout before hydration). This hook reads/writes it as an external
 * store, so there is no context provider, no flash, and no hydration mismatch.
 */
let listeners: Array<() => void> = [];

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => 'light' as Theme);

  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement;

    // Animate the switch, then clean up the transition class
    root.classList.add('theme-transition');
    window.setTimeout(() => root.classList.remove('theme-transition'), 400);

    root.classList.toggle('dark', next === 'dark');
    root.style.colorScheme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    listeners.forEach((l) => l());
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(getSnapshot() === 'dark' ? 'light' : 'dark');
  }, [setTheme]);

  return { theme, setTheme, toggleTheme };
}

/**
 * Runs before hydration (rendered as an inline <script> in the root layout).
 * Order of precedence: stored choice → system preference → light.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}var r=document.documentElement;r.classList.toggle('dark',t==='dark');r.style.colorScheme=t}catch(e){}})()`;
