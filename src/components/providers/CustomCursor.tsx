'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const INTERACTIVE_SELECTOR = 'a[href],button:not(:disabled),[data-cursor="pointer"]';


export default function CustomCursor() {
  const cursorRef    = useRef<HTMLDivElement>(null);
  const followerRef  = useRef<HTMLDivElement>(null);
  const labelRef     = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const mqFine   = window.matchMedia('(pointer: fine)');
    const mqHover  = window.matchMedia('(hover: hover)');
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

    const cursor   = cursorRef.current;
    const follower = followerRef.current;
    const label    = labelRef.current;
    if (!cursor || !follower || !label) {
      document.documentElement.removeAttribute('data-custom-cursor');
      return undefined;
    }

    document.documentElement.dataset.customCursor = 'fine';

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    gsap.set([cursor, follower], { xPercent: -50, yPercent: -50, x: cx, y: cy });

    let mouseX = cx, mouseY = cy;
    let followerX = cx, followerY = cy;
    let rafId = 0;
    let running = true;
    let hoverEl: Element | null = null;
    let currentLabel = '';

    const setCursorX   = gsap.quickSetter(cursor,   'x', 'px');
    const setCursorY   = gsap.quickSetter(cursor,   'y', 'px');
    const setFollowerX = gsap.quickSetter(follower, 'x', 'px');
    const setFollowerY = gsap.quickSetter(follower, 'y', 'px');

    // How much the follower lags behind — lower = more lag
    const followerLerp = 0.6;

    const showLabel = (text: string) => {
      if (currentLabel === text) return;
      currentLabel = text;
      if (label) {
        label.textContent = text;
        gsap.to(label, { opacity: text ? 1 : 0, scale: text ? 1 : 0.7, duration: 0.2 });
      }
    };

    const onEnterInteractive = (el: Element) => {
      // Check for a data-cursor-label on the element
      const labelText = (el as HTMLElement).dataset.cursorLabel ?? '';
      showLabel(labelText);
      gsap.to(follower, {
        scale: labelText ? 2.8 : 2.2,
        borderColor: 'rgba(34,211,238,0.9)',
        backgroundColor: labelText ? 'rgba(34,211,238,0.08)' : 'transparent',
        duration: 0.25,
        overwrite: 'auto',
      });
      gsap.to(cursor, { scale: 0, duration: 0.18, overwrite: 'auto' });
    };

    const onLeaveInteractive = () => {
      showLabel('');
      gsap.to(follower, {
        scale: 1,
        borderColor: 'rgba(34,211,238,0.5)',
        backgroundColor: 'transparent',
        duration: 0.25,
        overwrite: 'auto',
      });
      gsap.to(cursor, { scale: 1, duration: 0.18, overwrite: 'auto' });
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
        if (hoverEl) onEnterInteractive(hoverEl);
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

    // Hide cursor when it leaves the window
    const onLeave = () => {
      gsap.to([cursor, follower], { opacity: 0, duration: 0.2 });
    };
    const onEnter = () => {
      gsap.to([cursor, follower], { opacity: 1, duration: 0.2 });
    };

    rafId = requestAnimationFrame(tick);
    document.addEventListener('mousemove',  onMove,  { passive: true });
    document.addEventListener('mouseleave', onLeave, { passive: true });
    document.addEventListener('mouseenter', onEnter, { passive: true });
    window.addEventListener('blur', onBlur);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
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
      {/* Inner dot */}
      <div ref={cursorRef} className="cursor" aria-hidden />

      {/* Outer ring with optional text label */}
      <div ref={followerRef} className="cursor-follower flex items-center justify-center" aria-hidden>
        <span
          ref={labelRef}
          className="text-[8px] font-bold tracking-[0.2em] uppercase text-accent opacity-0 scale-75 select-none pointer-events-none"
          style={{ transform: 'scale(0.75)' }}
        />
      </div>
    </>
  );
}
