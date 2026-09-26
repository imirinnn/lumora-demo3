import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import SectionLabel from '../../components/SectionLabel';
import SplitText from '../../components/SplitText';
import Reveal from '../../components/Reveal';
import Img from '../../components/Img';
import { Arrow } from '../../components/Button';
import { services } from '../../data/content';
import { useIsDesktopPointer } from '../../hooks/useMediaQuery';
import { EASE } from '../../animations/motion';

/**
 * Services as an editorial index. On desktop, hovering a row reveals a
 * floating preview image that trails the pointer.
 */
export default function ServicesList() {
  const listRef = useRef(null);
  const desktop = useIsDesktopPointer();
  const reduce = useReducedMotion();
  const floating = desktop && !reduce;
  const [active, setActive] = useState(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 150, damping: 20, mass: 0.6 });

  const onMove = (e) => {
    const r = listRef.current.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  return (
    <section className="on-dark section bg-charcoal text-bone" aria-labelledby="services-heading">
      <div className="container-lux">
        <div className="mb-16 grid gap-8 md:mb-24 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionLabel number="04" className="mb-8 text-sand">What We Do</SectionLabel>
            <SplitText as="h2" id="services-heading" text={['Design, from the', 'plan to the last detail.']} className="display-xl" />
          </div>
          <Reveal className="md:col-span-4 md:col-start-9">
            <p className="text-mist">
              One studio for architecture, interiors and styling — so the idea that starts on the first sketch is still
              there when you move in.
            </p>
          </Reveal>
        </div>

        <div ref={listRef} className="relative" onPointerMove={floating ? onMove : undefined} onPointerLeave={() => setActive(null)}>
          <ul className="hairline border-t">
            {services.map((s, i) => (
              <li key={s.id} className="hairline border-b">
                <Link
                  to={`/services#${s.id}`}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(null)}
                  className="group grid grid-cols-12 items-baseline gap-4 py-8 md:py-10"
                >
                  <span className="col-span-2 font-display text-lg italic text-mist md:col-span-1">{s.number}</span>
                  <h3 className="col-span-10 font-display text-[clamp(1.9rem,4.2vw,4rem)] font-light leading-none transition-transform duration-700 group-hover:translate-x-3 md:col-span-6">
                    {s.title}
                  </h3>
                  <p className="col-span-10 col-start-3 text-mist md:col-span-4 md:col-start-auto">{s.short}</p>
                  <span className="hidden justify-end text-sand opacity-50 transition-opacity duration-500 group-hover:opacity-100 md:col-span-1 md:flex">
                    <Arrow className="h-4 w-5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {floating && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 z-10"
              style={{ x: sx, y: sy }}
            >
              <AnimatePresence>
                {active !== null && (
                  <motion.div
                    key={active}
                    className="frame absolute h-[300px] w-[240px]"
                    initial={{ opacity: 0, scale: 0.85, clipPath: 'inset(20% 20% 20% 20%)' }}
                    animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    style={{ left: 0, top: 0, x: '-50%', y: '-50%' }}
                  >
                    <Img image={services[active].image} sizes="240px" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
