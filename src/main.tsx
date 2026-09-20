import { LazyMotion } from 'framer-motion'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/App'
import { LocaleProvider } from '@/i18n'
import { PageContext } from '@/lib/page'

/** The animation engine is its own chunk — see src/lib/motion-features.ts. */
const loadMotionFeatures = () => import('@/lib/motion-features').then((mod) => mod.default)
import { isWhatsAppConfigured } from '@/lib/whatsapp'

if (import.meta.env.DEV && !isWhatsAppConfigured()) {
  console.warn(
    '[Elite Motors] WhatsApp number still contains placeholder X characters — update src/config/workshop.ts',
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LazyMotion features={loadMotionFeatures} strict>
      <PageContext.Provider value="home">
        <LocaleProvider page="home">
          <App />
        </LocaleProvider>
      </PageContext.Provider>
    </LazyMotion>
  </StrictMode>,
)
