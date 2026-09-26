import { motion, useReducedMotion } from 'framer-motion';
import { DURATION, EASE, VIEWPORT } from '../animations/motion';

/**
 * Editorial heading reveal: each word rises out of its own mask, staggered.
 *
 *   <SplitText as="h2" text={['We design interiors', 'that feel timeless.']} className="display-xl" />
 *
 * - `text` can be a string or an array of lines (each line is forced onto its own row).
 * - `trigger="view"` animates on scroll into view; `trigger="mount"` animates immediately,
 *    or when `play` becomes true (used by the hero after the preloader).
 * - Screen readers get the full sentence once from a visually-hidden copy; the split spans are aria-hidden.
 */
export default function SplitText({
  as = 'h2',
  text,
  className = '',
  delay = 0,
  stagger = 0.06,
  trigger = 'view',
  play = true,
  lineClassName = '',
  id,
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const lines = Array.isArray(text) ? text : [text];
  const label = lines.join(' ');

  let wordIndex = 0;

  const animateProps =
    trigger === 'view'
      ? { whileInView: 'show', viewport: VIEWPORT }
      : { animate: play ? 'show' : 'hidden' };

  return (
    <Tag id={id} className={className} initial={reduce ? false : 'hidden'} {...animateProps}>
      <span className="sr-only">{label}</span>
      {lines.map((line, li) => (
        <span key={li} aria-hidden="true" className={`block ${lineClassName}`}>
          {line.split(' ').map((word, wi, arr) => {
            const i = wordIndex++;
            return (
              <span key={wi} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-top">
                <motion.span
                  className="inline-block will-change-transform"
                  variants={{
                    hidden: { y: '105%' },
                    show: { y: '0%', transition: { duration: DURATION.slow, ease: EASE, delay: delay + i * stagger } },
                  }}
                >
                  {word}
                  {wi < arr.length - 1 ? ' ' : ''}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
