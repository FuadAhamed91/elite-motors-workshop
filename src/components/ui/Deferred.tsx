import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'

/*
 * Sections far below the fold are not rendered at all until the visitor
 * scrolls within ~900px of them: React does no work for them on load, the DOM
 * stays small, and the first interaction is not blocked by building the logo
 * wall, the review cards and the footer that nobody is looking at yet.
 *
 * Anchor links and deep links (`#hours`) need every section to exist, so
 * `mountAll()` flips a shared flag that mounts everything at once; the anchor
 * hook waits a frame after that before scrolling.
 */

let all = false
const listeners = new Set<() => void>()

/** Mount every deferred section now (anchor navigation, deep links). */
export function mountAll() {
  if (all) return
  all = true
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const getAll = () => all

interface DeferredProps {
  children: ReactNode
  /** Placeholder height until the section mounts — roughly the section's own height keeps the scrollbar honest. */
  minHeight?: string
}

export function Deferred({ children, minHeight = '70vh' }: DeferredProps) {
  const forced = useSyncExternalStore(subscribe, getAll, getAll)
  const [near, setNear] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (near || forced) return
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setNear(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true)
          observer.disconnect()
        }
      },
      { rootMargin: '900px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [near, forced])

  if (near || forced) return <>{children}</>
  return <div ref={ref} aria-hidden="true" style={{ minHeight }} />
}
