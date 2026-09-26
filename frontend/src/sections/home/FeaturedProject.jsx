import { Link } from 'react-router-dom';
import SectionLabel from '../../components/SectionLabel';
import SplitText from '../../components/SplitText';
import RevealImage from '../../components/RevealImage';
import Reveal from '../../components/Reveal';
import Button from '../../components/Button';
import { featuredProject as p } from '../../data/projects';

export default function FeaturedProject() {
  const meta = [
    ['Location', p.location],
    ['Type', p.category],
    ['Area', p.area],
    ['Year', p.year],
  ];

  return (
    <section className="section bg-linen" aria-labelledby="featured-heading">
      <div className="container-lux">
        <div className="mb-12 flex flex-col gap-8 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel number="02" className="mb-8 text-umber">Featured Project</SectionLabel>
            <SplitText as="h2" id="featured-heading" text={p.title} className="display-xl max-w-[12ch]" />
          </div>
          <Reveal className="max-w-sm md:pb-3">
            <p className="text-stone">{p.summary}</p>
          </Reveal>
        </div>

        <Link
          to={`/projects/${p.slug}`}
          className="group block"
          data-cursor="View"
          aria-label={`View project: ${p.title}`}
        >
          <RevealImage
            image={p.cover}
            className="aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/8]"
            sizes="(min-width: 1520px) 1420px, 100vw"
            parallax={6}
            hoverZoom
          />
        </Link>

        <div className="mt-10 grid gap-10 md:grid-cols-12 md:items-end">
          <dl className="grid grid-cols-2 gap-x-6 md:col-span-8 lg:grid-cols-4">
            {meta.map(([k, v], i) => (
              <Reveal key={k} delay={i * 0.08} className="hairline border-t py-5">
                <dt className="meta-label">{k}</dt>
                <dd className="mt-2 font-display text-2xl">{v}</dd>
              </Reveal>
            ))}
          </dl>
          <div className="md:col-span-4 md:text-right">
            <Button to={`/projects/${p.slug}`} variant="dark" magnetic>
              View Project
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
