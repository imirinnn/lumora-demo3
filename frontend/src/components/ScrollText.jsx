import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <span className="relative inline-block">
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}

/**
 * A statement that "reads itself": each word brightens as the paragraph scrolls through the viewport.
 * Pure opacity, so it is cheap. Reduced-motion users just see the full text.
 */
export default function ScrollText({ text, as = 'p', className = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] });
  const Tag = as;
  const words = text.split(' ');

  if (reduce) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag ref={ref} className={`relative ${className}`}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <span key={i} aria-hidden="true">
            <Word progress={scrollYProgress} range={[start, end]}>
              {w}
            </Word>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </Tag>
  );
}
