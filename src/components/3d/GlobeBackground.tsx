'use client';

import { lazy, Suspense, useEffect, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';

const GlobeCanvas = lazy(() => import('@/components/3d/Globe'));

export default function GlobeBackground() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const [destTop, setDestTop] = useState<number>(() =>
    typeof window === 'undefined' ? 0 : window.innerHeight,
  );
  const [revealTop, setRevealTop] = useState<number>(() =>
    typeof window === 'undefined' ? 0 : window.innerHeight * 5,
  );

  useEffect(() => {
    const measure = () => {
      const dest = document.getElementById('destinations');
      if (dest) {
        setDestTop(dest.getBoundingClientRect().top + window.scrollY);
      }
      const reveal = document.getElementById('turkey-reveal');
      if (reveal) {
        setRevealTop(reveal.getBoundingClientRect().top + window.scrollY);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => {
      window.removeEventListener('resize', measure);
      ro.disconnect();
    };
  }, []);

  const opacity = useTransform(scrollY, (y) => {
    if (typeof window === 'undefined') return 1;
    const vh = window.innerHeight;
    const start = destTop - vh;
    const end = destTop - vh * 0.3;
    const t = (y - start) / Math.max(1, end - start);
    return Math.max(0, Math.min(1, 1 - t));
  });

  // Zoom-to-Turkey progress: 0 at top of page, 1 by the time the Turkey Reveal section begins.
  const zoomProgress = useTransform(scrollY, (y) => {
    if (typeof window === 'undefined') return 0;
    const end = Math.max(1, revealTop);
    return Math.max(0, Math.min(1, y / end));
  });

  // Reveal progress: 0 at start of #turkey-reveal, 1 at start of #destinations.
  const revealProgress = useTransform(scrollY, (y) => {
    if (typeof window === 'undefined') return 0;
    const range = Math.max(1, destTop - revealTop);
    return Math.max(0, Math.min(1, (y - revealTop) / range));
  });

  const staticProgress = useMotionValue(0);
  const scrollYProgress = reduceMotion ? staticProgress : zoomProgress;
  const revealProgressValue = reduceMotion ? staticProgress : revealProgress;

  // `visible` drives R3F's render loop on/off — but we NEVER unmount the
  // canvas. Unmounting was costing us a texture re-decode + state reset every
  // time the user scrolled back to the hero, which manifested as the globe
  // animations restarting and a visible hitch. Keeping the canvas mounted and
  // toggling `frameloop` instead means: state (smoothed scroll, clock) is
  // preserved, the 8K texture stays in GPU memory, and there's zero lag on
  // re-entry — the only cost while hidden is the React reconciliation of the
  // `frameloop` prop, since useFrame stops firing entirely.
  const [visible, setVisible] = useState(true);
  useMotionValueEvent(opacity, 'change', (v) => {
    setVisible(v > 0.01);
  });

  return (
    <motion.div
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity }}
      aria-hidden
    >
      <Suspense fallback={null}>
        <GlobeCanvas
          scrollYProgress={scrollYProgress}
          revealProgress={revealProgressValue}
          visible={visible}
        />
      </Suspense>
    </motion.div>
  );
}
