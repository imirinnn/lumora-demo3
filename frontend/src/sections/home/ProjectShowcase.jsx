import SectionLabel from '../../components/SectionLabel';
import SplitText from '../../components/SplitText';
import ProjectCard from '../../components/ProjectCard';
import { TextLink } from '../../components/Button';
import { projects } from '../../data/projects';

/**
 * Editorial rhythm rather than a uniform grid:
 *   wide  →  two offset portraits  →  wide (inset)  →  two offset portraits (mirrored)
 */
const LAYOUT = [
  { cell: 'md:col-span-12', aspect: 'aspect-[4/5] sm:aspect-[16/9]', sizes: '100vw', parallax: 6 },
  { cell: 'md:col-span-7', aspect: 'aspect-[4/5]', sizes: '(min-width: 768px) 58vw, 100vw' },
  { cell: 'md:col-span-5 md:mt-40', aspect: 'aspect-[3/4]', sizes: '(min-width: 768px) 42vw, 100vw' },
  { cell: 'md:col-span-10 md:col-start-2', aspect: 'aspect-[4/5] sm:aspect-[16/10]', sizes: '(min-width: 768px) 83vw, 100vw', parallax: 5 },
  { cell: 'md:col-span-5 md:mt-24', aspect: 'aspect-[3/4]', sizes: '(min-width: 768px) 42vw, 100vw' },
  { cell: 'md:col-span-7', aspect: 'aspect-[4/5]', sizes: '(min-width: 768px) 58vw, 100vw' },
];

export default function ProjectShowcase({ items = projects, label = 'Selected Work', number = '03', showHeader = true }) {
  return (
    <section className="section" aria-labelledby="showcase-heading">
      <div className="container-lux">
        {showHeader && (
          <div className="mb-16 grid gap-8 md:mb-24 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <SectionLabel number={number} className="mb-8 text-umber">{label}</SectionLabel>
              <SplitText
                as="h2"
                id="showcase-heading"
                text={['A portfolio of quiet,', 'considered spaces.']}
                className="display-xl"
              />
            </div>
            <div className="md:col-span-4 md:text-right">
              <TextLink to="/projects">View all projects</TextLink>
            </div>
          </div>
        )}
        {!showHeader && <h2 id="showcase-heading" className="sr-only">{label}</h2>}

        <div className="grid gap-x-8 gap-y-16 md:grid-cols-12 md:gap-y-28">
          {items.map((project, i) => {
            const l = LAYOUT[i % LAYOUT.length];
            return (
              <div key={project.slug} className={l.cell}>
                <ProjectCard project={project} index={i} aspect={l.aspect} sizes={l.sizes} parallax={l.parallax || 0} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
