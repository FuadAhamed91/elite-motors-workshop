export interface GalleryPhoto {
  id: string
  /** Full-size image (max 1600px) shown in the lightbox. */
  src: string
  /** Lighter 800px version for the grid. */
  thumb: string
  alt: string
  caption: string
  width: number
  height: number
}

/**
 * Photos of the workshop in Mussafah. All vehicle number plates in these
 * images have been blurred before publishing.
 */
export const gallery: readonly GalleryPhoto[] = [
  { id: 'hall', src: '/photos/workshop-hall.jpg', thumb: '/photos/workshop-hall-thumb.jpg', alt: 'Main service hall with two-post lifts', caption: 'Main service hall — multiple two-post lifts under one roof', width: 1600, height: 1200 },
  { id: 'lifts', src: '/photos/lifts.jpg', thumb: '/photos/lifts-thumb.jpg', alt: 'Vehicles raised on lifts with a technician at work', caption: 'Mechanical bays', width: 1600, height: 1200 },
  { id: 'paint', src: '/photos/paint-booth.jpg', thumb: '/photos/paint-booth-thumb.jpg', alt: 'Enclosed paint booth with drying oven', caption: 'Full-size paint booth with drying oven', width: 1600, height: 1200 },
  { id: 'body', src: '/photos/body-shop.jpg', thumb: '/photos/body-shop-thumb.jpg', alt: 'Body shop bench with panels being repaired', caption: 'Body shop — measuring bench and panel repair', width: 1350, height: 960 },
  { id: 'wash', src: '/photos/wash-bay.jpg', thumb: '/photos/wash-bay-thumb.jpg', alt: 'Covered wash bay', caption: 'Wash & detailing bay', width: 1600, height: 1200 },
  { id: 'front', src: '/photos/workshop-front.jpg', thumb: '/photos/workshop-front-thumb.jpg', alt: 'Workshop entrance with signage and palm trees', caption: 'The entrance on Mussafah M21', width: 1600, height: 1200 },
  { id: 'reception', src: '/photos/reception.jpg', thumb: '/photos/reception-thumb.jpg', alt: 'Reception desk with the EMW logo', caption: 'Reception', width: 1600, height: 1200 },
  { id: 'lounge', src: '/photos/lounge.jpg', thumb: '/photos/lounge-thumb.jpg', alt: 'Customer waiting lounge with sofas', caption: 'Customer lounge', width: 1600, height: 1200 },
  { id: 'paint-wide', src: '/photos/paint-booth-wide.jpg', thumb: '/photos/paint-booth-wide-thumb.jpg', alt: 'Paint booth seen from the workshop floor', caption: 'Paint booth entry', width: 1600, height: 1200 },
  { id: 'office', src: '/photos/office.jpg', thumb: '/photos/office-thumb.jpg', alt: 'Service advisors at their desks in the office', caption: 'Service office', width: 1600, height: 1200 },
  { id: 'desk', src: '/photos/reception-desk.jpg', thumb: '/photos/reception-desk-thumb.jpg', alt: 'Front desk with Elite Motors Workshop branding', caption: 'Front desk', width: 1600, height: 1200 },
]

/** Equipment highlights from the company profile. */
export const equipment: readonly { title: string; detail: string }[] = [
  { title: 'Full-size paint booth', detail: 'with drying oven for factory-quality finishes' },
  { title: 'Car-O-Liner measuring system', detail: 'wireless chassis measurement against a 15,000+ vehicle database' },
  { title: 'Launch X431 diagnostics', detail: 'ECM fault codes on European, Japanese and Korean cars' },
  { title: 'Brake lathe', detail: 'turns rotors and drums for a true, shudder-free finish' },
  { title: 'Engine crane & bearing press', detail: '2-tonne crane; press-fit wheel bearings and bushes' },
  { title: 'Engineer-supervised team', detail: 'trained technicians under a U.S.-certified auto engineer' },
]
