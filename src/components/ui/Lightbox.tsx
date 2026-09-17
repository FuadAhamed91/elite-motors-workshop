import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import { Picture } from '@/components/ui/Picture'
import type { GalleryPhoto } from '@/data/gallery'

const EASE_OUT_CUBIC = [0.215, 0.61, 0.355, 1] as const

interface LightboxProps {
  photos: readonly GalleryPhoto[]
  /** Index of the open photo, or null when closed. */
  index: number | null
  onChange: (index: number | null) => void
}

/** Full-screen photo viewer with keyboard navigation and focus handling. */
export function Lightbox({ photos, index, onChange }: LightboxProps) {
  const reduce = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)
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

  return (
    <AnimatePresence>
      {open && photo && (
        <m.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={photo.caption}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-900/90 p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE_OUT_CUBIC }}
          onClick={() => onChange(null)}
        >
          <m.figure
            key={photo.id}
            className="relative flex max-h-full w-full max-w-6xl flex-col items-center"
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.22, ease: EASE_OUT_CUBIC }}
            onClick={(event) => event.stopPropagation()}
          >
            <Picture
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              loading="eager"
              className="max-h-[78vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <figcaption className="mt-3 text-center text-sm text-sand-50/90">
              {photo.caption}
              <span className="text-sand-50/50"> · {index! + 1} / {photos.length}</span>
            </figcaption>
          </m.figure>

          <button
            ref={closeRef}
            type="button"
            onClick={() => onChange(null)}
            aria-label="Close"
            className="absolute top-4 right-4 inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-sand-50 transition-colors hover:bg-white/20"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              step(-1)
            }}
            aria-label="Previous photo"
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
            aria-label="Next photo"
            className="absolute top-1/2 right-2 inline-flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-sand-50 transition-colors hover:bg-white/20 sm:right-6"
          >
            <ChevronRight className="size-6" aria-hidden="true" />
          </button>
        </m.div>
      )}
    </AnimatePresence>
  )
}
