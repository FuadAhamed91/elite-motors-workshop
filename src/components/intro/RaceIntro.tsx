import {
  AnimatePresence,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  useVelocity,
} from 'framer-motion'
import { Volume2, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { BrandMark } from '@/components/icons/BrandMark'
import { F1Car } from '@/components/intro/F1Car'
import { StartLights } from '@/components/intro/StartLights'
import { forceReplay, intro, lightsOutMs, resolveTimeline } from '@/config/intro'
import { workshop } from '@/config/workshop'
import { cn } from '@/lib/cn'
import { getAudioContext, playAudioFile, playIntroSound, tryUnlockAudio } from '@/lib/engineSound'

type Phase = 'grid' | 'race'

/* Easing per the web-animation-design guide: on-screen movement = ease-in-out
   (a car accelerating then braking — the braking half happens off screen),
   entering/exiting elements = ease-out. */
const EASE_IN_OUT_QUINT = [0.86, 0, 0.07, 1] as const
const EASE_OUT_CUBIC = [0.215, 0.61, 0.355, 1] as const

const SPARKS = [0, 1, 2, 3, 4] as const
const SMOKE = [0, 1, 2] as const

function shouldShowIntro(): boolean {
  if (!intro.enabled || intro.frequency === 'never') return false
  // A background tab has no animation frames — the sequence would stall, so skip it.
  if (document.visibilityState === 'hidden') return false
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

/** Car width in px for the current viewport (mirrors the Tailwind classes below). */
function carWidth(): number {
  return Math.min(Math.max(window.innerWidth * 0.44, 260), 520)
}

/**
 * Opening sequence: the car waits on the grid while five start lights come
 * on, then launches across the frame and pulls the overlay away behind it to
 * reveal the site. Runs on its own (tap anywhere for sound), is skippable,
 * shows once per session and is disabled under reduced motion.
 */
export function RaceIntro() {
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState<boolean>(() => !reduceMotion && shouldShowIntro())
  const [phase, setPhase] = useState<Phase>('grid')
  const [lit, setLit] = useState(0)
  const [lightsOut, setLightsOut] = useState(false)
  const [soundOn, setSoundOn] = useState(false)

  const startedAt = useRef(0)
  const timers = useRef<number[]>([])
  const stopSound = useRef<(() => void) | null>(null)
  const viewportWidth = useRef(1200)

  // One motion value drives the car, its lean/stretch, the blur trail and the wipe.
  const carX = useMotionValue(0)
  const velocity = useVelocity(carX)
  const lean = useTransform(velocity, [0, 3200], [0, -7], { clamp: true })
  const stretch = useTransform(velocity, [0, 3200], [1, 1.07], { clamp: true })
  const trailOpacity = useTransform(velocity, [300, 2600], [0, 0.85], { clamp: true })
  const sparkOpacity = useTransform(velocity, [900, 2400], [0, 1], { clamp: true })
  const carTransform = useMotionTemplate`translate3d(${carX}px, 0, 0) skewX(${lean}deg) scaleX(${stretch})`
  const wipe = useTransform(carX, (x) => `${Math.max(0, x - viewportWidth.current * 0.26)}px`)

  const finish = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
    stopSound.current?.()
    stopSound.current = null
    markIntroSeen()
    setOpen(false)
  }, [])

  /** Starts audio from wherever the visual timeline currently is. */
  const enableSound = useCallback(() => {
    if (stopSound.current) return
    const elapsed = performance.now() - startedAt.current
    if (intro.soundUrl) {
      stopSound.current = playAudioFile(intro.soundUrl, elapsed)
    } else {
      const ctx = getAudioContext()
      if (!ctx) return
      void ctx.resume()
      stopSound.current = playIntroSound(ctx, resolveTimeline(), elapsed)
    }
    setSoundOn(true)
  }, [])

  // Visual timeline: lights → hold → lights out → launch → done.
  useEffect(() => {
    if (!open) return
    const timeline = resolveTimeline()
    viewportWidth.current = window.innerWidth
    carX.set(window.innerWidth * 0.05)
    startedAt.current = performance.now()

    const schedule = (ms: number, fn: () => void) => {
      timers.current.push(window.setTimeout(fn, ms))
    }
    for (let i = 0; i < timeline.lightCount; i++) {
      schedule(timeline.lightsStartMs + i * timeline.lightIntervalMs, () => setLit(i + 1))
    }
    const launchMs = lightsOutMs(timeline)
    schedule(launchMs, () => {
      setLightsOut(true)
      setPhase('race')
    })
    schedule(launchMs + timeline.raceMs + 80, finish)

    // Audio may already be allowed (repeat interaction) — start it silently in sync.
    void tryUnlockAudio().then((allowed) => {
      if (allowed) enableSound()
    })

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finish()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id))
      timers.current = []
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, carX, finish, enableSound])

  // Launch: one ease-in-out run to well past the right edge, so the visible
  // part is pure acceleration and the "braking" half happens off screen.
  useEffect(() => {
    if (phase !== 'race') return
    const controls = animate(carX, window.innerWidth + carWidth() * 0.9, {
      duration: resolveTimeline().raceMs / 1000,
      ease: EASE_IN_OUT_QUINT,
    })
    return () => controls.stop()
  }, [phase, carX])

  const onTap = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 && event.pointerType === 'mouse') return
    enableSound()
  }

  const racing = phase === 'race'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="race-intro"
          role="dialog"
          aria-modal="true"
          aria-label={`Welcome to ${workshop.name}`}
          onPointerDown={onTap}
          className="race-sky race-wipe fixed inset-0 z-[100] overflow-hidden will-change-[mask-image,opacity]"
          style={{ '--wipe': wipe } as CSSProperties}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.32, ease: EASE_OUT_CUBIC } }}
        >
          {/* distant backdrop + streaks (panning-shot feel) */}
          <div
            aria-hidden="true"
            className={cn(
              'race-backdrop absolute inset-x-0 top-[26%] h-[22%] opacity-70',
              racing && 'motion-safe:animate-pan-streaks',
            )}
          />

          {/* brand + skip */}
          <div className="absolute top-5 left-5 flex items-center gap-3 sm:top-6 sm:left-8">
            <BrandMark className="h-9 w-auto sm:h-11" />
            <span className="hidden font-display text-sm font-bold tracking-[0.14em] text-fg uppercase sm:block">
              Elite Motors Workshop
            </span>
          </div>
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={finish}
            className="absolute top-5 right-5 inline-flex h-11 cursor-pointer items-center gap-1.5 rounded-pill border border-line bg-surface/80 px-4 text-sm font-semibold text-fg backdrop-blur transition-colors duration-150 ease-out hover:border-line-strong hover:bg-surface sm:top-6 sm:right-8"
          >
            Skip
            <X className="size-4" aria-hidden="true" />
          </button>

          {/* start lights */}
          <div className="absolute inset-x-0 top-[13%] sm:top-[15%]">
            <StartLights lit={lit} out={lightsOut} count={intro.timeline.lightCount} />
          </div>

          {/* track */}
          <div className="absolute inset-x-0 top-[48%] -translate-y-1/2 sm:top-1/2">
            <div className="race-kerb h-2" aria-hidden="true" />
            <div
              className={cn(
                'race-track relative h-36 sm:h-52',
                racing && 'motion-safe:[animation:var(--animate-road-dash)]',
              )}
            >
              {racing && (
                <div
                  aria-hidden="true"
                  className="race-pan-streaks absolute inset-0 opacity-30 motion-safe:animate-pan-streaks"
                />
              )}

              {/* car — width mirrors carWidth() */}
              <motion.div
                aria-hidden="true"
                className="absolute bottom-2 left-0 w-[44vw] max-w-[520px] min-w-[260px] will-change-transform sm:bottom-3"
                style={{ transform: carTransform, transformOrigin: '20% 100%' }}
              >
                {/* motion-blur trail behind the car */}
                <motion.div
                  className="absolute top-[40%] right-[60%] h-[36%] w-[80%] rounded-full bg-linear-to-l from-ink-900/45 to-transparent blur-[6px]"
                  style={{ opacity: trailOpacity }}
                />
                {/* sparks off the floor at speed */}
                <motion.div className="absolute bottom-[8%] left-[28%] h-2 w-[40%]" style={{ opacity: sparkOpacity }}>
                  {SPARKS.map((i) => (
                    <span
                      key={i}
                      className="absolute top-0 h-[2px] w-3 rounded-full bg-brand-yellow shadow-[0_0_6px_var(--color-brand-yellow)] motion-safe:animate-spark"
                      style={{ left: `${i * 18}%`, animationDelay: `${i * 55}ms` }}
                    />
                  ))}
                </motion.div>
                {/* tyre smoke at launch */}
                {racing &&
                  SMOKE.map((i) => (
                    <span
                      key={i}
                      aria-hidden="true"
                      className="absolute bottom-1 left-[12%] size-12 rounded-full bg-surface-elevated/70 blur-[3px] motion-safe:animate-smoke-puff"
                      style={{ animationDelay: `${i * 90}ms` }}
                    />
                  ))}
                <div className={cn(!racing && 'motion-safe:animate-idle-shake')}>
                  <F1Car spinning={racing} className="w-full" />
                </div>
              </motion.div>
            </div>
            <div className="race-kerb h-2" aria-hidden="true" />
            {/* pit wall line */}
            <div aria-hidden="true" className="h-1 bg-ink-900/25" />
          </div>

          {/* sound hint — the whole overlay is the tap target */}
          <AnimatePresence>
            {!soundOn && (
              <motion.div
                key="hint"
                className="pointer-events-none absolute inset-x-0 bottom-[max(2rem,env(safe-area-inset-bottom))] flex justify-center"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.25, delay: 0.2, ease: EASE_OUT_CUBIC } }}
                exit={{ opacity: 0, transition: { duration: 0.15, ease: EASE_OUT_CUBIC } }}
              >
                <span className="inline-flex items-center gap-2 rounded-pill border border-line bg-surface/80 px-4 py-2 text-xs font-medium text-fg-muted backdrop-blur">
                  <Volume2 className="size-4" aria-hidden="true" />
                  Tap anywhere for sound
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
