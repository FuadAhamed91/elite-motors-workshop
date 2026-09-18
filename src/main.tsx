import { LazyMotion, domAnimation } from 'framer-motion'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/App'
import { LocaleProvider } from '@/i18n'
import { PageContext } from '@/lib/page'
import { isWhatsAppConfigured } from '@/lib/whatsapp'

if (import.meta.env.DEV && !isWhatsAppConfigured()) {
  console.warn(
    '[Elite Motors] WhatsApp number still contains placeholder X characters — update src/config/workshop.ts',
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* `m` components + this feature bundle ship ~40% less animation code than `motion` */}
    <LazyMotion features={domAnimation} strict>
      <PageContext.Provider value="home">
        <LocaleProvider page="home">
          <App />
        </LocaleProvider>
      </PageContext.Provider>
    </LazyMotion>
  </StrictMode>,
)
