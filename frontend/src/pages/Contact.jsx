import PageTransition from '../layouts/PageTransition';
import Seo from '../components/Seo';
import SplitText from '../components/SplitText';
import Reveal from '../components/Reveal';
import RevealImage from '../components/RevealImage';
import ConsultationForm from '../components/ConsultationForm';
import { Arrow } from '../components/Button';
import { site } from '../data/site';
import { images } from '../data/images';

export default function Contact() {
  return (
    <PageTransition>
      <Seo
        title="Start a Project"
        description="Tell us about your space. Book a consultation with Lumora Interiors for residential, commercial and hospitality interior design."
        path="/contact"
      />

      <section className="container-lux pb-24 pt-40 sm:pb-36 sm:pt-48" aria-labelledby="contact-heading">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          {/* Left: invitation + studio details */}
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow text-umber">Contact &amp; Consultation</p>
            </Reveal>
            <SplitText
              as="h1"
              id="contact-heading"
              trigger="mount"
              delay={0.35}
              text={['Tell us about', 'your space.']}
              className="display-xl mt-8"
            />
            <Reveal delay={0.5} className="mt-8 max-w-md">
              <p className="lead text-stone">
                Share a few details and a member of our design team will reply within one working day to arrange a
                first conversation — in the studio, on site or online.
              </p>
            </Reveal>

            <div className="mt-14 hidden lg:block">
              <RevealImage image={images.introDetail} className="aspect-[5/4] w-4/5" sizes="30vw" delay={0.4} />
            </div>

            <Reveal delay={0.2} className="hairline mt-14 grid gap-8 border-t pt-10 sm:grid-cols-2">
              <div>
                <p className="meta-label mb-3">Studio</p>
                <address className="not-italic">
                  {site.address.map((l) => (
                    <span key={l} className="block">{l}</span>
                  ))}
                </address>
                <a href={site.mapUrl} target="_blank" rel="noreferrer" className="group mt-3 inline-flex items-center gap-2 text-sm text-umber">
                  <span className="link-u">Get directions</span> <Arrow className="-rotate-45" />
                </a>
              </div>
              <div>
                <p className="meta-label mb-3">Direct</p>
                <a href={`mailto:${site.email}`} className="link-u block">{site.email}</a>
                <a href={site.phoneHref} className="link-u mt-1 inline-block">{site.phone}</a>
                <p className="mt-3 text-sm text-stone">{site.hours}</p>
              </div>
            </Reveal>
          </div>

          {/* Right: consultation form */}
          <div id="consultation" className="scroll-mt-28 lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.4} className="bg-linen p-6 sm:p-10 lg:p-14">
              <div className="mb-10 flex items-baseline justify-between gap-4">
                <h2 className="display-sm">Consultation form</h2>
                <span className="meta-label">~ 2 min</span>
              </div>
              <ConsultationForm />
            </Reveal>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
