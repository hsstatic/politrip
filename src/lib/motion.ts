// ── Easing curves ────────────────────────────────────────────────────────────
export const EASE_OUT      = [0.22, 1, 0.36, 1] as const;
export const EASE_EXPO_OUT = [0.16, 1, 0.3, 1]  as const; // aggressive ease-out for cinematics

// ── Viewport config ──────────────────────────────────────────────────────────
export const viewportOnce = { once: true, margin: '0px 0px -8% 0px', amount: 0.1 } as const;

// ── Shared variants ──────────────────────────────────────────────────────────
export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 48, scale: 0.97 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.85, ease: EASE_OUT },
  },
};

/** Rises from below with a subtle forward Z-depth push. */
export const cinematicRise = {
  hidden: { opacity: 0, y: 64, scale: 0.94, filter: 'blur(3px)' },
  show: {
    opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
    transition: { duration: 1.1, ease: EASE_EXPO_OUT },
  },
};

/** Word-by-word reveal for big headlines. */
export const headlineWord = {
  hidden: { y: '115%', opacity: 0 },
  show: {
    y: '0%', opacity: 1,
    transition: { duration: 0.9, ease: EASE_EXPO_OUT },
  },
};
