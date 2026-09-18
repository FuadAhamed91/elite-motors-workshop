import { useEffect } from 'react'

/**
 * Below-the-fold sections use `content-visibility: auto`, so until they have
 * been rendered once they take a placeholder height. A jump to "#hours" would
 * then land short, because the sections above it grow to their real size as
 * the page scrolls past them. Before any in-page navigation (nav links, the
 * assistant's links, a deep link on load) this renders every section up to
 * and including the target, so the browser computes the true position.
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

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
      const id = link?.getAttribute('href')?.slice(1)
      const target = id ? document.getElementById(id) : null
      if (target) revealUpTo(target)
      // The browser's own anchor navigation follows (smooth scroll, focus, history).
    }
    document.addEventListener('click', onClick, true)

    // Deep link (e.g. /#hours) — the sections mount after the first paint, so scroll now.
    const id = window.location.hash.slice(1)
    const target = id ? document.getElementById(id) : null
    if (target) {
      revealUpTo(target)
      target.scrollIntoView()
    }

    return () => document.removeEventListener('click', onClick, true)
  }, [ready])
}
