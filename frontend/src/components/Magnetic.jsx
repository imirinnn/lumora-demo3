import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { useIsDesktopPointer } from '../hooks/useMediaQuery';

/**
 * Pulls its child gently toward the pointer on hover (desktop mouse only).
 * `strength` is the fraction of the pointer offset applied (0.25 = subtle).
 */
export default function Magnetic({ children, strength = 0.25, className = '' }) {
  const ref = useRef(null);
  const desktop = useIsDesktopPointer();
  const reduce = useReducedMotion();
  const enabled = desktop && !reduce;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  if (!enabled) return <span className={`inline-flex ${className}`}>{children}</span>;

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      className={`inline-flex ${className}`}
    >
      {children}
    </motion.span>
  );
}
