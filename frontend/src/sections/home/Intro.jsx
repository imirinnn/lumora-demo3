import ScrollText from '../../components/ScrollText';
import SectionLabel from '../../components/SectionLabel';
import RevealImage from '../../components/RevealImage';
import Reveal from '../../components/Reveal';
import { TextLink } from '../../components/Button';
import { images } from '../../data/images';

export default function Intro() {
  return (
    <section className="section" aria-labelledby="intro-heading">
      <div className="container-lux">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <SectionLabel number="01" className="whitespace-nowrap text-umber md:sticky md:top-32">
              The Studio
            </SectionLabel>
          </div>
          <div className="md:col-span-9">
            <h2 id="intro-heading" className="sr-only">About Lumora Interiors</h2>
            <ScrollText
              className="display-lg max-w-[22ch] text-charcoal"
              text="We design interiors that balance character, functionality and timeless detail — rooms that feel as good in ten years as they do on the day we hand them over."
            />
          </div>
        </div>

        <div className="mt-20 grid items-end gap-10 md:mt-32 md:grid-cols-12 md:gap-8">
          <div className="order-2 md:order-1 md:col-span-4 lg:col-span-3">
            <RevealImage
              image={images.introDetail}
              className="aspect-[4/5] w-2/3 md:w-full"
              sizes="(min-width: 768px) 25vw, 66vw"
            />
            <Reveal className="mt-8 max-w-sm">
              <p className="text-stone">
                Founded in Chennai in 2018, Lumora is a small team of architects, interior designers and makers.
                We take on a limited number of projects each year so every one gets our full attention.
              </p>
              <TextLink to="/about" className="mt-8">
                About the studio
              </TextLink>
            </Reveal>
          </div>

          <div className="order-1 md:order-2 md:col-span-8 md:col-start-5 lg:col-span-8 lg:col-start-5">
            <RevealImage
              image={images.intro}
              className="aspect-[4/5] sm:aspect-[5/4]"
              sizes="(min-width: 768px) 66vw, 100vw"
              parallax={8}
            />
            <p className="meta-label mt-4 flex justify-between">
              <span>Living room — Private residence</span>
              <span>Chennai</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
