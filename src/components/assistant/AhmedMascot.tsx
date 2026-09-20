import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Ahmed } from '@/components/assistant/Ahmed'
import { assistant } from '@/config/assistant'
import { useIntroActive } from '@/hooks/useIntroGate'
import { useLocale } from '@/i18n'

/** Shown once per browser session. */
const STORAGE_KEY = 'emw:ahmed-hello'

interface AhmedMascotProps {
  /** The chat panel is open — the character stays away. */
  chatOpen: boolean
  onOpenChat: () => void
}

/**
 * Ahmed peeks in from the side of the screen just above the chat launcher
 * and asks how he can help. Tapping him (or the bubble) opens the chat;
 * the × sends him away; otherwise he leaves by himself after a few seconds.
 */
export function AhmedMascot({ chatOpen, onOpenChat }: AhmedMascotProps) {
  const { t, dir } = useLocale()
  const reduce = useReducedMotion()
  const introActive = useIntroActive()
  const [show, setShow] = useState(false)
  const copy = t.assistant.mascot

  // Appear a moment after the page (and the intro) has settled — once per session.
  useEffect(() => {
    if (introActive || chatOpen) return
    let seen = false
    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      /* private mode — show anyway */
    }
    if (seen) return
    const enter = window.setTimeout(() => {
      setShow(true)
      try {
        sessionStorage.setItem(STORAGE_KEY, '1')
      } catch {
        /* ignore */
      }
    }, assistant.mascotDelayMs)
    return () => window.clearTimeout(enter)
  }, [introActive, chatOpen])

  // Leave by himself.
  useEffect(() => {
    if (!show) return
    const leave = window.setTimeout(() => setShow(false), assistant.mascotStayMs)
    return () => window.clearTimeout(leave)
  }, [show])

  const visible = show && !chatOpen
  const offscreen = dir === 'rtl' ? '-110%' : '110%'

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          key="ahmed"
          initial={reduce ? { opacity: 0 } : { x: offscreen, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0, transition: { duration: 0.2 } } : { x: offscreen, opacity: 0, transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } }}
          transition={{ type: 'spring', stiffness: 230, damping: 24 }}
          className="pointer-events-none fixed end-0 bottom-[calc(max(1rem,env(safe-area-inset-bottom))+8.5rem)] z-40 flex items-start gap-2 sm:bottom-[calc(1.5rem+8.5rem)]"
        >
          {/* Speech bubble — a button, so the whole thing is one tap */}
          <m.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: reduce ? 0 : 0.32, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto relative mt-3 max-w-[13.5rem]"
            style={{ transformOrigin: dir === 'rtl' ? '0% 100%' : '100% 100%' }}
          >
            <button
              type="button"
              onClick={onOpenChat}
              className="block w-full cursor-pointer rounded-2xl rounded-ee-md border border-line bg-surface-elevated px-4 py-3 text-start shadow-[0_18px_40px_-18px_rgb(15_27_61/0.5)] transition-transform hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
            >
              <span className="block font-display text-[15px] font-bold text-navy-900">{copy.hello}</span>
              <span className="mt-0.5 block text-sm text-fg-muted">{copy.question}</span>
              <span className="mt-2 inline-flex items-center rounded-pill bg-navy-900 px-3 py-1 text-xs font-semibold text-on-navy">{copy.chat}</span>
            </button>
            <button
              type="button"
              onClick={() => setShow(false)}
              aria-label={copy.dismiss}
              className="absolute -top-2 -start-2 inline-flex size-7 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-fg-muted shadow-sm transition-colors hover:text-fg"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </m.div>

          {/* The character, fading out at the bottom so he reads as peeking in */}
          <button
            type="button"
            onClick={onOpenChat}
            aria-label={copy.chat}
            className="pointer-events-auto -me-1 w-[6.75rem] shrink-0 cursor-pointer [mask-image:linear-gradient(to_bottom,black_72%,transparent)] sm:w-[7.5rem]"
          >
            <Ahmed className="h-auto w-full drop-shadow-[0_10px_18px_rgb(15_27_61/0.35)]" />
          </button>
        </m.div>
      )}
    </AnimatePresence>
  )
}
