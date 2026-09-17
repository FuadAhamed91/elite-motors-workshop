import { ArrowUpRight, Check } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { GlowCard } from '@/components/ui/GlowCard'
import { Picture } from '@/components/ui/Picture'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { facilities } from '@/data/gallery'
import { brands, services, type Service } from '@/data/services'
import { cn } from '@/lib/cn'
import { waLinks } from '@/lib/whatsapp'

export function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="container-x py-20 lg:py-28">
      <Reveal>
        <SectionHeading
          id="services-heading"
          eyebrow="Services"
          title="Mechanical, body and paint — under one roof."
          description="Engine and gearbox work, servicing, AC, brakes, denting, painting, electrical diagnosis and detailing. Every job starts with a clear estimate — no surprises on the invoice."
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
      <StaggerGroup as="ul" className="mt-10 grid gap-4 sm:grid-cols-3" aria-label="Where the work happens">
        {facilities.map((facility) => (
          <StaggerItem
            as="li"
            key={facility.id}
            className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card"
          >
            <Picture
              src={facility.thumb}
              alt={facility.alt}
              width={800}
              height={Math.round((800 * facility.height) / facility.width)}
              className="aspect-[3/2] w-full object-cover"
            />
            <div className="p-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">{facility.service}</p>
              <p className="mt-1 text-sm font-semibold text-fg">{facility.caption}</p>
              <p className="mt-0.5 text-sm text-fg-muted">{facility.blurb}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <Reveal delay={0.05}>
        <div className="mt-10 rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Multi-brand workshop</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {(Object.keys(brands) as Array<keyof typeof brands>).map((region) => (
              <div key={region}>
                <p className="text-sm font-semibold text-fg">{region}</p>
                <p className="mt-1 text-sm leading-relaxed text-fg-muted">{brands[region].join(' · ')}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-sm text-fg-muted">
          Not sure what your car needs?
          <a
            href={waLinks.quote()}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 font-semibold text-primary transition-colors hover:text-primary-bright"
          >
            <WhatsAppIcon className="size-4" />
            Describe the problem on WhatsApp
            <ArrowUpRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
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
  const Icon = service.icon
  const accentText = service.accent === 'primary' ? 'text-primary' : 'text-secondary'
  const accentBg = service.accent === 'primary' ? 'bg-primary/12' : 'bg-secondary/12'

  return (
    <GlowCard accent={service.accent} innerClassName="flex flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'flex size-12 shrink-0 items-center justify-center rounded-xl border border-line transition-transform duration-300 group-hover:scale-105 motion-reduce:group-hover:scale-100',
            accentBg,
            accentText,
          )}
        >
          <Icon className="size-6" aria-hidden="true" strokeWidth={1.75} />
        </span>
        {service.badge && (
          <span className="rounded-pill border border-secondary/30 bg-secondary/10 px-2.5 py-1 text-right text-[11px] font-semibold tracking-wider text-secondary uppercase">
            {service.badge}
          </span>
        )}
      </div>

      <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-fg">{service.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">{service.description}</p>

      <ul className="mt-4 space-y-2 pb-1" aria-label={`What ${service.title} includes`}>
        {service.includes.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-fg/90">
            <Check className={cn('size-4 shrink-0', accentText)} strokeWidth={2.5} aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </GlowCard>
  )
}
