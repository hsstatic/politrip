'use client';

import { useRef, useState, useCallback, type ReactNode } from 'react';

interface CardSliderProps {
  children: ReactNode[];
  /** Tailwind grid class for desktop, e.g. "lg:grid-cols-3" */
  desktopCols?: string;
  /** Extra classes on the wrapper */
  className?: string;
}

export default function CardSlider({
  children,
  desktopCols = 'md:grid-cols-2 lg:grid-cols-3',
  className = '',
}: CardSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = children.length;

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement;
    if (!first) return;
    const idx = Math.round(el.scrollLeft / (first.offsetWidth + 16)); // 16 = gap-4
    setActive(Math.min(Math.max(idx, 0), count - 1));
  }, [count]);

  const scrollTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement;
    el.scrollTo({ left: i * (first.offsetWidth + 16), behavior: 'smooth' });
    setActive(i);
  };

  const prev = () => scrollTo(Math.max(active - 1, 0));
  const next = () => scrollTo(Math.min(active + 1, count - 1));

  return (
    <div className={className}>
      {/* ── Mobile: horizontal snap slider ─────────────────── */}
      <div className={`md:hidden`}>
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="slider-track -mx-6 px-6 gap-4"
        >
          {children.map((child, i) => (
            <div
              key={i}
              className="slider-item"
              style={{ width: 'min(82vw, 340px)' }}
            >
              {child}
            </div>
          ))}
        </div>

        {/* Dots + arrows */}
        <div className="flex items-center justify-center gap-3 mt-5">
          <button
            onClick={prev}
            disabled={active === 0}
            className="w-8 h-8 rounded-full glass border border-[rgba(201,169,110,0.2)] flex items-center justify-center text-[rgba(201,169,110,0.6)] disabled:opacity-30 transition-opacity"
            aria-label="Previous"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex gap-2 items-center">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Slide ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === active ? 24 : 8,
                  height: 8,
                  background: i === active ? '#C9A96E' : 'rgba(201,169,110,0.25)',
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={active === count - 1}
            className="w-8 h-8 rounded-full glass border border-[rgba(201,169,110,0.2)] flex items-center justify-center text-[rgba(201,169,110,0.6)] disabled:opacity-30 transition-opacity"
            aria-label="Next"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Desktop: grid ───────────────────────────────────── */}
      <div className={`hidden md:grid ${desktopCols} gap-6`}>
        {children}
      </div>
    </div>
  );
}
