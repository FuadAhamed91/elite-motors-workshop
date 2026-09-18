import { createContext, useContext } from 'react'

/**
 * True while rendering the static shell at build time (see `src/shell`).
 * Components that depend on the clock or the browser render a neutral
 * placeholder instead, so nothing wrong is ever painted before React runs.
 */
export const ShellContext = createContext(false)

export function useIsShell(): boolean {
  return useContext(ShellContext)
}
