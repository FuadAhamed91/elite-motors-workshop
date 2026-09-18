import { ArrowUpRight, Check, Images } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import { Picture } from '@/components/ui/Picture'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { workshop } from '@/config/workshop'
import { equipment, photos, type GalleryPhoto } from '@/data/gallery'
import { useT, type Dictionary } from '@/i18n'

/** Loaded on first tap so the viewer's code stays out of the initial bundle. */
const Lightbox = lazy(() => import('@/components/ui/Lightbox').then((mod) => ({ default: mod.Lightbox })))

/** Photo captions/alt text in the active language (facility photos live under services). */
export function localisePhotos(t: Dictionary): GalleryPhoto[] {
  return photos.map((photo) => {
    const copy = t.workshop.photos[photo.id] ?? t.services.facilities[photo.id]
    return copy ? { ...photo, caption: copy.caption, alt: copy.alt } : photo
  })
}

/**
 * Inside the workshop: equipment highlights from the company profile and a
 * Gallery subsection that opens the photo viewer (all number plates blurred
 * before publishing).
 */
export function Workshop() {
  const t = useT()
  const [open, setOpen] = useState<number | null>(null)
  const [viewerLoaded, setViewerLoaded] = useState(false)
  const localised = localisePhotos(t)

  const openPhoto = (index: number) => {
    setViewerLoaded(true)
    setOpen(index)
  }

  return (
    <section id="workshop" aria-labelledby="workshop-heading" className="container-x py-20 lg:py-28">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16">
        <Reveal>
          <SectionHeading
            id="workshop-heading"
            eyebrow={t.workshop.eyebrow}
            title={t.workshop.title}
            description={t.workshop.description(workshop.foundedYear)}
          />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {equipment.map((item) => {
              const copy = t.workshop.equipment[item.id] ?? item
              return (
                <li key={item.id} className="flex gap-3 rounded-2xl border border-line bg-surface p-4">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-fg">{copy.title}</span>
                    <span className="block text-sm text-fg-muted">{copy.detail}</span>
                  </span>
                </li>
              )
            })}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <GalleryTeaser photos={localised} onOpen={openPhoto} />
        </Reveal>
      </div>

      {viewerLoaded && (
        <Suspense fallback={null}>
          <Lightbox photos={localised} index={open} onChange={setOpen} />
        </Suspense>
      )}
    </section>
  )
}

interface GalleryTeaserProps {
  photos: readonly GalleryPhoto[]
  onOpen: (index: number) => void
}

/** "Gallery" subsection: a cover photo plus a few thumbnails — every tap opens the viewer. */
function GalleryTeaser({ photos, onOpen }: GalleryTeaserProps) {
  const t = useT()
  // The About section already shows the exterior sign, so the gallery leads with the entrance.
  const coverIndex = Math.max(0, photos.findIndex((photo) => photo.id === 'front'))
  const cover = photos[coverIndex]
  const previews = photos
    .map((photo, index) => ({ photo, index }))
    .filter(({ index }) => index !== coverIndex)
    .slice(0, 3)
  const remaining = photos.length - 1 - previews.length
  const g = t.workshop.gallery

  return (
    <div id="gallery" aria-labelledby="gallery-heading" className="rounded-card border border-line bg-surface p-4 shadow-card sm:p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">{g.eyebrow}</p>
          <h3 id="gallery-heading" className="mt-1 font-display text-xl font-bold tracking-tight text-fg">
            {g.title}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => onOpen(coverIndex)}
          className="group inline-flex shrink-0 cursor-pointer items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary-bright"
        >
          {g.viewAll(photos.length)}
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => onOpen(coverIndex)}
        className="group relative mt-4 block w-full cursor-pointer overflow-hidden rounded-2xl border border-line bg-sand-200"
      >
        <Picture
          src={cover.thumb}
          alt={cover.alt}
          width={800}
          height={600}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
        />
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-ink-900/70 to-transparent" />
        <span className="pointer-events-none absolute bottom-4 start-4 inline-flex items-center gap-2 rounded-pill border border-white/40 bg-surface/95 px-4 py-2 text-sm font-semibold text-fg shadow-card">
          <Images className="size-4 text-primary" aria-hidden="true" />
          {g.openGallery(photos.length)}
        </span>
      </button>

      <ul className="mt-3 grid grid-cols-4 gap-2 sm:gap-3" aria-label={g.morePhotos}>
        {previews.map(({ photo, index }) => (
          <li key={photo.id}>
            <button
              type="button"
              onClick={() => onOpen(index)}
              aria-label={g.openPhoto(photo.caption)}
              className="group block w-full cursor-pointer overflow-hidden rounded-xl border border-line bg-sand-200"
            >
              <Picture
                src={photo.thumb}
                alt={photo.alt}
                width={800}
                height={600}
                sizes="(min-width: 1024px) 12vw, 22vw"
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05] motion-reduce:group-hover:scale-100"
              />
            </button>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => onOpen(previews.length + 1)}
            title={g.remainingAria(remaining)}
            className="flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-line bg-bg font-display text-lg font-bold text-fg transition-colors hover:border-primary/50 hover:text-primary"
          >
            +{remaining}
            <span className="font-sans text-[11px] font-medium text-fg-muted">{g.more}</span>
          </button>
        </li>
      </ul>
      <p className="mt-3 text-xs text-fg-muted">{g.hint}</p>
    </div>
  )
}
