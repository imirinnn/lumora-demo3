import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import Logo from './Logo';
import Button from './Button';
import MobileMenu from './MobileMenu';
import { navLinks } from '../data/site';
import { EASE } from '../animations/motion';

// Routes that open with a full-bleed dark image, where the nav starts in light text.
const overImage = (pathname) => pathname === '/' || /^\/projects\/[^/]+$/.test(pathname);

export default function Navbar() {
  const { pathname } = useLocation();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 40);
    // Tuck the bar away while reading downward, bring it back on any upward scroll.
    const goingDown = y > lastY.current;
    setHidden(goingDown && y > 480 && !open);
    lastY.current = y;
  });

  // Close the menu and reset on navigation
  useEffect(() => {
    setOpen(false);
    setHidden(false);
  }, [pathname]);

  const light = overImage(pathname) && !scrolled && !open;

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,border-color,box-shadow] duration-700 ${
          scrolled && !open ? 'bg-bone/95 text-charcoal shadow-[0_1px_0_var(--color-line)] backdrop-blur-sm' : 'bg-transparent'
        } ${light || open ? 'on-dark text-bone' : 'text-charcoal'}`}
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <nav
          aria-label="Main"
          className={`container-lux flex items-center justify-between transition-[height] duration-700 ${scrolled ? 'h-[4.5rem]' : 'h-[5.5rem]'}`}
        >
          <Logo className="relative z-[2]" onClick={() => setOpen(false)} />

          <ul className="hidden items-center gap-10 lg:flex">
            {navLinks.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} className="link-u text-[0.78rem] font-medium uppercase tracking-[0.18em]">
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <Button to="/contact" variant={light ? 'outline-light' : 'outline'} magnetic className="min-h-[2.75rem] px-6 py-3">
              Start a Project
            </Button>
          </div>

          {/* Mobile / tablet menu toggle */}
          <button
            type="button"
            className="relative z-[2] -mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="relative block h-3 w-7">
              <motion.span
                className="absolute left-0 top-0 h-px w-full bg-current"
                animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              />
              <motion.span
                className="absolute bottom-0 left-0 h-px w-full bg-current"
                animate={open ? { y: -5, rotate: -45, width: '100%' } : { y: 0, rotate: 0, width: '70%' }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            </span>
          </button>
        </nav>
      </motion.header>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
