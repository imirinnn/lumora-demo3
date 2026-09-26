import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { navLinks, site } from '../data/site';
import { projects } from '../data/projects';
import { Arrow } from './Button';
import { EASE } from '../animations/motion';

export default function Footer() {
  const reduce = useReducedMotion();
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark relative overflow-hidden bg-ink text-bone">
      <div className="container-lux pt-20 sm:pt-28">
        <div className="grid gap-14 border-b border-bone/10 pb-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="display-md max-w-md text-bone">Spaces that feel like you.</p>
            <a
              href={`mailto:${site.email}`}
              className="link-u mt-8 inline-block font-display text-2xl italic text-sand sm:text-3xl"
            >
              {site.email}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-7">
            <div>
              <p className="meta-label mb-5">Studio</p>
              <ul className="space-y-3 text-sm">
                {navLinks.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="link-u text-bone/85 hover:text-bone">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="meta-label mb-5">Selected work</p>
              <ul className="space-y-3 text-sm">
                {projects.slice(0, 4).map((p) => (
                  <li key={p.slug}>
                    <Link to={`/projects/${p.slug}`} className="link-u text-bone/85 hover:text-bone">{p.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="meta-label mb-5">Visit</p>
              <address className="space-y-1 text-sm not-italic text-bone/85">
                {site.address.map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
                <a href={site.phoneHref} className="link-u mt-3 inline-block">{site.phone}</a>
              </address>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {site.social.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-bone/85 hover:text-bone">
                      {s.label} <Arrow className="h-2.5 w-3 -rotate-45" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-8 text-xs text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {site.name}. All rights reserved.</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
            className="inline-flex items-center gap-2 self-start uppercase tracking-[0.2em] text-bone/80 hover:text-bone sm:self-auto"
          >
            Back to top <Arrow className="-rotate-90" />
          </button>
        </div>
      </div>

      {/* Oversized wordmark, cropped by the bottom edge */}
      <div className="pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <motion.p
          className="whitespace-nowrap text-center font-display text-[21vw] font-light leading-[0.8] tracking-[0.02em] text-bone/[0.06]"
          initial={reduce ? false : { y: '40%' }}
          whileInView={{ y: '18%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: EASE }}
        >
          LUMORA
        </motion.p>
      </div>
    </footer>
  );
}
