# Elite Motors Workshop — Landing Page

High-conversion, WhatsApp-first landing page for **Elite Motors Workshop**, an auto service
and repair centre in Mussafah, Abu Dhabi. Dark carbon/slate palette with electric green &
cyan accents, 21st.dev-style spotlight cards, Framer Motion reveals and Lucide icons.

The **only** conversion path is a direct WhatsApp conversation — no booking wizards,
calendars or lead forms. Every CTA opens `wa.me` with a pre-filled, context-specific message.

## Stack

- Vite 8 + React 19 + TypeScript (strict)
- Tailwind CSS v4 (design tokens in `src/index.css` — primitive → semantic layers)
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
| `whatsappNumber` | All WhatsApp links → `https://wa.me/97150XXXXXXX?text=...` |
| `phone` | "Call Workshop" CTAs (`tel:` links) |
| `schedule` | Live **Open Now / Open Today / Closed** badge + weekly schedule card |
| `hoursSummary`, `breakLabel` | Footer text and schedule legend |
| `address`, `mapEmbedUrl`, `mapsLink`, `directionsLink` | Location section + map iframe |
| `rating` | Review badge, hero chip, JSON-LD `aggregateRating` |
| `nav` | Navbar and footer quick links |

> **TODO before launch:** replace the `X` placeholders in `whatsappNumber` with the real
> digits (e.g. `+971 50 123 4567`). The dev server logs a warning until you do.

Content lives in `src/data/`:

- `services.ts` — six service cards (name passed into each WhatsApp message)
- `reviews.ts` — Google-style review cards (placeholder testimonials — replace with real ones)
- `stats.ts` — trust strip figures

## How the live status works

`src/lib/hours.ts` evaluates the structured schedule in **Asia/Dubai** time (via `Intl`), so
the badge is correct for visitors anywhere in the world. It distinguishes:

- **Open Now** · closes at …
- **Open Today** · on break, back at … / opens at …
- **Closed** · opens tomorrow / opens Mon …

Friday's morning session ends at 12:00 PM for Jumu'ah prayer and Sunday is closed — both
are indicated on the schedule card. Adjust in `workshop.schedule`.

## Pre-filled WhatsApp messages

`src/lib/whatsapp.ts` exposes `waLinks`:

- `quote()` — hero, navbar, FAB, footer
- `service(name)` — "Book via WhatsApp" on each service card
- `quickService(name)` — hero quick-quote console, footer service links
- `directions()` — location section
- `afterHours()` — shown by the status card when the workshop is closed

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
  components/
    ui/                     CtaLink, GlowCard, Reveal/Stagger, SectionHeading, StatusBadge, Stars
    layout/                 Navbar, Footer, Logo, WhatsAppFab
    sections/               Hero, TrustStrip, Services, Reviews, Hours, Location
    SeoSchema.tsx           schema.org AutoRepair JSON-LD
  index.css                 Tailwind v4 theme tokens + base styles
```
