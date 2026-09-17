import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { workshop } from '@/config/workshop'
import { waLinks } from '@/lib/whatsapp'

/**
 * Persistent floating WhatsApp action, bottom-right, with a pulsing halo.
 * The halo only animates when the visitor allows motion; the button itself is
 * a 56px target sitting above the safe-area inset on notched phones.
 */
export function WhatsAppFab() {
  return (
    <a
      href={waLinks.quote()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${workshop.name} on WhatsApp`}
      className="group fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex items-center gap-3 sm:right-6 sm:bottom-6"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none hidden translate-x-2 rounded-pill border border-line bg-surface/90 px-3.5 py-2 text-sm font-semibold text-fg opacity-0 shadow-card backdrop-blur-md transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:block"
      >
        Chat with us
      </span>
      <span className="relative flex size-14 items-center justify-center">
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-cta/70 motion-safe:animate-pulse-ring"
        />
        <span className="relative flex size-14 items-center justify-center rounded-full bg-cta text-cta-fg shadow-cta transition-transform duration-200 group-hover:scale-105 group-active:scale-95 motion-reduce:group-hover:scale-100">
          <WhatsAppIcon className="size-7" />
        </span>
      </span>
    </a>
  )
}
