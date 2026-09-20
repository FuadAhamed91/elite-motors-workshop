// Writes the monochrome (navy) brand marks used by the "All makes" logo wall to
// public/logos/brands/<id>.svg. Most come from simple-icons (CC0 icon data; the marks
// themselves stay the manufacturers' trademarks — shown only to say "we service these").
// Mercedes-Benz and Lexus are not in simple-icons, so simplified marks are drawn here;
// the remaining brands without a mark are shown as wordmarks by the component.
//   node scripts/brand-logos.mjs
import { mkdirSync, writeFileSync } from 'node:fs'
import * as si from 'simple-icons'

const FILL = '#0f1b3d' // navy-900 — the marks sit on cream tiles
const out = 'public/logos/brands'
mkdirSync(out, { recursive: true })

const fromSimpleIcons = {
  bmw: si.siBmw,
  audi: si.siAudi,
  volkswagen: si.siVolkswagen,
  porsche: si.siPorsche,
  mini: si.siMini,
  volvo: si.siVolvo,
  toyota: si.siToyota,
  honda: si.siHonda,
  nissan: si.siNissan,
  infiniti: si.siInfiniti,
  mitsubishi: si.siMitsubishi,
  mazda: si.siMazda,
  hyundai: si.siHyundai,
  kia: si.siKia,
  ford: si.siFord,
  chevrolet: si.siChevrolet,
  jeep: si.siJeep,
  mg: si.siMg,
}

const svg = (body, viewBox = '0 0 24 24') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="${FILL}">${body}</svg>\n`

for (const [id, icon] of Object.entries(fromSimpleIcons)) {
  writeFileSync(`${out}/${id}.svg`, svg(`<path d="${icon.path}"/>`))
}

/* Mercedes-Benz: ring + three tapered points (flat rendering of the star). */
const ring = (r, w) => `<path fill-rule="evenodd" d="M12 ${12 - r}a${r} ${r} 0 1 0 0 ${2 * r}a${r} ${r} 0 1 0 0 ${-2 * r}zM12 ${12 - r + w}a${r - w} ${r - w} 0 1 1 0 ${2 * (r - w)}a${r - w} ${r - w} 0 1 1 0 ${-2 * (r - w)}z"/>`
const spoke = (deg) => `<path transform="rotate(${deg} 12 12)" d="M12 1.6L13.15 12 12 13.3 10.85 12z"/>`
writeFileSync(`${out}/mercedes-benz.svg`, svg(`${ring(11.2, 1.25)}${spoke(0)}${spoke(120)}${spoke(240)}`))

/* Lexus: the oval ring with the slanted L whose two ends run into the ring —
   drawn as one filled shape (ring + L) so the joins are seamless. */
const lexusL = 'M2.4 8.9 4 7.75 10.15 14.25 21.4 14.25 21.4 16.15 8.6 16.15z'
const lexusRing = 'M12 4.1c6.35 0 11.5 3.54 11.5 7.9S18.35 19.9 12 19.9.5 16.36.5 12 5.65 4.1 12 4.1zm0 1.7C6.6 5.8 2.2 8.58 2.2 12S6.6 18.2 12 18.2s9.8-2.78 9.8-6.2S17.4 5.8 12 5.8z'
writeFileSync(`${out}/lexus.svg`, svg(`<path fill-rule="evenodd" d="${lexusRing}"/><path d="${lexusL}"/>`))

console.log('brand marks written to', out)
