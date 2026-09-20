import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { Languages, Menu, Navigation, Phone, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Logo } from '@/components/layout/Logo'
import { CtaLink } from '@/components/ui/CtaLink'
import { workshop } from '@/config/workshop'
import { useLocale } from '@/i18n'
import { cn } from '@/lib/cn'
import { useHref } from '@/lib/page'
import { buildTelLink } from '@/lib/whatsapp'

/** Sticky, glassmorphic navigation — transparent over the hero, frosted once scrolled. */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const { t, toggle } = useLocale()
  const href = useHref()

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
    const mq = window.matchMedia('(min-width: 1280px)')
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
  const navLabels: Record<string, string> = {
    '#services': t.nav.services,
    '/insurance': t.nav.insurance,
    '/before-after': t.nav.beforeAfter,
    '#workshop': t.nav.workshop,
    '#about': t.nav.about,
    '#reviews': t.nav.reviews,
    '#hours': t.nav.hoursLocation,
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300',
        frosted
          ? 'border-b border-white/10 bg-navy-900 text-on-navy shadow-[0_12px_40px_-24px_rgb(15_27_61/0.6)] [--color-fg:var(--color-on-navy)] [--color-fg-muted:var(--color-on-navy-muted)] [--color-line:rgb(255_255_255/0.15)] sm:bg-navy-900/92 sm:backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <a
        href={href('#main')}
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:start-3 focus:z-[60] focus:rounded-pill focus:bg-cta focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-cta-fg"
      >
        {t.common.skipToContent}
      </a>

      <nav
        aria-label={t.nav.primary}
        className="container-x flex h-16 items-center justify-between gap-3 sm:h-[4.5rem]"
      >
        <Logo />

        <ul className="hidden items-center gap-0.5 xl:flex">
          {workshop.nav.map((link) => (
            <li key={link.href}>
              <a
                href={href(link.href)}
                className={cn(
                  'inline-flex h-10 items-center rounded-pill px-3.5 text-sm font-medium whitespace-nowrap transition-colors duration-200',
                  frosted ? 'text-on-navy-muted hover:bg-white/10 hover:text-gold-500' : 'text-fg-muted hover:bg-fg/5 hover:text-fg',
                )}
              >
                {navLabels[link.href] ?? link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Language toggle — shows the language you would switch to */}
          <button
            type="button"
            onClick={toggle}
            aria-label={t.switchAria}
            lang={t.locale === 'en' ? 'ar' : 'en'}
            title={t.switchLabel}
            className={cn(
              'inline-flex size-11 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full border text-sm font-semibold transition-colors sm:h-10 sm:w-auto sm:rounded-pill sm:px-3',
              frosted ? 'border-white/20 bg-white/5 text-on-navy hover:bg-white/12' : 'border-line bg-fg/3 text-fg hover:bg-fg/8',
            )}
          >
            <Languages className={cn('size-5 sm:size-4', frosted ? 'text-gold-500' : 'text-primary')} aria-hidden="true" />
            <span className="hidden sm:inline">{t.switchLabel}</span>
          </button>
          <CtaLink
            href={buildTelLink(workshop.phone)}
            variant={frosted ? 'accent' : 'primary'}
            size="sm"
            icon={<Phone />}
            className="max-sm:hidden"
          >
            <span dir="ltr">{t.common.call(workshop.phone)}</span>
          </CtaLink>
          {/* Icon-only call shortcut keeps the landline one tap away on phones */}
          <a
            href={buildTelLink(workshop.phone)}
            aria-label={t.common.call(workshop.phone)}
            className={cn(
              'inline-flex size-11 items-center justify-center rounded-full shadow-[0_10px_24px_-10px_rgb(0_0_0/0.4)] transition-transform active:scale-95 sm:hidden',
              frosted ? 'bg-gold-500 text-navy-900' : 'bg-navy-900 text-on-navy',
            )}
          >
            <Phone className="size-5" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            className={cn(
              'inline-flex size-11 cursor-pointer items-center justify-center rounded-full border transition-colors xl:hidden',
              frosted ? 'border-white/20 bg-white/5 text-on-navy hover:bg-white/12' : 'border-line bg-fg/3 text-fg hover:bg-fg/8',
            )}
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
          <m.div
            id="mobile-nav"
            key="mobile-nav"
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, transition: { duration: 0.15 } }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-white/10 xl:hidden"
          >
            <div className="container-x flex flex-col gap-1 py-3">
              {workshop.nav.map((link) => (
                <a
                  key={link.href}
                  href={href(link.href)}
                  onClick={() => setOpen(false)}
                  className="flex h-12 items-center rounded-xl px-3 text-base font-medium text-on-navy transition-colors hover:bg-white/10 hover:text-gold-500"
                >
                  {navLabels[link.href] ?? link.label}
                </a>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
                <CtaLink href={buildTelLink(workshop.phone)} variant="accent" icon={<Phone />} fullWidth>
                  {t.common.callShort}
                </CtaLink>
                <CtaLink
                  href={workshop.directionsLink}
                  external
                  variant="light"
                  icon={<Navigation />}
                  fullWidth
                >
                  {t.common.directions}
                </CtaLink>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  )
}
