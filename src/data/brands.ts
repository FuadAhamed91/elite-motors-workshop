export type BrandRegion = 'European' | 'Japanese' | 'Korean' | 'American' | 'Chinese'

export interface Brand {
  id: string
  name: string
  region: BrandRegion
  /** Navy monochrome mark in /logos/brands (see scripts/brand-logos.mjs); brands without one show a wordmark. */
  logo?: string
  /** Rendered height of the mark in px (wide marks such as Mini and Ford get a little less). */
  height?: number
}

const mark = (id: string, name: string, region: BrandRegion, height?: number): Brand => ({ id, name, region, logo: `/logos/brands/${id}.svg`, height })
const word = (id: string, name: string, region: BrandRegion): Brand => ({ id, name, region })

/**
 * Makes the workshop services, in the order they scroll across the logo wall.
 * The company profile lists the European, Japanese and Korean makes; the
 * American and Chinese ones and the extra European/Japanese makes are cars
 * that come through the yard (see the before/after photos) — trim if the owner prefers.
 */
export const brandWall: readonly Brand[] = [
  mark('mercedes-benz', 'Mercedes-Benz', 'European'),
  mark('bmw', 'BMW', 'European'),
  mark('audi', 'Audi', 'European', 40),
  mark('volkswagen', 'Volkswagen', 'European'),
  mark('porsche', 'Porsche', 'European'),
  mark('toyota', 'Toyota', 'Japanese'),
  mark('lexus', 'Lexus', 'Japanese'),
  mark('honda', 'Honda', 'Japanese'),
  mark('nissan', 'Nissan', 'Japanese'),
  mark('infiniti', 'Infiniti', 'Japanese', 40),
  mark('mitsubishi', 'Mitsubishi', 'Japanese'),
  mark('hyundai', 'Hyundai', 'Korean', 40),
  mark('kia', 'Kia', 'Korean', 34),
  word('land-rover', 'Land Rover', 'European'),
  mark('mini', 'Mini', 'European', 40),
  mark('volvo', 'Volvo', 'European'),
  word('alfa-romeo', 'Alfa Romeo', 'European'),
  mark('mazda', 'Mazda', 'Japanese'),
  mark('ford', 'Ford', 'American', 44),
  mark('chevrolet', 'Chevrolet', 'American', 34),
  mark('jeep', 'Jeep', 'American', 34),
  word('gmc', 'GMC', 'American'),
  word('changan', 'Changan', 'Chinese'),
  mark('mg', 'MG', 'Chinese', 40),
  word('geely', 'Geely', 'Chinese'),
  word('chery', 'Chery', 'Chinese'),
  word('byd', 'BYD', 'Chinese'),
  word('haval', 'Haval', 'Chinese'),
  word('jetour', 'Jetour', 'Chinese'),
]

/** Names grouped by region — the text lists used by the assistant and the services copy. */
export const brandsByRegion: Record<BrandRegion, readonly string[]> = {
  European: brandWall.filter((b) => b.region === 'European').map((b) => b.name),
  Japanese: brandWall.filter((b) => b.region === 'Japanese').map((b) => b.name),
  Korean: brandWall.filter((b) => b.region === 'Korean').map((b) => b.name),
  American: brandWall.filter((b) => b.region === 'American').map((b) => b.name),
  Chinese: brandWall.filter((b) => b.region === 'Chinese').map((b) => b.name),
}
