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
import { useEffect, useState } from 'react'
import { BrandMark } from '@/components/icons/BrandMark'
import { TopDownF1Car } from '@/components/intro/TopDownF1Car'
import { intro, resolveSplash, reviewMode } from '@/config/intro'
import { workshop } from '@/config/workshop'
import type { IntroGate } from '@/hooks/useIntroGate'

const EASE_OUT_CUBIC = [0.215, 0.61, 0.355, 1] as const

/**
 * Full-screen splash: a top-down F1 car starts just below the viewport,
 * accelerates straight up and off the top (power4.in), leaving skid marks
 * and speed streaks; the backdrop fades out as the car clears the frame.
 * The site behind is inert until then (see App). Once per session, skippable.
 */
export function SplashIntro({ active, ready, finish }: IntroGate) {
  const [launched, setLaunched] = useState(false)

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
    setLaunched(true)

    if (reviewMode() === 'freeze') {
      // Dev review frame: car parked in view, nothing moves, no auto-finish.
      y.set(viewportHeight * 0.06)
      return
    }

    const controls = animate(y, -1.2 * viewportHeight, {
      // translateY(-120vh) — well clear of the top
      duration: splash.durationMs / 1000,
      ease: splash.ease,
    })
    // Start the backdrop fade as the car clears the top edge.
    const done = window.setTimeout(finish, splash.durationMs - 120)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finish()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      controls.stop()
      window.clearTimeout(done)
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
          <div aria-hidden="true" className="absolute bottom-0 left-1/2 h-[30vh] w-[min(46vw,320px)] -translate-x-1/2">
            <div className="splash-grid-box absolute inset-x-0 bottom-0 h-[10vh] opacity-60" />
            {launched && (
              <>
                <span className="splash-skid absolute bottom-0 left-[16%] h-full w-[13%] rounded-t-full motion-safe:animate-skid" />
                <span className="splash-skid absolute right-[16%] bottom-0 h-full w-[13%] rounded-t-full motion-safe:animate-skid" />
              </>
            )}
          </div>

          {/* the car */}
          <motion.div
            aria-hidden="true"
            className="absolute top-0 left-1/2 w-[min(40vw,270px)] will-change-transform"
            style={{ transform: carTransform, transformOrigin: '50% 100%' }}
          >
            {/* motion-blur trail behind (below) the car */}
            <motion.div
              className="absolute inset-x-[14%] top-[92%] h-[70%] rounded-full bg-linear-to-b from-brand-red/50 via-white/10 to-transparent blur-[8px]"
              style={{ opacity: trailOpacity }}
            />
            {/* exhaust plume with heat-haze distortion */}
            <div
              className="absolute top-[93%] left-1/2 h-[22%] w-[38%] -translate-x-1/2"
              style={{ filter: 'url(#splash-haze)' }}
            >
              <div className="size-full rounded-full bg-[radial-gradient(ellipse_at_50%_0%,rgb(255_210_138/0.55),rgb(255_122_26/0.25)_35%,transparent_70%)] blur-[2px] motion-safe:animate-exhaust" />
            </div>
            <TopDownF1Car className="relative w-full" />
          </motion.div>

          {/* brand + skip */}
          <div className="absolute top-5 left-5 flex items-center gap-3 sm:top-6 sm:left-8">
            <BrandMark className="h-9 w-auto sm:h-11" />
            <span className="hidden font-display text-sm font-bold tracking-[0.14em] text-sand-50 uppercase sm:block">
              Elite Motors Workshop
            </span>
          </div>
          <button
            type="button"
            onClick={finish}
            className="absolute top-5 right-5 inline-flex h-11 cursor-pointer items-center gap-1.5 rounded-pill border border-white/15 bg-white/8 px-4 text-sm font-semibold text-sand-50 backdrop-blur transition-colors duration-150 ease-out hover:bg-white/14 sm:top-6 sm:right-8"
          >
            Skip
            <X className="size-4" aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
