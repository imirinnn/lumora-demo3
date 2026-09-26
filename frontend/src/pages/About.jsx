import PageTransition from '../layouts/PageTransition';
import Seo from '../components/Seo';
import PageHeader from '../components/PageHeader';
import RevealImage from '../components/RevealImage';
import Reveal from '../components/Reveal';
import SectionLabel from '../components/SectionLabel';
import SplitText from '../components/SplitText';
import Process from '../sections/home/Process';
import Stats from '../sections/home/Stats';
import Testimonials from '../sections/home/Testimonials';
import ConsultationCTA from '../sections/ConsultationCTA';
import { images } from '../data/images';
import { principles, team } from '../data/content';

export default function About() {
  return (
    <PageTransition>
      <Seo
        title="About the Studio"
        description="Founded in Chennai in 2018, Lumora Interiors is a small team of architects and interior designers creating calm, characterful spaces across India."
        path="/about"
      />

      <PageHeader
        eyebrow="About Lumora"
        title={['A small studio', 'with a quiet point', 'of view.']}
        intro="We are architects, interior designers and makers who believe a well-designed space should feel inevitable — as if it could never have been any other way."
      />

      <div className="container-lux">
        <RevealImage image={images.studio} className="aspect-[4/5] sm:aspect-[16/8]" parallax={8} priority sizes="100vw" />
      </div>

      {/* Story */}
      <section className="section" aria-labelledby="story-heading">
        <div className="container-lux grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionLabel number="01" className="text-umber md:sticky md:top-32">Our Story</SectionLabel>
          </div>
          <div className="md:col-span-8">
            <SplitText
              as="h2"
              id="story-heading"
              text="Lumora began with a single apartment in Chennai and a simple idea: design for how people actually live."
              className="display-md max-w-[26ch]"
            />
            <div className="mt-12 grid gap-8 text-stone sm:grid-cols-2">
              <Reveal>
                <p>
                  Our founder, Aditi Varma, spent a decade in architecture practices in Bengaluru and Milan before
                  returning home. She noticed that most interiors were designed to impress on the day of handover —
                  and quietly disappointed a year later.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <p>
                  Eight years on, we are a team of fourteen working across six cities. We still take on a limited number
                  of projects each year, so the people who design your space are the same people on site when it is
                  built.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Image pair */}
      <div className="container-lux grid items-end gap-6 md:grid-cols-12 md:gap-8">
        <RevealImage image={images.aboutSpace} className="aspect-[4/5] md:col-span-7" sizes="(min-width: 768px) 58vw, 100vw" parallax={6} />
        <div className="md:col-span-5">
          <RevealImage image={images.aboutDetail} className="aspect-[3/4]" sizes="(min-width: 768px) 42vw, 100vw" delay={0.15} />
        </div>
      </div>

      {/* Principles */}
      <section className="section" aria-labelledby="principles-heading">
        <div className="container-lux">
          <SectionLabel number="02" className="mb-8 text-umber">What We Believe</SectionLabel>
          <SplitText as="h2" id="principles-heading" text="Three principles guide every project." className="display-lg max-w-[18ch]" />
          <div className="mt-16 grid gap-px bg-line md:grid-cols-3">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1} className="bg-bone py-10 md:px-10 md:first:pl-0 md:last:pr-0">
                <p className="font-display text-lg italic text-clay">0{i + 1}</p>
                <h3 className="mt-6 font-display text-3xl font-light">{p.title}</h3>
                <p className="mt-4 text-stone">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Stats />

      {/* Team — typographic, no portraits needed */}
      <section className="section" aria-labelledby="team-heading">
        <div className="container-lux grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionLabel number="03" className="mb-8 text-umber">The Team</SectionLabel>
            <h2 id="team-heading" className="display-md">The people behind the work.</h2>
          </div>
          <ul className="hairline border-t md:col-span-8">
            {team.map((m, i) => (
              <Reveal as="li" key={m.name} delay={i * 0.06} className="hairline group flex flex-col justify-between gap-1 border-b py-7 sm:flex-row sm:items-baseline">
                <span className="font-display text-[clamp(1.7rem,3vw,2.6rem)] font-light leading-none transition-transform duration-700 group-hover:translate-x-2">
                  {m.name}
                </span>
                <span className="meta-label">{m.role}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <div className="bg-linen">
        <Process number="04" />
      </div>
      <Testimonials number="05" />
      <ConsultationCTA />
    </PageTransition>
  );
}
