import Counter from '../../components/Counter';
import Reveal from '../../components/Reveal';
import { stats } from '../../data/content';

export default function Stats({ className = 'bg-linen' }) {
  return (
    <section className={`section-sm ${className}`} aria-label="Studio in numbers">
      <div className="container-lux">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.08}
              className={`hairline flex flex-col-reverse gap-3 border-t px-1 py-8 sm:py-10 lg:border-l lg:border-t-0 lg:px-8 lg:py-4 ${
                i === 0 ? 'lg:border-l-0 lg:pl-0' : ''
              }`}
            >
              <dt className="meta-label">{s.label}</dt>
              <dd className="font-display text-[clamp(3.2rem,6vw,5.5rem)] font-light leading-none">
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
