import type { LucideIcon } from 'lucide-react'
import { Award, BadgeCheck, PackageCheck, ShieldCheck } from 'lucide-react'

export interface Stat {
  id: string
  value: string
  label: string
  icon: LucideIcon
}

export const stats: readonly Stat[] = [
  { id: 'years', value: '15+', label: 'Years Serving Abu Dhabi', icon: Award },
  { id: 'insurance', value: 'Insurance', label: 'Approved Body Shop', icon: ShieldCheck },
  { id: 'techs', value: 'Certified', label: 'Master Technicians', icon: BadgeCheck },
  { id: 'parts', value: 'Genuine', label: 'OEM Parts Only', icon: PackageCheck },
]
