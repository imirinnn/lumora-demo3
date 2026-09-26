import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import SectionLabel from '../../components/SectionLabel';
import SplitText from '../../components/SplitText';
import Reveal from '../../components/Reveal';
import { process } from '../../data/content';
import { EASE, VIEWPORT } from '../../animations/motion';

/**
 * Five-stage process. A hairline "draws" down the timeline as you scroll,
 * and each stage lifts into place when it arrives.
 */
export default function Process({ number = '05' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.6'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 25, restDelta: 0.001 });

  return (
    <section className="section" aria-labelledby="process-heading">
      <div className="container-lux grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <SectionLabel number={number} className="mb-8 text-umber">Our Process</SectionLabel>
            <SplitText as="h2" id="process-heading" text={['Five calm steps', 'from idea to reveal.']} className="display-lg" />
            <Reveal className="mt-8 max-w-sm">
              <p className="text-stone">
                A clear structure, one point of contact and honest numbers at every stage — so the process feels as
                considered as the space itself.
              </p>
            </Reveal>
          </div>
        </div>

        <ol ref={ref} className="relative md:col-span-6 md:col-start-7">
          {/* Timeline track + progress */}
          <span aria-hidden="true" className="absolute bottom-4 left-[1.1rem] top-4 w-px bg-line" />
          <motion.span
            aria-hidden="true"
            className="absolute bottom-4 left-[1.1rem] top-4 w-px origin-top bg-charcoal"
            style={{ scaleY: reduce ? 1 : scaleY }}
          />

          {process.map((step, i) => (
            <motion.li
              key={step.number}
              className="relative grid grid-cols-[2.25rem_1fr] gap-6 pb-14 last:pb-0 sm:gap-10"
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
            >
              <span className="relative z-[1] flex h-9 w-9 items-center justify-center rounded-full border border-charcoal bg-bone font-display text-sm italic">
                {i + 1}
              </span>
              <div className="pt-0.5">
                <p className="meta-label">{step.number} —</p>
                <h3 className="mt-2 font-display text-[clamp(2rem,3.4vw,3.2rem)] font-light leading-none">{step.title}</h3>
                <p className="mt-4 text-lg font-light">{step.body}</p>
                <p className="mt-2 text-sm text-stone">{step.detail}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
