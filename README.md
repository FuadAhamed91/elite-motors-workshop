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

## Opening "lights out" intro

`src/components/intro/RaceIntro.tsx` — on first open the EMW single-seater waits on the grid
while the five start lights come on; at lights-out it launches across the frame (wheelspin,
tyre smoke, sparks, velocity-driven lean and motion-blur trail) and the overlay wipes away
behind the car with a feathered edge, straight into the hero. No menu, no button.

- **Sound** is synthesized with the Web Audio API (`src/lib/engineSound.ts`): a tick per
  light, an idle burble that tightens, then the launch — gear shifts, peak, Doppler drop.
  Browsers block autoplay, so tapping anywhere turns it on, synced to wherever the sequence
  is. Drop a licensed clip in `/public` and set `soundUrl` in `src/config/intro.ts` for a real
  recording.
- Motion follows the web-animation-design guide: ease-in-out for on-screen movement, ease-out
  for enters/exits, transform/opacity only, `will-change`, blur under 20px.
- Skippable (button / Escape), once per browser session, skipped for reduced-motion users
  and background tabs. Timing lives in `src/config/intro.ts`.
- Dev review aids: `?intro=slow` runs the sequence 8× slower, `?intro=replay` ignores the
  once-per-session rule (dev server only).

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
  config/intro.ts           opening race intro settings
  lib/engineSound.ts        Web Audio engine-sound synth
  components/
    intro/                  RaceIntro overlay, F1Car SVG, StartLights gantry
    ui/                     CtaLink, GlowCard, Reveal/Stagger, SectionHeading, StatusBadge, Stars
    layout/                 Navbar, Footer, Logo, WhatsAppFab
    sections/               Hero, TrustStrip, Services, Reviews, Hours, Location
    SeoSchema.tsx           schema.org AutoRepair JSON-LD
  index.css                 Tailwind v4 theme tokens + base styles
```
