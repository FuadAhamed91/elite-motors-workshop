import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { WhatsAppFab } from '@/components/layout/WhatsAppFab'
import { Hero } from '@/components/sections/Hero'
import { Hours } from '@/components/sections/Hours'
import { Location } from '@/components/sections/Location'
import { Reviews } from '@/components/sections/Reviews'
import { Services } from '@/components/sections/Services'
import { TrustStrip } from '@/components/sections/TrustStrip'
import { SeoSchema } from '@/components/SeoSchema'

export default function App() {
  return (
    <>
      <SeoSchema />
      <Navbar />
      <main id="main">
        <Hero />
        <TrustStrip />
        <Services />
        <Reviews />
        <Hours />
        <Location />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  )
}
