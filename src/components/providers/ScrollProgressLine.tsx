'use client';

import { useScroll, useSpring, motion } from 'framer-motion';

export default function ScrollProgressLine() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[200] origin-left pointer-events-none"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, transparent, #22d3ee 30%, #67e8f9 70%, transparent)',
        boxShadow: '0 0 8px rgba(34,211,238,0.6)',
      }}
      aria-hidden
    />
  );
}
