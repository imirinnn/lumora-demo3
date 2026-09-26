/**
 * ─────────────────────────────────────────────────────────────
 *  CENTRAL IMAGE REGISTRY
 * ─────────────────────────────────────────────────────────────
 *  Every photo on the site is referenced from here, by key.
 *
 *  DEVELOPMENT: images are served from Unsplash (free to use under the
 *  Unsplash License). Before going live with a real client:
 *    1. Put the client's licensed photos in  frontend/public/images/
 *    2. Replace `src: unsplash('…')` with `src: '/images/your-file.jpg'`
 *       (local files skip the responsive srcset automatically).
 *    3. Update the `alt` text to describe the real photo.
 *
 *  `unsplash()` requests right-sized, auto-compressed (WebP/AVIF) files
 *  so the browser never downloads more pixels than it needs.
 */

const UNSPLASH = 'https://images.unsplash.com/photo-';

export const unsplash = (id) => ({ provider: 'unsplash', id });

/** Build a URL for a given width (used by <Img> to generate srcset). */
export function imageUrl(src, width = 1600) {
  if (typeof src === 'string') return src; // local / absolute file
  if (src?.provider === 'unsplash') {
    return `${UNSPLASH}${src.id}?auto=format&fit=crop&w=${width}&q=${width > 1600 ? 72 : 78}`;
  }
  return '';
}

export const IMAGE_WIDTHS = [480, 800, 1200, 1600, 2200];

export const images = {
  // Home
  hero: { src: unsplash('1618221195710-dd6b41faaea6'), alt: 'Sunlit living room with a low linen sofa, sculptural terracotta seats and a wide garden window' },
  intro: { src: unsplash('1616486338812-3dadae4b4ace'), alt: 'Calm neutral living room with a round timber coffee table and soft upholstered seating' },
  introDetail: { src: unsplash('1618219908412-a29a1bb7b86e'), alt: 'Round mirror above a cane-fronted timber sideboard styled with ceramics' },

  // Services
  serviceResidential: { src: unsplash('1616137466211-f939a420be84'), alt: 'Bright residential living room with pale upholstery and a sculptural pendant' },
  serviceCommercial: { src: unsplash('1600494603989-9650cf6ddd3d'), alt: 'Workspace with a deep green wall, timber desk and framed artwork' },
  serviceArchitecture: { src: unsplash('1600585154340-be6161a56a0c'), alt: 'Contemporary house at dusk with glazed walls opening onto a lawn' },
  serviceStyling: { src: unsplash('1616046229478-9901c5536a45'), alt: 'Styled console with a round mirror, ceramics and dried botanicals' },

  // About
  studio: { src: unsplash('1600566752229-250ed79470f8'), alt: 'Veined marble counter and pale timber — a study in material' },
  aboutSpace: { src: unsplash('1600210491369-e753d80a41f3'), alt: 'Living room with gallery art, a low sofa and layered neutral textiles' },
  aboutDetail: { src: unsplash('1600566753086-00f18fb6b3ea'), alt: 'Double-height living space with an open timber staircase' },

  // Courtyard Residence
  courtyardCover: { src: unsplash('1604014237800-1c9102c219da'), alt: 'Living room with a warm timber wall opening onto a planted terrace' },
  courtyardLiving: { src: unsplash('1631679706909-1844bbd07221'), alt: 'Soft beige lounge with woven round mirrors and a curved sofa' },
  courtyardDining: { src: unsplash('1617806118233-18e1de247200'), alt: 'Dining room with green upholstered chairs under a sculptural light' },
  courtyardBedroom: { src: unsplash('1505693416388-ac5ce068fe85'), alt: 'Bedroom with an upholstered headboard and warm bedside lamps' },
  courtyardBath: { src: unsplash('1620626011761-996317b8d101'), alt: 'White bathroom with a freestanding tub and a potted plant' },
  courtyardExterior: { src: unsplash('1600566753190-17f0baa2a6c3'), alt: 'Residence exterior with a timber-clad volume and a cantilevered roof' },

  // Terra House
  terraCover: { src: unsplash('1615529182904-14819c35db37'), alt: 'Earthy living room with rattan pendant lights and natural textures' },
  terraBedroom: { src: unsplash('1615874959474-d609969a20ed'), alt: 'Bedroom in terracotta and cream with a woven pendant' },
  terraDining: { src: unsplash('1560185007-cde436f6a4d0'), alt: 'Dining table beneath a row of brass pendant lights' },
  terraExterior: { src: unsplash('1600047509807-ba8f99d2cdde'), alt: 'House façade combining warm timber cladding and dark render' },
  terraLounge: { src: unsplash('1617103996702-96ff29b1c467'), alt: 'Layered lounge with woven wall plates, rugs and low seating' },

  // Noir Office
  noirCover: { src: unsplash('1497366811353-6870744d04b2'), alt: 'Open-plan office with an exposed concrete ceiling and dark joinery' },
  noirCorridor: { src: unsplash('1497366216548-37526070297c'), alt: 'Glazed meeting rooms along a dark office corridor' },
  noirLounge: { src: unsplash('1598928506311-c55ded91a20c'), alt: 'Dark-toned lounge with low seating and framed art' },
  noirArt: { src: unsplash('1618219740975-d40978bb7378'), alt: 'Charcoal sofa beneath large monochrome artwork' },
  noirFacade: { src: unsplash('1600585154526-990dced4db0d'), alt: 'Detail of a dark façade with warm timber soffit lighting' },

  // The White Villa
  villaCover: { src: unsplash('1600596542815-ffad4c1539a9'), alt: 'White villa with stacked volumes beside a long blue pool' },
  villaLiving: { src: unsplash('1600210491892-03d54c0aaf87'), alt: 'White living room with arched windows and a fireplace' },
  villaKitchen: { src: unsplash('1507089947368-19c1da9775ae'), alt: 'Bright white kitchen with a stone island and glass pendants' },
  villaStair: { src: unsplash('1600573472550-8090b5e0745e'), alt: 'Minimal white stair and glazed landing' },
  villaPool: { src: unsplash('1512917774080-9991f1c4c750'), alt: 'Glazed pavilion opening onto a turquoise pool' },
  villaBedroom: { src: unsplash('1595526114035-0d45ed16cfbf'), alt: 'Pale bedroom with soft grey linens and natural light' },

  // Atelier 27
  atelierCover: { src: unsplash('1524758631624-e2822e304c36'), alt: 'Design studio lounge with sculptural chairs and a floor lamp' },
  atelierWork: { src: unsplash('1604328698692-f76ea9498e76'), alt: 'Warm open studio with timber floors and plants' },
  atelierDesk: { src: unsplash('1497215728101-856f4ea42174'), alt: 'Light-filled workstation beside floor-to-ceiling windows' },
  atelierLoft: { src: unsplash('1600508774634-4e11d34730e2'), alt: 'Loft space with industrial pendants and a patterned rug' },
  atelierConsole: { src: unsplash('1618220179428-22790b461013'), alt: 'Mustard console with a round mirror and ceramic objects' },

  // Coastal Retreat
  coastalCover: { src: unsplash('1542314831-068cd1dbfeeb'), alt: 'Resort pool glowing at dusk beneath a pavilion roof' },
  coastalPool: { src: unsplash('1520250497591-112f2f40a3f4'), alt: 'Tropical infinity pool surrounded by palms and thatched villas' },
  coastalSuite: { src: unsplash('1566665797739-1674de7a421a'), alt: 'Guest suite with dark timber panelling and crisp linens' },
  coastalLounge: { src: unsplash('1590490360182-c33d57733427'), alt: 'Hotel room lounge with a tufted sofa and warm lamps' },
  coastalBath: { src: unsplash('1582719478250-c89cae4dc85b'), alt: 'Suite bathroom in dark timber with a sunken tub' },
};
