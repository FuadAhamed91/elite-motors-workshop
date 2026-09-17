import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, Phone, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { Logo } from '@/components/layout/Logo'
import { CtaLink } from '@/components/ui/CtaLink'
import { workshop } from '@/config/workshop'
import { cn } from '@/lib/cn'
import { buildTelLink, waLinks } from '@/lib/whatsapp'

/** Sticky, glassmorphic navigation — transparent over the hero, frosted once scrolled. */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile panel on Escape and when the viewport grows to desktop.
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => {
      if (mq.matches) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onChange)
    return () => {
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onChange)
    }
  }, [open])

  const frosted = scrolled || open

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300',
        frosted
          ? 'border-b border-line bg-bg/75 shadow-[0_12px_40px_-24px_rgb(0_0_0/0.9)] backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-pill focus:bg-cta focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-cta-fg"
      >
        Skip to content
      </a>

      <nav
        aria-label="Primary"
        className="container-x flex h-16 items-center justify-between gap-3 sm:h-[4.5rem]"
      >
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {workshop.nav.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-flex h-10 items-center rounded-pill px-4 text-sm font-medium text-fg-muted transition-colors duration-200 hover:bg-white/5 hover:text-fg"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <CtaLink
            href={waLinks.quote()}
            external
            size="sm"
            icon={<WhatsAppIcon />}
            className="max-sm:hidden"
          >
            Chat on WhatsApp
          </CtaLink>
          {/* Icon-only WhatsApp shortcut keeps the primary conversion one tap away on phones */}
          <a
            href={waLinks.quote()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="inline-flex size-11 items-center justify-center rounded-full bg-cta text-cta-fg shadow-cta transition-transform active:scale-95 sm:hidden"
          >
            <WhatsAppIcon className="size-5" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-line bg-white/3 text-fg transition-colors hover:bg-white/8 lg:hidden"
          >
            {open ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, transition: { duration: 0.15 } }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-line lg:hidden"
          >
            <div className="container-x flex flex-col gap-1 py-3">
              {workshop.nav.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex h-12 items-center rounded-xl px-3 text-base font-medium text-fg transition-colors hover:bg-white/5"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-line pt-3">
                <CtaLink href={waLinks.quote()} external icon={<WhatsAppIcon />} fullWidth>
                  WhatsApp
                </CtaLink>
                <CtaLink
                  href={buildTelLink(workshop.phone)}
                  variant="outline"
                  icon={<Phone />}
                  fullWidth
                >
                  Call
                </CtaLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
