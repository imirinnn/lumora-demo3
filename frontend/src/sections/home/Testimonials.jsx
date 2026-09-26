import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import SectionLabel from '../../components/SectionLabel';
import Reveal from '../../components/Reveal';
import { Arrow } from '../../components/Button';
import { testimonials } from '../../data/content';
import { EASE } from '../../animations/motion';

const INTERVAL = 8000;

/**
 * One quote at a time, cross-fading. Auto-advances slowly, pauses on hover/focus,
 * and never auto-advances for reduced-motion users.
 */
export default function Testimonials({ number = '06' }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userDriven, setUserDriven] = useState(false);
  const autoplay = !reduce && !paused && !userDriven;
  const t = testimonials[index];

  const go = useCallback((dir) => {
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (!autoplay) return undefined;
    const id = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(id);
  }, [autoplay, index, go]);

  const manual = (dir) => {
    setUserDriven(true);
    go(dir);
  };

  return (
    <section
      className="section overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container-lux grid gap-12 md:grid-cols-12">
        <div className="md:col-span-3">
          <SectionLabel number={number} className="text-umber">Kind Words</SectionLabel>
        </div>

        <div className="md:col-span-9">
          <Reveal>
            <span aria-hidden="true" className="block font-display text-[7rem] leading-[0.5] text-clay/60">“</span>
          </Reveal>

          <div className="relative mt-4 min-h-[19rem] sm:min-h-[16rem] lg:min-h-[14rem]" aria-live={userDriven ? 'polite' : 'off'}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={index}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
                transition={{ duration: 0.7, ease: EASE }}
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${testimonials.length}`}
              >
                <blockquote className="font-display text-[clamp(1.6rem,3.1vw,2.9rem)] font-light italic leading-[1.2] text-charcoal">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="text-sm font-medium tracking-wide">{t.name}</span>
                  <span className="meta-label">{t.role}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="hairline mt-12 flex items-center justify-between gap-6 border-t pt-6">
            <div className="flex items-center gap-5">
              <span className="font-display text-lg tabular-nums">
                {String(index + 1).padStart(2, '0')}
                <span className="text-stone"> / {String(testimonials.length).padStart(2, '0')}</span>
              </span>
              {/* Slow progress line while auto-playing */}
              <span aria-hidden="true" className="relative hidden h-px w-28 overflow-hidden bg-line sm:block">
                {autoplay && (
                  <motion.span
                    key={index}
                    className="absolute inset-0 origin-left bg-charcoal"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
                  />
                )}
              </span>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => manual(-1)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-line transition-colors duration-500 hover:border-charcoal hover:bg-charcoal hover:text-bone"
                aria-label="Previous testimonial"
              >
                <Arrow className="rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => manual(1)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-line transition-colors duration-500 hover:border-charcoal hover:bg-charcoal hover:text-bone"
                aria-label="Next testimonial"
              >
                <Arrow />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
