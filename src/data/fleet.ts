export type FleetKind = 'rental' | 'taxi' | 'bakery'

export interface FleetClient {
  id: string
  name: string
  /** The client's own website (opens in a new tab). */
  url: string
  kind: FleetKind
  /** The company's logo in /logos/fleet (their own mark, shown to say "we service their fleet"). */
  logo: string
  /** Width ÷ height of the logo file, for the img size hints. */
  ratio: number
}

const client = (id: string, name: string, url: string, kind: FleetKind, ratio: number): FleetClient => ({
  id,
  name,
  url,
  kind,
  logo: `/logos/fleet/${id}.png`,
  ratio,
})

/**
 * Fleet customers the owner named (2026-09-20), with their logos. Labels for
 * the kinds live in `src/i18n` under `fleet.kinds`.
 */
export const fleetClients: readonly FleetClient[] = [
  client('kabi', 'Kabi Taxi', 'https://www.kabi.ae/', 'taxi', 2.4),
  client('dollar', 'Dollar Rent a Car', 'https://www.dollaruae.com/', 'rental', 2.63),
  client('thrifty', 'Thrifty Rent a Car', 'https://www.thriftyuae.com/', 'rental', 2.86),
  client('legend', 'Legend Rent a Car', 'https://www.legendrentacar.com/', 'rental', 3.09),
  client('city-star', 'City Star Rent a Car', 'https://citystarrentacar.com/', 'rental', 3.48),
  client('bake-al-arab', 'Bake Al Arab', 'https://www.bakealarab.com/', 'bakery', 1.27),
]
