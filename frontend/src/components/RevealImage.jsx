import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Img from './Img';
import { VIEWPORT, clipReveal, imageSettle } from '../animations/motion';
import { useParallax } from '../animations/useParallax';

/**
 * Large editorial image with:
 *   - a clip-path wipe as it enters the viewport
 *   - the photo settling from a slight zoom
 *   - optional subtle scroll parallax (desktop only)
 *   - optional hover zoom when placed inside a `.group`
 *
 * Size/aspect is controlled by `className` (e.g. "aspect-[4/5]").
 */
export default function RevealImage({
  image,
  className = '',
  sizes = '100vw',
  parallax = 0,
  priority = false,
  hoverZoom = false,
  delay = 0,
  children,
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { y, enabled } = useParallax(ref, parallax);
  const hasParallax = parallax > 0 && enabled;

  return (
    <motion.div
      ref={ref}
      className={`frame ${className}`}
      variants={clipReveal}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={VIEWPORT}
      custom={delay}
    >
      <motion.div
        className="absolute inset-x-0"
        style={hasParallax ? { y, top: `-${parallax}%`, bottom: `-${parallax}%` } : { top: 0, bottom: 0 }}
      >
        <motion.div variants={imageSettle} custom={delay} className="h-full w-full">
          <Img image={image} sizes={sizes} priority={priority} className={hoverZoom ? 'zoom-img' : ''} />
        </motion.div>
      </motion.div>
      {children}
    </motion.div>
  );
}
