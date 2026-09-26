import SplitText from './SplitText';
import Reveal from './Reveal';

/** Opening block for interior pages: eyebrow, oversized heading, supporting copy. */
export default function PageHeader({ eyebrow, title, intro, aside }) {
  return (
    <header className="container-lux pb-16 pt-40 sm:pb-24 sm:pt-48">
      <Reveal>
        <p className="eyebrow text-umber">{eyebrow}</p>
      </Reveal>
      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
        <SplitText as="h1" trigger="mount" delay={0.35} text={title} className="display-xl lg:col-span-8" />
        {(intro || aside) && (
          <Reveal delay={0.5} className="lg:col-span-4 lg:pb-3">
            {intro && <p className="lead text-stone">{intro}</p>}
            {aside}
          </Reveal>
        )}
      </div>
    </header>
  );
}
