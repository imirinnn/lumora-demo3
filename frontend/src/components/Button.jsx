import { Link } from 'react-router-dom';
import Magnetic from './Magnetic';

export function Arrow({ className = '' }) {
  return (
    <svg className={`btn-arrow h-3 w-4 ${className}`} viewBox="0 0 16 12" fill="none" aria-hidden="true">
      <path d="M0 6h14M9.5 1 15 6l-5.5 5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/**
 * Pill button as a router link (or <button> when `to` is omitted).
 * variant: dark | outline | light | outline-light
 */
export default function Button({ to, variant = 'dark', magnetic = false, arrow = true, className = '', children, ...rest }) {
  const cls = `btn btn-${variant} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {arrow && <Arrow />}
    </>
  );

  const el = to ? (
    <Link to={to} className={cls} {...rest}>
      {content}
    </Link>
  ) : (
    <button type="button" className={cls} {...rest}>
      {content}
    </button>
  );

  // Width utilities (e.g. "w-full sm:w-auto") must also apply to the magnetic wrapper.
  const widths = className.split(' ').filter((c) => /(^|:)w-/.test(c)).join(' ');
  return magnetic ? <Magnetic className={widths}>{el}</Magnetic> : el;
}

/** Understated text link with an animated underline and arrow. */
export function TextLink({ to, children, className = '', ...rest }) {
  return (
    <Link to={to} className={`group inline-flex items-center gap-3 eyebrow ${className}`} {...rest}>
      <span className="link-u">{children}</span>
      <Arrow className="transition-transform duration-500 group-hover:translate-x-1" />
    </Link>
  );
}
