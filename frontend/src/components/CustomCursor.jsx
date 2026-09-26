import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useIsDesktopPointer } from '../hooks/useMediaQuery';

/**
 * A soft follower ring for desktop mouse users. The native cursor stays visible
 * (better for accessibility); the ring trails it and expands into a labelled disc
 * over anything marked `data-cursor="View"`.
 * Not rendered on touch devices, small screens or with reduced motion.
 */
export default function CustomCursor() {
  const desktop = useIsDesktopPointer();
  const reduce = useReducedMotion();
  const enabled = desktop && !reduce;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });
  const [label, setLabel] = useState(null);
  const [hoverLink, setHoverLink] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };
    const over = (e) => {
      const target = e.target instanceof Element ? e.target : null;
      const labelled = target?.closest('[data-cursor]');
      setLabel(labelled ? labelled.getAttribute('data-cursor') : null);
      setHoverLink(!labelled && !!target?.closest('a, button, [role="button"], label'));
    };
    const leave = () => setVisible(false);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [enabled, visible, x, y]);

  if (!enabled) return null;

  const size = label ? 92 : hoverLink ? 44 : 26;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[80]"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${
          label ? 'bg-charcoal text-bone' : 'border border-charcoal/40'
        }`}
        animate={{ width: size, height: size, opacity: visible ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        style={{ mixBlendMode: label ? 'normal' : 'difference', borderColor: label ? undefined : 'rgba(244,239,231,.75)' }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              className="eyebrow text-[0.62rem]"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.25 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
