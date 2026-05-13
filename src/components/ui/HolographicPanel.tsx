'use client';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'gold' | 'blue';
  glow?: boolean;
  label?: string;
}

export default function HolographicPanel({
  children,
  className = '',
  variant = 'default',
  glow = false,
  label,
}: Props) {
  const variantCls =
    variant === 'gold' ? 'holo-panel--gold' :
    variant === 'blue' ? 'holo-panel--blue' : '';

  return (
    <div className={`holo-panel ${variantCls} ${glow ? 'holo-panel--glow' : ''} ${className}`}>
      {label && (
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px w-3 bg-gradient-to-r from-transparent to-white/25" />
          <span className="text-[7px] uppercase tracking-[0.45em] text-white/28">{label}</span>
          <div className="h-px flex-1 bg-gradient-to-r from-white/25 to-transparent" />
        </div>
      )}
      {children}
    </div>
  );
}
