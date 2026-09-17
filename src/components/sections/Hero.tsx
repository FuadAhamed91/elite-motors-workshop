import { Check, MapPin, Navigation, Phone, Star } from 'lucide-react'
import { CtaLink } from '@/components/ui/CtaLink'
import { Picture } from '@/components/ui/Picture'
import { Reveal } from '@/components/ui/Reveal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { workshop } from '@/config/workshop'
import { gallery } from '@/data/gallery'
import { buildTelLink } from '@/lib/whatsapp'

const HERO_PROOF_POINTS = [
  'In Mussafah since 2003',
  'Mechanical, body & paint under one roof',
  'Estimate before any work starts',
] as const

/** The main service hall — the first photo of the gallery. */
const HERO_PHOTO = gallery[0]

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-40 lg:pb-24"
    >
      {/* Ambient background: blueprint grid + electric glows, all decorative */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black_20%,transparent_75%)]" />
        <div className="absolute -top-48 left-1/2 h-[720px] w-[1100px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--color-primary-bright)_16%,transparent),transparent_62%)]" />
        <div className="absolute top-16 -right-40 h-[620px] w-[620px] bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--color-secondary-bright)_14%,transparent),transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-bg to-transparent" />
      </div>

      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <Reveal>
            <StatusBadge />
          </Reveal>

          <Reveal delay={0.05}>
            <h1
              id="hero-heading"
              className="mt-6 font-display text-[2.6rem] leading-[1.05] font-extrabold tracking-tight text-balance text-fg sm:text-5xl lg:text-6xl xl:text-[4.4rem]"
            >
              Precision Auto Care &amp;{' '}
              <span className="bg-linear-to-r from-primary via-primary-bright to-secondary bg-clip-text text-transparent">
                Mechanical Excellence
              </span>{' '}
              in Abu Dhabi
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-fg-muted sm:text-xl">
              Trusted diagnostics, transparent pricing and fast turnaround — right here in
              Mussafah. Call the workshop or drop in; every job starts with a clear estimate.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CtaLink href={buildTelLink(workshop.phone)} size="lg" icon={<Phone />}>
                Call {workshop.phone}
              </CtaLink>
              <CtaLink
                href={workshop.directionsLink}
                external
                variant="outline"
                size="lg"
                icon={<Navigation />}
              >
                Get Directions
              </CtaLink>
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm text-fg-muted">
              <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
              {workshop.address.line2} · landline answered during working hours
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {HERO_PROOF_POINTS.map((point) => (
                <li key={point} className="flex items-center gap-2 text-sm text-fg/90">
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.2} y={32} className="relative">
          <HeroPhoto />
        </Reveal>
      </div>
    </section>
  )
}

/** Hero visual: the actual service hall in Mussafah (plates redacted) with the Google review count. */
function HeroPhoto() {
  return (
    <figure className="relative">
      {/* Floating review chip */}
      <div
        aria-hidden="true"
        className="absolute -top-4 left-4 z-20 flex items-center gap-2 rounded-pill border border-line bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-fg shadow-card motion-safe:animate-float sm:-left-3"
      >
        <Star className="size-3.5 fill-star text-star" />
        {workshop.googleReviews.count} reviews on Google
      </div>

      <div className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
        <Picture
          src={HERO_PHOTO.src}
          thumb={HERO_PHOTO.thumb}
          alt={HERO_PHOTO.alt}
          width={HERO_PHOTO.width}
          height={HERO_PHOTO.height}
          sizes="(min-width: 1024px) 45vw, 100vw"
          loading="eager"
          fetchPriority="high"
          className="aspect-[16/11] w-full object-cover lg:aspect-[4/3]"
        />
      </div>

      <figcaption className="pointer-events-none absolute right-3 bottom-3 left-3 flex items-center justify-between gap-3 rounded-2xl border border-white/30 bg-ink-900/55 px-4 py-2.5 text-xs text-sand-50 sm:text-sm">
        <span className="font-semibold">{HERO_PHOTO.caption}</span>
        <span className="text-sand-50/80">Musaffah M21</span>
      </figcaption>
    </figure>
  )
}
