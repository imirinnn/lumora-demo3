import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { navLinks, site } from '../data/site';
import { EASE, EASE_IN_OUT } from '../animations/motion';
import { Arrow } from './Button';

const items = [{ label: 'Home', to: '/' }, ...navLinks, { label: 'Start a Project', to: '/start-a-project' }];

/**
 * Full-screen menu for phones & tablets: a charcoal curtain drops in, large serif links rise in sequence.
 * Locks page scroll, closes on Escape, and moves focus into the menu for keyboard / screen-reader users.
 */
export default function MobileMenu({ open, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    // Focus the first link once the panel is in place
    const t = setTimeout(() => panelRef.current?.querySelector('a')?.focus(), 350);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="on-dark fixed inset-0 z-40 flex flex-col bg-charcoal text-bone lg:hidden"
          initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.75, ease: EASE_IN_OUT } }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.6, ease: EASE_IN_OUT, delay: 0.1 } }}
        >
          <nav aria-label="Mobile" className="container-lux flex flex-1 flex-col justify-center pt-24">
            <ul className="space-y-1">
              {items.map((item, i) => (
                <li key={item.to + item.label} className="overflow-hidden">
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: '0%', transition: { duration: 0.8, ease: EASE, delay: 0.25 + i * 0.06 } }}
                    exit={{ y: '100%', transition: { duration: 0.35, ease: EASE } }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `group flex items-baseline gap-4 py-1 font-display text-[clamp(2.6rem,11vw,4.5rem)] font-light leading-[1.05] transition-colors duration-300 ${
                          isActive ? 'text-bone' : 'text-bone/60 hover:text-bone'
                        }`
                      }
                    >
                      <span className="text-[0.7rem] font-sans tracking-[0.2em] text-mist">0{i + 1}</span>
                      {item.label}
                    </NavLink>
                  </motion.div>
                </li>
              ))}
            </ul>
          </nav>

          <motion.div
            className="container-lux grid gap-6 border-t border-bone/10 py-8 text-sm text-mist sm:grid-cols-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.6, duration: 0.6 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <div>
              <p className="meta-label mb-2">Studio</p>
              <a href={`mailto:${site.email}`} className="block text-bone">{site.email}</a>
              <a href={site.phoneHref} className="block text-bone">{site.phone}</a>
            </div>
            <div className="flex flex-wrap items-end gap-x-6 gap-y-2 sm:justify-end">
              {site.social.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-bone">
                  {s.label} <Arrow className="-rotate-45" />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
