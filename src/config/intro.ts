/**
 * Opening "lights out" intro — an F1 car waits on the grid while the five
 * start lights come on, then launches across the screen and pulls the
 * overlay away to reveal the site. Set `enabled: false` to remove it.
 */
export const intro = {
  enabled: true,
  /** 'session' = once per browser session, 'always' = every load, 'never' = off. */
  frequency: 'session' as 'session' | 'always' | 'never',
  /**
   * Optional licensed audio clip in /public (e.g. '/sounds/f1-start.mp3').
   * When null the start lights and engine are synthesized with the Web Audio API.
   */
  soundUrl: null as string | null,
  /** Sequence timing in milliseconds from the moment the intro mounts. */
  timeline: {
    lightsStartMs: 450,
    lightIntervalMs: 220,
    lightCount: 5,
    /** All five lit before they go out ("it's lights out and away we go"). */
    holdMs: 420,
    /** Car launch → off screen. */
    raceMs: 1500,
  },
  /** sessionStorage key used for the once-per-session rule. */
  storageKey: 'emw-intro-seen',
} as const

export interface IntroTimeline {
  lightsStartMs: number
  lightIntervalMs: number
  lightCount: number
  holdMs: number
  raceMs: number
}

/**
 * Dev aid: open the site with `?intro=slow` to run the sequence 8× slower
 * (and `?intro=replay` to ignore the once-per-session rule) when reviewing it.
 */
export function resolveTimeline(): IntroTimeline {
  if (!import.meta.env.DEV || typeof window === 'undefined') return intro.timeline
  const mode = new URLSearchParams(window.location.search).get('intro')
  if (mode !== 'slow') return intro.timeline
  const t = intro.timeline
  return {
    ...t,
    lightsStartMs: t.lightsStartMs * 8,
    lightIntervalMs: t.lightIntervalMs * 8,
    holdMs: t.holdMs * 8,
    raceMs: t.raceMs * 8,
  }
}

export function forceReplay(): boolean {
  if (!import.meta.env.DEV || typeof window === 'undefined') return false
  const mode = new URLSearchParams(window.location.search).get('intro')
  return mode === 'slow' || mode === 'replay'
}

/** Moment the lights go out and the car launches, in ms from mount. */
export function lightsOutMs(timeline: IntroTimeline): number {
  return timeline.lightsStartMs + timeline.lightIntervalMs * (timeline.lightCount - 1) + timeline.holdMs
}
