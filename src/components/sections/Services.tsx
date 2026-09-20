import { ArrowUpRight, Phone } from 'lucide-react'
import { GlowCard } from '@/components/ui/GlowCard'
import { Picture } from '@/components/ui/Picture'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { workshop } from '@/config/workshop'
import { facilities } from '@/data/gallery'
import { services, type Service } from '@/data/services'
import { useT } from '@/i18n'
import { cn } from '@/lib/cn'
import { buildTelLink } from '@/lib/whatsapp'

export function Services() {
  const t = useT()

  return (
    <section id="services" aria-labelledby="services-heading" className="below-fold container-x py-20 lg:py-28">
      <Reveal>
        <SectionHeading
          id="services-heading"
          eyebrow={t.services.eyebrow}
          title={t.services.title}
          description={t.services.description}
        />
      </Reveal>

      <StaggerGroup as="ul" className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {services.map((service) => (
          <StaggerItem as="li" key={service.id} className="h-full">
            <ServiceCard service={service} />
          </StaggerItem>
        ))}
      </StaggerGroup>

      {/* The three facilities behind the body, paint and mechanical work — real photos, plates redacted */}
      <StaggerGroup as="ul" className="mt-10 grid gap-4 sm:grid-cols-3" aria-label={t.services.facilitiesLabel}>
        {facilities.map((facility) => {
          const copy = t.services.facilities[facility.id] ?? facility
          return (
            <StaggerItem
              as="li"
              key={facility.id}
              className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card"
            >
              <Picture
                src={facility.thumb}
                alt={copy.alt}
                width={800}
                height={Math.round((800 * facility.height) / facility.width)}
                className="aspect-[3/2] w-full object-cover"
              />
              <div className="p-4">
                <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">{copy.service}</p>
                <p className="mt-1 text-sm font-semibold text-fg">{copy.caption}</p>
                <p className="mt-0.5 text-sm text-fg-muted">{copy.blurb}</p>
              </div>
            </StaggerItem>
          )
        })}
      </StaggerGroup>

      <Reveal delay={0.1}>
        <p className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-sm text-fg-muted">
          {t.services.notSure}
          <a
            href={buildTelLink(workshop.phone)}
            className="group inline-flex items-center gap-1.5 font-semibold text-primary transition-colors hover:text-primary-bright"
          >
            <Phone className="size-4" aria-hidden="true" />
            {t.services.callAndDescribe(workshop.phone)}
            <ArrowUpRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </p>
      </Reveal>
    </section>
  )
}

interface ServiceCardProps {
  service: Service
}

function ServiceCard({ service }: ServiceCardProps) {
  const t = useT()
  const copy = t.services.items[service.id] ?? { title: service.title, description: service.description, includes: [...service.includes], badge: service.badge }
  return (
    <GlowCard accent={service.accent} innerClassName="flex flex-col p-6">
      {copy.badge && (
        <span className="mb-4 self-start rounded-pill border border-secondary/30 bg-secondary/10 px-2.5 py-1 text-[11px] font-semibold tracking-wider text-secondary uppercase">
          {copy.badge}
        </span>
      )}

      <h3 className="font-display text-xl font-bold tracking-tight text-fg">{copy.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">{copy.description}</p>

      <ul className="mt-4 space-y-2 pb-1" aria-label={t.services.includesLabel(copy.title)}>
        {copy.includes.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-fg/90">
            <span aria-hidden="true" className={cn('mt-[0.55em] size-1.5 shrink-0 rounded-full', service.accent === 'primary' ? 'bg-primary' : 'bg-secondary')} />
            {item}
          </li>
        ))}
      </ul>
    </GlowCard>
  )
}
