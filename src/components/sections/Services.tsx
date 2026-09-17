import { ArrowUpRight, Check } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { CtaLink } from '@/components/ui/CtaLink'
import { GlowCard } from '@/components/ui/GlowCard'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { services, type Service } from '@/data/services'
import { cn } from '@/lib/cn'
import { waLinks } from '@/lib/whatsapp'

export function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="container-x py-20 lg:py-28">
      <Reveal>
        <SectionHeading
          id="services-heading"
          eyebrow="Services"
          title="Everything your car needs, under one roof."
          description="From a 20-minute diagnostic scan to a full transmission rebuild. Every job starts with a clear WhatsApp quote — no surprises on the invoice."
        />
      </Reveal>

      <StaggerGroup as="ul" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <StaggerItem as="li" key={service.id} className="h-full">
            <ServiceCard service={service} />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  )
}

interface ServiceCardProps {
  service: Service
}

function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon
  const accentText = service.accent === 'primary' ? 'text-primary' : 'text-secondary'
  const accentBg = service.accent === 'primary' ? 'bg-primary/12' : 'bg-secondary/12'

  return (
    <GlowCard accent={service.accent} innerClassName="flex flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'flex size-12 items-center justify-center rounded-xl border border-line transition-transform duration-300 group-hover:scale-105 motion-reduce:group-hover:scale-100',
            accentBg,
            accentText,
          )}
        >
          <Icon className="size-6" aria-hidden="true" strokeWidth={1.75} />
        </span>
        {service.badge && (
          <span className="rounded-pill border border-secondary/30 bg-secondary/10 px-2.5 py-1 text-[11px] font-semibold tracking-wider text-secondary uppercase">
            {service.badge}
          </span>
        )}
      </div>

      <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-fg">{service.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">{service.description}</p>

      <ul className="mt-4 space-y-2" aria-label={`What ${service.title} includes`}>
        {service.includes.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-fg/90">
            <Check className={cn('size-4 shrink-0', accentText)} strokeWidth={2.5} aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <CtaLink
          href={waLinks.service(service.name)}
          external
          size="sm"
          icon={<WhatsAppIcon />}
          iconRight={<ArrowUpRight />}
          className="w-full sm:w-auto"
          aria-label={`Book ${service.name} via WhatsApp`}
        >
          Book via WhatsApp
        </CtaLink>
      </div>
    </GlowCard>
  )
}
