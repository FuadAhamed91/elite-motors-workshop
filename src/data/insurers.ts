/**
 * Insurers the workshop is an approved repairer for (list supplied by the
 * workshop, September 2026). Names and notes in both languages live in
 * `src/i18n` keyed by id; logos are the insurers' own marks, used only to
 * state this relationship.
 */
export interface Insurer {
  id: string
  name: string
  url: string
  logo: string
  /** Logo aspect ratio (width / height) so tiles reserve the right space. */
  ratio: number
}

export const insurers: readonly Insurer[] = [
  { id: 'dubai-insurance', name: 'Dubai Insurance Company', url: 'https://www.dubins.ae/', logo: '/logos/insurers/dubai-insurance.jpg', ratio: 600 / 298 },
  { id: 'sukoon', name: 'Sukoon Insurance', url: 'https://www.sukoon.com/', logo: '/logos/insurers/sukoon.svg', ratio: 237.89 / 73.28 },
  { id: 'adamjee', name: 'Adamjee Insurance', url: 'https://adamjeeinsurance.ae/', logo: '/logos/insurers/adamjee.svg', ratio: 106.08 / 65.08 },
  { id: 'fidelity-united', name: 'Fidelity United (United Fidelity Insurance)', url: 'https://fidelityunited.ae/', logo: '/logos/insurers/fidelity-united.jpg', ratio: 600 / 167 },
  { id: 'watania-takaful', name: 'Watania Takaful (formerly Noor Takaful)', url: 'https://www.watania.ae/', logo: '/logos/insurers/watania-takaful.svg', ratio: 185.12 / 70.09 },
  { id: 'tokio-marine', name: 'Tokio Marine', url: 'https://www.tokiomarine.com/ae/en.html', logo: '/logos/insurers/tokio-marine.png', ratio: 600 / 149 },
  { id: 'qic', name: 'Qatar Insurance Company (QIC)', url: 'https://qicuae.com/', logo: '/logos/insurers/qic.png', ratio: 600 / 212 },
  { id: 'dni', name: 'Dubai National Insurance', url: 'https://www.dni.ae/', logo: '/logos/insurers/dubai-national-insurance.png', ratio: 400 / 93 },
]
