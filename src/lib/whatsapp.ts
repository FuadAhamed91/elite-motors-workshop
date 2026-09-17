import { workshop } from '@/config/workshop'

/**
 * wa.me expects the international number without "+", spaces, dashes or
 * leading zeros. Placeholder X's are preserved so an unconfigured number still
 * produces the documented link shape (https://wa.me/97150XXXXXXX?text=...).
 */
export function normalizeWhatsAppNumber(raw: string): string {
  return raw.replace(/[^0-9X]/gi, '').replace(/^00/, '')
}

export function isWhatsAppConfigured(): boolean {
  return !/x/i.test(workshop.whatsappNumber)
}

/** Builds a click-to-chat link with a URL-encoded, pre-filled message. */
export function buildWhatsAppLink(message: string): string {
  const number = normalizeWhatsAppNumber(workshop.whatsappNumber)
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

/** Builds a tel: link from a display-formatted phone number. */
export function buildTelLink(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, '')}`
}

const greeting = `Hi ${workshop.name}! 👋`

/**
 * Pre-filled conversation starters. Each section/CTA picks the message that
 * matches its intent so the workshop instantly knows what the driver needs.
 */
export const whatsappMessages = {
  quote: () =>
    `${greeting}\n\nI'd like an instant quote for my car.\n\n🚗 Car (make / model / year): \n🔧 Issue or service needed: \n\nThank you!`,

  service: (serviceName: string) =>
    `${greeting}\n\nI'd like to book *${serviceName}*.\n\n🚗 Car (make / model / year): \n📅 Preferred day / time: \n\nPlease share availability and pricing. Thank you!`,

  quickService: (serviceName: string) =>
    `${greeting} I need *${serviceName}* for my car. Can you share a quote and the next available slot?`,

  directions: () =>
    `${greeting}\n\nI'm on my way to the workshop in ${workshop.city}. Could you share the exact pin location / directions?`,

  afterHours: () =>
    `${greeting}\n\nI know you're currently closed — could you get back to me when you open?\n\n🚗 Car: \n🔧 Issue: `,

  general: () => `${greeting} I have a question about your services in ${workshop.city}.`,
} as const

export type WhatsAppIntent = keyof typeof whatsappMessages

/** Convenience helpers used by CTAs across the page. */
export const waLinks = {
  quote: () => buildWhatsAppLink(whatsappMessages.quote()),
  service: (name: string) => buildWhatsAppLink(whatsappMessages.service(name)),
  quickService: (name: string) => buildWhatsAppLink(whatsappMessages.quickService(name)),
  directions: () => buildWhatsAppLink(whatsappMessages.directions()),
  afterHours: () => buildWhatsAppLink(whatsappMessages.afterHours()),
  general: () => buildWhatsAppLink(whatsappMessages.general()),
}
