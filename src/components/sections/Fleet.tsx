import { ExternalLink, Phone } from 'lucide-react'
import { CtaLink } from '@/components/ui/CtaLink'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { workshop } from '@/config/workshop'
import { fleetClients } from '@/data/fleet'
import { useT } from '@/i18n'
import { buildTelLink } from '@/lib/whatsapp'

/**
 * Fleet & company vehicles — sits right after the insurance section, in the
 * same style: a logo wall of the rental, taxi and company fleets the workshop
 * services (each tile links to the company's site) and the pitch for the next
 * fleet manager (call the landline — no forms).
 */
export function Fleet() {
  const t = useT()
  const c = t.fleet

  return (
    <section id="fleet" aria-labelledby="fleet-heading" className="below-fold container-x py-20 lg:py-28">
      <Reveal>
        <SectionHeading id="fleet-heading" eyebrow={c.eyebrow} title={c.title} description={c.description} />
      </Reveal>

      <Reveal delay={0.05}>
        <p className="mt-10 text-xs font-semibold tracking-[0.18em] text-primary uppercase">{c.clientsTitle}</p>
      </Reveal>
      <StaggerGroup as="ul" className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4" aria-label={c.clientsTitle}>
        {fleetClients.map((client) => {
          const name = c.names[client.id] ?? client.name
          return (
            <StaggerItem as="li" key={client.id} className="h-full">
              <a
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                title={c.visit(name)}
                className="group flex h-full flex-col items-center rounded-2xl border border-line bg-white p-4 text-center shadow-card transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/50 motion-reduce:hover:translate-y-0"
              >
                <span className="flex h-16 w-full items-center justify-center">
                  <img
                    src={client.logo}
                    alt={c.logoAlt(name)}
                    width={Math.round(56 * client.ratio)}
                    height={56}
                    loading="lazy"
                    decoding="async"
                    className="max-h-14 w-auto max-w-[9.5rem] object-contain"
                  />
                </span>
                <span className="mt-3 text-xs font-semibold leading-snug text-fg">{name}</span>
                <span className="mt-0.5 text-[11px] leading-snug text-fg-muted">{c.kinds[client.kind]}</span>
                <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-fg-muted opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {c.visit(name)}
                  <ExternalLink className="size-3" aria-hidden="true" />
                </span>
              </a>
            </StaggerItem>
          )
        })}
      </StaggerGroup>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <Reveal>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {c.points.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm text-fg/90">
                <span aria-hidden="true" className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-primary" />
                {point}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <CtaLink href={buildTelLink(workshop.phone)} size="lg" icon={<Phone />}>
              {c.cta}
            </CtaLink>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
