import { Check, Images } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import { Picture } from '@/components/ui/Picture'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { equipment, gallery } from '@/data/gallery'
import { cn } from '@/lib/cn'

/** Loaded on first tap so the viewer's code stays out of the initial bundle. */
const Lightbox = lazy(() => import('@/components/ui/Lightbox').then((mod) => ({ default: mod.Lightbox })))

/**
 * Inside the workshop: equipment highlights from the company profile and a
 * photo gallery of the facility (all number plates blurred before publishing).
 */
export function Workshop() {
  const [open, setOpen] = useState<number | null>(null)
  const [viewerLoaded, setViewerLoaded] = useState(false)

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
            eyebrow="Inside the workshop"
            title="A full mechanical, body and paint facility in Mussafah."
            description="Serving Abu Dhabi since 2003 with dealer-grade equipment under one roof — so your car doesn’t travel between garages for mechanical work, bodywork and paint."
          />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {equipment.map((item) => (
              <li key={item.title} className="flex gap-3 rounded-2xl border border-line bg-surface p-4">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-fg">{item.title}</span>
                  <span className="block text-sm text-fg-muted">{item.detail}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 flex items-center gap-2 text-xs text-fg-muted">
            <Images className="size-4 text-primary" aria-hidden="true" />
            Tap any photo to view it full size.
          </p>
        </Reveal>

        <StaggerGroup as="ul" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {gallery.map((photo, index) => (
            <StaggerItem
              as="li"
              key={photo.id}
              className={cn(
                index === 0 && 'col-span-2 lg:row-span-2',
                index === gallery.length - 1 && 'col-span-2 lg:col-span-1',
              )}
            >
              <button
                type="button"
                onClick={() => openPhoto(index)}
                aria-label={`Open photo: ${photo.caption}`}
                className="group relative block h-full w-full cursor-pointer overflow-hidden rounded-2xl border border-line bg-surface shadow-card"
              >
                <Picture
                  src={photo.thumb}
                  alt={photo.alt}
                  width={800}
                  height={600}
                  className="aspect-[4/3] h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-ink-900/70 to-transparent px-3 pt-8 pb-2.5 text-left text-xs font-medium text-sand-50 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {photo.caption}
                </span>
              </button>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>

      {viewerLoaded && (
        <Suspense fallback={null}>
          <Lightbox photos={gallery} index={open} onChange={setOpen} />
        </Suspense>
      )}
    </section>
  )
}
