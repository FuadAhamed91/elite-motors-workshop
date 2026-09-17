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

function shouldShowIntro(): boolean {
  if (!intro.enabled || intro.frequency === 'never' || forceSkip()) return false
  if (intro.frequency === 'always' || forceReplay()) return true
  try {
    return !window.sessionStorage.getItem(intro.storageKey)
  } catch {
    return true
  }
}

function markIntroSeen() {
  try {
    window.sessionStorage.setItem(intro.storageKey, '1')
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
