'use client';

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export default function GlassCard({ children, className = '', tilt = true, glow = true, onClick }: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={tilt ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : {}}
      whileHover={glow ? { boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(201,169,110,0.15)' } : {}}
      transition={{ duration: 0.3 }}
      className={`glass rounded-2xl border border-[rgba(201,169,110,0.15)] overflow-hidden ${onClick ? 'cursor-none' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
