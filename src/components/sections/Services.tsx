import { ArrowUpRight, Check } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { GlowCard } from '@/components/ui/GlowCard'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
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

  return (
    <GlowCard accent={service.accent} innerClassName="flex flex-col">
      {/* photo header — workshop photo, number plates redacted */}
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-sand-200">
        <img
          src={service.image.src}
          alt={service.image.alt}
          width={service.image.width}
          height={service.image.height}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
        />
        <span
          className={cn(
            'absolute bottom-3 left-3 flex size-11 items-center justify-center rounded-xl border border-white/40 bg-surface/95 shadow-card',
            accentText,
          )}
        >
          <Icon className="size-5" aria-hidden="true" strokeWidth={1.75} />
        </span>
        {service.badge && (
          <span className="absolute top-3 right-3 rounded-pill border border-white/40 bg-surface/95 px-2.5 py-1 text-[11px] font-semibold tracking-wider text-secondary uppercase shadow-card">
            {service.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
      <h3 className="font-display text-lg font-bold tracking-tight text-fg">{service.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">{service.description}</p>

      <ul className="mt-4 space-y-2 pb-1" aria-label={`What ${service.title} includes`}>
        {service.includes.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-fg/90">
            <Check className={cn('size-4 shrink-0', accentText)} strokeWidth={2.5} aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
      </div>
    </GlowCard>
  )
}
