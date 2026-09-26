/**
 * Shared motion language for the whole site.
 * One easing curve and a small set of durations keep every animation feeling related.
 * All effects animate only `transform`, `opacity` or `clip-path` (GPU-friendly, no layout thrash).
 */

export const EASE = [0.22, 1, 0.36, 1]; // soft "expo out" — confident start, long gentle settle
export const EASE_IN_OUT = [0.76, 0, 0.24, 1]; // used for curtains / page wipes

export const DURATION = {
  fast: 0.45,
  base: 0.8,
  slow: 1.2,
  reveal: 1.4,
};

/** Default viewport trigger for scroll reveals: fire once, slightly before fully in view. */
export const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' };

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE, delay },
  }),
};

export const fade = {
  hidden: { opacity: 0 },
  show: (delay = 0) => ({ opacity: 1, transition: { duration: DURATION.base, ease: EASE, delay } }),
};

/** Parent that staggers its children's `hidden → show` */
export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** A line of text rising out of a mask (the mask is an overflow-hidden wrapper) */
export const lineRise = {
  hidden: { y: '110%' },
  show: (delay = 0) => ({ y: '0%', transition: { duration: DURATION.slow, ease: EASE, delay } }),
};

/** Image revealed by a clip-path wipe from the bottom edge */
export const clipReveal = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
  show: (delay = 0) => ({
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: DURATION.reveal, ease: EASE_IN_OUT, delay },
  }),
};

/** The image inside a clip reveal settles from a slight zoom */
export const imageSettle = {
  hidden: { scale: 1.18 },
  show: (delay = 0) => ({ scale: 1, transition: { duration: DURATION.reveal + 0.4, ease: EASE, delay } }),
};
