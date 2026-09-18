import { createContext, useContext } from 'react'

/** Which entry page is rendering — decides how section anchors are written. */
export type PageId = 'home' | 'insurance'

export const PageContext = createContext<PageId>('home')

export function usePage(): PageId {
  return useContext(PageContext)
}

/**
 * Section anchors (`#hours`) only exist on the home page; from any other page
 * they must point back to it (`/#hours`). Page paths (`/insurance`) and
 * external URLs pass through untouched.
 */
export function resolveHref(href: string, page: PageId): string {
  return href.startsWith('#') && page !== 'home' ? `/${href}` : href
}

/** `const href = useHref(); <a href={href('#hours')}>` */
export function useHref(): (href: string) => string {
  const page = usePage()
  return (href) => resolveHref(href, page)
}
