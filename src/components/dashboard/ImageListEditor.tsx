'use client';

import { useState } from 'react';
import { useDashLang } from '@/lib/dashboardI18n';

interface ImageListEditorProps {
  images: string[];
  onChange: (imgs: string[]) => void;
}

const inputCls = 'flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-cyan-500/50 transition-colors';

export default function ImageListEditor({ images, onChange }: ImageListEditorProps) {
  const { labels } = useDashLang();
  const [slideIdx, setSlideIdx] = useState(0);

  const validImages = images.filter(Boolean);
  const clampedIdx = validImages.length > 0 ? Math.min(slideIdx, validImages.length - 1) : 0;

  function prev() {
    setSlideIdx((i) => (i <= 0 ? validImages.length - 1 : i - 1));
  }

  function next() {
    setSlideIdx((i) => (i >= validImages.length - 1 ? 0 : i + 1));
  }

  function updateUrl(index: number, value: string) {
    const next = [...images];
    next[index] = value;
    onChange(next);
  }

  function removeUrl(index: number) {
    const next = images.filter((_, i) => i !== index);
    onChange(next);
    setSlideIdx((prev) => Math.min(prev, Math.max(0, next.filter(Boolean).length - 1)));
  }

  function addUrl() {
    onChange([...images, '']);
  }

  return (
    <div className="space-y-3">
      {/* Slider preview */}
      <div className="relative h-44 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
        {validImages.length === 0 ? (
          <p className="text-white/25 text-sm">{labels.common.noImages}</p>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={validImages[clampedIdx]}
              src={validImages[clampedIdx]}
              alt={`Preview ${clampedIdx + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.15'; }}
            />
            {validImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors text-sm"
                  aria-label="Previous"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors text-sm"
                  aria-label="Next"
                >
                  ›
                </button>
                <span className="absolute bottom-2 right-3 text-xs text-white/70 bg-black/40 px-2 py-0.5 rounded-full">
                  {labels.common.imageOf(clampedIdx + 1, validImages.length)}
                </span>
              </>
            )}
          </>
        )}
      </div>

      {/* URL inputs */}
      <div className="space-y-2">
        {images.map((url, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              className={inputCls}
              type="url"
              value={url}
              onChange={(e) => updateUrl(i, e.target.value)}
              onFocus={() => { if (url) setSlideIdx(validImages.indexOf(url)); }}
              placeholder="https://..."
            />
            <button
              type="button"
              onClick={() => removeUrl(i)}
              className="w-8 h-8 flex items-center justify-center text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
              aria-label="Remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addUrl}
        className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        {labels.common.addImage}
      </button>
    </div>
  );
}
