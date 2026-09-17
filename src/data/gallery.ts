export interface GalleryPhoto {
  id: string
  /** Full-size image (max 1400px) shown in the lightbox. */
  src: string
  /** 800px version for grids and cards. */
  thumb: string
  alt: string
  caption: string
  width: number
  height: number
}

/**
 * Photos of the workshop in Mussafah. All vehicle number plates in these
 * images have been blurred before publishing. Each JPEG has a WebP sibling.
 */
export const gallery: readonly GalleryPhoto[] = [
  { id: 'hall', src: '/photos/workshop-hall.jpg', thumb: '/photos/workshop-hall-thumb.jpg', alt: 'Main service hall with two-post lifts', caption: 'Main service hall', width: 1400, height: 1050 },
  { id: 'wash', src: '/photos/wash-bay.jpg', thumb: '/photos/wash-bay-thumb.jpg', alt: 'Covered wash bay', caption: 'Wash & detailing bay', width: 1400, height: 1050 },
  { id: 'front', src: '/photos/workshop-front.jpg', thumb: '/photos/workshop-front-thumb.jpg', alt: 'Workshop entrance with signage and palm trees', caption: 'The entrance on Mussafah M21', width: 1400, height: 1050 },
  { id: 'reception', src: '/photos/reception.jpg', thumb: '/photos/reception-thumb.jpg', alt: 'Reception desk with the EMW logo', caption: 'Reception', width: 1400, height: 1050 },
  { id: 'lounge', src: '/photos/lounge.jpg', thumb: '/photos/lounge-thumb.jpg', alt: 'Customer waiting lounge with sofas', caption: 'Customer lounge', width: 1400, height: 1050 },
  { id: 'paint-wide', src: '/photos/paint-booth-wide.jpg', thumb: '/photos/paint-booth-wide-thumb.jpg', alt: 'Paint booth seen from the workshop floor', caption: 'Paint booth entry', width: 1400, height: 1050 },
]

/** The facilities that back specific services — shown with the services grid. */
export const facilities: readonly (GalleryPhoto & { service: string; blurb: string })[] = [
  { id: 'paint', service: 'Painting', blurb: 'Full-size paint booth with drying oven', src: '/photos/paint-booth.jpg', thumb: '/photos/paint-booth-thumb.jpg', alt: 'Enclosed paint booth with red doors', caption: 'Paint booth', width: 1400, height: 1050 },
  { id: 'body', service: 'Denting & accident repair', blurb: 'Measuring bench for chassis and panel work', src: '/photos/body-shop.jpg', thumb: '/photos/body-shop-thumb.jpg', alt: 'Body shop bench with panels being repaired', caption: 'Body shop', width: 1350, height: 960 },
  { id: 'lifts', service: 'Mechanical work', blurb: 'Two-post lifts for engine, gearbox and brake jobs', src: '/photos/lifts.jpg', thumb: '/photos/lifts-thumb.jpg', alt: 'Vehicles raised on lifts with a technician at work', caption: 'Mechanical bays', width: 1400, height: 1050 },
]

/** Everything the gallery viewer can browse: the gallery set followed by the three facility photos. */
export const photos: readonly GalleryPhoto[] = [...gallery, ...facilities]

/** Equipment highlights from the company profile. */
export const equipment: readonly { title: string; detail: string }[] = [
  { title: 'Full-size paint booth', detail: 'with drying oven for factory-quality finishes' },
  { title: 'Car-O-Liner measuring system', detail: 'wireless chassis measurement against a 15,000+ vehicle database' },
  { title: 'Launch X431 diagnostics', detail: 'ECM fault codes on European, Japanese and Korean cars' },
  { title: 'Brake lathe', detail: 'turns rotors and drums for a true, shudder-free finish' },
  { title: 'Engine crane & bearing press', detail: '2-tonne crane; press-fit wheel bearings and bushes' },
  { title: 'Engineer-supervised team', detail: 'trained technicians under a U.S.-certified auto engineer' },
]
