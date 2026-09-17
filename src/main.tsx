import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/App'
import { isWhatsAppConfigured } from '@/lib/whatsapp'

if (import.meta.env.DEV && !isWhatsAppConfigured()) {
  console.warn(
    '[Elite Motors] WhatsApp number still contains placeholder X characters — update src/config/workshop.ts',
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
