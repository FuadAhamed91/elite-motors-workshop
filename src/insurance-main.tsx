import { LazyMotion, domAnimation } from 'framer-motion'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import { LocaleProvider } from '@/i18n'
import { PageContext } from '@/lib/page'
import InsurancePage from '@/pages/InsurancePage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LazyMotion features={domAnimation} strict>
      <PageContext.Provider value="insurance">
        <LocaleProvider page="insurance">
          <InsurancePage />
        </LocaleProvider>
      </PageContext.Provider>
    </LazyMotion>
  </StrictMode>,
)
