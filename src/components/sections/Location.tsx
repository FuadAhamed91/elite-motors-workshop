import { ExternalLink, MapPin, Navigation, Phone } from 'lucide-react'
import { useState } from 'react'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { CtaLink } from '@/components/ui/CtaLink'
import { GlowCard } from '@/components/ui/GlowCard'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { workshop } from '@/config/workshop'
import { cn } from '@/lib/cn'
import { buildTelLink, waLinks } from '@/lib/whatsapp'

export function Location() {
  return (
    <section id="location" aria-labelledby="location-heading" className="container-x pb-20 lg:pb-28">
      <Reveal>
        <SectionHeading
          id="location-heading"
          eyebrow="Find us"
          title="In the heart of Mussafah Industrial Area."
          description="Sector M21 of Mussafah Industrial Area — a short drive from Abu Dhabi city, Khalifa City and the Al Ain Road."
        />
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <AddressCard />
        </Reveal>
        <Reveal delay={0.1}>
          <MapEmbed />
        </Reveal>
      </div>
    </section>
  )
}

function AddressCard() {
  const { address, phone } = workshop

  return (
    <GlowCard innerClassName="flex h-full flex-col p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
          <MapPin className="size-6" aria-hidden="true" />
        </span>
        <address className="not-italic">
          <p className="font-display text-xl font-bold text-fg">{address.line1}</p>
          <p className="mt-2 leading-relaxed text-fg/90">
            {address.line2}
            <br />
            {address.city}
          </p>
          <p className="mt-3 text-sm text-fg-muted">{address.landmarks}</p>
        </address>
      </div>

      <dl className="mt-8 space-y-4 border-t border-line pt-6">
        <div className="flex items-center gap-4">
          <dt className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-fg/4 text-secondary">
            <Phone className="size-4.5" aria-hidden="true" />
            <span className="sr-only">Phone</span>
          </dt>
          <dd>
            <a
              href={buildTelLink(phone)}
              className="font-semibold text-fg transition-colors hover:text-primary tabular-nums"
            >
              {phone}
            </a>
            <p className="text-xs text-fg-muted">Landline · call during working hours</p>
          </dd>
        </div>
        <div className="flex items-center gap-4">
          <dt className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-fg/4 text-cta">
            <WhatsAppIcon className="size-4.5" />
            <span className="sr-only">WhatsApp</span>
          </dt>
          <dd>
            <a
              href={waLinks.directions()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-fg transition-colors hover:text-primary"
            >
              Chat on WhatsApp
            </a>
            <p className="text-xs text-fg-muted">Send us your location for directions</p>
          </dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
        <CtaLink
          href={workshop.mapsLink}
          external
          variant="outline"
          icon={<ExternalLink />}
          className="sm:flex-1"
        >
          Open in Google Maps
        </CtaLink>
        <CtaLink
          href={workshop.directionsLink}
          external
          variant="outline"
          icon={<Navigation />}
          className="sm:flex-1"
        >
          Get Directions
        </CtaLink>
      </div>
    </GlowCard>
  )
}

/** Lazy Google Maps iframe with a dark treatment and a skeleton until it paints. */
function MapEmbed() {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative min-h-[320px] overflow-hidden rounded-card border border-line bg-surface shadow-card sm:min-h-[400px] lg:h-full">
      <iframe
        src={workshop.mapEmbedUrl}
        title={`Map showing ${workshop.name} in ${workshop.address.line2}, Abu Dhabi`}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoaded(true)}
        className={cn(
          'map-tone absolute inset-0 h-full w-full border-0 transition-opacity duration-700',
          loaded ? 'opacity-100' : 'opacity-0',
        )}
      />
      {!loaded && (
        <div aria-hidden="true" className="bg-grid absolute inset-0 animate-pulse bg-surface-elevated/40" />
      )}
      <div className="pointer-events-none absolute inset-x-4 bottom-4 flex justify-between gap-3">
        <span className="rounded-pill border border-line bg-bg/85 px-3 py-1.5 text-xs font-medium text-fg backdrop-blur-md">
          {workshop.address.line2}
        </span>
        <a
          href={workshop.mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-pill bg-primary px-3 py-1.5 text-xs font-semibold text-cta-fg shadow-glow-primary transition-transform hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
        >
          Larger map
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
