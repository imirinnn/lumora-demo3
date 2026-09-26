import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Img from '../../components/Img';
import SplitText from '../../components/SplitText';
import Button from '../../components/Button';
import { images } from '../../data/images';
import { EASE, EASE_IN_OUT } from '../../animations/motion';
import { useIntroDone } from '../../layouts/IntroContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export default function Hero() {
  const ref = useRef(null);
  const ready = useIntroDone();
  const reduce = useReducedMotion();
  const wide = useMediaQuery('(min-width: 768px)');
  const parallax = wide && !reduce;

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], parallax ? ['0%', '18%'] : ['0%', '0%']);
  const contentY = useTransform(scrollYProgress, [0, 1], parallax ? ['0%', '-22%'] : ['0%', '0%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], parallax ? [1, 0] : [1, 1]);

  const fadeIn = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease: EASE, delay },
  });

  return (
    <section ref={ref} className="on-dark relative h-[100svh] min-h-[620px] overflow-hidden bg-ink text-bone" aria-label="Introduction">
      {/* Image: clip-path reveal from a smaller frame, then slow settle + scroll parallax */}
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { clipPath: 'inset(14% 10% 14% 10%)' }}
        animate={ready ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
        transition={{ duration: 1.6, ease: EASE_IN_OUT }}
      >
        <motion.div className="absolute inset-0" style={{ y: imgY }}>
          <motion.div
            className="h-full w-full"
            initial={reduce ? false : { scale: 1.25 }}
            animate={ready ? { scale: 1.06 } : undefined}
            transition={{ duration: 2.4, ease: EASE }}
          >
            <Img image={images.hero} priority sizes="100vw" width={2200} height={1400} />
          </motion.div>
        </motion.div>
        {/* Legibility wash — stronger at the bottom where the type sits */}
        <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/30 to-ink/35" />
      </motion.div>

      <motion.div
        className="container-lux relative flex h-full flex-col justify-end pb-10 pt-32 sm:pb-14"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.p className="eyebrow mb-6 text-sand sm:mb-8" {...fadeIn(0.9)}>
          Interior Design &amp; Architecture Studio
        </motion.p>

        <SplitText
          as="h1"
          trigger="mount"
          play={reduce || ready}
          delay={0.55}
          stagger={0.07}
          text={wide ? ['Spaces that', 'feel like you.'] : ['Spaces', 'that feel', 'like you.']}
          className="display-hero"
        />

        <div className="mt-10 grid gap-8 border-t border-bone/20 pt-8 md:mt-14 lg:grid-cols-12 lg:items-end">
          <motion.p className="lead max-w-md text-bone/85 lg:col-span-5" {...fadeIn(1.2)}>
            Thoughtful interiors shaped by architecture, material and light.
          </motion.p>

          <motion.div className="flex flex-col gap-3 sm:flex-row lg:col-span-7 lg:justify-end" {...fadeIn(1.35)}>
            <Button to="/projects" variant="light" magnetic className="w-full sm:w-auto">
              Explore Our Work
            </Button>
            <Button to="/contact" variant="outline-light" magnetic className="w-full sm:w-auto">
              Start a Project
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden="true"
        className="absolute right-[var(--gutter)] top-[38%] hidden flex-col items-center gap-3 xl:flex"
        {...fadeIn(1.6)}
      >
        <span className="eyebrow text-[0.6rem] text-bone/70 [writing-mode:vertical-rl]">Scroll</span>
        <span className="relative h-14 w-px overflow-hidden bg-bone/20">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-bone"
            animate={reduce ? undefined : { y: ['-100%', '200%'] }}
            transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.4 }}
          />
        </span>
      </motion.div>
    </section>
  );
}
