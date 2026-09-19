import type { GalleryPhoto } from '@/data/gallery'

export type RepairStage = 'before' | 'after'

export interface RepairPair {
  id: string
  /** Car name and a one-line description of the job live in `src/i18n` under `beforeAfter.cars`. */
  before: RepairShot
  after: RepairShot
}

export interface RepairShot {
  width: number
  height: number
  /** `object-position` for the cropped card thumbnails, so the car (not the background) stays in frame. */
  focus: string
}

const shot = (width: number, height: number, focus = '50% 50%'): RepairShot => ({ width, height, focus })

/**
 * Accident repairs from the body shop, photographed on arrival and after the
 * repair. Every number plate (including plates lying on dashboards and cars in
 * the background) has been blurred before publishing, and the wash bay's green
 * floor paint was retouched to plain concrete. Files live in /photos/repairs
 * as `<id>-before.jpg` / `<id>-after.jpg` with -thumb (800px) and .webp siblings.
 */
export const repairs: readonly RepairPair[] = [
  { id: 'bmw-5-series', before: shot(1400, 788, '30% 50%'), after: shot(1280, 720, '40% 50%') },
  { id: 'toyota-hilux', before: shot(1400, 1050, '50% 55%'), after: shot(1280, 720, '50% 50%') },
  { id: 'alfa-romeo-giulia', before: shot(1400, 1050, '50% 45%'), after: shot(1400, 1054, '45% 55%') },
  { id: 'nissan-x-trail', before: shot(1400, 647, '30% 50%'), after: shot(1400, 787, '45% 55%') },
  { id: 'toyota-land-cruiser', before: shot(1400, 1050, '40% 50%'), after: shot(1400, 1054, '45% 55%') },
  { id: 'honda-civic', before: shot(1400, 1050, '40% 50%'), after: shot(1400, 787, '55% 55%') },
  { id: 'changan-suv', before: shot(1400, 647, '35% 50%'), after: shot(1280, 963, '45% 50%') },
]

/** Paths of a shot's image files. */
export function repairSrc(id: string, stage: RepairStage): Pick<GalleryPhoto, 'src' | 'thumb'> {
  return { src: `/photos/repairs/${id}-${stage}.jpg`, thumb: `/photos/repairs/${id}-${stage}-thumb.jpg` }
}
