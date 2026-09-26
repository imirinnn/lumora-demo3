import PageTransition from '../layouts/PageTransition';
import Seo from '../components/Seo';
import Hero from '../sections/home/Hero';
import Intro from '../sections/home/Intro';
import FeaturedProject from '../sections/home/FeaturedProject';
import ProjectShowcase from '../sections/home/ProjectShowcase';
import ServicesList from '../sections/home/ServicesList';
import Process from '../sections/home/Process';
import Stats from '../sections/home/Stats';
import Testimonials from '../sections/home/Testimonials';
import ConsultationCTA from '../sections/ConsultationCTA';
import { projects } from '../data/projects';

export default function Home() {
  return (
    <PageTransition>
      <Seo
        description="Lumora Interiors is a premium interior design and architecture studio in Chennai, creating thoughtful residential, commercial and hospitality spaces across India."
        path="/"
      />
      <Hero />
      <Intro />
      <FeaturedProject />
      <ProjectShowcase items={projects} />
      <ServicesList />
      <Process />
      <Stats />
      <Testimonials />
      <ConsultationCTA />
    </PageTransition>
  );
}
