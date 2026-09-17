/**
 * Opening intro. Two variants are available:
 *   'splash'     — dark full-screen backdrop, top-down F1 car launches straight up
 *                  the screen and the backdrop fades into the site (see `splash`)
 *   'lights-out' — F1 start-light sequence, side-view car races across a track
 *                  and wipes the overlay away (see `timeline`)
 * Set `enabled: false` to remove the intro entirely.
 */
export const intro = {
  enabled: true,
  variant: 'splash' as 'splash' | 'lights-out',
  /** 'session' = once per browser session, 'always' = every load, 'never' = off. */
  frequency: 'session' as 'session' | 'always' | 'never',
  /** Vertical launch splash. */
  splash: {
    /** Start lights (single row) that gate the launch. */
    lights: {
      startMs: 260 as number,
      intervalMs: 210 as number,
      count: 3,
      /** All lit before they go out. */
      holdMs: 320 as number,
    },
    /** Car travel from below the viewport (100vh) to above it (-120vh). */
    durationMs: 1800 as number,
    /** Aggressive racing acceleration curve (power4.in). */
    ease: [0.7, 0, 0.84, 0] as [number, number, number, number],
    /** Backdrop fade once the car has cleared the top. */
    fadeMs: 400 as number,
  },
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
  storageKey: 'hasSeenIntro',
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

export type IntroReviewMode = 'normal' | 'slow' | 'replay' | 'freeze'

/**
 * Dev-only review switches (ignored in production builds):
 *   ?intro=replay — ignore the once-per-session rule
 *   ?intro=slow   — run 4–8× slower
 *   ?intro=freeze — splash only: park the car mid-screen with no motion
 */
export function reviewMode(): IntroReviewMode {
  if (!import.meta.env.DEV || typeof window === 'undefined') return 'normal'
  const mode = new URLSearchParams(window.location.search).get('intro')
  return mode === 'slow' || mode === 'replay' || mode === 'freeze' ? mode : 'normal'
}

/** Same dev aid for the splash variant: `?intro=slow` stretches the launch 4×. */
export function resolveSplash(): typeof intro.splash {
  if (reviewMode() !== 'slow') return intro.splash
  const { lights } = intro.splash
  return {
    ...intro.splash,
    durationMs: intro.splash.durationMs * 4,
    lights: {
      ...lights,
      startMs: lights.startMs * 4,
      intervalMs: lights.intervalMs * 4,
      holdMs: lights.holdMs * 4,
    },
  }
}

/** Moment the splash lights go out and the car launches, in ms from start. */
export function splashLaunchMs(splash: typeof intro.splash): number {
  const { lights } = splash
  return lights.startMs + lights.intervalMs * (lights.count - 1) + lights.holdMs
}

export function forceReplay(): boolean {
  return reviewMode() !== 'normal'
}

/** Moment the lights go out and the car launches, in ms from mount. */
export function lightsOutMs(timeline: IntroTimeline): number {
  return timeline.lightsStartMs + timeline.lightIntervalMs * (timeline.lightCount - 1) + timeline.holdMs
}
