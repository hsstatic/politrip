'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    gsap.set([cursor, follower], { xPercent: -50, yPercent: -50, x: cx, y: cy });

    let mouseX = cx;
    let mouseY = cy;
    let followerX = cx;
    let followerY = cy;
    let rafId = 0;

    const setCursorX = gsap.quickSetter(cursor, 'x', 'px');
    const setCursorY = gsap.quickSetter(cursor, 'y', 'px');
    const setFollowerX = gsap.quickSetter(follower, 'x', 'px');
    const setFollowerY = gsap.quickSetter(follower, 'y', 'px');

    /** Lerp per frame; higher = snappier (0.55 ≈ tight follow at 60fps) */
    const followerLerp = 0.55;

    const tick = () => {
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
    };

    rafId = requestAnimationFrame(tick);
    document.addEventListener('mousemove', onMove);

    const onEnterLink = () => {
      gsap.to(follower, { scale: 2, borderColor: 'rgba(201,169,110,0.8)', duration: 0.2, overwrite: 'auto' });
      gsap.to(cursor, { scale: 0, duration: 0.2, overwrite: 'auto' });
    };

    const onLeaveLink = () => {
      gsap.to(follower, { scale: 1, borderColor: 'rgba(201,169,110,0.5)', duration: 0.2, overwrite: 'auto' });
      gsap.to(cursor, { scale: 1, duration: 0.2, overwrite: 'auto' });
    };

    const links = document.querySelectorAll('a, button, [data-cursor="pointer"]');
    links.forEach((link) => {
      link.addEventListener('mouseenter', onEnterLink);
      link.addEventListener('mouseleave', onLeaveLink);
    });

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', onMove);
      links.forEach((link) => {
        link.removeEventListener('mouseenter', onEnterLink);
        link.removeEventListener('mouseleave', onLeaveLink);
      });
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  );
}
