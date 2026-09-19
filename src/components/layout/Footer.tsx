import { Clock, MapPin, Navigation, Phone } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { CtaLink } from '@/components/ui/CtaLink'
import { GlowCard } from '@/components/ui/GlowCard'
import { Reveal } from '@/components/ui/Reveal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { workshop } from '@/config/workshop'
import { services } from '@/data/services'
import { useT } from '@/i18n'
import { useHref } from '@/lib/page'
import { buildTelLink } from '@/lib/whatsapp'

export function Footer() {
  const t = useT()
  const href = useHref()
  const year = new Date().getFullYear()
  const navLabels: Record<string, string> = {
    '#services': t.nav.services,
    '/insurance': t.nav.insurance,
    '/before-after': t.nav.beforeAfter,
    '#workshop': t.nav.workshop,
    '#about': t.nav.about,
    '#reviews': t.nav.reviews,
    '#hours': t.nav.hoursLocation,
  }

  return (
    <footer className="below-fold relative border-t border-line bg-surface/40 pb-28 sm:pb-12 lg:pb-10">
      {/* Final conversion callout */}
      <div className="container-x -mt-px py-16 lg:py-20">
        <Reveal>
          <GlowCard animatedBorder innerClassName="p-6 sm:p-10 lg:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                  <span aria-hidden="true" className="h-px w-6 bg-linear-to-r from-primary to-secondary" />
                  {t.footer.eyebrow}
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-fg sm:text-4xl">
                  {t.footer.title}
                </h2>
                <p className="mt-3 max-w-xl text-fg-muted">{t.footer.body}</p>
              </div>
              <div className="flex flex-col gap-3 lg:items-end">
                <CtaLink href={buildTelLink(workshop.phone)} size="lg" icon={<Phone />}>
                  {t.common.call(workshop.phone)}
                </CtaLink>
                <CtaLink
                  href={workshop.directionsLink}
                  external
                  variant="ghost"
                  size="md"
                  icon={<Navigation />}
                >
                  {t.footer.orDirections}
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
            {t.footer.blurb(t.footer.city, workshop.foundedYear)}
          </p>
          <StatusBadge className="mt-5" />
        </div>

        <nav aria-label={t.nav.footer}>
          <h3 className="text-xs font-semibold tracking-[0.18em] text-fg uppercase">{t.footer.quickLinks}</h3>
          <ul className="mt-4 space-y-2.5">
            {workshop.nav.map((link) => (
              <li key={link.href}>
                <a
                  href={href(link.href)}
                  className="text-sm text-fg-muted transition-colors hover:text-primary"
                >
                  {navLabels[link.href] ?? link.label}
                </a>
              </li>
            ))}
            <li>
              <a href={href('#location')} className="text-sm text-fg-muted transition-colors hover:text-primary">
                {t.footer.googleMaps}
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="text-xs font-semibold tracking-[0.18em] text-fg uppercase">{t.footer.services}</h3>
          <ul className="mt-4 space-y-2.5">
            {services.map((service) => (
              <li key={service.id}>
                <a
                  href={href('#services')}
                  className="text-sm text-fg-muted transition-colors hover:text-primary"
                >
                  {t.services.items[service.id]?.title ?? service.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-[0.18em] text-fg uppercase">{t.footer.visitUs}</h3>
          <ul className="mt-4 space-y-3 text-sm text-fg-muted">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>
                {t.location.line2}
                <br />
                {t.location.city}
              </span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <a href={buildTelLink(workshop.phone)} className="transition-colors hover:text-primary tabular-nums" dir="ltr">
                {workshop.phone}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{t.hours.summary}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-x mt-12 flex flex-col gap-4 border-t border-line pt-6 text-xs text-fg-muted sm:flex-row sm:items-start sm:justify-between sm:pe-28 lg:pe-32">
        <p>
          {t.footer.rights(year, t.brand.legalName)}
          <br />
          {t.footer.group}
        </p>
        <p className="max-w-2xl sm:text-end">{t.footer.disclaimer(t.brand.name)}</p>
      </div>
    </footer>
  )
}
