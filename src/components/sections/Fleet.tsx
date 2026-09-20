import { ArrowUpRight, Building2, Car, CarTaxiFront, Phone, Truck } from 'lucide-react'
import { CtaLink } from '@/components/ui/CtaLink'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { workshop } from '@/config/workshop'
import { fleetClients, type FleetKind } from '@/data/fleet'
import { useT } from '@/i18n'
import { buildTelLink } from '@/lib/whatsapp'

const KIND_ICON: Record<FleetKind, typeof Car> = { rental: Car, taxi: CarTaxiFront, delivery: Truck }

/**
 * Fleet & company vehicles: the rental, taxi and delivery fleets the workshop
 * services, as name tiles linking to the companies' own sites, plus the pitch
 * for the next fleet manager (call the landline — no forms).
 */
export function Fleet() {
  const t = useT()
  const c = t.fleet

  return (
    <section id="fleet" aria-labelledby="fleet-heading" className="below-fold container-x py-20 lg:py-28">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:items-start lg:gap-16">
        <Reveal>
          <SectionHeading id="fleet-heading" eyebrow={c.eyebrow} title={c.title} description={c.description} />
          <ul className="mt-6 space-y-2.5">
            {c.points.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm text-fg/90">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                  <Building2 className="size-3" aria-hidden="true" />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CtaLink href={buildTelLink(workshop.phone)} size="lg" icon={<Phone />}>
              {c.cta}
            </CtaLink>
          </div>
        </Reveal>

        <div>
          <Reveal delay={0.05}>
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">{c.clientsTitle}</p>
          </Reveal>
          <StaggerGroup as="ul" className="mt-4 grid gap-3 sm:grid-cols-2" aria-label={c.clientsTitle}>
            {fleetClients.map((client) => {
              const Icon = KIND_ICON[client.kind]
              const inner = (
                <>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-gold-500">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-base font-bold tracking-tight text-fg">{c.names[client.id] ?? client.name}</span>
                    <span className="block text-xs text-fg-muted">{c.kinds[client.kind]}</span>
                  </span>
                  {client.url && (
                    <ArrowUpRight className="size-4 shrink-0 text-fg-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
                  )}
                </>
              )
              const className = 'group flex h-full items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-card transition-[border-color,transform] duration-200'
              return (
                <StaggerItem as="li" key={client.id} className="h-full">
                  {client.url ? (
                    <a
                      href={client.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={c.visit(c.names[client.id] ?? client.name)}
                      className={`${className} hover:-translate-y-0.5 hover:border-primary/50 motion-reduce:hover:translate-y-0`}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className={className}>{inner}</div>
                  )}
                </StaggerItem>
              )
            })}
          </StaggerGroup>
          <Reveal delay={0.1}>
            <p className="mt-4 text-xs text-fg-muted">{c.note}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
