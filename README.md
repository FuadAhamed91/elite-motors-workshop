# Elite Motors Workshop — Landing Page

High-conversion landing page for **Elite Motors Workshop**, an auto service and repair centre
in Mussafah, Abu Dhabi. Warm beige/cream palette with electric green & cyan accents,
21st.dev-style spotlight cards, Framer Motion reveals and Lucide icons.

No booking wizards, calendars or lead forms. Every call to action is the landline (`tel:`) or
Google Maps directions; WhatsApp is reached only from the floating button at the bottom right
(and the assistant's answer when someone asks about WhatsApp).

## Stack

- Vite 8 + React 19 + TypeScript (strict)
- Tailwind CSS v4 (design tokens in `src/index.css` — primitive → semantic layers; the whole
  palette, including the beige theme, is defined there)
- framer-motion (scroll reveals, stagger, mobile nav) — honours `prefers-reduced-motion`
- lucide-react icons

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build → dist/
npm run preview    # serve the production build locally
```

## Configuration — `src/config/workshop.ts`

Everything business-specific lives in one file. Every section, CTA, the live status badge,
the map and the SEO schema read from it.

| Key | What it drives |
| --- | --- |
| `name`, `displayTitle`, `tagline`, `city` | Navbar, hero, footer, `<title>`, JSON-LD |
| `whatsappNumber` | The floating WhatsApp button → `https://wa.me/971565017797?text=...` (never displayed as a phone number, never a page CTA) |
| `phone` | Landline — the only number shown; every "Call" CTA (`tel:` link) |
| `schedule` | Live **Open Now / Open Today / Closed** badge + weekly schedule card |
| `hoursSummary`, `breakLabel` | Footer text and schedule legend |
| `address`, `mapEmbedUrl`, `mapsLink`, `directionsLink` | Location section + map iframe (Google pin: Musaffah M21) |
| `googleReviews` | Review count + link to the Google review list (no star average is shown) |
| `nav` | Navbar and footer quick links |

Content lives in `src/data/`:

- `services.ts` — six informational service cards (no per-service booking buttons)
- `reviews.ts` — short excerpts of the top 5-star Google reviews (captured Sept 2026), each linking to Google
- `stats.ts` — trust strip figures

The EMW logo is a vector recreation in `src/components/icons/BrandMark.tsx` (brand colours
live as `--color-brand-*` tokens); `Logo.tsx` offers `inline` (navbar) and `stacked`
(footer) lockups.

## How the live status works

`src/lib/hours.ts` evaluates the structured schedule in **Asia/Dubai** time (via `Intl`), so
the badge is correct for visitors anywhere in the world. It distinguishes:

- **Open Now** · closes at …
- **Open Today** · on break, back at … / opens at …
- **Closed** · opens tomorrow / opens Mon …

Hours are Monday–Saturday 8:00 AM–1:00 PM and 2:00 PM–5:30 PM with Sunday closed. Adjust in
`workshop.schedule`; a per-day `note` (e.g. a prayer break) renders as a badge on that row.

## Calls to action

- **Call** — `buildTelLink(workshop.phone)` in the navbar (text on desktop, icon on phones),
  hero, services prompt, hours card (while open), location card and footer.
- **Get Directions** — `workshop.directionsLink` in the hero, mobile menu, hours card (while
  closed), location card and footer.
- **WhatsApp** — only the floating button (`WhatsAppFab`, pre-filled quote message from
  `src/lib/whatsapp.ts`) and the assistant's WhatsApp answer.

## Opening intro

Two variants live in `src/components/intro/`; pick one with `variant` in `src/config/intro.ts`
(`'splash'` is active, `'lights-out'` is the approved earlier version — git tag `v1-approved-intro`).

**`splash`** — `SplashIntro.tsx`: a full-screen overlay (`z-index: 9999`) on the site's cream/beige
gradient with a faint grain and vignette. A single row of three start lights comes on, holds,
and goes out; then a top-down F1 car (`TopDownF1Car.tsx`, 400×1100 SVG with metallic gradients,
halo, slick tyres) starts at `translateY(100vh)` and accelerates straight up to
`translateY(-120vh)` over 2 s on `cubic-bezier(0.7, 0, 0.84, 0)`. Speed cues: twin skid marks
fading behind the launch slot, velocity-driven stretch and blur trail, rushing track streaks, and
an exhaust plume distorted by an SVG heat-haze filter. As the car clears the top the backdrop
fades (400 ms) and the overlay unmounts.

**`lights-out`** — `RaceIntro.tsx`: F1 start-light gantry, side-view car launches across a track
and wipes the overlay away behind it; synthesized engine sound on tap.

Shared behaviour (`src/hooks/useIntroGate.ts`): the site DOM is `inert` while an intro is up,
`sessionStorage.hasSeenIntro` skips it on refresh within the session, a **Skip** button and
Escape bypass it, it is disabled for `prefers-reduced-motion`, and it waits for the tab to be
visible before playing. Dev review switches: `?intro=replay`, `?intro=slow`, `?intro=freeze`
(splash: car parked mid-screen), `?intro=skip` (no intro — for layout reviews and screenshots).
Only the selected variant ships in the main bundle; the other is a lazy chunk.

## Content & photos

Services, equipment highlights, brands and the founding year come from the company profile
(`src/data/services.ts`, `src/data/gallery.ts`, `workshop.foundedYear`). The old "basic profile"
page (staff counts, previous phone numbers) is intentionally not used.

`public/photos/` holds the workshop photos: the hero (service hall), the About banner
(`entrance-canopy`), the three facility photos under the services grid (paint booth, body shop,
lifts) and the **Gallery** subsection in the Workshop section — a cover photo plus thumbnails that
open a full-screen viewer (arrows, keyboard, swipe, thumbnail strip) over all nine photos
(`photos` in `src/data/gallery.ts`). Each photo exists as `name.jpg` + `name.webp` (max 1400px)
and `name-thumb.jpg` + `name-thumb.webp` (800px, used in grids and on phones via `srcset`);
`Picture.tsx` serves the WebP automatically. **Every vehicle number plate was blurred before the images were added** — if
you add new photos, redact plates first and keep them out of the repo otherwise.

## On-site assistant

`src/components/assistant/AssistantWidget.tsx` is a small chat panel (launcher above the WhatsApp
button). It is **rule-based and runs entirely in the browser** — no API, no keys, nothing sent
anywhere. `src/lib/assistant.ts` matches the question against intents (open now, hours incl.
specific days, location/directions, phone, WhatsApp, services and each service card, body shop &
insurance, prices, reviews, booking, parts, experience) and builds every answer from the site's own
config and data, with call/maps links (a WhatsApp link only when someone asks how to get in
touch or about WhatsApp). Anything outside that scope gets the landline.
Copy and quick replies live in `src/config/assistant.ts`; set `enabled: false` to remove it.

## Performance notes

- Only `transform`/`opacity` animate (looping textures translate a doubled pattern; the animated
  border rotates a gradient behind the card); no `backdrop-filter` on cards; hero glows are
  gradients, not large blurs.
- Page reveals are held while the intro is up and play as it fades (`IntroActiveContext`).
- framer-motion is loaded through `LazyMotion` + `m` components; fonts load without blocking first
  paint; the Google Maps iframe mounts only when the location section is near the viewport.
- Code splitting: the assistant loads in idle time after the page is interactive, the photo
  lightbox on the first tap, and the unused intro variant never.
- The rotating card border is sized to the card's diagonal (not a 300% box) and only animates
  while the card is on screen; the navbar uses a solid tint instead of `backdrop-filter` on phones.
- Photos are WebP with JPEG fallback, 800px thumbnails in grids, all lazy-loaded with explicit
  dimensions (no layout shift).

## Deployment (Vercel)

Vercel auto-detects Vite. Either import the GitHub repo in the Vercel dashboard, or:

```bash
npx vercel login
npx vercel --prod
```

`vercel.json` adds long-term caching for hashed assets and basic security headers.

## Project structure

```
src/
  config/workshop.ts        business config (single source of truth)
  data/                     services, reviews, stats
  lib/                      whatsapp link builder, hours engine, cn()
  hooks/useWorkshopStatus   live status (re-evaluated every 30s)
  config/intro.ts           intro variant + timing settings
  hooks/useIntroGate.ts     once-per-session / inert / visibility gate
  lib/engineSound.ts        Web Audio engine-sound synth
  lib/assistant.ts          rule-based assistant (intents → answers from site data)
  config/assistant.ts       assistant copy, quick replies, on/off
  components/
    assistant/              AssistantWidget chat panel
    intro/                  SplashIntro + TopDownF1Car, RaceIntro + F1Car + StartLights
    ui/                     CtaLink, GlowCard, Lightbox, Reveal/Stagger, SectionHeading, StatusBadge, Stars
    layout/                 Navbar, Footer, Logo, WhatsAppFab
    sections/               Hero, TrustStrip, Services, Workshop (equipment + Gallery), Reviews, Hours, Location
    SeoSchema.tsx           schema.org AutoRepair JSON-LD
  index.css                 Tailwind v4 theme tokens + base styles
```
