import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { EASE, EASE_IN_OUT } from '../animations/motion';

const LETTERS = 'LUMORA'.split('');

/**
 * Brief branded intro shown once per browser session (~1.6s).
 * Letters rise, a hairline fills, then the panel lifts away like a curtain.
 * Calls `onDone` as the curtain starts to lift so the hero can begin its entrance underneath.
 */
export default function Preloader({ onDone }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const DURATION = 1200;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <motion.div
      className="on-dark fixed inset-0 z-[90] flex flex-col items-center justify-center bg-charcoal text-bone"
      initial={{ y: 0 }}
      exit={{ y: '-100%', transition: { duration: 0.9, ease: EASE_IN_OUT } }}
      role="status"
      aria-label="Loading Lumora Interiors"
    >
      <div className="flex overflow-hidden font-display text-5xl font-light tracking-[0.35em] sm:text-7xl" aria-hidden="true">
        {LETTERS.map((l, i) => (
          <motion.span
            key={i}
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.06 }}
          >
            {l}
          </motion.span>
        ))}
      </div>
      <div className="mt-10 flex w-48 items-center gap-4 sm:w-64" aria-hidden="true">
        <div className="relative h-px flex-1 bg-bone/15">
          <div className="absolute inset-y-0 left-0 w-full origin-left bg-sand" style={{ transform: `scaleX(${count / 100})` }} />
        </div>
        <span className="w-8 text-right text-[0.7rem] tabular-nums tracking-widest text-mist">{count}</span>
      </div>
    </motion.div>
  );
}
