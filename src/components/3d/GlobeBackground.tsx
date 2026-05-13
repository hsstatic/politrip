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

  useEffect(() => {
    const measure = () => {
      const el = document.getElementById('destinations');
      if (!el) return;
      const rectTop = el.getBoundingClientRect().top + window.scrollY;
      setDestTop(rectTop);
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

  // Zoom-to-Turkey progress: 0 at top of page, 1 by the time the fade begins.
  const zoomProgress = useTransform(scrollY, (y) => {
    if (typeof window === 'undefined') return 0;
    const vh = window.innerHeight;
    const end = Math.max(1, destTop - vh);
    return Math.max(0, Math.min(1, y / end));
  });
  const staticProgress = useMotionValue(0);
  const scrollYProgress = reduceMotion ? staticProgress : zoomProgress;

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
        <GlobeCanvas scrollYProgress={scrollYProgress} visible={visible} />
      </Suspense>
    </motion.div>
  );
}
