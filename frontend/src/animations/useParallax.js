import { useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useMediaQuery } from '../hooks/useMediaQuery';

/**
 * Subtle scroll parallax for an element inside `targetRef`.
 * Returns a MotionValue for `y` (in %). Disabled on small screens and for
 * reduced-motion users, where it simply returns 0.
 *
 *   const ref = useRef(null);
 *   const y = useParallax(ref, 12);
 *   <div ref={ref} className="frame"><motion.img style={{ y, scale: 1.15 }} /></div>
 */
export function useParallax(targetRef, distance = 10) {
  const reduce = useReducedMotion();
  const wide = useMediaQuery('(min-width: 768px)');
  const enabled = wide && !reduce;

  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], enabled ? [`-${distance}%`, `${distance}%`] : ['0%', '0%']);
  return { y, enabled, scrollYProgress };
}
