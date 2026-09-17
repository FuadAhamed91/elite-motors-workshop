/**
 * Opening "race" intro — an F1 car tears across a track (with engine sound
 * once the visitor taps), then a short menu of options appears.
 * Everything here is optional polish; set `enabled: false` to remove it.
 */
export const intro = {
  enabled: true,
  /** 'session' = once per browser session, 'always' = every load, 'never' = off. */
  frequency: 'session' as 'session' | 'always' | 'never',
  /**
   * Optional licensed audio file placed in /public (e.g. '/sounds/f1-pass.mp3').
   * When null the engine sound is synthesized with the Web Audio API.
   */
  soundUrl: null as string | null,
  /** If the visitor doesn't tap "Start engine", the race starts silently after this delay. */
  autoStartAfterMs: 2500,
  /** How long the car takes to cross the screen. */
  raceDurationMs: 2200,
  /** sessionStorage key used for the once-per-session rule. */
  storageKey: 'emw-intro-seen',
} as const
