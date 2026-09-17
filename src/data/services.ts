import type { LucideIcon } from 'lucide-react'
import {
  Cog,
  Cpu,
  Disc3,
  Droplets,
  Hammer,
  PaintBucket,
  Snowflake,
  Sparkles,
} from 'lucide-react'

export interface ServiceImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface Service {
  id: string
  /** Exact name passed into the WhatsApp message. */
  name: string
  /** Short heading shown on the card (kept punchy for mobile). */
  title: string
  description: string
  /** What is included — rendered as check-list chips. */
  includes: readonly string[]
  icon: LucideIcon
  /** Highlights climate-critical or most-requested services. */
  badge?: string
  /** Accent used for the icon tile + hover glow. */
  accent: 'primary' | 'secondary'
  /** Photo from the workshop (number plates redacted). */
  image: ServiceImage
}

/**
 * Services as listed in the Elite Motors Workshop company profile:
 * mechanical works (engine, gear, general service, oil change, AC, radiator,
 * brakes, suspension, tyre alignment), denting, painting, electrical,
 * computer diagnosis and express detailing.
 */
export const services: readonly Service[] = [
  {
    id: 'engine',
    name: 'Engine & Gearbox Repair',
    title: 'Engine & Gearbox Repair',
    description:
      'Engine work from timing and gaskets to full rebuilds, plus automatic and manual gearbox repairs — with a 2-tonne engine crane for removal and installation.',
    includes: ['Engine repair & rebuild', 'Gearbox & transmission work', 'Clutch, mounts & drivetrain'],
    icon: Cog,
    accent: 'secondary',
    image: { src: '/photos/card-engine.jpg', alt: 'Car raised on a two-post lift with the bonnet open in the workshop', width: 600, height: 450 },
  },
  {
    id: 'service',
    name: 'General Service & Oil Change',
    title: 'General Service & Oil Change',
    description:
      'Scheduled servicing at the intervals your manufacturer specifies: engine oil and filters, fluids, belts and a full inspection, recorded in your service book.',
    includes: ['Engine oil & filter change', 'Fluids, belts & filters', 'Multi-point inspection'],
    icon: Droplets,
    badge: 'Most requested',
    accent: 'primary',
    image: { src: '/photos/workshop-hall.jpg', alt: 'The main service hall with vehicle lifts and a technician at work', width: 1600, height: 1200 },
  },
  {
    id: 'ac',
    name: 'AC & Radiator Service',
    title: 'AC & Radiator Service',
    description:
      'Ice-cold cabin air for Abu Dhabi summers and a cooling system that copes with 45°C traffic — AC repair and regas, radiator flushing, thermostat and water pump work.',
    includes: ['AC repair, leak test & regas', 'Radiator flush & replacement', 'Thermostat & water pump'],
    icon: Snowflake,
    badge: 'UAE summer essential',
    accent: 'secondary',
    image: { src: '/photos/card-ac.jpg', alt: 'SUV raised on a lift for cooling system work', width: 550, height: 420 },
  },
  {
    id: 'brakes',
    name: 'Brakes, Suspension & Tyre Alignment',
    title: 'Brakes, Suspension & Alignment',
    description:
      'Pads, discs and calipers with an in-house brake lathe for rotors and drums, suspension repairs, and wheel alignment to manufacturer specifications.',
    includes: ['Brake pads, discs & lathe work', 'Shocks, bushes & links', 'Wheel alignment & bearings'],
    icon: Disc3,
    accent: 'primary',
    image: { src: '/photos/card-brakes.jpg', alt: 'Vehicle on a lift for brake and suspension work', width: 450, height: 420 },
  },
  {
    id: 'body',
    name: 'Denting & Accident Repair',
    title: 'Denting & Accident Repair',
    description:
      'Dent removal, panel and bumper repairs and full accident restoration on a Car-O-Liner measuring bench — insurance-approved, with claims handled for you.',
    includes: ['Dent & panel repair', 'Chassis measuring & straightening', 'Insurance claim repairs'],
    icon: Hammer,
    badge: 'Insurance approved',
    accent: 'secondary',
    image: { src: '/photos/body-shop.jpg', alt: 'Body shop bench with bumpers and panels being repaired', width: 1350, height: 960 },
  },
  {
    id: 'paint',
    name: 'Painting',
    title: 'Painting & Refinishing',
    description:
      'Factory-quality finishes in a full-size paint booth with a drying oven: colour-matched panel resprays, full repaints and clear-coat correction.',
    includes: ['Full-size booth with drying oven', 'Colour matching & resprays', 'Clear coat & polishing'],
    icon: PaintBucket,
    accent: 'primary',
    image: { src: '/photos/paint-booth.jpg', alt: 'The workshop’s enclosed paint booth with red doors', width: 1600, height: 1200 },
  },
  {
    id: 'electrical',
    name: 'Electrical & Computer Diagnosis',
    title: 'Electrical & Computer Diagnosis',
    description:
      'Starting, charging and warning-light faults traced with the Launch X431 scanner — reads ECM fault codes on European, Japanese and Korean vehicles.',
    includes: ['OBD scan & fault report', 'Battery, alternator & starter', 'Wiring & sensor repairs'],
    icon: Cpu,
    accent: 'secondary',
    image: { src: '/photos/card-electrical.jpg', alt: 'Technician walking between vehicle lifts in the service hall', width: 600, height: 450 },
  },
  {
    id: 'detailing',
    name: 'Express Detailing',
    title: 'Express Detailing & Wash',
    description:
      'Interior and exterior detailing in the dedicated wash bay — a proper clean-up after every repair, or on its own to keep the car looking its best.',
    includes: ['Exterior wash & polish', 'Interior deep clean', 'Engine bay cleaning'],
    icon: Sparkles,
    accent: 'primary',
    image: { src: '/photos/wash-bay.jpg', alt: 'Two vehicles in the covered wash bay', width: 1600, height: 1200 },
  },
]

/** Makes the workshop services (from the company profile). */
export const brands = {
  European: ['Mercedes-Benz', 'BMW', 'Volkswagen', 'Audi', 'Porsche'],
  Japanese: ['Toyota', 'Lexus', 'Honda', 'Nissan', 'Infiniti', 'Mitsubishi'],
  Korean: ['Hyundai', 'Kia'],
} as const
