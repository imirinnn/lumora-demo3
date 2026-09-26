import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE } from '../animations/motion';

/** Accessible accordion (button + region) with a smooth height reveal. */
export default function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  const baseId = useId();

  return (
    <div className="hairline border-t">
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${baseId}-btn-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={item.q} className="hairline border-b">
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="group flex w-full items-center justify-between gap-6 py-7 text-left"
              >
                <span className="font-display text-[clamp(1.35rem,2.2vw,1.9rem)] font-normal leading-tight transition-colors duration-500 group-hover:text-umber">
                  {item.q}
                </span>
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line" aria-hidden="true">
                  <span className="absolute h-px w-3.5 bg-current" />
                  <motion.span
                    className="absolute h-3.5 w-px bg-current"
                    animate={{ scaleY: isOpen ? 0 : 1 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-8 text-stone">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
