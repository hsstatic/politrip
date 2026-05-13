export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_INOUT = [0.65, 0, 0.35, 1] as const;
export const EASE_SPRING = { type: 'spring', stiffness: 340, damping: 30 } as const;

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
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

export const staggerContainerFast = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.02 },
  },
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

export const viewportOnce = { once: true, margin: '0px 0px -8% 0px', amount: 0.1 } as const;

/** Earlier trigger + slightly longer motion (product-page style reveals). */
export const viewportCinematic = {
  once: true,
  margin: '0px 0px -12% 0px',
  amount: 0.12,
} as const;

export const editorialHero = {
  hidden: { opacity: 0, y: 72 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.05, ease: EASE_OUT },
  },
};
