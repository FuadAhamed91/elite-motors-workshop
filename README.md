# Elite Motors Workshop — Landing Page

High-conversion landing page for **Elite Motors Workshop**, an auto service and repair centre
in Mussafah, Abu Dhabi. Warm beige/cream palette with accents taken from the EMW badge (its blue as the primary, its yellow as a deep gold, its red for details and the tri-colour stripe) and navy bands — scrolled navbar, stat tiles, brands wall, reviews, footer — with badge-yellow buttons on them,
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

## Insurance page — `/insurance`

The site has three pages (home, `/insurance`, `/before-after`). `insurance.html` → `src/insurance-main.tsx` → `src/pages/InsurancePage.tsx`
is the dedicated claims page (Vercel `cleanUrls` serves it at `/insurance`; the dev server does the
same via a tiny plugin in `vite.config.ts`). It shows the insurers the workshop is an approved
repairer for (`src/data/insurers.ts`; names/notes per language in `src/i18n`; logos in
`public/logos/insurers/`, each tile linking to the insurer's site), the three claim steps, the
document checklist (owner's and driver's documents, trade licence for company cars), first steps
after an accident in Abu Dhabi, and a short FAQ. The home page keeps a teaser section with the logo
wall and a button to the page; the hero has an "Insurance claim" button; the assistant answers
insurance questions from the same data. The logos are the insurers' own marks, shown only to state
the approved-repairer relationship — remove an insurer if that approval ends.

Section anchors from the insurance page point back to the home page (`/#hours`) via
`resolveHref` in `src/lib/page.tsx`; both pages get the pre-rendered shell.

## Languages — English & Arabic

The whole site is bilingual. `src/i18n/en.ts` is the source of every string (typed as
`Dictionary`); `src/i18n/ar.ts` must match its shape, so a missing translation fails the build.
`LocaleProvider` (`src/i18n/index.tsx`) picks the language — `?lang=ar|en` in the URL, then the
saved choice (`localStorage` `emw:lang`), then the browser language (Arabic browsers get Arabic) —
and keeps `<html lang dir>`, the title and the description in step. The toggle sits in the navbar
(icon-only on phones).

Arabic details: `dir="rtl"` flips the layout (logical `start/end` utilities, mirrored arrows), the
**Cairo** font loads only when Arabic is shown, letter-spacing is disabled for the connected
script, and times/phone numbers are wrapped in bidi isolates so "8:00 ص – 1:00 م" and
"+971 2 550 1080" never reorder inside Arabic text. Review quotes stay in their original English.
The assistant answers in the language of the question (Arabic script → Arabic, with Gulf terms
such as الجير، الرديتر، السمكرة، الصبغ) using Arabic keyword sets in `src/lib/assistant.ts`.

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
it plays once per browser session (`sessionStorage.hasSeenIntro`; `frequency: 'once' | 'always'` are
available), it is skipped on Save-Data / very low-end phones, a **Skip** button and
Escape bypass it, it is disabled for `prefers-reduced-motion`, and it waits for the tab to be
visible before playing. Dev review switches: `?intro=replay`, `?intro=slow`, `?intro=freeze`
(splash: car parked mid-screen, dev only), `?intro=skip` (no intro — for layout reviews and screenshots).
`?intro=replay` and `?intro=skip` also work on the live site.
Only the selected variant ships in the main bundle; the other is a lazy chunk.

## Content & photos

Services, equipment highlights, brands and the founding year come from the company profile
(`src/data/services.ts`, `src/data/gallery.ts`). `workshop.foundedYear` is 2016 per the owner — every
"since …" line and the years stat derive from it. The old "basic profile"
page (staff counts, previous phone numbers) is intentionally not used.

`public/photos/` holds the workshop photos: the About banner (`workshop-exterior`, 2:1 — the sign over the blue fence, the owner's pick), the three
facility photos under the services grid (paint booth, body shop, lifts) and the **Gallery**
subsection in the Workshop section — a cover photo plus thumbnails that open a full-screen viewer
(arrows, keyboard, swipe, thumbnail strip) over all eight photos (`photos` in
`src/data/gallery.ts`). The hero itself has no photo — headline, live status and the two calls
to action. Each photo exists as `name.jpg` + `name.webp` (max 1400px)
and `name-thumb.jpg` + `name-thumb.webp` (800px, used in grids and on phones via `srcset`);
`Picture.tsx` serves the WebP automatically. **Every vehicle number plate was blurred before the images were added** — if
you add new photos, redact plates first and keep them out of the repo otherwise.

### Brands (`#brands`)

A navy band with a moving logo wall of the makes the workshop services — European, Japanese,
Korean, American and Chinese (`src/data/brands.ts`; cream tiles with the manufacturers' logos in
their original colours in `public/logos/brands/`). The logos are the SVGs kept on Wikimedia
Commons (Mercedes-Benz, Mazda and GMC rasterised to PNG because their SVGs were huge); Alfa Romeo
is the brand's own single-colour badge from alfaromeousa.com, recoloured dark, since the coloured
badge is not freely available. Per-brand `height` keeps wordmarks visually lighter than emblems.
The row is two identical copies sliding by one copy width (`.marquee` in `index.css`):
transform-only, runs only while on screen, pauses under a real hover pointer only (a tap on a
phone must not freeze it), and becomes a plain scrollable row under reduced motion. The
manufacturers' marks are their trademarks and are shown only to say "we service these" — never
imply an official dealership.

### Fleet (`#fleet`)

"Fleet & company vehicles" right after the insurance section, in the same style: a logo wall of
the fleets the owner named (`src/data/fleet.ts` — Kabi Taxi, Dollar, Thrifty, Legend and City Star
rent-a-car, the Bake Al Arab bakery chain and ME Courier), each tile linking to the company's own site, plus
the pitch for fleet managers (priority booking, claims handled, one invoice, recovery arranged) and
a call button. Logos are the companies' own marks in `public/logos/fleet/` (from their sites /
public profiles), shown only to say "we service their fleet". The assistant answers fleet /
corporate questions with the same list.

### Before & after — `/before-after`

`public/photos/repairs/` holds seven accident repairs from the body shop as pairs
(`<id>-before` / `<id>-after`, same sizes and siblings as above); `src/data/repairs.ts` lists the
pairs with per-shot `focus` (object-position for the cropped card thumbnails) and the copy lives in
`beforeAfter.cars` in both dictionaries. Same structure as insurance: the home page has a teaser
section (three pairs + a button), the hero has a "Before & after" button, and the dedicated page
(`before-after.html` → `src/before-after-main.tsx` → `src/pages/BeforeAfterPage.tsx`, pre-rendered
like the others) shows every car in a 2-column grid. Each card is one photo with an
"On arrival | After repair" switch that cross-fades between the two shots (the repaired car shows
first — the owner did not want BEFORE/AFTER words printed on the photos); tapping the photo opens
the same Lightbox (14 photos, on arrival → after repair order). The switch is a see-through
"glass" pill; `src/config/beforeAfter.ts` (`toggle: 'solid'`) brings back the opaque cream pill
(also tagged `v5-toggle-solid`). The insurance page shows the first three pairs
with a link to the page, and the assistant answers "before and after / examples / results" with a
link to it. Owner's rules applied to these photos:
all plates blurred (including a plate lying on a dashboard and cars in the background), the wash
bay's green floor paint retouched to plain concrete (also in the gallery's wash-bay photo) and the
phones' date/model stamps removed.

## Icons

The owner asked for **no decorative pictograms** (2026-09-20): service cards, stat tiles, claim
steps, section eyebrows, hours/location cards and the footer carry no small icons — lists use a
plain dot marker, steps are numbered. Icons remain only where they do a job: call/directions/arrow
icons inside buttons and links, the WhatsApp mark, the star ratings, close/menu controls.

## On-site assistant

`src/components/assistant/AssistantWidget.tsx` is a small chat panel (launcher above the WhatsApp
button). It is **rule-based and runs entirely in the browser** — no API, no keys, nothing sent
anywhere. `src/lib/assistant.ts` matches the question against intents (open now, hours incl.
specific days, location/directions, phone, WhatsApp, services and each service card, body shop &
insurance, prices, reviews, booking, parts, experience) and builds every answer from the site's own
config and data, with call/maps links (a WhatsApp link only when someone asks how to get in
touch or about WhatsApp). Anything outside that scope gets the landline.
Settings live in `src/config/assistant.ts`; set `enabled: false` to remove it.

The assistant is **"Ahmed"** (`persona: 'ahmed'`): a flat-vector Emirati character
(`Ahmed.tsx` — kandura, ghutra and agal, drawn in code, no image files). His face is the launcher
button and the panel-header avatar, and once per browser session (`sessionStorage`
`emw:ahmed-hello`), ~1.8 s after the page and the intro have settled, he slides in from the side
of the screen above the launcher, waves (`--animate-wave`) and shows a "Hi, I'm Ahmed 👋 / How can
I help you?" bubble; tapping him or the bubble opens the chat, × dismisses him, and he leaves by
himself after 11 s (`AhmedMascot.tsx`; reduced motion = fade only, no wave). Under RTL the figure
is mirrored so he still waves toward the page. `persona: 'plain'` restores the nameless
chat-icon assistant; git tag `v7-before-ahmed` is the full earlier state. Ahmed does not wave (the owner found it awkward); he blinks and
breathes (`--animate-blink` / `--animate-breathe`), the launcher portrait nods now and then
(`--animate-nod`) and shows an "Ask Ahmed" label on hover, his portrait sits beside every reply,
and messages slide in. On phones the panel is a bottom sheet capped at `100dvh − 5.5rem`, so
it never runs under the sticky navbar.

## Performance notes

- Only `transform`/`opacity` animate (looping textures translate a doubled pattern; the animated
  border rotates a gradient behind the card); no `backdrop-filter` on cards; hero glows are
  gradients, not large blurs.
- Page reveals are held while the intro is up and play as it fades (`IntroActiveContext`).
- framer-motion is loaded through `LazyMotion` + `m` components; the Google Maps iframe mounts only
  when the location section is near the viewport.
- Code splitting: the assistant loads in idle time after the page is interactive, the photo
  lightbox on the first tap, and the unused intro variant never.
- The rotating card border is sized to the card's diagonal (not a 300% box) and only animates
  while the card is on screen; the navbar uses a solid tint instead of `backdrop-filter` on phones.
- Photos are WebP with JPEG fallback, 800px thumbnails in grids, all lazy-loaded with explicit
  dimensions (no layout shift).
- **Pre-rendered shell.** `npm run build` also builds `src/shell/entry-server.tsx` (server bundle in
  `.prerender/`) and `scripts/prerender.mjs` writes the navbar + hero, in both languages, straight
  into `dist/index.html` and `dist/insurance.html`. A small inline script in `<head>` sets `<html lang dir>`, the title and
  (for first-time visitors) the intro backdrop before the first paint, and only imports the app
  bundle once the browser has reported the headline as its largest paint — so the page shows in
  about a second on a slow phone and React takes over without any visible change. Time-dependent
  bits (the live status badge) render a neutral placeholder in the shell (`ShellContext`).
- Fonts are self-hosted latin subsets (`public/fonts`, preloaded); Cairo is fetched only for Arabic.
- Below-the-fold sections mount one frame after the hero and use `content-visibility: auto`, so
  the first JavaScript task and the initial layout only cover what is on screen.
  `useAnchorNavigation` renders the sections above an anchor target before any in-page jump so
  "#hours" lands in the right place. The hero paints under the intro (`Reveal eager`), so the
  largest text counts as painted during the intro rather than after it.

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
  hooks/useIntroGate.ts     once-per-visitor / weak-device / inert / visibility gate
  lib/engineSound.ts        Web Audio engine-sound synth
  lib/assistant.ts          rule-based assistant (intents → answers from site data)
  config/assistant.ts       assistant copy, quick replies, on/off
  components/
    assistant/              AssistantWidget chat panel
    intro/                  SplashIntro + TopDownF1Car, RaceIntro + F1Car + StartLights
    ui/                     CtaLink, GlowCard, Lightbox, Reveal/Stagger, SectionHeading, StatusBadge, Stars
    layout/                 Navbar, Footer, Logo, WhatsAppFab
    sections/               Hero, TrustStrip, Services, Insurance, BeforeAfter, Workshop (equipment + Gallery), Reviews, Hours, Location
    SeoSchema.tsx           schema.org AutoRepair JSON-LD
  index.css                 Tailwind v4 theme tokens + base styles
```
