import type { LucideIcon } from 'lucide-react'
import { Award, BadgeCheck, PackageCheck, ShieldCheck } from 'lucide-react'
import { workshop } from '@/config/workshop'

const yearsInBusiness = new Date().getFullYear() - workshop.foundedYear

export interface Stat {
  id: string
  value: string
  label: string
  icon: LucideIcon
}

export const stats: readonly Stat[] = [
  { id: 'years', value: `${yearsInBusiness}+`, label: `Years in Mussafah · since ${workshop.foundedYear}`, icon: Award },
  { id: 'insurance', value: 'Insurance', label: 'Approved Body & Paint Shop', icon: ShieldCheck },
  { id: 'techs', value: 'All makes', label: 'European, Japanese, Korean, American & Chinese cars', icon: BadgeCheck },
  { id: 'parts', value: 'Genuine', label: 'OEM Parts Only', icon: PackageCheck },
]
