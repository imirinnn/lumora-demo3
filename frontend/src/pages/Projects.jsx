import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import PageTransition from '../layouts/PageTransition';
import Seo from '../components/Seo';
import PageHeader from '../components/PageHeader';
import ProjectCard from '../components/ProjectCard';
import ConsultationCTA from '../sections/ConsultationCTA';
import { CATEGORIES, projects } from '../data/projects';
import { EASE } from '../animations/motion';

const FILTERS = ['All', ...CATEGORIES];

// Alternating editorial layout that still works when a filter leaves 1–4 items.
const cellFor = (i) =>
  [
    { cell: 'md:col-span-7', aspect: 'aspect-[4/5]' },
    { cell: 'md:col-span-5 md:mt-32', aspect: 'aspect-[3/4]' },
    { cell: 'md:col-span-5', aspect: 'aspect-[3/4]' },
    { cell: 'md:col-span-7 md:mt-32', aspect: 'aspect-[4/5]' },
  ][i % 4];

export default function Projects() {
  const [params, setParams] = useSearchParams();
  const reduce = useReducedMotion();
  const active = FILTERS.includes(params.get('category')) ? params.get('category') : 'All';

  const list = useMemo(() => (active === 'All' ? projects : projects.filter((p) => p.category === active)), [active]);

  const setFilter = (f) => {
    if (f === 'All') setParams({}, { replace: true });
    else setParams({ category: f }, { replace: true });
  };

  return (
    <PageTransition>
      <Seo
        title="Projects"
        description="Selected residential, commercial and hospitality interiors by Lumora Interiors — homes, offices and retreats across India."
        path="/projects"
      />

      <PageHeader
        eyebrow={`Portfolio — ${projects.length} projects`}
        title={['Selected', 'work.']}
        intro="Homes, workplaces and places to stay — each shaped around the people who use it, the site it sits on and the light it receives."
      />

      <section className="container-lux pb-28 sm:pb-40" aria-label="Project list">
        {/* Filters */}
        <div className="hairline mb-14 flex items-center justify-between gap-6 border-y py-5 sm:mb-20">
          <div role="group" aria-label="Filter projects by category" className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 sm:gap-3">
            {FILTERS.map((f) => {
              const count = f === 'All' ? projects.length : projects.filter((p) => p.category === f).length;
              const on = f === active;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(f)}
                  className={`relative shrink-0 rounded-full px-4 py-2 text-sm transition-colors duration-500 ${on ? 'text-bone' : 'text-charcoal hover:text-umber'}`}
                >
                  {on && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-charcoal"
                      transition={{ duration: 0.5, ease: EASE }}
                    />
                  )}
                  <span className="relative">
                    {f} <sup className="ml-0.5 text-[0.6rem] opacity-60">{count}</sup>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="meta-label hidden sm:block" aria-live="polite">
            Showing {list.length} {list.length === 1 ? 'project' : 'projects'}
          </p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            className="grid gap-x-8 gap-y-16 md:grid-cols-12 md:gap-y-24"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {list.map((p, i) => {
              const l = cellFor(i);
              return (
                <div key={p.slug} className={l.cell}>
                  <ProjectCard project={p} index={projects.indexOf(p)} aspect={l.aspect} headingLevel="h2" />
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </section>

      <ConsultationCTA />
    </PageTransition>
  );
}
