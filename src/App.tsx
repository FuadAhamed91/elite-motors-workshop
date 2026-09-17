import { AssistantWidget } from '@/components/assistant/AssistantWidget'
import { RaceIntro } from '@/components/intro/RaceIntro'
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

export default function App() {
  const gate = useIntroGate()
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
        {assistant.enabled && <AssistantWidget />}
      </div>
      <Intro active={gate.active} ready={gate.ready} finish={gate.finish} />
    </IntroActiveContext.Provider>
  )
}
