import { Check, ExternalLink, Images, MapPin, Navigation, Phone, ShieldCheck, Star } from 'lucide-react'
import { CtaLink } from '@/components/ui/CtaLink'
import { Reveal } from '@/components/ui/Reveal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { workshop } from '@/config/workshop'
import { useT } from '@/i18n'
import { buildTelLink } from '@/lib/whatsapp'

/** Centred hero: live status, headline, landline + directions, proof points. No visual, no forms. */
export function Hero() {
  const t = useT()

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

      <div className="container-x flex flex-col items-center text-center">
        <Reveal eager>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <StatusBadge />
            <a
              href={workshop.googleReviews.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-fg shadow-card transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Star className="size-3.5 fill-star text-star" aria-hidden="true" />
              {t.hero.reviewsChip(workshop.googleReviews.count)}
              <ExternalLink className="size-3 text-fg-muted" aria-hidden="true" />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.05} eager>
          <h1
            id="hero-heading"
            className="mx-auto mt-6 max-w-4xl font-display text-[2.6rem] leading-[1.05] font-extrabold tracking-tight text-balance text-fg sm:text-5xl lg:text-6xl xl:text-[4.4rem]"
          >
            {t.hero.headlineStart}{' '}
            <span className="bg-linear-to-r from-primary via-primary-bright to-secondary bg-clip-text text-transparent">
              {t.hero.headlineAccent}
            </span>{' '}
            {t.hero.headlineEnd}
          </h1>
        </Reveal>

        <Reveal delay={0.1} eager>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-fg-muted sm:text-xl">
            {t.hero.lead}
          </p>
        </Reveal>

        <Reveal delay={0.15} eager>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <CtaLink href={buildTelLink(workshop.phone)} size="lg" icon={<Phone />}>
              {t.common.call(workshop.phone)}
            </CtaLink>
            <CtaLink
              href={workshop.directionsLink}
              external
              variant="outline"
              size="lg"
              icon={<Navigation />}
            >
              {t.common.getDirections}
            </CtaLink>
            {/* The two page links share a row on phones so four pills don't push the fold down. */}
            <div className="grid grid-cols-2 gap-3 sm:contents">
              <CtaLink href="/insurance" variant="outline" size="lg" icon={<ShieldCheck />} className="max-sm:gap-1 max-sm:px-2.5 max-sm:text-[13px]">
                {t.common.insuranceClaim}
              </CtaLink>
              <CtaLink href="/before-after" variant="outline" size="lg" icon={<Images />} className="max-sm:gap-1 max-sm:px-2.5 max-sm:text-[13px]">
                {t.common.beforeAfter}
              </CtaLink>
            </div>
          </div>
          <p className="mt-4 flex items-center justify-center gap-2 text-sm text-fg-muted">
            <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
            {t.hero.addressLine(t.location.line2)}
          </p>
        </Reveal>

        <Reveal delay={0.2} eager>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {t.hero.proofPoints(workshop.foundedYear).map((point) => (
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
    </section>
  )
}
