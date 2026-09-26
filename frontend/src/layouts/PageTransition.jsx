import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE, EASE_IN_OUT } from '../animations/motion';

// The very first page render is covered by the preloader, so skip the curtain once.
let firstRender = true;

/**
 * Wraps every public page.
 * Navigating away: a charcoal curtain rises from the bottom and covers the old page.
 * Arriving:        the curtain continues upward and uncovers the new page, which fades in.
 * Reduced motion:  a simple, quick cross-fade.
 */
export default function PageTransition({ children }) {
  const reduce = useReducedMotion();
  // Read the flag once per mount (safe under StrictMode double-render), clear it after mount.
  const [skipIntro] = useState(() => firstRender);
  useEffect(() => {
    firstRender = false;
    // Deep links such as /services#architecture: scroll to the section once the page is in the DOM.
    const { hash } = window.location;
    if (!hash) return undefined;
    const t = setTimeout(() => {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: 'start' });
    }, 60);
    return () => clearTimeout(t);
  }, []);

  if (reduce) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
        {children}
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={skipIntro ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: 0.35 } }}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
      >
        {children}
      </motion.div>

      {/* Curtain that uncovers the incoming page (shrinks toward the top) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[70] flex origin-top items-center justify-center bg-charcoal"
        initial={skipIntro ? { scaleY: 0 } : { scaleY: 1 }}
        animate={{ scaleY: 0, transition: { duration: 0.75, ease: EASE_IN_OUT, delay: 0.05 } }}
        exit={{ scaleY: 0 }}
      />

      {/* Curtain that covers the outgoing page (grows from the bottom) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[70] flex origin-bottom items-center justify-center bg-charcoal"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1, transition: { duration: 0.55, ease: EASE_IN_OUT } }}
      >
        <span className="font-display text-xl tracking-[0.4em] text-bone/40">LUMORA</span>
      </motion.div>
    </>
  );
}
