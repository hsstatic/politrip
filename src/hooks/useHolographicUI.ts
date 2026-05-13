'use client';
import { useTransform, useSpring, MotionValue } from 'framer-motion';

export interface HoloUIState {
  gulf: { opacity: MotionValue<number>; y: MotionValue<number> };
  route: { opacity: MotionValue<number>; progress: MotionValue<number> };
  vip: { opacity: MotionValue<number>; x: MotionValue<number> };
  turkey: { opacity: MotionValue<number>; y: MotionValue<number> };
  cities: { opacity: MotionValue<number>; scale: MotionValue<number> };
  parallaxX: MotionValue<number>;
  transitionFade: MotionValue<number>;
}

export function useHolographicUI(scrollYProgress: MotionValue<number>): HoloUIState {
  const spring = useSpring(scrollYProgress, { stiffness: 100, damping: 22, restDelta: 0.001 });

  // Panels drift opposite camera movement (parallax depth illusion)
  const parallaxX = useTransform(spring, [0, 1], [0, -14]);

  // Panels become more transparent during fast camera transitions
  const transitionFade = useTransform(
    scrollYProgress,
    [0, 0.28, 0.38, 0.62, 0.72, 1],
    [1, 1, 0.5, 0.5, 1, 1]
  );

  // Gulf region panel: visible from load → 0.44
  const gulfOpacity = useTransform(scrollYProgress, [0, 0.30, 0.44], [1, 1, 0]);
  const gulfY = useTransform(spring, [0, 0.5], [0, -18]);

  // Travel route panel: visible 0.16 → 0.78
  const routeOpacity = useTransform(scrollYProgress, [0.16, 0.28, 0.66, 0.78], [0, 1, 1, 0]);
  const routeProgress = useTransform(scrollYProgress, [0.16, 0.78], [0, 1]);

  // VIP services panel: visible 0.38 → 0.78
  const vipOpacity = useTransform(scrollYProgress, [0.38, 0.48, 0.68, 0.78], [0, 1, 1, 0]);
  const vipX = useTransform(spring, [0.38, 0.52], [28, 0]);

  // Turkey region panel: visible 0.62 → 1.0
  const turkeyOpacity = useTransform(scrollYProgress, [0.62, 0.74, 1], [0, 1, 1]);
  const turkeyY = useTransform(spring, [0.6, 0.76], [20, 0]);

  // City highlight cards: visible 0.72 → 1.0
  const citiesOpacity = useTransform(scrollYProgress, [0.72, 0.84, 1], [0, 1, 1]);
  const citiesScale = useTransform(spring, [0.72, 0.86], [0.9, 1]);

  return {
    gulf: { opacity: gulfOpacity, y: gulfY },
    route: { opacity: routeOpacity, progress: routeProgress },
    vip: { opacity: vipOpacity, x: vipX },
    turkey: { opacity: turkeyOpacity, y: turkeyY },
    cities: { opacity: citiesOpacity, scale: citiesScale },
    parallaxX,
    transitionFade,
  };
}
