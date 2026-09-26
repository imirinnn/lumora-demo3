import PageTransition from '../layouts/PageTransition';
import Seo from '../components/Seo';
import PageHeader from '../components/PageHeader';
import RevealImage from '../components/RevealImage';
import Reveal from '../components/Reveal';
import SplitText from '../components/SplitText';
import SectionLabel from '../components/SectionLabel';
import Accordion from '../components/Accordion';
import { TextLink } from '../components/Button';
import Process from '../sections/home/Process';
import ConsultationCTA from '../sections/ConsultationCTA';
import { faqs, services } from '../data/content';

export default function Services() {
  return (
    <PageTransition>
      <Seo
        title="Services"
        description="Residential interiors, commercial interiors, architecture & planning, and styling & consultation — one studio from first sketch to final reveal."
        path="/services"
      />

      <PageHeader
        eyebrow="Services"
        title={['One studio,', 'every detail.']}
        intro="Architecture, interiors and styling under one roof — so the idea that starts on the first sketch is still there when you move in."
      />

      {/* Quick index */}
      <nav aria-label="Services" className="container-lux">
        <ul className="hairline grid gap-px border-y bg-line sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <li key={s.id} className="bg-bone">
              <a href={`#${s.id}`} className="group flex items-baseline gap-4 px-1 py-5 lg:px-6">
                <span className="font-display text-sm italic text-stone">{s.number}</span>
                <span className="link-u text-sm">{s.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {services.map((s, i) => {
        const flip = i % 2 === 1;
        return (
          <section key={s.id} id={s.id} className="section scroll-mt-24" aria-labelledby={`${s.id}-title`}>
            <div className="container-lux grid items-center gap-12 md:grid-cols-12 md:gap-8">
              <div className={`md:col-span-6 ${flip ? 'md:order-2 md:col-start-7' : ''}`}>
                <RevealImage
                  image={s.image}
                  className="aspect-[4/5]"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  parallax={6}
                />
              </div>
              <div className={`md:col-span-5 ${flip ? 'md:order-1' : 'md:col-start-8'}`}>
                <SectionLabel number={s.number} className="mb-8 text-umber">Service</SectionLabel>
                <SplitText as="h2" id={`${s.id}-title`} text={s.title} className="display-lg" />
                <Reveal className="mt-8">
                  <p className="display-sm font-light italic text-umber">{s.short}</p>
                  <p className="mt-6 text-stone">{s.body}</p>
                </Reveal>
                <Reveal delay={0.1}>
                  <ul className="hairline mt-10 border-t">
                    {s.includes.map((inc) => (
                      <li key={inc} className="hairline flex items-center justify-between border-b py-4 text-sm">
                        {inc}
                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-clay" />
                      </li>
                    ))}
                  </ul>
                  <TextLink to="/contact" className="mt-10">Enquire about this service</TextLink>
                </Reveal>
              </div>
            </div>
          </section>
        );
      })}

      <div className="bg-linen">
        <Process number="05" />
      </div>

      <section className="section" aria-labelledby="faq-heading">
        <div className="container-lux grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionLabel number="06" className="mb-8 text-umber">Questions</SectionLabel>
            <h2 id="faq-heading" className="display-md max-w-[12ch]">Good to know before we begin.</h2>
          </div>
          <div className="md:col-span-8">
            <Accordion items={faqs} />
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </PageTransition>
  );
}
