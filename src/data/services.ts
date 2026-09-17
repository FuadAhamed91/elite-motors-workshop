import type { LucideIcon } from 'lucide-react'
import {
  ClipboardCheck,
  Cog,
  Cpu,
  Disc3,
  Droplets,
  Snowflake,
} from 'lucide-react'

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
}

export const services: readonly Service[] = [
  {
    id: 'diagnostics',
    name: 'Engine Diagnostics & Computer Scanning',
    title: 'Engine Diagnostics & Computer Scanning',
    description:
      'OBD computer scanning that pinpoints check-engine lights, misfires and sensor faults before they become expensive.',
    includes: ['Full ECU scan', 'Live data analysis', 'Written fault report'],
    icon: Cpu,
    badge: 'Most requested',
    accent: 'secondary',
  },
  {
    id: 'maintenance',
    name: 'Routine Periodic Maintenance & Fluid Changes',
    title: 'Periodic Maintenance & Fluid Changes',
    description:
      'Manufacturer-schedule servicing with genuine filters and fluids, so your warranty and resale value stay intact.',
    includes: ['Engine oil & filter', 'Brake, coolant & ATF fluids', 'Multi-point safety check'],
    icon: Droplets,
    accent: 'primary',
  },
  {
    id: 'ac',
    name: 'AC Repair & Cooling System Diagnostics',
    title: 'AC Repair & Cooling System',
    description:
      'Ice-cold cabin air for 45°C summers. Leak detection, compressor repair, radiator and thermostat service.',
    includes: ['Refrigerant leak test', 'Compressor & condenser', 'Radiator & thermostat'],
    icon: Snowflake,
    badge: 'UAE summer essential',
    accent: 'secondary',
  },
  {
    id: 'brakes',
    name: 'Brake System, Suspension & Wheel Alignment',
    title: 'Brakes, Suspension & Alignment',
    description:
      'Pads, discs, shocks and precision wheel alignment for a straight, silent and confident drive on Abu Dhabi highways.',
    includes: ['Pads, discs & calipers', 'Shocks, bushes & links', 'Wheel alignment & balancing'],
    icon: Disc3,
    accent: 'primary',
  },
  {
    id: 'transmission',
    name: 'Transmission & Drivetrain Overhauls',
    title: 'Transmission & Drivetrain',
    description:
      'Automatic, CVT and 4×4 specialists. From slipping gears to full rebuilds, diagnosed honestly and fixed right.',
    includes: ['Gearbox service & rebuild', 'Differential & transfer case', 'Clutch & CV joints'],
    icon: Cog,
    accent: 'secondary',
  },
  {
    id: 'inspection',
    name: 'Pre-Purchase Vehicle Inspection',
    title: 'Pre-Purchase Vehicle Inspection',
    description:
      'Buying used? A comprehensive inspection uncovers accident repairs, hidden leaks and odometer red flags before you pay.',
    includes: ['Comprehensive checklist', 'Paint depth & chassis check', 'Written report'],
    icon: ClipboardCheck,
    accent: 'primary',
  },
]
