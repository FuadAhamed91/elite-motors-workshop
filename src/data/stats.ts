import { workshop } from '@/config/workshop'

const yearsInBusiness = new Date().getFullYear() - workshop.foundedYear

export interface Stat {
  id: string
  value: string
  label: string
}

export const stats: readonly Stat[] = [
  { id: 'years', value: `${yearsInBusiness}+`, label: `Years in Mussafah · since ${workshop.foundedYear}` },
  { id: 'insurance', value: 'Insurance', label: 'Approved Body & Paint Shop' },
  { id: 'techs', value: 'All makes', label: 'European, Japanese, Korean, American & Chinese cars' },
  { id: 'parts', value: 'Genuine', label: 'OEM Parts Only' },
]
