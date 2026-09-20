import { Phone } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { CtaLink } from '@/components/ui/CtaLink'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { workshop } from '@/config/workshop'
import { brandWall, type Brand } from '@/data/brands'
import { useT } from '@/i18n'
import { buildTelLink } from '@/lib/whatsapp'

/**
 * "All makes" logo wall on a navy band: the manufacturers' logos (original colours) glide past in
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
          className="marquee [mask-image:linear-gradient(90deg,transparent,black_4%,black_96%,transparent)]"
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

      <div className="container-x relative mt-10 flex sm:justify-end">
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
      className="flex w-40 shrink-0 flex-col items-center justify-center gap-3 rounded-2xl border border-white/60 bg-sand-50 px-4 py-5 text-navy-900 shadow-[0_18px_40px_-24px_rgb(0_0_0/0.6)] transition-transform duration-300 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 sm:w-44"
    >
      <span className="flex h-14 items-center justify-center">
        <img
          src={brand.logo}
          alt=""
          width={Math.round(brand.height * 2)}
          height={brand.height}
          loading="lazy"
          decoding="async"
          style={{ height: brand.height }}
          className="w-auto max-w-[8.5rem] object-contain"
        />
      </span>
      <span className="text-[13px] font-semibold tracking-wide text-navy-800">
        <span className="sr-only">{t.brands.serviced} </span>
        {brand.name}
      </span>
    </li>
  )
}
