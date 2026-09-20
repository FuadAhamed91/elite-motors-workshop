import { lazy, Suspense, useEffect, useState } from 'react'
import { SplashIntro } from '@/components/intro/SplashIntro'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { WhatsAppFab } from '@/components/layout/WhatsAppFab'
import { BeforeAfter } from '@/components/sections/BeforeAfter'
import { Brands } from '@/components/sections/Brands'
import { Fleet } from '@/components/sections/Fleet'
import { Hero } from '@/components/sections/Hero'
import { Hours } from '@/components/sections/Hours'
import { Insurance } from '@/components/sections/Insurance'
import { Location } from '@/components/sections/Location'
import { Reviews } from '@/components/sections/Reviews'
import { Services } from '@/components/sections/Services'
import { TrustStrip } from '@/components/sections/TrustStrip'
import { Workshop } from '@/components/sections/Workshop'
import { SeoSchema } from '@/components/SeoSchema'
import { Deferred } from '@/components/ui/Deferred'
import { assistant } from '@/config/assistant'
import { intro } from '@/config/intro'
import { useAnchorNavigation } from '@/hooks/useAnchorNavigation'
import { useIdle } from '@/hooks/useIdle'
import { IntroActiveContext, useIntroGate } from '@/hooks/useIntroGate'

/** The assistant (chat panel + answer engine) loads in idle time, after the page is interactive. */
const AssistantWidget = lazy(() =>
  import('@/components/assistant/AssistantWidget').then((mod) => ({ default: mod.AssistantWidget })),
)
/** The alternate intro (with its car SVG and engine-sound synth) only loads if it is selected. */
const RaceIntro = lazy(() => import('@/components/intro/RaceIntro').then((mod) => ({ default: mod.RaceIntro })))

/**
 * True from the second animation frame after mount. The first commit paints
 * only the navbar and the hero (the largest text on the page), everything
 * below the fold mounts one frame later — the same content, but the initial
 * JavaScript task is a fraction of the size on slow phones.
 */
function useAfterFirstPaint(): boolean {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true))
    return () => window.cancelAnimationFrame(id)
  }, [])
  return ready
}

export default function App() {
  const gate = useIntroGate()
  const idle = useIdle()
  const belowFold = useAfterFirstPaint()
  useAnchorNavigation(belowFold)
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
          {/* Services mounts one frame after the hero; everything lower mounts as the visitor approaches it. */}
          {belowFold && (
            <>
              <Services />
              <Deferred minHeight="60vh">
                <Brands />
              </Deferred>
              <Deferred minHeight="90vh">
                <Insurance />
              </Deferred>
              <Deferred minHeight="80vh">
                <Fleet />
              </Deferred>
              <Deferred minHeight="90vh">
                <BeforeAfter />
              </Deferred>
              <Deferred minHeight="90vh">
                <Workshop />
              </Deferred>
              <Deferred minHeight="90vh">
                <Reviews />
              </Deferred>
              <Deferred minHeight="80vh">
                <Hours />
              </Deferred>
              <Deferred minHeight="70vh">
                <Location />
              </Deferred>
            </>
          )}
        </main>
        {belowFold && (
          <Deferred minHeight="60vh">
            <Footer />
          </Deferred>
        )}
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
