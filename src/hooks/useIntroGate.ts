import { useReducedMotion } from 'framer-motion'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { forceReplay, forceSkip, intro } from '@/config/intro'

export interface IntroGate {
  /** True while an intro overlay is on screen — the site behind it is made inert. */
  active: boolean
  /**
   * True once the overlay may start animating: the document is visible.
   * A page opened in a background tab has no animation frames, so intros wait
   * for this instead of stalling half-way.
   */
  ready: boolean
  /** Called by the intro when it has finished or been skipped. */
  finish: () => void
}

/** Where "seen" is remembered: per visitor or per browser session. */
function seenStore(): Storage {
  return intro.frequency === 'once' ? window.localStorage : window.sessionStorage
}

/** Save-Data, or a phone with very few cores / little memory — not worth a 2 s animation. */
function isWeakDevice(): boolean {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number }
  if (nav.connection?.saveData) return true
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 2) return true
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 2) return true
  return false
}

function shouldShowIntro(): boolean {
  if (!intro.enabled || intro.frequency === 'never' || forceSkip()) return false
  if (forceReplay()) return true
  if (intro.skipOnWeakDevices && isWeakDevice()) return false
  if (intro.frequency === 'always') return true
  try {
    return !seenStore().getItem(intro.storageKey)
  } catch {
    return true
  }
}

function markIntroSeen() {
  try {
    seenStore().setItem(intro.storageKey, '1')
  } catch {
    /* private mode — ignore */
  }
}

/**
 * Decides once per page load whether the intro plays (session rule, reduced
 * motion, hidden tab) and records when it is done so refreshes skip it.
 */
export function useIntroGate(): IntroGate {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState<boolean>(() => !reduceMotion && shouldShowIntro())
  const [visible, setVisible] = useState<boolean>(() => document.visibilityState === 'visible')

  useEffect(() => {
    if (visible || !active) return
    const onChange = () => {
      if (document.visibilityState === 'visible') setVisible(true)
    }
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [visible, active])

  const finish = useCallback(() => {
    markIntroSeen()
    setActive(false)
  }, [])

  return { active, ready: active && visible, finish }
}

/** True while an intro overlay covers the page — reveals wait for it to finish. */
export const IntroActiveContext = createContext(false)

export function useIntroActive(): boolean {
  return useContext(IntroActiveContext)
}
