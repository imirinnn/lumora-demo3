import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import SplitText from '../components/SplitText';
import Reveal from '../components/Reveal';
import Button from '../components/Button';
import { site } from '../data/site';

/** Closing call-to-action used at the end of most pages. */
export default function ConsultationCTA() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  // The panel "opens" slightly as it scrolls in — a subtle widening of the dark field.
  const inset = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['4%', '0%']);
  const clipPath = useTransform(inset, (v) => `inset(0% ${v} 0% ${v} round 0px)`);

  return (
    <section ref={ref} aria-labelledby="cta-heading" className="relative bg-ink">
      <motion.div className="on-dark bg-charcoal text-bone" style={{ clipPath }}>
        <div className="container-lux py-28 text-center sm:py-40">
          <Reveal>
            <p className="eyebrow text-sand">Start a conversation</p>
          </Reveal>
          <SplitText
            as="h2"
            id="cta-heading"
            text={["Let's create", 'something beautiful.']}
            className="display-xl mx-auto mt-8 max-w-[16ch] uppercase"
          />
          <Reveal delay={0.2} className="mx-auto mt-10 max-w-xl">
            <p className="lead text-mist">Tell us about your space, your ideas and what you want it to become.</p>
          </Reveal>
          <Reveal delay={0.3} className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Button to="/contact" variant="light" magnetic>
              Start a Project
            </Button>
            <a href={site.phoneHref} className="link-u eyebrow text-bone/80 hover:text-bone">
              Or call {site.phone}
            </a>
          </Reveal>
        </div>
      </motion.div>
    </section>
  );
}
