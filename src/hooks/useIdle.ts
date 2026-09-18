import { useEffect, useState } from 'react'

/** True once the main thread has gone idle after load (or after `timeout` ms at the latest). */
export function useIdle(timeout = 2500): boolean {
  const [idle, setIdle] = useState(false)
  useEffect(() => {
    // Safari has no requestIdleCallback — fall back to a short timer.
    if (typeof window.requestIdleCallback !== 'function') {
      const id = window.setTimeout(() => setIdle(true), 1200)
      return () => window.clearTimeout(id)
    }
    const id = window.requestIdleCallback(() => setIdle(true), { timeout })
    return () => window.cancelIdleCallback(id)
  }, [timeout])
  return idle
}
