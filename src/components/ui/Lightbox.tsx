import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useRef, type PointerEvent } from 'react'
import { Picture } from '@/components/ui/Picture'
import type { GalleryPhoto } from '@/data/gallery'
import { useT } from '@/i18n'
import { cn } from '@/lib/cn'

const EASE_OUT_CUBIC = [0.215, 0.61, 0.355, 1] as const
/** Horizontal drag (px) that counts as a swipe between photos. */
const SWIPE_THRESHOLD = 48

interface LightboxProps {
  photos: readonly GalleryPhoto[]
  /** Index of the open photo, or null when closed. */
  index: number | null
  onChange: (index: number | null) => void
}

/**
 * Full-screen photo viewer: arrows, keyboard, swipe on touch screens and a
 * thumbnail strip on larger screens. Neighbouring photos are prefetched so
 * stepping through the gallery never shows a blank frame.
 */
export function Lightbox({ photos, index, onChange }: LightboxProps) {
  const t = useT()
  const reduce = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)
  const swipeStart = useRef<number | null>(null)
  const open = index !== null
  const photo = index !== null ? photos[index] : undefined

  const step = useCallback(
    (delta: number) => {
      if (index === null) return
      onChange((index + delta + photos.length) % photos.length)
    },
    [index, onChange, photos.length],
  )

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focus = window.setTimeout(() => closeRef.current?.focus(), 50)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onChange(null)
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.clearTimeout(focus)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onChange, step])

  // Prefetch the previous and next full-size photos.
  useEffect(() => {
    if (index === null) return
    for (const delta of [1, -1]) {
      const neighbour = photos[(index + delta + photos.length) % photos.length]
      const img = new Image()
      img.src = neighbour.src.replace(/\.jpe?g$/i, '.webp')
    }
  }, [index, photos])

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') return
    swipeStart.current = event.clientX
  }
  const onPointerUp = (event: PointerEvent) => {
    if (swipeStart.current === null) return
    const dx = event.clientX - swipeStart.current
    swipeStart.current = null
    if (Math.abs(dx) >= SWIPE_THRESHOLD) step(dx < 0 ? 1 : -1)
  }

  return (
    <AnimatePresence>
      {open && photo && (
        <m.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t.lightbox.photoOf(photo.caption, index! + 1, photos.length)}
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink-900/92 p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE_OUT_CUBIC }}
          onClick={() => onChange(null)}
        >
          <m.figure
            key={photo.id}
            className="relative flex w-full max-w-6xl touch-pan-y flex-col items-center select-none"
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.22, ease: EASE_OUT_CUBIC }}
            onClick={(event) => event.stopPropagation()}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (swipeStart.current = null)}
          >
            <Picture
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              loading="eager"
              draggable={false}
              className="max-h-[68vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl sm:max-h-[72vh]"
            />
            <figcaption className="mt-3 text-center text-sm text-sand-50/90">
              {photo.caption}
              <span className="text-sand-50/50" dir="ltr"> · {index! + 1} / {photos.length}</span>
            </figcaption>
          </m.figure>

          {/* Thumbnail strip — desktop and tablets; phones swipe instead */}
          <ul
            className="mt-4 hidden max-w-full gap-2 overflow-x-auto px-2 pb-1 sm:flex"
            aria-label={t.lightbox.allPhotos}
            onClick={(event) => event.stopPropagation()}
          >
            {photos.map((item, itemIndex) => (
              <li key={item.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onChange(itemIndex)}
                  aria-label={t.lightbox.showPhoto(itemIndex + 1, item.caption)}
                  aria-current={itemIndex === index ? 'true' : undefined}
                  className={cn(
                    'block cursor-pointer overflow-hidden rounded-lg border-2 transition-[border-color,opacity] duration-200',
                    itemIndex === index ? 'border-primary-bright opacity-100' : 'border-transparent opacity-60 hover:opacity-100',
                  )}
                >
                  <Picture
                    src={item.thumb}
                    alt=""
                    width={800}
                    height={600}
                    sizes="96px"
                    className="aspect-[4/3] w-20 object-cover lg:w-24"
                  />
                </button>
              </li>
            ))}
          </ul>

          <button
            ref={closeRef}
            type="button"
            onClick={() => onChange(null)}
            aria-label={t.lightbox.close}
            className="absolute top-4 end-4 inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-sand-50 transition-colors hover:bg-white/20"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              step(-1)
            }}
            aria-label={t.lightbox.previous}
            className="absolute top-1/2 left-2 inline-flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-sand-50 transition-colors hover:bg-white/20 sm:left-6"
          >
            <ChevronLeft className="size-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              step(1)
            }}
            aria-label={t.lightbox.next}
            className="absolute top-1/2 right-2 inline-flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-sand-50 transition-colors hover:bg-white/20 sm:right-6"
          >
            <ChevronRight className="size-6" aria-hidden="true" />
          </button>
        </m.div>
      )}
    </AnimatePresence>
  )
}
