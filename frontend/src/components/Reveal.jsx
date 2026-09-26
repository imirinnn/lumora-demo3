import { motion, useReducedMotion } from 'framer-motion';
import { VIEWPORT, fadeUp } from '../animations/motion';

/**
 * Fades + lifts its children into place when scrolled into view.
 * Use sparingly: on blocks of content, not on every single element.
 */
export default function Reveal({ as = 'div', delay = 0, className = '', children, ...rest }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      variants={fadeUp}
      custom={delay}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={VIEWPORT}
      {...rest}
    >
      {children}
    </Tag>
  );
}
