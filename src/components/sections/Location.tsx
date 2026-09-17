import { ExternalLink, MapPin, Navigation, Phone } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { CtaLink } from '@/components/ui/CtaLink'
import { GlowCard } from '@/components/ui/GlowCard'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { workshop } from '@/config/workshop'
import { useT } from '@/i18n'
import { cn } from '@/lib/cn'
import { buildTelLink } from '@/lib/whatsapp'

export function Location() {
  const t = useT()
  return (
    <section id="location" aria-labelledby="location-heading" className="container-x pb-20 lg:pb-28">
      <Reveal>
        <SectionHeading
          id="location-heading"
          eyebrow={t.location.eyebrow}
          title={t.location.title}
          description={t.location.description}
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
  const t = useT()
  const { phone } = workshop

  return (
    <GlowCard innerClassName="flex h-full flex-col p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
          <MapPin className="size-6" aria-hidden="true" />
        </span>
        <address className="not-italic">
          <p className="font-display text-xl font-bold text-fg">{t.location.line1}</p>
          <p className="mt-2 leading-relaxed text-fg/90">
            {t.location.line2}
            <br />
            {t.location.city}
          </p>
          <p className="mt-3 text-sm text-fg-muted">{t.location.landmarks}</p>
        </address>
      </div>

      <dl className="mt-8 space-y-4 border-t border-line pt-6">
        <div className="flex items-center gap-4">
          <dt className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-fg/4 text-secondary">
            <Phone className="size-4.5" aria-hidden="true" />
            <span className="sr-only">{t.location.phone}</span>
          </dt>
          <dd>
            <a
              href={buildTelLink(phone)}
              className="font-semibold text-fg transition-colors hover:text-primary tabular-nums"
              dir="ltr"
            >
              {phone}
            </a>
            <p className="text-xs text-fg-muted">{t.location.phoneNote}</p>
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
          {t.common.openInGoogleMaps}
        </CtaLink>
        <CtaLink
          href={workshop.directionsLink}
          external
          variant="outline"
          icon={<Navigation />}
          className="sm:flex-1"
        >
          {t.common.getDirections}
        </CtaLink>
      </div>
    </GlowCard>
  )
}

/**
 * Google Maps iframe mounted only once the section comes within ~400px of the
 * viewport — the Maps scripts are heavy and would otherwise compete with the
 * page's own load — with a skeleton until it paints.
 */
function MapEmbed() {
  const t = useT()
  const [loaded, setLoaded] = useState(false)
  const [near, setNear] = useState(false)
  const frame = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = frame.current
    if (!el || near) return
    if (!('IntersectionObserver' in window)) {
      setNear(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setNear(true)
      },
      { rootMargin: '400px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [near])

  return (
    <div
      ref={frame}
      className="relative min-h-[320px] overflow-hidden rounded-card border border-line bg-surface shadow-card sm:min-h-[400px] lg:h-full"
    >
      {near && (
        <iframe
          src={workshop.mapEmbedUrl}
          title={t.location.mapTitle(t.brand.name, t.location.line2)}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setLoaded(true)}
          className={cn(
            'map-tone absolute inset-0 h-full w-full border-0 transition-opacity duration-700',
            loaded ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}
      {!loaded && (
        <div aria-hidden="true" className="bg-grid absolute inset-0 animate-pulse bg-surface-elevated/40" />
      )}
      <div className="pointer-events-none absolute inset-x-4 bottom-4 flex justify-between gap-3">
        <span className="min-w-0 truncate rounded-pill border border-line bg-bg/95 px-3 py-1.5 text-xs font-medium text-fg">
          {t.location.line2}
        </span>
        <a
          href={workshop.mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto inline-flex shrink-0 items-center gap-1.5 rounded-pill bg-primary px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-cta-fg shadow-glow-primary transition-transform hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
        >
          {t.common.largerMap}
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
