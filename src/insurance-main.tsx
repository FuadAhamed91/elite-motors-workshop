import { LazyMotion } from 'framer-motion'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import { LocaleProvider } from '@/i18n'
import { PageContext } from '@/lib/page'

/** The animation engine is its own chunk — see src/lib/motion-features.ts. */
const loadMotionFeatures = () => import('@/lib/motion-features').then((mod) => mod.default)
import InsurancePage from '@/pages/InsurancePage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LazyMotion features={loadMotionFeatures} strict>
      <PageContext.Provider value="insurance">
        <LocaleProvider page="insurance">
          <InsurancePage />
        </LocaleProvider>
      </PageContext.Provider>
    </LazyMotion>
  </StrictMode>,
)
