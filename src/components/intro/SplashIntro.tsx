import {
  AnimatePresence,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  useVelocity,
} from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { BrandMark } from '@/components/icons/BrandMark'
import { StartLights } from '@/components/intro/StartLights'
import { TopDownF1Car } from '@/components/intro/TopDownF1Car'
import { intro, resolveSplash, reviewMode, splashLaunchMs } from '@/config/intro'
import { workshop } from '@/config/workshop'
import type { IntroGate } from '@/hooks/useIntroGate'

const EASE_OUT_CUBIC = [0.215, 0.61, 0.355, 1] as const

/**
 * Full-screen splash on the site's cream/beige gradient: three start lights
 * come on, hold, go out — then a top-down F1 car launches from just below the
 * viewport straight up and off the top (power4.in), leaving skid marks and
 * speed streaks. The backdrop fades as the car clears the frame. The site
 * behind is inert until then (see App). Once per session, skippable.
 */
export function SplashIntro({ active, ready, finish }: IntroGate) {
  const [lit, setLit] = useState(0)
  const [lightsOut, setLightsOut] = useState(false)
  const [launched, setLaunched] = useState(false)
  const timers = useRef<number[]>([])

  // Vertical position in px drives everything: stretch, trail and streak intensity follow velocity.
  const y = useMotionValue(typeof window === 'undefined' ? 0 : window.innerHeight)
  const velocity = useVelocity(y) // negative while travelling up
  const stretch = useTransform(velocity, [-2800, -300], [1.14, 1], { clamp: true })
  const trailOpacity = useTransform(velocity, [-2600, -350], [0.9, 0], { clamp: true })
  const streakOpacity = useTransform(velocity, [-2400, -250], [1, 0], { clamp: true })
  const carTransform = useMotionTemplate`translate3d(-50%, ${y}px, 0) scaleY(${stretch})`

  useEffect(() => {
    if (!ready) return
    const splash = resolveSplash()
    const viewportHeight = window.innerHeight
    y.set(viewportHeight) // translateY(100vh): just below the viewport

    if (reviewMode() === 'freeze') {
      // Dev review frame: lights on, car parked in view, nothing moves, no auto-finish.
      setLit(splash.lights.count)
      setLaunched(true)
      y.set(viewportHeight * 0.06)
      return
    }

    const schedule = (ms: number, fn: () => void) => {
      timers.current.push(window.setTimeout(fn, ms))
    }
    for (let i = 0; i < splash.lights.count; i++) {
      schedule(splash.lights.startMs + i * splash.lights.intervalMs, () => setLit(i + 1))
    }

    let controls: ReturnType<typeof animate> | null = null
    const launchMs = splashLaunchMs(splash)
    schedule(launchMs, () => {
      setLightsOut(true)
      setLaunched(true)
      controls = animate(y, -1.2 * viewportHeight, {
        // translateY(-120vh) — well clear of the top
        duration: splash.durationMs / 1000,
        ease: splash.ease,
      })
    })
    // Start the backdrop fade as the car clears the top edge.
    schedule(launchMs + splash.durationMs - 120, finish)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finish()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      controls?.stop()
      timers.current.forEach((id) => window.clearTimeout(id))
      timers.current = []
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [ready, y, finish])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="splash-intro"
          role="dialog"
          aria-modal="true"
          aria-label={`Welcome to ${workshop.name}`}
          className="splash-backdrop fixed inset-0 z-[9999] overflow-hidden will-change-[opacity]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: intro.splash.fadeMs / 1000, ease: EASE_OUT_CUBIC } }}
        >
          {/* heat-haze displacement filter (used by the exhaust plume) */}
          <svg className="absolute size-0" aria-hidden="true" focusable="false">
            <filter id="splash-haze" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.02 0.07" numOctaves="2" seed="4">
                <animate
                  attributeName="baseFrequency"
                  dur="0.5s"
                  values="0.02 0.07;0.028 0.09;0.02 0.07"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" scale="18" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </svg>

          {/* backdrop layers */}
          <div aria-hidden="true" className="splash-asphalt absolute inset-0" />
          <div aria-hidden="true" className="splash-vignette absolute inset-0" />

          {/* track texture rushing past — only visible once the car is moving fast */}
          <motion.div
            aria-hidden="true"
            className="splash-streaks absolute inset-x-[18%] inset-y-0 motion-safe:animate-streaks-down sm:inset-x-[30%]"
            style={{ opacity: streakOpacity }}
          />

          {/* grid slot at the launch position + twin skid marks */}
          <div aria-hidden="true" className="absolute bottom-0 left-1/2 h-[30vh] w-[min(46vw,270px)] -translate-x-1/2">
            <div className="splash-grid-box absolute inset-x-0 bottom-0 h-[10vh] opacity-50" />
            {launched && (
              <>
                {/* rear tyres sit at 15% / 85% of the car's width — skids are centred on them */}
                <span className="splash-skid absolute bottom-0 left-[8.5%] h-full w-[13%] rounded-t-full motion-safe:animate-skid" />
                <span className="splash-skid absolute right-[8.5%] bottom-0 h-full w-[13%] rounded-t-full motion-safe:animate-skid" />
              </>
            )}
          </div>

          {/* the car */}
          <motion.div
            aria-hidden="true"
            className="absolute top-0 left-1/2 w-[min(46vw,270px)] will-change-transform"
            style={{ transform: carTransform, transformOrigin: '50% 100%' }}
          >
            {/* motion-blur trail behind (below) the car */}
            <motion.div
              className="absolute inset-x-[14%] top-[92%] h-[70%] rounded-full bg-linear-to-b from-brand-red/45 via-ink-900/15 to-transparent blur-[8px]"
              style={{ opacity: trailOpacity }}
            />
            {/* exhaust plume with heat-haze distortion */}
            <div
              className="absolute top-[93%] left-1/2 h-[22%] w-[38%] -translate-x-1/2"
              style={{ filter: 'url(#splash-haze)' }}
            >
              <div className="size-full rounded-full bg-[radial-gradient(ellipse_at_50%_0%,rgb(255_170_60/0.6),rgb(255_110_20/0.3)_35%,transparent_70%)] blur-[2px] motion-safe:animate-exhaust" />
            </div>
            <TopDownF1Car className="relative w-full" />
          </motion.div>

          {/* start lights — hang above the track, so the car passes beneath them */}
          <div className="absolute inset-x-0 top-[max(5rem,13%)] sm:top-[max(6rem,15%)]">
            <StartLights lit={lit} out={lightsOut} count={intro.splash.lights.count} rows={1} />
          </div>

          {/* brand + skip */}
          <div className="absolute top-5 left-5 flex items-center gap-3 sm:top-6 sm:left-8">
            <BrandMark className="h-9 w-auto sm:h-11" />
            <span className="hidden font-display text-sm font-bold tracking-[0.14em] text-fg uppercase sm:block">
              Elite Motors Workshop
            </span>
          </div>
          <button
            type="button"
            onClick={finish}
            className="absolute top-5 right-5 inline-flex h-11 cursor-pointer items-center gap-1.5 rounded-pill border border-line bg-surface/80 px-4 text-sm font-semibold text-fg backdrop-blur transition-colors duration-150 ease-out hover:border-line-strong hover:bg-surface sm:top-6 sm:right-8"
          >
            Skip
            <X className="size-4" aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
