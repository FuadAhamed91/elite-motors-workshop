import { Phone } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { CtaLink } from '@/components/ui/CtaLink'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { workshop } from '@/config/workshop'
import { brandWall, type Brand, type BrandRegion } from '@/data/brands'
import { useT } from '@/i18n'
import { cn } from '@/lib/cn'
import { buildTelLink } from '@/lib/whatsapp'

const REGIONS: readonly BrandRegion[] = ['European', 'Japanese', 'Korean', 'American']

/**
 * "All makes" logo wall on a navy band: the manufacturers' marks glide past in
 * a continuous loop (paused while off-screen, on hover, and under reduced
 * motion, where the row simply scrolls by hand).
 */
export function Brands() {
  const t = useT()
  const c = t.brands
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  // Only animate while the band is on screen — the loop is transform-only, but idle work is still work.
  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? false), { rootMargin: '80px 0px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="brands" aria-labelledby="brands-heading" className="below-fold relative overflow-hidden bg-navy-900 py-20 text-sand-50 lg:py-24">
      <div aria-hidden="true" className="brand-stripe absolute inset-x-0 top-0 h-1" />
      <div aria-hidden="true" className="absolute -top-40 left-1/2 -z-0 h-[520px] w-[900px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--color-royal-500)_28%,transparent),transparent_65%)]" />

      <div className="container-x relative">
        <Reveal>
          <SectionHeading id="brands-heading" tone="dark" eyebrow={c.eyebrow} title={c.title} description={c.description} />
        </Reveal>
      </div>

      <Reveal delay={0.1} className="relative mt-12">
        <div
          ref={ref}
          dir="ltr"
          role="region"
          aria-label={c.wallLabel}
          data-inview={inView}
          className="marquee [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]"
        >
          {/* Two copies of the row: the track slides by exactly one copy, so the loop is seamless. */}
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0 items-stretch gap-4 pe-4 sm:gap-5 sm:pe-5" aria-hidden={copy === 1 || undefined}>
                {brandWall.map((brand) => (
                  <BrandTile key={brand.id} brand={brand} />
                ))}
              </ul>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="container-x relative mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Reveal delay={0.15}>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-sand-300" aria-label={c.regionsLabel}>
            {REGIONS.map((region) => (
              <li key={region} className="inline-flex items-center gap-2">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-gold-500" />
                {t.services.regions[region]}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.2}>
          <CtaLink href={buildTelLink(workshop.phone)} variant="accent" size="md" icon={<Phone />}>
            {c.cta}
          </CtaLink>
        </Reveal>
      </div>
    </section>
  )
}

function BrandTile({ brand }: { brand: Brand }) {
  const t = useT()
  return (
    <li
      className="flex w-36 shrink-0 flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-5 transition-colors duration-300 hover:bg-white/10 sm:w-40"
    >
      <span className="flex h-11 items-center justify-center">
        {brand.logo ? (
          <img
            src={brand.logo}
            alt=""
            width={44}
            height={brand.height ?? 36}
            loading="lazy"
            decoding="async"
            style={{ height: brand.height ?? 36 }}
            className={cn('w-auto max-w-[6.5rem] opacity-90')}
          />
        ) : (
          <span className="font-display text-lg font-extrabold tracking-[0.04em] whitespace-nowrap text-sand-50 uppercase">{brand.name}</span>
        )}
      </span>
      <span className="text-xs font-medium tracking-wide text-sand-300">
        <span className="sr-only">{t.brands.serviced} </span>
        {brand.name}
      </span>
    </li>
  )
}
