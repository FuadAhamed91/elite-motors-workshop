import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ar } from '@/i18n/ar'
import { en, type Dictionary, type Locale } from '@/i18n/en'
import type { HoursStrings } from '@/lib/hours'

export type { Dictionary, Locale }

const DICTIONARIES: Record<Locale, Dictionary> = { en, ar }
const STORAGE_KEY = 'emw:lang'
/** Cairo pairs well with Outfit/Inter and covers Arabic + Latin; loaded only when Arabic is shown. */
const ARABIC_FONT_URL = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap'

interface LocaleContextValue {
  locale: Locale
  dir: 'ltr' | 'rtl'
  t: Dictionary
  setLocale: (locale: Locale) => void
  toggle: () => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function isLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'ar'
}

/** `?lang=` beats the saved choice, which beats the browser language. English otherwise. */
export function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  const param = new URLSearchParams(window.location.search).get('lang')
  if (isLocale(param)) return param
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    /* private mode — ignore */
  }
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language]
  return languages.some((lang) => lang.toLowerCase().startsWith('ar')) ? 'ar' : 'en'
}

function ensureArabicFont() {
  if (document.querySelector('link[data-arabic-font]')) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = ARABIC_FONT_URL
  link.dataset.arabicFont = 'true'
  document.head.appendChild(link)
}

/** Keeps <html lang/dir>, the title and the description in step with the UI language. */
function applyToDocument(dict: Dictionary) {
  const root = document.documentElement
  root.lang = dict.locale
  root.dir = dict.dir
  document.title = dict.meta.title
  document.querySelector('meta[name="description"]')?.setAttribute('content', dict.meta.description)
  if (dict.locale === 'ar') ensureArabicFont()
}

/** Hours-engine strings for a dictionary (status labels + short day names). */
export function hoursStrings(t: Dictionary): HoursStrings {
  return { ...t.status, dayShort: (day) => t.days[day].short }
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale)

  useEffect(() => {
    applyToDocument(DICTIONARIES[locale])
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
    // Keep a shareable URL in step (no reload, no history entry).
    const url = new URL(window.location.href)
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', next)
      window.history.replaceState(window.history.state, '', url)
    }
  }, [])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dir: DICTIONARIES[locale].dir,
      t: DICTIONARIES[locale],
      setLocale,
      toggle: () => setLocale(locale === 'en' ? 'ar' : 'en'),
    }),
    [locale, setLocale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>')
  return ctx
}

/** The active dictionary — `const t = useT()` then `t.hero.lead`. */
export function useT(): Dictionary {
  return useLocale().t
}
