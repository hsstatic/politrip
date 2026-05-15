// ── Easing curves ────────────────────────────────────────────────────────────
export const EASE_OUT      = [0.22, 1, 0.36, 1] as const;
export const EASE_INOUT    = [0.65, 0, 0.35, 1] as const;
export const EASE_EXPO_OUT = [0.16, 1, 0.3, 1]  as const; // aggressive ease-out for cinematics
export const EASE_SPRING   = { type: 'spring', stiffness: 340, damping: 30 } as const;
export const EASE_SPRING_SOFT = { type: 'spring', stiffness: 180, damping: 28 } as const;

// ── Viewport configs ─────────────────────────────────────────────────────────
export const viewportOnce = { once: true, margin: '0px 0px -8% 0px', amount: 0.1 } as const;
export const viewportCinematic = { once: true, margin: '0px 0px -12% 0px', amount: 0.12 } as const;
export const viewportDeep = { once: true, margin: '0px 0px -4% 0px', amount: 0.05 } as const;

// ── Base variants ────────────────────────────────────────────────────────────
export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.88, ease: EASE_OUT } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.72, ease: EASE_OUT } },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -48 },
  show: { opacity: 1, x: 0, transition: { duration: 0.88, ease: EASE_OUT } },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 48 },
  show: { opacity: 1, x: 0, transition: { duration: 0.88, ease: EASE_OUT } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.72, ease: EASE_OUT } },
};

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export const staggerContainerFast = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.02 } },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 48, scale: 0.97 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.85, ease: EASE_OUT },
  },
};

export const staggerItemFast = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1, y: 0,
    transition: { duration: 0.65, ease: EASE_OUT },
  },
};

export const clipReveal = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  show: {
    clipPath: 'inset(0 0% 0 0)',
    transition: { duration: 1.1, ease: EASE_OUT },
  },
};

export const editorialHero = {
  hidden: { opacity: 0, y: 72 },
  show: {
    opacity: 1, y: 0,
    transition: { duration: 1.05, ease: EASE_OUT },
  },
};

// ── Cinematic depth variants — "flying through space" feel ───────────────────

/** Rises from below with a subtle forward Z-depth push. */
export const cinematicRise = {
  hidden: { opacity: 0, y: 64, scale: 0.94, filter: 'blur(3px)' },
  show: {
    opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
    transition: { duration: 1.1, ease: EASE_EXPO_OUT },
  },
};

/** Panel slides in from the side with depth-aware scale. */
export const cinematicSlideIn = (dir: 1 | -1 = 1) => ({
  hidden: { opacity: 0, x: dir * 80, scale: 0.96, filter: 'blur(2px)' },
  show: {
    opacity: 1, x: 0, scale: 1, filter: 'blur(0px)',
    transition: { duration: 1.05, ease: EASE_EXPO_OUT },
  },
});

/** Snaps in from far below with motion-blur feel. */
export const depthSweep = {
  hidden: { opacity: 0, y: 100, rotateX: 8, scale: 0.92 },
  show: {
    opacity: 1, y: 0, rotateX: 0, scale: 1,
    transition: { duration: 1.2, ease: EASE_EXPO_OUT },
  },
};

/** Floating card emerges from depth — for glass panels. */
export const floatIn = {
  hidden: { opacity: 0, y: 48, scale: 0.93, filter: 'blur(6px)' },
  show: {
    opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
    transition: { duration: 1.3, ease: EASE_EXPO_OUT },
  },
};

/** Staggered container for cinematic children (slower cadence). */
export const cinematicStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.08 } },
};

/** Staggered item used inside cinematicStagger. */
export const cinematicItem = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 1.0, ease: EASE_EXPO_OUT },
  },
};

/** Line/divider draws in from left. */
export const lineReveal = {
  hidden: { scaleX: 0, originX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: 0.9, ease: EASE_OUT },
  },
};

/** Eyebrow label with glow — fades + slides */
export const eyebrowReveal = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1, x: 0,
    transition: { duration: 0.75, ease: EASE_OUT },
  },
};

/** Char-by-char or word-by-word reveal for big headlines */
export const headlineWord = {
  hidden: { y: '115%', opacity: 0 },
  show: {
    y: '0%', opacity: 1,
    transition: { duration: 0.9, ease: EASE_EXPO_OUT },
  },
};
