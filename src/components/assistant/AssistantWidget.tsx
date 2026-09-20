import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { ArrowRight, ExternalLink, MapPin, MessageSquareText, Navigation, Phone, SendHorizontal, X } from 'lucide-react'
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { AhmedFace } from '@/components/assistant/Ahmed'
import { AhmedMascot } from '@/components/assistant/AhmedMascot'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { assistant } from '@/config/assistant'
import { workshop } from '@/config/workshop'
import { useWorkshopStatus } from '@/hooks/useWorkshopStatus'
import { useLocale, type Locale } from '@/i18n'
import { answerQuestion, type AssistantReply, type ReplyLink } from '@/lib/assistant'
import { cn } from '@/lib/cn'
import { useHref } from '@/lib/page'

const EASE_OUT_CUBIC = [0.215, 0.61, 0.355, 1] as const

interface ChatMessage {
  id: number
  role: 'user' | 'assistant'
  text: string
  links?: ReplyLink[]
  suggestions?: string[]
  /** Language of this bubble — a visitor can type Arabic on the English site and vice versa. */
  locale: Locale
}

const LINK_ICON: Record<ReplyLink['kind'], ReactNode> = {
  call: <Phone className="size-4" aria-hidden="true" />,
  whatsapp: <WhatsAppIcon className="size-4" />,
  maps: <MapPin className="size-4" aria-hidden="true" />,
  directions: <Navigation className="size-4" aria-hidden="true" />,
  anchor: <ArrowRight className="size-4" aria-hidden="true" />,
  external: <ExternalLink className="size-4" aria-hidden="true" />,
}

/**
 * On-site assistant: a launcher above the WhatsApp button that opens a chat
 * panel. Answers come from `answerQuestion` (site data only); anything else
 * is redirected to the landline. No network requests, nothing stored.
 */
export function AssistantWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const nextId = useRef(1)
  const inputRef = useRef<HTMLInputElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { status } = useWorkshopStatus()
  const headingId = useId()
  const { t, locale, dir } = useLocale()
  const ahmed = assistant.persona === 'ahmed'
  const copy = ahmed ? t.assistant : { ...t.assistant, name: t.assistant.plainName, greeting: t.assistant.plainGreeting }

  // Greeting on first open.
  useEffect(() => {
    if (!open || messages.length > 0) return
    setMessages([
      {
        id: nextId.current++,
        role: 'assistant',
        text: copy.greeting,
        suggestions: [...copy.quickReplies],
        locale,
      },
    ])
  }, [open, messages.length, copy, locale])

  // Focus the input, close on Escape, keep the log scrolled to the latest message.
  useEffect(() => {
    if (!open) return
    const focus = window.setTimeout(() => inputRef.current?.focus(), 250)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(focus)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    const log = logRef.current
    if (!log) return
    log.scrollTo({ top: log.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [messages, typing, reduceMotion])

  const ask = (question: string) => {
    const trimmed = question.trim()
    if (!trimmed) return
    setMessages((current) => [...current, { id: nextId.current++, role: 'user', text: trimmed, locale: /[؀-ۿ]/.test(trimmed) ? 'ar' : 'en' }])
    setDraft('')
    setTyping(true)
    // A short pause reads as "thinking" and keeps the reply from flashing in.
    window.setTimeout(() => {
      const reply: AssistantReply = answerQuestion(trimmed, locale)
      setMessages((current) => [
        ...current,
        { id: nextId.current++, role: 'assistant', text: reply.text, links: reply.links, suggestions: reply.suggestions, locale: reply.locale },
      ])
      setTyping(false)
    }, 350)
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    ask(draft)
  }

  const lastMessage = messages[messages.length - 1]

  return (
    <>
      {/* Launcher — sits above the WhatsApp button. With Ahmed it is his portrait: it blinks, nods now and then, and shows a label on hover. */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="emw-assistant"
        aria-label={open ? copy.close : copy.open(copy.name)}
        className={cn(
          'group fixed end-4 bottom-[calc(max(1rem,env(safe-area-inset-bottom))+4.75rem)] z-40 flex cursor-pointer items-center gap-3 sm:end-6 sm:bottom-[calc(1.5rem+4.75rem)]',
        )}
      >
        {ahmed && !open && (
          <span
            aria-hidden="true"
            className="pointer-events-none hidden translate-x-2 rounded-pill border border-line bg-surface/90 px-3.5 py-2 text-sm font-semibold text-fg opacity-0 shadow-card backdrop-blur-md transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:block rtl:-translate-x-2"
          >
            {copy.open(copy.name)}
          </span>
        )}
        <span
          className={cn(
            'relative inline-flex size-14 shrink-0 items-center justify-center rounded-full border-2 shadow-card transition-transform duration-200 group-hover:scale-105 group-active:scale-95 motion-reduce:group-hover:scale-100',
            ahmed && !open ? 'border-gold-500 bg-navy-900 text-on-navy' : 'border-line bg-surface text-fg group-hover:bg-surface-elevated',
          )}
        >
          {open ? (
            <X className="size-5" aria-hidden="true" />
          ) : ahmed ? (
            <>
              <span className="block size-full overflow-hidden rounded-full motion-safe:animate-nod" style={{ transformOrigin: '50% 90%' }}>
                <AhmedFace className="size-full" />
              </span>
              {/* "online" dot */}
              <span aria-hidden="true" className="absolute end-0 bottom-0 size-3.5 rounded-full border-2 border-navy-900 bg-gold-500" />
            </>
          ) : (
            <MessageSquareText className="size-5" aria-hidden="true" />
          )}
        </span>
      </button>

      {ahmed && <AhmedMascot chatOpen={open} onOpenChat={() => setOpen(true)} />}

      <AnimatePresence>
        {open && (
          <m.section
            id="emw-assistant"
            key="assistant-panel"
            role="dialog"
            aria-labelledby={headingId}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.16, ease: EASE_OUT_CUBIC } }}
            transition={{ duration: 0.22, ease: EASE_OUT_CUBIC }}
            className="fixed inset-x-2 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-[45] flex max-h-[calc(100dvh-5.5rem-max(0.5rem,env(safe-area-inset-bottom)))] flex-col overflow-hidden rounded-card border border-line bg-surface shadow-[0_30px_60px_-24px_rgb(68_52_30/0.45)] sm:inset-x-auto sm:end-6 sm:bottom-[calc(1.5rem+8.75rem)] sm:max-h-[min(72vh,600px)] sm:w-[380px]"
            style={{ transformOrigin: dir === 'rtl' ? '0% 100%' : '100% 100%' }}
          >
            <header className="flex items-center gap-3 border-b border-white/10 bg-navy-900 px-4 py-3 text-on-navy [--color-fg:var(--color-on-navy)] [--color-fg-muted:var(--color-on-navy-muted)]">
              <span className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-white/10 text-gold-500">
                {ahmed ? <AhmedFace className="size-full scale-[1.12]" /> : <MessageSquareText className="size-4.5" aria-hidden="true" />}
              </span>
              <div className="min-w-0 flex-1">
                <h2 id={headingId} className="font-display text-sm font-bold text-fg">
                  {copy.name}
                </h2>
                <p className="flex items-center gap-1.5 text-xs text-fg-muted">
                  <span
                    aria-hidden="true"
                    className={cn('size-1.5 rounded-full', status.isOpen ? 'bg-gold-500' : 'bg-warn')}
                  />
                  {status.label} · {status.detail}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={copy.close}
                className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-on-navy-muted transition-colors hover:bg-white/10 hover:text-on-navy"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </header>

            <div ref={logRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} onSuggestion={ask} isLast={message === lastMessage} avatar={ahmed} />
              ))}
              {typing && (
                <div className="flex items-center gap-2" aria-label={copy.typing(copy.name)}>
                  {ahmed && <Avatar />}
                  <div className="flex items-center gap-1 rounded-2xl rounded-es-md bg-bg px-3 py-2.5">
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        className="size-1.5 rounded-full bg-fg-muted/60 motion-safe:animate-pulse"
                        style={{ animationDelay: `${dot * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-line bg-bg p-3">
              <label htmlFor="emw-assistant-input" className="sr-only">
                {copy.inputLabel}
              </label>
              <input
                id="emw-assistant-input"
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={copy.placeholder}
                autoComplete="off"
                enterKeyHint="send"
                className="h-11 min-w-0 flex-1 rounded-pill border border-line bg-surface px-4 text-base text-fg placeholder:text-fg-muted/70 focus:border-primary/60 focus:outline-none sm:text-sm"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label={copy.send}
                className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-on-primary transition-[opacity,transform] duration-150 ease-out active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <SendHorizontal className="size-4.5 rtl:-scale-x-100" aria-hidden="true" />
              </button>
            </form>
            <p className="border-t border-line bg-bg px-4 py-2 text-[11px] text-fg-muted">{copy.footnote(workshop.phone)}</p>
          </m.section>
        )}
      </AnimatePresence>
    </>
  )
}

/** Ahmed's small portrait beside his replies. */
function Avatar() {
  return (
    <span aria-hidden="true" className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold-500/60 bg-navy-900">
      <AhmedFace className="size-full" />
    </span>
  )
}

interface MessageBubbleProps {
  message: ChatMessage
  isLast: boolean
  onSuggestion: (question: string) => void
  /** Show Ahmed's portrait next to assistant replies. */
  avatar?: boolean
}

function MessageBubble({ message, isLast, onSuggestion, avatar = false }: MessageBubbleProps) {
  const href = useHref()
  const reduce = useReducedMotion()
  const isUser = message.role === 'user'
  return (
    <m.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: EASE_OUT_CUBIC }}
      className={cn('flex flex-col gap-2', isUser ? 'items-end' : 'items-start')}
    >
      <div className={cn('flex max-w-[92%] items-start gap-2', isUser && 'flex-row-reverse')}>
        {!isUser && avatar && <Avatar />}
        <div
          dir={message.locale === 'ar' ? 'rtl' : 'ltr'}
          lang={message.locale}
          className={cn(
            'rounded-2xl px-3.5 py-2.5 text-start text-sm leading-relaxed whitespace-pre-line',
            isUser ? 'rounded-ee-md bg-primary text-on-primary' : 'rounded-es-md bg-bg text-fg',
          )}
        >
          {message.text}
        </div>
      </div>

      {message.links && message.links.length > 0 && (
        <div className={cn('flex max-w-[92%] flex-wrap gap-2', avatar && !isUser && 'ps-9')}>
          {message.links.map((link) => {
            const external = link.kind !== 'anchor' && link.kind !== 'call'
            return (
              <a
                key={link.href + link.label}
                href={link.kind === 'anchor' ? href(link.href) : link.href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className={cn(
                  'inline-flex min-h-9 items-center gap-1.5 rounded-pill border px-3 py-1.5 text-xs font-semibold transition-colors',
                  link.kind === 'whatsapp'
                    ? 'border-cta/40 bg-cta text-cta-fg hover:bg-cta-hover'
                    : 'border-line bg-surface text-fg hover:border-primary/50 hover:text-primary',
                )}
              >
                {LINK_ICON[link.kind]}
                {link.label}
              </a>
            )
          })}
        </div>
      )}

      {/* Suggestions only stay on the latest assistant message to keep the log tidy */}
      {!isUser && isLast && message.suggestions && message.suggestions.length > 0 && (
        <div className={cn('flex max-w-[92%] flex-wrap gap-2', avatar && 'ps-9')}>
          {message.suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onSuggestion(suggestion)}
              className="inline-flex min-h-9 cursor-pointer items-center rounded-pill border border-primary/30 bg-primary/8 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/14"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </m.div>
  )
}
