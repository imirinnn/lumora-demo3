import { images } from './images';

export const services = [
  {
    id: 'residential',
    number: '01',
    title: 'Residential Interiors',
    short: 'Thoughtful spaces designed around the way you live.',
    body: 'From a single apartment to a family estate, we shape homes around daily rituals — how you wake, cook, gather and unwind — then craft every surface to last.',
    includes: ['Space planning & layouts', 'Custom joinery & furniture', 'Lighting design', 'Material & finish selection'],
    image: images.serviceResidential,
  },
  {
    id: 'commercial',
    number: '02',
    title: 'Commercial Interiors',
    short: 'Functional environments designed to represent your brand.',
    body: 'Offices, studios, showrooms and restaurants that work hard and feel unmistakably yours — planned for people, built on time and tuned to your identity.',
    includes: ['Workplace strategy', 'Brand-led interiors', 'Retail & showroom design', 'Project & site management'],
    image: images.serviceCommercial,
  },
  {
    id: 'architecture',
    number: '03',
    title: 'Architecture & Planning',
    short: 'A balance between structure, material and experience.',
    body: 'New builds, extensions and renovations planned from the inside out, so architecture and interior are one continuous idea rather than two separate jobs.',
    includes: ['Concept architecture', 'Renovations & extensions', 'Façade & landscape integration', 'Approvals coordination'],
    image: images.serviceArchitecture,
  },
  {
    id: 'styling',
    number: '04',
    title: 'Styling & Consultation',
    short: 'Finishing details that bring the entire space together.',
    body: 'Art, objects, textiles and furniture curated to complete a space — or an expert consultation when you need a clear direction before you begin.',
    includes: ['Furniture & art curation', 'Soft furnishings', 'Colour consultations', 'One-day design sessions'],
    image: images.serviceStyling,
  },
];

export const process = [
  { number: '01', title: 'Discover', body: 'Understanding your lifestyle, needs and vision.', detail: 'Site visit, conversations, a clear brief and budget.' },
  { number: '02', title: 'Concept', body: 'Developing the design direction.', detail: 'Mood, spatial ideas and a material story to react to.' },
  { number: '03', title: 'Design', body: 'Refining materials, layouts and details.', detail: 'Drawings, 3D views, samples and a detailed estimate.' },
  { number: '04', title: 'Build', body: 'Bringing the concept into reality.', detail: 'Trusted craftspeople, weekly site reviews, no surprises.' },
  { number: '05', title: 'Reveal', body: 'Delivering a finished space.', detail: 'Styled, photographed and handed over — ready to live in.' },
];

export const stats = [
  { value: 15, suffix: '+', label: 'Projects Completed' },
  { value: 8, suffix: '+', label: 'Years of Experience' },
  { value: 12, suffix: '', label: 'Design Awards' },
  { value: 6, suffix: '', label: 'Cities' },
];

// Fictional testimonials for the demo.
export const testimonials = [
  {
    quote:
      'Lumora transformed our home without compromising the character of the space. They kept the old teak doors and carved pillars we loved, and somehow everything feels new.',
    name: 'Ananya & Karthik Raman',
    role: 'Homeowners, The Courtyard Residence',
  },
  {
    quote:
      'They listened more than they talked, which is rare. The office came in on budget and a week early, and the team actually wants to come in now.',
    name: 'Rohan Mehta',
    role: 'Founder, Noir Creative — Mumbai',
  },
  {
    quote:
      'Every material was explained, every decision made with us. Guests notice the calm before they notice anything else — that was exactly our brief.',
    name: 'Meera Pillai',
    role: 'Owner, Coastal Retreat — Puducherry',
  },
];

export const principles = [
  { title: 'Character before trend', body: 'We design for how a space should feel in ten years, not how it photographs this season.' },
  { title: 'Material honesty', body: 'Natural, local and repairable materials, chosen to age well and be touched every day.' },
  { title: 'Light as a material', body: 'Every plan starts with the sun — where it enters, where it rests and how it changes by the hour.' },
];

export const team = [
  { name: 'Aditi Varma', role: 'Founder & Principal Designer' },
  { name: 'Nikhil Iyer', role: 'Principal Architect' },
  { name: 'Sara D’Souza', role: 'Head of Interiors' },
  { name: 'Farhan Qureshi', role: 'Project Director' },
];

export const faqs = [
  {
    q: 'What size of project do you take on?',
    a: 'Most of our residential projects range from 1,500 to 6,000 sq.ft, and commercial projects from 2,000 to 20,000 sq.ft. For smaller spaces, our Styling & Consultation service is a great place to start.',
  },
  {
    q: 'Do you work outside Chennai?',
    a: 'Yes. We currently have projects in six cities across India and take on select work elsewhere. Site visits are planned around key milestones.',
  },
  {
    q: 'How are your fees structured?',
    a: 'We quote a fixed design fee based on scope and area after our first conversation, with execution billed separately and transparently. There are no hidden margins on materials.',
  },
  {
    q: 'How long does a typical project take?',
    a: 'A full home usually takes 6 to 12 months from first meeting to reveal, depending on scale and whether architectural work is involved.',
  },
];

export const PROJECT_TYPES = ['Residential', 'Commercial', 'Hospitality', 'Consultation'];
export const BUDGETS = ['Under ₹10 Lakhs', '₹10–25 Lakhs', '₹25–50 Lakhs', '₹50 Lakhs+'];
