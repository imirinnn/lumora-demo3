import { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import PageTransition from '../layouts/PageTransition';
import Seo from '../components/Seo';
import Img from '../components/Img';
import RevealImage from '../components/RevealImage';
import Reveal from '../components/Reveal';
import SplitText from '../components/SplitText';
import SectionLabel from '../components/SectionLabel';
import Button, { Arrow } from '../components/Button';
import NotFound from './NotFound';
import { getNextProject, getProject } from '../data/projects';
import { imageUrl } from '../data/images';
import { EASE, EASE_IN_OUT, VIEWPORT } from '../animations/motion';
import { useMediaQuery } from '../hooks/useMediaQuery';

function ProjectHero({ project }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const wide = useMediaQuery('(min-width: 768px)');
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], wide && !reduce ? ['0%', '20%'] : ['0%', '0%']);

  return (
    <section ref={ref} className="on-dark relative h-[88svh] min-h-[560px] overflow-hidden bg-ink text-bone">
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { clipPath: 'inset(0% 0% 100% 0%)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        transition={{ duration: 1.4, ease: EASE_IN_OUT, delay: 0.2 }}
      >
        <motion.div className="absolute inset-0" style={{ y }}>
          <motion.div
            className="h-full w-full"
            initial={reduce ? false : { scale: 1.2 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 2.2, ease: EASE, delay: 0.2 }}
          >
            <Img image={project.cover} priority sizes="100vw" width={2200} height={1400} />
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/15 to-ink/40" />
      </motion.div>

      <div className="container-lux relative flex h-full flex-col justify-end pb-12 sm:pb-16">
        <Reveal delay={0.7}>
          <nav aria-label="Breadcrumb" className="eyebrow mb-6 flex items-center gap-3 text-sand">
            <Link to="/projects" className="link-u">Projects</Link>
            <span aria-hidden="true">/</span>
            <Link to={`/projects?category=${project.category}`} className="link-u">{project.category}</Link>
          </nav>
        </Reveal>
        <SplitText as="h1" trigger="mount" delay={0.8} text={project.title} className="display-xl max-w-[14ch] uppercase" />
      </div>
    </section>
  );
}

function MetaBar({ project }) {
  const items = [
    ['Location', project.location],
    ['Category', project.category],
    ['Year', project.year],
    ['Area', project.area],
    ['Duration', project.duration],
  ];
  return (
    <div className="container-lux">
      <dl className="hairline grid grid-cols-2 border-b sm:grid-cols-3 lg:grid-cols-5">
        {items.map(([k, v], i) => (
          <Reveal key={k} delay={i * 0.06} className={`hairline py-6 lg:border-l lg:px-6 ${i === 0 ? 'lg:border-l-0 lg:pl-0' : ''}`}>
            <dt className="meta-label">{k}</dt>
            <dd className="mt-2 font-display text-xl sm:text-2xl">{v}</dd>
          </Reveal>
        ))}
      </dl>
    </div>
  );
}

function MaterialPalette({ materials }) {
  const reduce = useReducedMotion();
  return (
    <section className="section bg-linen" aria-labelledby="materials-heading">
      <div className="container-lux">
        <div className="mb-14 grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionLabel number="03" className="mb-8 text-umber">Material Palette</SectionLabel>
            <SplitText as="h2" id="materials-heading" text="A short list of honest materials." className="display-lg max-w-[16ch]" />
          </div>
          <Reveal className="md:col-span-4 md:col-start-9">
            <p className="text-stone">
              Fewer materials, used generously. Each one chosen for how it feels underhand, how it ages and how it holds the light.
            </p>
          </Reveal>
        </div>

        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-6">
          {materials.map((m, i) => (
            <motion.li
              key={m.name}
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.9, ease: EASE, delay: i * 0.08 }}
              className="group"
            >
              <div
                className="aspect-[3/4] w-full rounded-t-full transition-transform duration-700 group-hover:-translate-y-2"
                style={{ backgroundColor: m.hex, boxShadow: 'inset 0 0 0 1px rgba(29,27,25,.08)' }}
                role="img"
                aria-label={`${m.name} swatch`}
              />
              <p className="mt-5 font-display text-2xl leading-tight">{m.name}</p>
              <p className="meta-label mt-1">{m.note}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function NextProject({ project }) {
  return (
    <section className="on-dark bg-ink text-bone" aria-label="Next project">
      <Link to={`/projects/${project.slug}`} className="group relative block overflow-hidden" data-cursor="Next">
        <div className="absolute inset-0 opacity-35 transition-opacity duration-1000 group-hover:opacity-55">
          <Img image={project.cover} sizes="100vw" className="zoom-img" alt="" />
        </div>
        <div className="absolute inset-0 bg-ink/40" />
        <div className="container-lux relative flex min-h-[70svh] flex-col justify-center py-28 text-center sm:min-h-[80svh]">
          <p className="eyebrow text-sand">Next Project</p>
          <SplitText as="p" text={project.title} className="display-xl mx-auto mt-8 max-w-[14ch] uppercase" />
          <p className="meta-label mt-8">
            {project.category} · {project.location}
          </p>
          <span className="mx-auto mt-10 flex h-14 w-14 items-center justify-center rounded-full border border-bone/40 transition-colors duration-500 group-hover:border-bone group-hover:bg-bone group-hover:text-charcoal">
            <Arrow />
          </span>
        </div>
      </Link>
    </section>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProject(slug);
  if (!project) return <NotFound />;

  const next = getNextProject(slug);
  const [g0, g1, g2, ...rest] = project.gallery;

  return (
    <PageTransition>
      <Seo
        title={`${project.title} — ${project.category} Interior, ${project.location.split(',')[0]}`}
        description={project.summary}
        image={imageUrl(project.cover.src, 1200)}
        path={`/projects/${project.slug}`}
      />

      <ProjectHero project={project} />
      <MetaBar project={project} />

      {/* Brief */}
      <section className="section" aria-labelledby="brief-heading">
        <div className="container-lux grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionLabel number="01" className="text-umber md:sticky md:top-32">The Brief</SectionLabel>
          </div>
          <div className="md:col-span-8">
            <h2 id="brief-heading" className="sr-only">The brief</h2>
            <Reveal>
              <p className="display-sm max-w-[34ch] font-light">{project.intro}</p>
            </Reveal>
            <Reveal delay={0.1} className="mt-10 max-w-xl">
              <p className="text-stone">{project.summary}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {g0 && (
        <div className="px-0 sm:px-[var(--gutter)]">
          <RevealImage image={g0} className="aspect-[4/5] sm:aspect-[16/9]" sizes="100vw" parallax={8} />
        </div>
      )}

      {/* Concept */}
      <section className="section" aria-labelledby="concept-heading">
        <div className="container-lux grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionLabel number="02" className="text-umber md:sticky md:top-32">Design Concept</SectionLabel>
          </div>
          <div className="md:col-span-8">
            <SplitText as="h2" id="concept-heading" text={project.concept.title} className="display-lg max-w-[16ch]" />
            <div className="mt-12 grid gap-8 text-stone lg:grid-cols-2">
              {project.concept.body.map((para, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <p>{para}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {(g1 || g2) && (
        <div className="container-lux grid items-start gap-6 md:grid-cols-12 md:gap-8">
          {g1 && <RevealImage image={g1} className="aspect-[4/5] md:col-span-7" sizes="(min-width: 768px) 58vw, 100vw" parallax={5} />}
          {g2 && (
            <div className="md:col-span-5 md:mt-40">
              <RevealImage image={g2} className="aspect-[3/4]" sizes="(min-width: 768px) 42vw, 100vw" delay={0.1} />
            </div>
          )}
        </div>
      )}

      {/* Pull quote */}
      <section className="section" aria-label="Client reflection">
        <figure className="container-lux mx-auto max-w-5xl text-center">
          <Reveal>
            <blockquote className="font-display text-[clamp(1.9rem,4.2vw,4rem)] font-light italic leading-[1.12]">
              “{project.quote}”
            </blockquote>
          </Reveal>
          <Reveal delay={0.15}>
            <figcaption className="meta-label mt-8">— The client, {project.title}</figcaption>
          </Reveal>
        </figure>
      </section>

      <MaterialPalette materials={project.materials} />

      {/* Highlights */}
      <section className="section" aria-labelledby="highlights-heading">
        <div className="container-lux grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionLabel number="04" className="mb-8 text-umber">Highlights</SectionLabel>
            <h2 id="highlights-heading" className="display-md max-w-[12ch]">What makes it work.</h2>
          </div>
          <ol className="grid gap-x-10 sm:grid-cols-2 md:col-span-8">
            {project.highlights.map((h, i) => (
              <Reveal as="li" key={h} delay={i * 0.06} className="hairline flex gap-6 border-t py-7">
                <span className="font-display text-lg italic text-clay">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-lg font-light leading-snug">{h}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {rest.length > 0 && (
        <div className="container-lux grid gap-6 pb-28 sm:pb-40 md:grid-cols-2 md:gap-8">
          {rest.map((img, i) => (
            <RevealImage
              key={img.alt}
              image={img}
              className={rest.length === 1 ? 'aspect-[4/5] sm:aspect-[16/9] md:col-span-2' : 'aspect-[4/5]'}
              sizes={rest.length === 1 ? '100vw' : '(min-width: 768px) 50vw, 100vw'}
              delay={i * 0.1}
            />
          ))}
        </div>
      )}

      {/* Gentle prompt before moving on */}
      <section className="hairline border-t" aria-label="Start a project">
        <div className="container-lux flex flex-col items-start justify-between gap-8 py-16 sm:py-20 md:flex-row md:items-center">
          <p className="display-md max-w-[20ch]">Imagining something similar for your space?</p>
          <Button to="/contact" variant="dark" magnetic>
            Start a Project
          </Button>
        </div>
      </section>

      <NextProject project={next} />
    </PageTransition>
  );
}
