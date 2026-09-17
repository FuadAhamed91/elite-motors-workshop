import { cn } from '@/lib/cn'

interface StartLightsProps {
  /** How many lights are currently on (0–5). */
  lit: number
  /** All lights off after the hold — "lights out". */
  out: boolean
  count: number
  /** Lamps per column — real gantries have two, the splash uses one. */
  rows?: 1 | 2
}

/**
 * F1 start-light gantry. Only opacity is transitioned (the red lamp and its
 * glow are separate layers) so the sequence stays on the compositor.
 */
export function StartLights({ lit, out, count, rows = 2 }: StartLightsProps) {
  return (
    <div
      aria-hidden="true"
      className="mx-auto flex w-fit items-center gap-3 rounded-2xl bg-asphalt px-4 py-3 shadow-card sm:gap-4 sm:px-5 sm:py-3.5"
    >
      {Array.from({ length: count }, (_, index) => {
        const on = !out && index < lit
        return (
          <span key={index} className="flex flex-col gap-2">
            {Array.from({ length: rows }, (_, row) => (
              <span key={row} className="relative size-5 rounded-full bg-brand-red/15 sm:size-7">
                <span
                  className={cn(
                    'absolute -inset-2 rounded-full bg-brand-red/60 blur-md transition-opacity duration-150 ease-out',
                    on ? 'opacity-100' : 'opacity-0',
                  )}
                />
                <span
                  className={cn(
                    'absolute inset-0 rounded-full bg-brand-red shadow-[inset_0_-3px_6px_rgb(0_0_0/0.35)] transition-opacity duration-150 ease-out',
                    on ? 'opacity-100' : 'opacity-0',
                  )}
                />
              </span>
            ))}
          </span>
        )
      })}
    </div>
  )
}
