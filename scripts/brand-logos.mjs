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

/* Lexus: oval ring with a bold L. */
const oval = `<path fill-rule="evenodd" d="M12 3.6c6.3 0 11.4 3.76 11.4 8.4S18.3 20.4 12 20.4.6 16.64.6 12 5.7 3.6 12 3.6zm0 1.35C6.45 4.95 1.95 8.1 1.95 12S6.45 19.05 12 19.05 22.05 15.9 22.05 12 17.55 4.95 12 4.95z"/>`
const L = `<path d="M7.4 7.3h2.6v7.55h6.9v2.05H7.4z"/>`
writeFileSync(`${out}/lexus.svg`, svg(`${oval}${L}`))

console.log('brand marks written to', out)
