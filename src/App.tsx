import { lazy, Suspense, useEffect, useState } from 'react'
import { SplashIntro } from '@/components/intro/SplashIntro'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { WhatsAppFab } from '@/components/layout/WhatsAppFab'
import { Hero } from '@/components/sections/Hero'
import { Hours } from '@/components/sections/Hours'
import { Location } from '@/components/sections/Location'
import { Reviews } from '@/components/sections/Reviews'
import { Services } from '@/components/sections/Services'
import { TrustStrip } from '@/components/sections/TrustStrip'
import { Workshop } from '@/components/sections/Workshop'
import { SeoSchema } from '@/components/SeoSchema'
import { assistant } from '@/config/assistant'
import { intro } from '@/config/intro'
import { IntroActiveContext, useIntroGate } from '@/hooks/useIntroGate'

/** The assistant (chat panel + answer engine) loads in idle time, after the page is interactive. */
const AssistantWidget = lazy(() =>
  import('@/components/assistant/AssistantWidget').then((mod) => ({ default: mod.AssistantWidget })),
)
/** The alternate intro (with its car SVG and engine-sound synth) only loads if it is selected. */
const RaceIntro = lazy(() => import('@/components/intro/RaceIntro').then((mod) => ({ default: mod.RaceIntro })))

/** True once the main thread has gone idle after load (or after `timeout` ms at the latest). */
function useIdle(timeout = 2500): boolean {
  const [idle, setIdle] = useState(false)
  useEffect(() => {
    // Safari has no requestIdleCallback — fall back to a short timer.
    if (typeof window.requestIdleCallback !== 'function') {
      const id = window.setTimeout(() => setIdle(true), 1200)
      return () => window.clearTimeout(id)
    }
    const id = window.requestIdleCallback(() => setIdle(true), { timeout })
    return () => window.cancelIdleCallback(id)
  }, [timeout])
  return idle
}

export default function App() {
  const gate = useIntroGate()
  const idle = useIdle()
  const Intro = intro.variant === 'splash' ? SplashIntro : RaceIntro

  return (
    <IntroActiveContext.Provider value={gate.active}>
      <SeoSchema />
      {/* The site stays inert (no focus, clicks or scrolling) until the intro is gone. */}
      <div inert={gate.active || undefined}>
        <Navbar />
        <main id="main">
          <Hero />
          <TrustStrip />
          <Services />
          <Workshop />
          <Reviews />
          <Hours />
          <Location />
        </main>
        <Footer />
        <WhatsAppFab />
        {assistant.enabled && idle && (
          <Suspense fallback={null}>
            <AssistantWidget />
          </Suspense>
        )}
      </div>
      <Suspense fallback={null}>
        <Intro active={gate.active} ready={gate.ready} finish={gate.finish} />
      </Suspense>
    </IntroActiveContext.Provider>
  )
}
