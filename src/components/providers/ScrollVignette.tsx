'use client';

import { useEffect, useRef } from 'react';
import { getLenis } from '@/components/providers/LenisProvider';

/**
 * A fixed fullscreen vignette that darkens at the edges when the user
 * is scrolling fast, then fades back to transparent when they stop.
 * Gives a cinematic "speed" feel without any layout impact.
 */
export default function ScrollVignette() {
  const ref = useRef<HTMLDivElement>(null);
  const velocity = useRef(0);
  const lastScroll = useRef(0);
  const rafId = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Use a simple velocity tracker driven by the Lenis scroll event
    const onScroll = ({ scroll }: { scroll: number }) => {
      velocity.current = scroll - lastScroll.current;
      lastScroll.current = scroll;
    };

    const tick = () => {
      // Decay velocity toward 0 (simulates inertia settling)
      velocity.current *= 0.78;

      // Map |velocity| to vignette strength: 0 at rest, max at ~30px/frame
      const strength = Math.min(Math.abs(velocity.current) / 30, 1);
      const opacity = strength * 0.28; // max 28% edge darkening

      el.style.opacity = String(opacity);
      rafId.current = requestAnimationFrame(tick);
    };

    // Attach after first paint so getLenis() is ready
    const raf = requestAnimationFrame(() => {
      getLenis()?.on('scroll', onScroll);
      rafId.current = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(rafId.current);
      getLenis()?.off('scroll', onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[150] pointer-events-none opacity-0"
      style={{
        background:
          'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 45%, rgba(1,10,31,0.9) 100%)',
      }}
      aria-hidden
    />
  );
}
