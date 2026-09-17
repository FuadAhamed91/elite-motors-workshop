import { Clock, MapPin, Navigation, Phone } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { CtaLink } from '@/components/ui/CtaLink'
import { GlowCard } from '@/components/ui/GlowCard'
import { Reveal } from '@/components/ui/Reveal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { workshop } from '@/config/workshop'
import { services } from '@/data/services'
import { buildTelLink } from '@/lib/whatsapp'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-line bg-surface/40 pb-28 sm:pb-12 lg:pb-10">
      {/* Final conversion callout */}
      <div className="container-x -mt-px py-16 lg:py-20">
        <Reveal>
          <GlowCard animatedBorder innerClassName="p-6 sm:p-10 lg:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                  <span aria-hidden="true" className="h-px w-6 bg-linear-to-r from-primary to-secondary" />
                  Ready when you are
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-fg sm:text-4xl">
                  Talk to the workshop directly. No forms, no waiting.
                </h2>
                <p className="mt-3 max-w-xl text-fg-muted">
                  Call the landline during working hours or drop in at Musaffah M21 — a certified
                  technician looks at the car and gives you a clear estimate before any work starts.
                </p>
              </div>
              <div className="flex flex-col gap-3 lg:items-end">
                <CtaLink href={buildTelLink(workshop.phone)} size="lg" icon={<Phone />}>
                  Call {workshop.phone}
                </CtaLink>
                <CtaLink
                  href={workshop.directionsLink}
                  external
                  variant="ghost"
                  size="md"
                  icon={<Navigation />}
                >
                  or get directions
                </CtaLink>
              </div>
            </div>
          </GlowCard>
        </Reveal>
      </div>

      <div className="container-x grid gap-10 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo variant="stacked" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">
            Mechanical, electrical, body and paint repairs in {workshop.city} since{' '}
            {workshop.foundedYear}. Engineer-supervised team, genuine parts and honest pricing.
          </p>
          <StatusBadge className="mt-5" />
        </div>

        <nav aria-label="Footer">
          <h3 className="text-xs font-semibold tracking-[0.18em] text-fg uppercase">Quick links</h3>
          <ul className="mt-4 space-y-2.5">
            {workshop.nav.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-fg-muted transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#location" className="text-sm text-fg-muted transition-colors hover:text-primary">
                Google Maps
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="text-xs font-semibold tracking-[0.18em] text-fg uppercase">Services</h3>
          <ul className="mt-4 space-y-2.5">
            {services.map((service) => (
              <li key={service.id}>
                <a
                  href="#services"
                  className="text-sm text-fg-muted transition-colors hover:text-primary"
                >
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-[0.18em] text-fg uppercase">Visit us</h3>
          <ul className="mt-4 space-y-3 text-sm text-fg-muted">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>
                {workshop.address.line2}
                <br />
                {workshop.address.city}
              </span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <a href={buildTelLink(workshop.phone)} className="transition-colors hover:text-primary tabular-nums">
                {workshop.phone}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{workshop.hoursSummary}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-x mt-12 flex flex-col gap-4 border-t border-line pt-6 text-xs text-fg-muted sm:flex-row sm:items-start sm:justify-between sm:pr-28 lg:pr-32">
        <p>
          &copy; {year} {workshop.legalName}. All rights reserved.
          <br />
          Group companies: Alkayed Workshop LLC · Motor World Workshop (Dubai, Ajman, Fujairah) ·
          Dubai Classic Motors · Repute Spare Parts Trading.
        </p>
        <p className="max-w-2xl sm:text-right">
          {workshop.name} is an independent workshop and is not affiliated with any vehicle
          manufacturer. Prices quoted over the phone or in chat are estimates until the vehicle is inspected.
          Brand names are used for identification only.
        </p>
      </div>
    </footer>
  )
}
