import { useEffect } from 'react'
import { mountAll } from '@/components/ui/Deferred'

/**
 * Below-the-fold sections use `content-visibility: auto`, and the lower ones
 * are not mounted at all until they are near the viewport (see `Deferred`).
 * A jump to "#hours" would then land short or on nothing. Before any in-page
 * navigation (nav links, the assistant's links, a deep link on load) this
 * mounts everything, renders every section up to and including the target,
 * and only then scrolls.
 */
export function useAnchorNavigation(ready: boolean) {
  useEffect(() => {
    if (!ready) return

    const revealUpTo = (target: Element) => {
      for (const section of document.querySelectorAll<HTMLElement>('.below-fold')) {
        const precedes = section.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING
        if (section.contains(target) || precedes) section.style.contentVisibility = 'visible'
      }
    }

    /**
     * Mount everything, wait for the target to exist, then jump to it and keep
     * correcting for a few frames while the freshly mounted sections above it
     * take their real height (an instant jump — a smooth scroll across sections
     * that are still growing never lands where it should).
     */
    const jumpAfterMount = (id: string, done?: () => void) => {
      mountAll()
      let tries = 0
      const look = () => {
        const target = document.getElementById(id)
        if (!target) {
          if (tries++ < 10) window.requestAnimationFrame(look)
          return
        }
        revealUpTo(target)
        const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0
        let frames = 0
        const settle = () => {
          const top = target.getBoundingClientRect().top - margin
          if (Math.abs(top) > 2) target.scrollIntoView({ behavior: 'instant', block: 'start' })
          if (frames++ < 12) window.requestAnimationFrame(settle)
          else done?.()
        }
        settle()
      }
      window.requestAnimationFrame(look)
    }
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
      const id = link?.getAttribute('href')?.slice(1)
      if (!id) return
      const target = document.getElementById(id)
      if (target) {
        revealUpTo(target)
        return // the browser's own anchor navigation follows (smooth scroll, focus, history)
      }
      // Not mounted yet: mount everything, then do the jump ourselves.
      event.preventDefault()
      window.history.pushState(null, '', `#${id}`)
      jumpAfterMount(id)
    }
    document.addEventListener('click', onClick, true)

    // Deep link (e.g. /#hours) — the sections mount after the first paint, so scroll now.
    const id = window.location.hash.slice(1)
    if (id) jumpAfterMount(id)

    return () => document.removeEventListener('click', onClick, true)
  }, [ready])
}
