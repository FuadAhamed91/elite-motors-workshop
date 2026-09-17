# Elite Motors Workshop — Landing Page

High-conversion, WhatsApp-first landing page for **Elite Motors Workshop**, an auto service
and repair centre in Mussafah, Abu Dhabi. Warm beige/cream palette with electric green &
cyan accents, 21st.dev-style spotlight cards, Framer Motion reveals and Lucide icons.

The **only** conversion path is a direct WhatsApp conversation — no booking wizards,
calendars or lead forms. Every CTA opens `wa.me` with a pre-filled, context-specific message.

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
| `whatsappNumber` | All WhatsApp chat links → `https://wa.me/971565017797?text=...` (never displayed as a phone number) |
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

## Pre-filled WhatsApp messages

`src/lib/whatsapp.ts` exposes `waLinks`:

- `quote()` — hero, navbar, FAB, services prompt, footer
- `quickService(name)` — hero quick-quote console (estimate request, not a booking)
- `directions()` — location section
- `afterHours()` — shown by the status card when the workshop is closed

## Opening intro

Two variants live in `src/components/intro/`; pick one with `variant` in `src/config/intro.ts`
(`'splash'` is active, `'lights-out'` is the approved earlier version — git tag `v1-approved-intro`).

**`splash`** — `SplashIntro.tsx`: a full-screen dark backdrop (`z-index: 9999`, radial gradient +
asphalt grain + vignette). A top-down F1 car (`TopDownF1Car.tsx`, 400×1100 SVG with metallic
gradients, halo, slick tyres) starts at `translateY(100vh)` and accelerates straight up to
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
(splash: car parked mid-screen).

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
  components/
    intro/                  SplashIntro + TopDownF1Car, RaceIntro + F1Car + StartLights
    ui/                     CtaLink, GlowCard, Reveal/Stagger, SectionHeading, StatusBadge, Stars
    layout/                 Navbar, Footer, Logo, WhatsAppFab
    sections/               Hero, TrustStrip, Services, Reviews, Hours, Location
    SeoSchema.tsx           schema.org AutoRepair JSON-LD
  index.css                 Tailwind v4 theme tokens + base styles
```
