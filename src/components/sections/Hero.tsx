import { Check, ChevronRight, Phone, Star, Timer } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { CtaLink } from '@/components/ui/CtaLink'
import { GlowCard } from '@/components/ui/GlowCard'
import { Reveal } from '@/components/ui/Reveal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { workshop } from '@/config/workshop'
import { services } from '@/data/services'
import { useWorkshopStatus } from '@/hooks/useWorkshopStatus'
import { buildTelLink, waLinks } from '@/lib/whatsapp'

const HERO_PROOF_POINTS = [
  'Estimate before any work starts',
  'Genuine OEM parts',
  'Insurance-approved body shop',
] as const

/** Four most-requested services surfaced as one-tap WhatsApp shortcuts. */
const QUICK_SERVICES = services.slice(0, 4)

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
        <div className="absolute -top-48 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-primary/15 blur-[130px]" />
        <div className="absolute top-32 -right-24 h-[420px] w-[420px] rounded-full bg-secondary/12 blur-[120px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-bg to-transparent" />
      </div>

      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
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
              Mussafah. Message us on WhatsApp and get a real quote in minutes, not days.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CtaLink href={waLinks.quote()} external size="lg" icon={<WhatsAppIcon />}>
                Get Instant Quote on WhatsApp
              </CtaLink>
              <CtaLink
                href={buildTelLink(workshop.phone)}
                variant="outline"
                size="lg"
                icon={<Phone />}
              >
                Call Workshop
              </CtaLink>
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm text-fg-muted">
              <Timer className="size-4 text-primary" aria-hidden="true" />
              {workshop.responseTime}
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

        <Reveal delay={0.2} y={32} className="relative lg:justify-self-end">
          <QuickQuoteConsole />
        </Reveal>
      </div>
    </section>
  )
}

/**
 * Hero visual with a job: a glass "console" that opens a pre-filled WhatsApp
 * chat for the four most-requested services, plus the live Abu Dhabi clock.
 */
function QuickQuoteConsole() {
  const { status, now } = useWorkshopStatus(15_000)

  return (
    <div className="relative w-full max-w-md lg:max-w-[440px]">
      {/* Floating rating chip */}
      <div
        aria-hidden="true"
        className="absolute -top-4 -right-2 z-20 flex items-center gap-2 rounded-pill border border-line bg-surface-elevated/95 px-3 py-1.5 text-xs font-semibold text-fg shadow-card backdrop-blur-md motion-safe:animate-float sm:-right-5"
      >
        <Star className="size-3.5 fill-star text-star" />
        {workshop.googleReviews.count} reviews on Google
      </div>

      <GlowCard accent="secondary" animatedBorder innerClassName="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-secondary uppercase">
              Quick quote
            </p>
            <p className="mt-1 font-display text-xl font-bold text-fg">
              Tap a service, we pre-fill your message
            </p>
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cta/15 text-cta">
            <WhatsAppIcon className="size-5" />
          </span>
        </div>

        <ul className="mt-5 space-y-2">
          {QUICK_SERVICES.map((service) => {
            const Icon = service.icon
            return (
              <li key={service.id}>
                <a
                  href={waLinks.quickService(service.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/row flex min-h-12 items-center gap-3 rounded-xl border border-line bg-fg/3 px-3 py-2.5 transition-[background-color,border-color,transform] duration-200 hover:border-primary/40 hover:bg-fg/6 active:scale-[0.99]"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                    <Icon className="size-4.5" aria-hidden="true" />
                  </span>
                  <span className="flex-1 text-sm font-medium text-fg">{service.title}</span>
                  <ChevronRight
                    className="size-4 shrink-0 text-fg-muted transition-transform duration-200 group-hover/row:translate-x-0.5 group-hover/row:text-primary"
                    aria-hidden="true"
                  />
                </a>
              </li>
            )
          })}
        </ul>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4 text-xs text-fg-muted">
          <span>
            Abu Dhabi time{' '}
            <span className="font-semibold text-fg tabular-nums" aria-live="off">
              {now.clock}
            </span>
          </span>
          <span className="text-right">{status.detail}</span>
        </div>
      </GlowCard>
    </div>
  )
}
