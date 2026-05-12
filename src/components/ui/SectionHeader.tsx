'use client';

import { motion } from 'framer-motion';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  align?: 'left' | 'center';
  light?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  light = false,
}: SectionHeaderProps) {
  const alignClass =
    align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      className={`flex flex-col ${alignClass} mb-10 md:mb-16`}
    >
      {/* Eyebrow */}
      <div className={`flex items-center gap-3 mb-3 md:mb-4 ${align === 'center' ? 'justify-center' : ''}`}>
        <div className="h-px w-8 md:w-10 bg-gradient-to-r from-transparent to-[#C9A96E]" />
        <span className="text-[9px] md:text-[10px] uppercase tracking-[4px] md:tracking-[5px] text-[#C9A96E] font-medium">
          {eyebrow}
        </span>
        <div className="h-px w-8 md:w-10 bg-gradient-to-l from-transparent to-[#C9A96E]" />
      </div>

      {/* Title */}
      <h2
        className={`text-[clamp(30px,6vw,56px)] font-black leading-tight mb-3 md:mb-4 ${
          light ? 'text-gradient-gold' : 'text-[rgba(245,240,232,0.95)]'
        }`}
        style={{ fontFamily: 'var(--font-display,serif)' }}
      >
        {title}
      </h2>

      {/* Subtitle */}
      <p className="text-[rgba(245,240,232,0.55)] text-sm md:text-base max-w-xl md:max-w-2xl leading-relaxed px-2 md:px-0">
        {subtitle}
      </p>
    </motion.div>
  );
}
