import { Link } from 'react-router-dom';
import RevealImage from './RevealImage';
import Reveal from './Reveal';
import { Arrow } from './Button';

/**
 * Portfolio tile. On hover (desktop): the photo slowly zooms, a soft shade rises
 * and project metadata slides up; the custom cursor becomes a "View" disc.
 * On touch devices the metadata is always visible beneath the image.
 */
export default function ProjectCard({ project, index, aspect = 'aspect-[4/5]', sizes = '(min-width: 768px) 50vw, 100vw', parallax = 0, headingLevel = 'h3' }) {
  const Heading = headingLevel;
  return (
    <article>
      <Link
        to={`/projects/${project.slug}`}
        className="group block"
        data-cursor="View"
        aria-label={`${project.title} — ${project.category}, ${project.location}`}
      >
        <RevealImage image={project.cover} className={aspect} sizes={sizes} parallax={parallax} hoverZoom>
          {/* Hover layer (desktop) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden flex-col justify-end bg-linear-to-t from-ink/70 via-ink/10 to-transparent p-6 text-bone opacity-0 transition-opacity duration-700 group-hover:opacity-100 lg:flex lg:p-8"
          >
            <div className="flex translate-y-4 items-end justify-between gap-6 transition-transform duration-700 group-hover:translate-y-0">
              <div>
                <p className="eyebrow text-sand">
                  {project.category} · {project.year}
                </p>
                <p className="mt-2 max-w-xs text-sm text-bone/85">{project.area}</p>
              </div>
              <span className="inline-flex items-center gap-3 eyebrow">
                View project <Arrow />
              </span>
            </div>
          </div>
        </RevealImage>

        <Reveal className="mt-5 flex items-start justify-between gap-6">
          <div className="flex items-baseline gap-4">
            {index != null && (
              <span className="font-display text-sm italic text-stone">{String(index + 1).padStart(2, '0')}</span>
            )}
            <div>
              <Heading className="display-sm transition-colors duration-500 group-hover:text-umber">{project.title}</Heading>
              <p className="meta-label mt-2">{project.category}</p>
            </div>
          </div>
          <p className="meta-label shrink-0 pt-1 text-right">{project.location}</p>
        </Reveal>
      </Link>
    </article>
  );
}
