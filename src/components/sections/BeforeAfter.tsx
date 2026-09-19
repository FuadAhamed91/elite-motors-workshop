import { ArrowUpRight, Phone } from 'lucide-react'
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

/** Every shot as a viewer photo — pair by pair, on arrival then after repair — with captions in the active language. */
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

const COLUMNS = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
} as const

interface RepairGridProps {
  pairs?: readonly RepairPair[]
  /** Cards per row on desktop — 2 on the dedicated page (bigger photos), 3 in the teasers. */
  columns?: keyof typeof COLUMNS
  className?: string
}

/**
 * The repair cards plus the shared viewer: tapping a card's photo opens the
 * Lightbox over every shot in `pairs` (on arrival → after repair order).
 */
export function RepairGrid({ pairs = repairs, columns = 3, className }: RepairGridProps) {
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
      <StaggerGroup as="ul" className={cn('grid gap-4 lg:gap-5', COLUMNS[columns], className)} aria-label={c.listLabel}>
        {pairs.map((pair, index) => (
          <StaggerItem as="li" key={pair.id}>
            <SwitchCard pair={pair} photos={photos} firstIndex={index * 2} onOpen={openPhoto} />
          </StaggerItem>
        ))}
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
 * Home-page teaser (same pattern as the insurance section): three cars and a
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
            {c.openPage}
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
  /** How many cars to show. */
  limit: number
}

/** Compact strip for other pages (the insurance page): an h3, a few cars and a link to the full page. */
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
          {c.seeAll}
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
        </a>
      </div>
      <RepairGrid pairs={repairs.slice(0, limit)} className="mt-5" />
    </div>
  )
}

interface SwitchCardProps {
  pair: RepairPair
  /** All viewer photos; this car's shots are at `firstIndex` (on arrival) and `firstIndex + 1` (after repair). */
  photos: readonly GalleryPhoto[]
  firstIndex: number
  onOpen: (index: number) => void
}

/**
 * One car, one photo: an "On arrival | After repair" switch cross-fades
 * between the two shots (the repaired car shows first); tapping the photo
 * opens the viewer on the shot being shown.
 */
function SwitchCard({ pair, photos, firstIndex, onOpen }: SwitchCardProps) {
  const t = useT()
  const c = t.beforeAfter
  const copy = c.cars[pair.id] ?? { name: pair.id, work: '' }
  const [stage, setStage] = useState<RepairStage>('after')
  const label = (which: RepairStage) => (which === 'before' ? c.before : c.after)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card">
      <div className="relative p-1">
        <button
          type="button"
          onClick={() => onOpen(firstIndex + (stage === 'after' ? 1 : 0))}
          aria-label={c.openPhoto(copy.name, label(stage))}
          className="group relative block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-[calc(var(--radius-card)-0.25rem)] bg-sand-200 sm:aspect-[16/10]"
        >
          {STAGES.map((which, offset) => {
            const photo = photos[firstIndex + offset]
            const active = which === stage
            return (
              <Picture
                key={which}
                src={photo.src}
                thumb={photo.thumb}
                alt={active ? photo.alt : ''}
                aria-hidden={!active}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                style={{ objectPosition: pair[which].focus }}
                className={cn(
                  'absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100',
                  active ? 'opacity-100' : 'opacity-0',
                )}
              />
            )
          })}
          {/* Legibility scrim behind the switch */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-ink-900/55 to-transparent" />
        </button>

        <div
          role="group"
          aria-label={c.toggleLabel}
          className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 rounded-pill border border-white/50 bg-surface/95 p-1 shadow-card"
        >
          {STAGES.map((which) => (
            <button
              key={which}
              type="button"
              aria-pressed={which === stage}
              onClick={() => setStage(which)}
              className={cn(
                'min-h-9 cursor-pointer rounded-pill px-3.5 text-xs font-semibold whitespace-nowrap transition-colors duration-200 sm:px-4 sm:text-[13px]',
                which === stage ? 'bg-primary text-on-primary shadow-sm' : 'text-fg-muted hover:text-fg',
              )}
            >
              {label(which)}
            </button>
          ))}
        </div>
      </div>
      <div className="px-4 py-3">
        <p className="font-semibold text-fg">{copy.name}</p>
        <p className="mt-0.5 text-sm leading-snug text-fg-muted">{copy.work}</p>
      </div>
    </article>
  )
}
