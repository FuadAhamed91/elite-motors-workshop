import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Flag, MapPin, Phone, Volume2, Wrench, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { BrandMark } from '@/components/icons/BrandMark'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { F1Car } from '@/components/intro/F1Car'
import { intro } from '@/config/intro'
import { workshop } from '@/config/workshop'
import { cn } from '@/lib/cn'
import { getAudioContext, playAudioFile, playEnginePass, tryUnlockAudio } from '@/lib/engineSound'
import { buildTelLink, waLinks } from '@/lib/whatsapp'

type Step = 'idle' | 'racing' | 'options'

function shouldShowIntro(): boolean {
  if (!intro.enabled || intro.frequency === 'never') return false
  if (intro.frequency === 'always') return true
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
 * Opening sequence: an F1 car races across the screen (engine sound once the
 * visitor taps "Start engine"), then a short menu of options appears.
 * Skippable at any time, shown once per session, disabled under reduced motion.
 */
export function RaceIntro() {
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState<boolean>(() => !reduceMotion && shouldShowIntro())
  const [step, setStep] = useState<Step>('idle')
  const [soundOn, setSoundOn] = useState(false)
  const [raceKey, setRaceKey] = useState(0)
  const optionsRef = useRef<HTMLDivElement>(null)
  const stopSound = useRef<(() => void) | null>(null)
  const raceTimer = useRef<number | null>(null)

  const finish = useCallback(() => {
    stopSound.current?.()
    stopSound.current = null
    if (raceTimer.current) window.clearTimeout(raceTimer.current)
    markIntroSeen()
    setOpen(false)
  }, [])

  const startRace = useCallback(
    (withSound: boolean) => {
      if (withSound) {
        const ctx = getAudioContext()
        stopSound.current?.()
        stopSound.current = intro.soundUrl
          ? playAudioFile(intro.soundUrl)
          : ctx
            ? playEnginePass(ctx, intro.raceDurationMs)
            : null
        setSoundOn(Boolean(stopSound.current))
      }
      setRaceKey((key) => key + 1)
      setStep('racing')
      if (raceTimer.current) window.clearTimeout(raceTimer.current)
      raceTimer.current = window.setTimeout(() => setStep('options'), intro.raceDurationMs + 250)
    },
    [],
  )

  const goTo = useCallback(
    (hash: string) => {
      finish()
      window.requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    },
    [finish],
  )

  // Try to start with sound immediately (allowed after a previous interaction);
  // otherwise wait for a tap, and race silently if the visitor doesn't.
  useEffect(() => {
    if (!open || step !== 'idle') return
    let cancelled = false
    void tryUnlockAudio().then((allowed) => {
      if (!cancelled && allowed) startRace(true)
    })
    const fallback = window.setTimeout(() => {
      if (!cancelled) startRace(false)
    }, intro.autoStartAfterMs)
    return () => {
      cancelled = true
      window.clearTimeout(fallback)
    }
  }, [open, step, startRace])

  // Lock page scroll and allow Escape to skip while the overlay is up.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finish()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
      if (raceTimer.current) window.clearTimeout(raceTimer.current)
    }
  }, [open, finish])

  useEffect(() => {
    if (step !== 'options') return
    const id = window.setTimeout(() => {
      optionsRef.current?.querySelector<HTMLElement>('a, button')?.focus()
    }, 150)
    return () => window.clearTimeout(id)
  }, [step])

  const racing = step === 'racing'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="race-intro"
          role="dialog"
          aria-modal="true"
          aria-label={`Welcome to ${workshop.name}`}
          className="fixed inset-0 z-[100] overflow-hidden bg-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: 'easeOut' } }}
        >
          {/* Ambient beige gradient */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,color-mix(in_oklab,var(--color-primary-bright)_16%,transparent),transparent_70%)]"
          />

          <div className="absolute top-5 left-5 flex items-center gap-3 sm:top-6 sm:left-8">
            <BrandMark className="h-9 w-auto sm:h-11" />
            <span className="hidden font-display text-sm font-bold tracking-[0.14em] text-fg uppercase sm:block">
              Elite Motors Workshop
            </span>
          </div>

          <button
            type="button"
            onClick={finish}
            className="absolute top-5 right-5 inline-flex h-11 cursor-pointer items-center gap-1.5 rounded-pill border border-line bg-surface/80 px-4 text-sm font-semibold text-fg backdrop-blur transition-colors hover:border-line-strong hover:bg-surface sm:top-6 sm:right-8"
          >
            Skip intro
            <X className="size-4" aria-hidden="true" />
          </button>

          {/* Track */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
            <div className="race-kerb h-2.5" aria-hidden="true" />
            <div
              className={cn(
                'race-track relative h-32 sm:h-44',
                racing && 'motion-safe:[animation:var(--animate-road-dash)]',
              )}
            >
              {racing && (
                <div
                  aria-hidden="true"
                  className="race-speed-lines absolute inset-0 opacity-40 motion-safe:animate-speed-lines"
                />
              )}
              <motion.div
                key={raceKey}
                aria-hidden="true"
                className="absolute bottom-3 left-0 w-[58vw] max-w-[440px] min-w-[240px] sm:bottom-4"
                initial={{ x: '-120%' }}
                animate={racing || step === 'options' ? { x: 'calc(100vw + 30%)' } : { x: '-120%' }}
                transition={{
                  duration: intro.raceDurationMs / 1000,
                  ease: [0.5, 0, 0.9, 0.4],
                }}
              >
                <F1Car spinning={racing} className="w-full drop-shadow-[0_18px_18px_rgb(0_0_0/0.35)]" />
              </motion.div>
            </div>
            <div className="race-kerb h-2.5" aria-hidden="true" />
          </div>

          {/* Idle prompt: the tap unlocks audio (browsers block autoplay) */}
          <AnimatePresence>
            {step === 'idle' && (
              <motion.div
                key="idle"
                className="absolute inset-x-0 top-[calc(50%+6rem)] flex flex-col items-center gap-4 px-6 text-center sm:top-[calc(50%+8rem)]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
              >
                <p className="font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl">
                  Ready for the lights?
                </p>
                <button
                  type="button"
                  autoFocus
                  onClick={() => startRace(true)}
                  className="inline-flex h-14 cursor-pointer items-center gap-2.5 rounded-pill bg-brand-red px-8 text-base font-semibold text-white shadow-[0_16px_40px_-12px_color-mix(in_oklab,var(--color-brand-red)_70%,transparent)] transition-transform hover:-translate-y-0.5 active:scale-[0.97] motion-reduce:hover:translate-y-0"
                >
                  <Flag className="size-5" aria-hidden="true" />
                  Start engine
                </button>
                <p className="text-xs text-fg-muted">Tap for sound · starts on its own in a moment</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Options after the race */}
          <AnimatePresence>
            {step === 'options' && (
              <motion.div
                key="options"
                className="absolute inset-0 flex items-center justify-center overflow-y-auto bg-bg/85 px-5 py-20 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
              >
                <motion.div
                  ref={optionsRef}
                  className="w-full max-w-2xl text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                    Welcome to {workshop.name}
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
                    Where to?
                  </h2>
                  <p className="mt-2 text-sm text-fg-muted sm:text-base">
                    Pick what you need — or just browse the site.
                  </p>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <OptionTile
                      href={waLinks.quote()}
                      external
                      onClick={finish}
                      icon={<WhatsAppIcon className="size-5" />}
                      tone="cta"
                      title="Get a quote on WhatsApp"
                      detail={workshop.responseTime}
                    />
                    <OptionTile
                      href={buildTelLink(workshop.phone)}
                      onClick={finish}
                      icon={<Phone className="size-5" aria-hidden="true" />}
                      title="Call the workshop"
                      detail={workshop.phone}
                    />
                    <OptionTile
                      onClick={() => goTo('#services')}
                      icon={<Wrench className="size-5" aria-hidden="true" />}
                      title="Browse services"
                      detail="Diagnostics, servicing, AC, body shop"
                    />
                    <OptionTile
                      onClick={() => goTo('#hours')}
                      icon={<MapPin className="size-5" aria-hidden="true" />}
                      title="Hours & location"
                      detail={workshop.address.line2}
                    />
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
                    <button
                      type="button"
                      onClick={finish}
                      className="cursor-pointer font-semibold text-fg underline-offset-4 hover:underline"
                    >
                      Enter the site
                    </button>
                    <button
                      type="button"
                      onClick={() => startRace(true)}
                      className="inline-flex cursor-pointer items-center gap-1.5 text-fg-muted underline-offset-4 hover:text-fg hover:underline"
                    >
                      <Volume2 className="size-4" aria-hidden="true" />
                      {soundOn ? 'Replay' : 'Replay with sound'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface OptionTileProps {
  title: string
  detail: string
  icon: ReactNode
  href?: string
  external?: boolean
  onClick?: () => void
  tone?: 'default' | 'cta'
}

function OptionTile({
  title,
  detail,
  icon,
  href,
  external,
  onClick,
  tone = 'default',
}: OptionTileProps) {
  const className = cn(
    'group flex min-h-20 w-full cursor-pointer items-center gap-4 rounded-2xl border p-4 text-left transition-[transform,border-color,background-color,box-shadow] duration-200 hover:-translate-y-0.5 active:scale-[0.99] motion-reduce:hover:translate-y-0',
    tone === 'cta'
      ? 'border-cta/40 bg-cta text-cta-fg shadow-cta hover:bg-cta-hover'
      : 'border-line bg-surface/90 text-fg shadow-card hover:border-primary/50',
  )
  const iconClass = cn(
    'flex size-11 shrink-0 items-center justify-center rounded-xl',
    tone === 'cta' ? 'bg-cta-fg/10 text-cta-fg' : 'bg-primary/12 text-primary',
  )
  const body = (
    <>
      <span className={iconClass}>{icon}</span>
      <span className="flex flex-col">
        <span className="font-display text-base font-bold">{title}</span>
        <span className={cn('text-xs', tone === 'cta' ? 'text-cta-fg/80' : 'text-fg-muted')}>
          {detail}
        </span>
      </span>
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={className}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {body}
      </a>
    )
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {body}
    </button>
  )
}
