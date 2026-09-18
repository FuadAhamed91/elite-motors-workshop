import { LazyMotion, domAnimation } from 'framer-motion'
import { renderToStaticMarkup } from 'react-dom/server'
import { Navbar } from '@/components/layout/Navbar'
import { Hero } from '@/components/sections/Hero'
import { intro } from '@/config/intro'
import { IntroActiveContext } from '@/hooks/useIntroGate'
import { LocaleProvider, type Locale } from '@/i18n'
import { ar } from '@/i18n/ar'
import { en } from '@/i18n/en'
import { ShellContext } from '@/shell/context'

/**
 * Build-time "shell": the navbar and the hero rendered to plain HTML and
 * written into dist/index.html (see scripts/prerender.mjs). The browser paints
 * it as soon as the CSS arrives — a couple of seconds before the JavaScript
 * has downloaded and run on a slow phone — and React replaces it with the
 * live page on mount. Rendered once per language; an inline script in the
 * <head> shows the right one.
 */
export function renderShell(locale: Locale): string {
  return renderToStaticMarkup(
    <LocaleProvider initialLocale={locale}>
      <LazyMotion features={domAnimation} strict>
        {/* "intro active" makes the hero's eager blocks render statically (no hidden initial state). */}
        <IntroActiveContext.Provider value={true}>
          <ShellContext.Provider value={true}>
            <Navbar />
            <main id="main">
              <Hero />
            </main>
          </ShellContext.Provider>
        </IntroActiveContext.Provider>
      </LazyMotion>
    </LocaleProvider>,
  )
}

/** What the inline head script needs to know. */
export const shellMeta = {
  titles: { en: en.meta.title, ar: ar.meta.title },
  descriptions: { en: en.meta.description, ar: ar.meta.description },
  /** The splash overlay is pre-painted for first-time visitors so the intro still comes first. */
  introOverlay: intro.enabled && intro.frequency !== 'never' && intro.variant === 'splash',
  introStorageKey: intro.storageKey,
  introOncePerVisitor: intro.frequency === 'once',
  skipOnWeakDevices: intro.skipOnWeakDevices,
}
