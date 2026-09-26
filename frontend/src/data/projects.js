import { images } from './images';

/**
 * Portfolio content. Each project powers:
 *   - the home page showcase & featured project
 *   - the /projects index
 *   - its own /projects/:slug story page
 *
 * All projects, clients and figures are fictional (demo content).
 */
export const CATEGORIES = ['Residential', 'Commercial', 'Hospitality'];

export const projects = [
  {
    slug: 'courtyard-residence',
    title: 'The Courtyard Residence',
    category: 'Residential',
    location: 'Chennai, India',
    year: '2026',
    area: '2,400 sq.ft',
    duration: '11 months',
    cover: images.courtyardCover,
    summary: 'A family home arranged around a planted courtyard, where every room borrows light, air and a view of green.',
    intro:
      'For a family of four moving back to Chennai, the brief was simple and difficult at once: a home that stays cool, feels generous without being grand, and lets three generations share space without living on top of one another.',
    concept: {
      title: 'Rooms that open inward',
      body: [
        'We turned the plan inside out. Instead of facing the street, the living, dining and study wrap a central courtyard planted with a frangipani and a low water channel. Deep overhangs and timber screens temper the afternoon sun, and cross-ventilation does the work an air-conditioner would otherwise do for most of the year.',
        'Inside, the palette is restrained so the courtyard can be the colour: lime-washed walls, honed Kota stone underfoot and warm teak joinery that ages gracefully in the coastal humidity.',
      ],
    },
    quote: 'We wanted the house to breathe the way old Chennai homes did — only quieter, and lighter.',
    materials: [
      { name: 'Lime plaster', note: 'Walls', hex: '#E9E1D4' },
      { name: 'Burma teak', note: 'Joinery & screens', hex: '#8B5E3C' },
      { name: 'Honed Kota stone', note: 'Floors', hex: '#9C9A8C' },
      { name: 'Handloom cotton', note: 'Upholstery', hex: '#D8CDBB' },
      { name: 'Aged brass', note: 'Hardware', hex: '#A88B55' },
    ],
    highlights: [
      'Central courtyard with a frangipani and water channel',
      'Passive cooling — 40% lower summer energy use',
      'Custom teak jali screens made by local craftsmen',
      'Independent grandparents’ suite on the ground floor',
    ],
    gallery: [
      { ...images.courtyardLiving, layout: 'wide' },
      { ...images.courtyardDining, layout: 'tall' },
      { ...images.courtyardBedroom, layout: 'tall' },
      { ...images.courtyardBath, layout: 'half' },
      { ...images.courtyardExterior, layout: 'half' },
    ],
  },
  {
    slug: 'terra-house',
    title: 'Terra House',
    category: 'Residential',
    location: 'Bengaluru, India',
    year: '2025',
    area: '3,100 sq.ft',
    duration: '9 months',
    cover: images.terraCover,
    summary: 'An earthy, tactile home for two architects — clay, cane and oiled oak in a warm, low-lit palette.',
    intro:
      'Terra House belongs to a couple who spend their days designing for other people. At home they wanted the opposite of a showroom: something soft, slightly imperfect and deeply comfortable.',
    concept: {
      title: 'Made of the ground it stands on',
      body: [
        'Every surface started with the earth — terracotta tiles pressed in Kanchipuram, clay-plaster walls with a hand-trowelled finish, and cane and rattan woven by a Bengaluru collective. The result is warm to the touch and quiet to the ear.',
        'Lighting is low and layered. Woven pendants cast soft patterns at night, and every room has at least three light sources so the house can shift from work to evening without a single harsh overhead.',
      ],
    },
    quote: 'It is the first house we have lived in that feels better after dark.',
    materials: [
      { name: 'Terracotta', note: 'Floors', hex: '#B86F4B' },
      { name: 'Clay plaster', note: 'Walls', hex: '#CDB79E' },
      { name: 'Oiled oak', note: 'Furniture', hex: '#A07850' },
      { name: 'Natural cane', note: 'Lighting & screens', hex: '#C9A978' },
      { name: 'Charcoal linen', note: 'Soft furnishings', hex: '#45403A' },
    ],
    highlights: [
      'Handmade terracotta sourced within 300 km',
      'Layered lighting plan with 38 dimmable circuits',
      'Built-in library wall for 2,000 books',
      'Reading nook cantilevered over the garden',
    ],
    gallery: [
      { ...images.terraLounge, layout: 'wide' },
      { ...images.terraBedroom, layout: 'tall' },
      { ...images.terraDining, layout: 'tall' },
      { ...images.terraExterior, layout: 'wide' },
    ],
  },
  {
    slug: 'noir-office',
    title: 'Noir Office',
    category: 'Commercial',
    location: 'Mumbai, India',
    year: '2025',
    area: '6,800 sq.ft',
    duration: '7 months',
    cover: images.noirCover,
    summary: 'A moody, gallery-like workplace for a creative agency — dark surfaces, precise light, zero clutter.',
    intro:
      'A Lower Parel creative agency had outgrown its first studio. They wanted a space that felt like their work: confident, graphic and a little theatrical — without sacrificing a single hour of daylight for the team.',
    concept: {
      title: 'Darkness as a frame',
      body: [
        'We used deep charcoal surfaces to make the work — and the people — the brightest thing in the room. Blackened oak, smoked glass and micro-cement wrap the client-facing zones, while the studio floor stays pale and bright under the original concrete soffit.',
        'Meeting rooms line a single glazed spine, so every conversation is visible but acoustically private. Lighting is tuned per zone with warm 2700K accents against cooler task light.',
      ],
    },
    quote: 'Clients walk in and immediately lower their voices. That is exactly what we wanted.',
    materials: [
      { name: 'Blackened oak', note: 'Joinery', hex: '#2A2522' },
      { name: 'Micro-cement', note: 'Walls & floors', hex: '#6E6A64' },
      { name: 'Smoked glass', note: 'Partitions', hex: '#4A4B4A' },
      { name: 'Bouclé wool', note: 'Lounge seating', hex: '#D9D3C8' },
      { name: 'Brushed steel', note: 'Details', hex: '#9EA0A0' },
    ],
    highlights: [
      '60-seat studio with 92% daylit desks',
      'Acoustic glazed meeting spine',
      'Gallery wall with track lighting for rotating work',
      'Delivered in 7 months while the team kept working',
    ],
    gallery: [
      { ...images.noirCorridor, layout: 'wide' },
      { ...images.noirLounge, layout: 'tall' },
      { ...images.noirArt, layout: 'tall' },
      { ...images.noirFacade, layout: 'wide' },
    ],
  },
  {
    slug: 'white-villa',
    title: 'The White Villa',
    category: 'Residential',
    location: 'Goa, India',
    year: '2024',
    area: '5,200 sq.ft',
    duration: '14 months',
    cover: images.villaCover,
    summary: 'A light-washed holiday villa of stacked white volumes, arched openings and a long reflecting pool.',
    intro:
      'Commissioned as a family holiday home near Assagao, The White Villa had to feel effortless — a place where sandy feet are welcome and the house stays cool through the hottest months.',
    concept: {
      title: 'Light, in its purest form',
      body: [
        'A family of white volumes steps down the site toward the pool, each one rotated slightly to catch the breeze. Arches borrowed from Goan-Portuguese houses frame the views, re-drawn with crisp modern edges.',
        'With a single colour on every wall, texture does the talking: lime render outside, polished plaster inside, raw linen at the windows and pale oak underfoot.',
      ],
    },
    quote: 'The villa changes colour all day — pink at sunrise, gold at five, blue at night.',
    materials: [
      { name: 'Polished plaster', note: 'Interior walls', hex: '#F2EEE7' },
      { name: 'Pale oak', note: 'Floors', hex: '#CDB597' },
      { name: 'Raw linen', note: 'Drapery', hex: '#E4DCCD' },
      { name: 'Travertine', note: 'Pool deck & baths', hex: '#D5C6AE' },
      { name: 'Blue-grey slate', note: 'Pool lining', hex: '#6F8189' },
    ],
    highlights: [
      '28-metre reflecting pool along the main axis',
      'Every bedroom opens to its own garden or terrace',
      'Arched openings inspired by Goan-Portuguese homes',
      'Rainwater harvesting feeds the entire landscape',
    ],
    gallery: [
      { ...images.villaLiving, layout: 'wide' },
      { ...images.villaKitchen, layout: 'tall' },
      { ...images.villaStair, layout: 'tall' },
      { ...images.villaBedroom, layout: 'half' },
      { ...images.villaPool, layout: 'half' },
    ],
  },
  {
    slug: 'atelier-27',
    title: 'Atelier 27',
    category: 'Commercial',
    location: 'Hyderabad, India',
    year: '2024',
    area: '4,300 sq.ft',
    duration: '6 months',
    cover: images.atelierCover,
    summary: 'A flagship studio and client lounge for a furniture brand — part showroom, part workshop, part home.',
    intro:
      'Atelier 27 is a young Hyderabad furniture label that sells through appointments, not shop windows. They needed one space to design, make, photograph and host clients — without it ever feeling like a store.',
    concept: {
      title: 'A home for objects',
      body: [
        'We planned the atelier as a sequence of domestic rooms — a lounge, a dining room, a reading corner — so every piece is seen the way it will be lived with. Movable plinths and a ceiling rail system let the team restage the whole floor in an afternoon.',
        'Behind a pivoting oak wall sits the working studio: bright, practical and deliberately visible, so clients can see the craft behind the piece they are buying.',
      ],
    },
    quote: 'Our conversion rate doubled. People stay for coffee and leave with a sofa.',
    materials: [
      { name: 'Natural oak', note: 'Pivot wall & plinths', hex: '#B89468' },
      { name: 'Ochre lime-wash', note: 'Feature walls', hex: '#C49A55' },
      { name: 'Polished concrete', note: 'Floors', hex: '#A7A29A' },
      { name: 'Wool felt', note: 'Acoustic panels', hex: '#7D7466' },
      { name: 'Powder-coat black', note: 'Rail system', hex: '#262422' },
    ],
    highlights: [
      'Reconfigurable showroom — restaged in under 4 hours',
      'Oak pivot wall revealing the working studio',
      'In-house photography corner with north light',
      'Client lounge that doubles as an events space',
    ],
    gallery: [
      { ...images.atelierWork, layout: 'wide' },
      { ...images.atelierConsole, layout: 'tall' },
      { ...images.atelierDesk, layout: 'tall' },
      { ...images.atelierLoft, layout: 'wide' },
    ],
  },
  {
    slug: 'coastal-retreat',
    title: 'Coastal Retreat',
    category: 'Hospitality',
    location: 'Puducherry, India',
    year: '2023',
    area: '18,500 sq.ft',
    duration: '16 months',
    cover: images.coastalCover,
    summary: 'A twelve-key boutique retreat on the Coromandel coast, designed around slowness, shade and the sound of the sea.',
    intro:
      'The owners of this boutique property wanted guests to feel the pace change the moment they arrived. No lobby, no counter — just a shaded verandah, a cold drink and the sea in front of you.',
    concept: {
      title: 'The architecture of slowing down',
      body: [
        'Twelve suites are arranged as a village of low pavilions under deep, palm-thatched roofs, linked by shaded walkways. Nothing is more than one storey, so the tree canopy always wins.',
        'Interiors borrow from the French-Tamil heritage of Puducherry: dark timber, lime-washed walls, Athangudi tiles and handloom textiles — tuned for barefoot comfort and salty air.',
      ],
    },
    quote: 'Guests tell us they slept better here than anywhere else. That is the whole brief, really.',
    materials: [
      { name: 'Reclaimed teak', note: 'Suites & doors', hex: '#5C3F2B' },
      { name: 'Athangudi tile', note: 'Floors', hex: '#B3664A' },
      { name: 'Lime-wash', note: 'Walls', hex: '#EDE6DA' },
      { name: 'Palm thatch', note: 'Roofs', hex: '#9E8358' },
      { name: 'Indigo handloom', note: 'Textiles', hex: '#3E4A5C' },
    ],
    highlights: [
      '12 pavilion suites, each with a private garden',
      'Handmade Athangudi tiles from Chettinad',
      '96% average guest rating in the first year',
      'Built around 40 existing trees — none removed',
    ],
    gallery: [
      { ...images.coastalPool, layout: 'wide' },
      { ...images.coastalSuite, layout: 'tall' },
      { ...images.coastalLounge, layout: 'tall' },
      { ...images.coastalBath, layout: 'wide' },
    ],
  },
];

export const getProject = (slug) => projects.find((p) => p.slug === slug);

export function getNextProject(slug) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}

export const featuredProject = projects[0];
