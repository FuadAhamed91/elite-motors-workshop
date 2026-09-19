import { ArrowRight, ArrowUpRight, Phone } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import { createPortal } from 'react-dom'
import { CtaLink } from '@/components/ui/CtaLink'
import { Picture } from '@/components/ui/Picture'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { workshop } from '@/config/workshop'
import type { GalleryPhoto } from '@/data/gallery'
import { repairs, repairSrc, type RepairPair, type RepairStage } from '@/data/repairs'
import { useT, type Dictionary } from '@/i18n'
import { cn } from '@/lib/cn'
import { buildTelLink } from '@/lib/whatsapp'

/** Loaded on first tap so the viewer's code stays out of the initial bundle. */
const Lightbox = lazy(() => import('@/components/ui/Lightbox').then((mod) => ({ default: mod.Lightbox })))

const STAGES: readonly RepairStage[] = ['before', 'after']

/** Every shot as a viewer photo — pair by pair, before then after — with captions in the active language. */
export function repairPhotos(t: Dictionary, pairs: readonly RepairPair[] = repairs): GalleryPhoto[] {
  const c = t.beforeAfter
  return pairs.flatMap((pair) => {
    const name = c.cars[pair.id]?.name ?? pair.id
    return STAGES.map((stage) => ({
      id: `${pair.id}-${stage}`,
      ...repairSrc(pair.id, stage),
      width: pair[stage].width,
      height: pair[stage].height,
      caption: stage === 'before' ? c.captionBefore(name) : c.captionAfter(name),
      alt: stage === 'before' ? c.altBefore(name) : c.altAfter(name),
    }))
  })
}

interface RepairGridProps {
  pairs?: readonly RepairPair[]
  /** Show the first pair at full width (the /before-after page); off for the teasers. */
  featured?: boolean
  className?: string
}

/**
 * The before/after cards plus the shared viewer: any photo opens the Lightbox
 * over every shot in `pairs` (before → after order).
 */
export function RepairGrid({ pairs = repairs, featured = false, className }: RepairGridProps) {
  const t = useT()
  const c = t.beforeAfter
  const photos = repairPhotos(t, pairs)
  const [open, setOpen] = useState<number | null>(null)
  const [viewerLoaded, setViewerLoaded] = useState(false)

  const openPhoto = (index: number) => {
    setViewerLoaded(true)
    setOpen(index)
  }

  return (
    <>
      <StaggerGroup as="ul" className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5', className)} aria-label={c.listLabel}>
        {pairs.map((pair, index) => {
          const big = featured && index === 0
          return (
            <StaggerItem as="li" key={pair.id} className={cn(big && 'sm:col-span-2 lg:col-span-3')}>
              <PairCard pair={pair} photos={photos} firstIndex={index * 2} featured={big} onOpen={openPhoto} />
            </StaggerItem>
          )
        })}
      </StaggerGroup>
      <p className="mt-4 text-xs text-fg-muted">{c.hint}</p>

      {/* Portalled to <body>: sections are paint-contained (content-visibility), which would clip a fixed viewer inside them. */}
      {viewerLoaded &&
        createPortal(
          <Suspense fallback={null}>
            <Lightbox photos={photos} index={open} onChange={setOpen} />
          </Suspense>,
          document.body,
        )}
    </>
  )
}

/**
 * Home-page teaser (same pattern as the insurance section): three pairs and a
 * button to the dedicated /before-after page with the full set.
 */
export function BeforeAfter() {
  const t = useT()
  const c = t.beforeAfter

  return (
    <section id="before-after" aria-labelledby="before-after-heading" className="below-fold container-x py-20 lg:py-28">
      <Reveal>
        <SectionHeading id="before-after-heading" eyebrow={c.eyebrow} title={c.title} description={c.homeLead} />
      </Reveal>

      <RepairGrid pairs={repairs.slice(0, 3)} className="mt-10" />

      <Reveal delay={0.1}>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <CtaLink href="/before-after" size="lg" iconRight={<ArrowUpRight className="rtl:-scale-x-100" />}>
            {c.openPage(repairs.length)}
          </CtaLink>
          <CtaLink href={buildTelLink(workshop.phone)} variant="outline" size="lg" icon={<Phone />}>
            {t.common.call(workshop.phone)}
          </CtaLink>
        </div>
      </Reveal>
    </section>
  )
}

interface BeforeAfterStripProps {
  /** How many pairs to show. */
  limit: number
}

/** Compact strip for other pages (the insurance page): an h3, a few pairs and a link to the full page. */
export function BeforeAfterStrip({ limit }: BeforeAfterStripProps) {
  const t = useT()
  const c = t.beforeAfter

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <h3 className="font-display text-xl font-bold tracking-tight text-fg">{c.compactTitle}</h3>
        <a
          href="/before-after"
          className="group inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary-bright"
        >
          {c.seeAll(repairs.length)}
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
        </a>
      </div>
      <RepairGrid pairs={repairs.slice(0, limit)} className="mt-5" />
    </div>
  )
}

interface PairCardProps {
  pair: RepairPair
  /** All viewer photos; this pair's shots are at `firstIndex` (before) and `firstIndex + 1` (after). */
  photos: readonly GalleryPhoto[]
  firstIndex: number
  featured?: boolean
  onOpen: (index: number) => void
}

/** One car: before and after side by side (before at the reading start, so the pair reads left→right / right→left). */
function PairCard({ pair, photos, firstIndex, featured = false, onOpen }: PairCardProps) {
  const t = useT()
  const c = t.beforeAfter
  const copy = c.cars[pair.id] ?? { name: pair.id, work: '' }

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card">
      <div className="relative grid grid-cols-2 gap-1 p-1">
        {STAGES.map((stage, offset) => {
          const photo = photos[firstIndex + offset]
          const label = stage === 'before' ? c.before : c.after
          return (
            <button
              key={stage}
              type="button"
              onClick={() => onOpen(firstIndex + offset)}
              aria-label={c.openPhoto(copy.name, label)}
              className="group relative block w-full cursor-pointer overflow-hidden rounded-[calc(var(--radius-card)-0.25rem)] bg-sand-200"
            >
              <Picture
                src={photo.src}
                thumb={photo.thumb}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes={featured ? '(min-width: 1280px) 600px, 50vw' : '(min-width: 1024px) 20vw, (min-width: 640px) 25vw, 50vw'}
                style={{ objectPosition: pair[stage].focus }}
                className={cn(
                  'w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:group-hover:scale-100',
                  featured ? 'aspect-[4/3] sm:aspect-[16/10]' : 'aspect-square sm:aspect-[4/3]',
                )}
              />
              <span
                className={cn(
                  'pointer-events-none absolute top-2 start-2 rounded-pill px-2.5 py-1 text-[11px] font-bold tracking-[0.12em] uppercase shadow-sm',
                  stage === 'before' ? 'bg-ink-900/80 text-sand-50' : 'bg-primary text-on-primary',
                )}
              >
                {label}
              </span>
            </button>
          )
        })}
        {/* Seam badge: reads as "this became that" */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-surface/95 text-primary shadow-card"
        >
          <ArrowRight className="size-4 rtl:-scale-x-100" strokeWidth={2.5} />
        </span>
      </div>
      <div className="flex flex-1 items-start justify-between gap-3 px-4 py-3">
        <div>
          <p className={cn('font-semibold text-fg', featured && 'text-lg')}>{copy.name}</p>
          <p className="mt-0.5 text-sm leading-snug text-fg-muted">{copy.work}</p>
        </div>
      </div>
    </article>
  )
}
