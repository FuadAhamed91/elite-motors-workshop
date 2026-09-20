export type BrandRegion = 'European' | 'Japanese' | 'Korean' | 'American' | 'Chinese'

export interface Brand {
  id: string
  name: string
  region: BrandRegion
  /** The manufacturer's own logo, in its original colours, in /logos/brands. */
  logo: string
  /** Rendered height of the logo in px — wordmarks sit smaller than emblems so the row looks even. */
  height: number
}

const svg = (id: string, name: string, region: BrandRegion, height: number): Brand => ({ id, name, region, logo: `/logos/brands/${id}.svg`, height })
const png = (id: string, name: string, region: BrandRegion, height: number): Brand => ({ id, name, region, logo: `/logos/brands/${id}.png`, height })

/**
 * Makes the workshop services, in the order they scroll across the logo wall.
 * Logos are the manufacturers' trademarks (mostly the SVGs kept on Wikimedia
 * Commons; three heavy ones rasterised to PNG), shown only to say "we service
 * these" — never imply an official dealership. Alfa Romeo is the brand's own
 * single-colour badge; the coloured one is not freely available.
 */
export const brandWall: readonly Brand[] = [
  png('mercedes-benz', 'Mercedes-Benz', 'European', 52),
  svg('bmw', 'BMW', 'European', 52),
  svg('audi', 'Audi', 'European', 30),
  svg('volkswagen', 'Volkswagen', 'European', 52),
  svg('porsche', 'Porsche', 'European', 20),
  svg('toyota', 'Toyota', 'Japanese', 28),
  svg('lexus', 'Lexus', 'Japanese', 44),
  svg('honda', 'Honda', 'Japanese', 40),
  svg('nissan', 'Nissan', 'Japanese', 48),
  svg('infiniti', 'Infiniti', 'Japanese', 30),
  svg('mitsubishi', 'Mitsubishi', 'Japanese', 50),
  svg('hyundai', 'Hyundai', 'Korean', 24),
  svg('kia', 'Kia', 'Korean', 26),
  svg('land-rover', 'Land Rover', 'European', 40),
  svg('mini', 'Mini', 'European', 34),
  svg('volvo', 'Volvo', 'European', 22),
  svg('alfa-romeo', 'Alfa Romeo', 'European', 52),
  png('mazda', 'Mazda', 'Japanese', 46),
  svg('ford', 'Ford', 'American', 40),
  svg('chevrolet', 'Chevrolet', 'American', 44),
  svg('jeep', 'Jeep', 'American', 34),
  png('gmc', 'GMC', 'American', 26),
  svg('changan', 'Changan', 'Chinese', 48),
  svg('mg', 'MG', 'Chinese', 50),
  svg('geely', 'Geely', 'Chinese', 34),
  svg('chery', 'Chery', 'Chinese', 40),
  svg('byd', 'BYD', 'Chinese', 24),
  svg('haval', 'Haval', 'Chinese', 20),
  svg('jetour', 'Jetour', 'Chinese', 18),
]

/** Names grouped by region — the text lists used by the assistant and the services copy. */
export const brandsByRegion: Record<BrandRegion, readonly string[]> = {
  European: brandWall.filter((b) => b.region === 'European').map((b) => b.name),
  Japanese: brandWall.filter((b) => b.region === 'Japanese').map((b) => b.name),
  Korean: brandWall.filter((b) => b.region === 'Korean').map((b) => b.name),
  American: brandWall.filter((b) => b.region === 'American').map((b) => b.name),
  Chinese: brandWall.filter((b) => b.region === 'Chinese').map((b) => b.name),
}
