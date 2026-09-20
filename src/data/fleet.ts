export type FleetKind = 'rental' | 'taxi' | 'delivery'

export interface FleetClient {
  id: string
  name: string
  /** The client's own website (opens in a new tab); omit when we could not find one. */
  url?: string
  kind: FleetKind
}

/**
 * Fleet customers the owner named (2026-09-20). Shown as name tiles that link
 * to the companies' sites — no logos, so nothing to license. Labels for the
 * kinds live in `src/i18n` under `fleet.kinds`.
 */
export const fleetClients: readonly FleetClient[] = [
  { id: 'kabi', name: 'Kabi Taxi', url: 'https://www.kabi.ae/', kind: 'taxi' },
  { id: 'dollar', name: 'Dollar Rent a Car', url: 'https://www.dollaruae.com/', kind: 'rental' },
  { id: 'thrifty', name: 'Thrifty Rent a Car', url: 'https://www.thriftyuae.com/', kind: 'rental' },
  { id: 'legend', name: 'Legend Rent a Car', url: 'https://www.legendrentacar.com/', kind: 'rental' },
  { id: 'city-star', name: 'City Star Rent a Car', url: 'https://citystarrentacar.com/', kind: 'rental' },
  { id: 'bake-al-arab', name: 'Bake Al Arab', url: 'https://www.bakealarab.com/', kind: 'delivery' },
]
