'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/** Elements that get the enlarged follower ring (also updated via coords each move). */
const INTERACTIVE_SELECTOR = 'a[href],button:not(:disabled),[data-cursor="pointer"]';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  /** Enable only on mouse-first desktops; touch / coarse pointers see the native cursor. */
  useEffect(() => {
    const mqFine = window.matchMedia('(pointer: fine)');
    const mqHover = window.matchMedia('(hover: hover)');
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setActive(mqFine.matches && mqHover.matches && !mqReduce.matches);
    sync();
    mqFine.addEventListener('change', sync);
    mqHover.addEventListener('change', sync);
    mqReduce.addEventListener('change', sync);
    return () => {
      mqFine.removeEventListener('change', sync);
      mqHover.removeEventListener('change', sync);
      mqReduce.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    if (!active) {
      document.documentElement.removeAttribute('data-custom-cursor');
      return undefined;
    }

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) {
      document.documentElement.removeAttribute('data-custom-cursor');
      return undefined;
    }

    document.documentElement.dataset.customCursor = 'fine';

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    gsap.set([cursor, follower], { xPercent: -50, yPercent: -50, x: cx, y: cy });

    let mouseX = cx;
    let mouseY = cy;
    let followerX = cx;
    let followerY = cy;
    let rafId = 0;
    let running = true;
    let hoverEl: Element | null = null;

    const setCursorX = gsap.quickSetter(cursor, 'x', 'px');
    const setCursorY = gsap.quickSetter(cursor, 'y', 'px');
    const setFollowerX = gsap.quickSetter(follower, 'x', 'px');
    const setFollowerY = gsap.quickSetter(follower, 'y', 'px');

    const followerLerp = 0.55;

    const onEnterInteractive = () => {
      gsap.to(follower, { scale: 2, borderColor: 'rgba(34,211,238,0.8)', duration: 0.2, overwrite: 'auto' });
      gsap.to(cursor, { scale: 0, duration: 0.2, overwrite: 'auto' });
    };

    const onLeaveInteractive = () => {
      gsap.to(follower, { scale: 1, borderColor: 'rgba(34,211,238,0.5)', duration: 0.2, overwrite: 'auto' });
      gsap.to(cursor, { scale: 1, duration: 0.2, overwrite: 'auto' });
    };

    const resolveHover = (x: number, y: number) => {
      const under = document.elementFromPoint(x, y);
      if (!under) return null;
      const hit = under.closest(INTERACTIVE_SELECTOR);
      if (!hit) return null;
      if (hit instanceof HTMLElement) {
        if (hit.getAttribute('aria-disabled') === 'true') return null;
        if (hit.closest('[inert]')) return null;
      }
      return hit;
    };

    const syncHover = () => {
      const next = resolveHover(mouseX, mouseY);
      if (next !== hoverEl) {
        if (hoverEl) onLeaveInteractive();
        hoverEl = next;
        if (hoverEl) onEnterInteractive();
      }
    };

    const tick = () => {
      if (!running) return;
      setCursorX(mouseX);
      setCursorY(mouseY);
      followerX += (mouseX - followerX) * followerLerp;
      followerY += (mouseY - followerY) * followerLerp;
      setFollowerX(followerX);
      setFollowerY(followerY);
      rafId = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      syncHover();
    };

    const onBlur = () => {
      if (hoverEl) onLeaveInteractive();
      hoverEl = null;
    };

    rafId = requestAnimationFrame(tick);
    document.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('blur', onBlur);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', onMove);
      window.removeEventListener('blur', onBlur);
      gsap.killTweensOf([cursor, follower]);
      if (hoverEl) onLeaveInteractive();
      hoverEl = null;
      document.documentElement.removeAttribute('data-custom-cursor');
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      <div ref={cursorRef} className="cursor" aria-hidden />
      <div ref={followerRef} className="cursor-follower" aria-hidden />
    </>
  );
}
