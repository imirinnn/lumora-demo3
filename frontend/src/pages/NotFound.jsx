import PageTransition from '../layouts/PageTransition';
import Seo from '../components/Seo';
import SplitText from '../components/SplitText';
import Reveal from '../components/Reveal';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <PageTransition>
      <Seo title="Page not found" noindex />
      <section className="container-lux flex min-h-[85svh] flex-col justify-center pb-24 pt-40">
        <Reveal>
          <p className="eyebrow text-umber">Error 404</p>
        </Reveal>
        <SplitText as="h1" trigger="mount" delay={0.3} text={['This room', "doesn't exist."]} className="display-xl mt-8" />
        <Reveal delay={0.5} className="mt-8 max-w-md">
          <p className="lead text-stone">The page you were looking for has moved, or never existed. Let’s get you somewhere beautiful.</p>
        </Reveal>
        <Reveal delay={0.6} className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Button to="/">Back to home</Button>
          <Button to="/projects" variant="outline">View projects</Button>
        </Reveal>
      </section>
    </PageTransition>
  );
}
