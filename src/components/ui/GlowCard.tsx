import { useRef, type MouseEvent, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface GlowCardProps {
  children: ReactNode
  className?: string
  /** Extra classes for the inner padded surface. */
  innerClassName?: string
  /** Which accent the spotlight and border glow should use. */
  accent?: 'primary' | 'secondary'
  /** Adds the rotating conic border ring (use sparingly — 1 per view). */
  animatedBorder?: boolean
}

const ACCENT_VAR = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
} as const

/**
 * 21st.dev-style spotlight card: a radial glow tracks the cursor via CSS
 * variables (no re-renders) and the border brightens on hover. Touch devices
 * simply get the elevated resting state.
 */
export function GlowCard({
  children,
  className,
  innerClassName,
  accent = 'primary',
  animatedBorder = false,
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--x', `${event.clientX - rect.left}px`)
    el.style.setProperty('--y', `${event.clientY - rect.top}px`)
  }

  const color = ACCENT_VAR[accent]

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={cn(
        'group relative h-full rounded-card transition-[border-color,box-shadow] duration-300 ease-out',
        animatedBorder
          ? 'animated-border p-px'
          : 'border border-line bg-surface shadow-card hover:border-line-strong',
        className,
      )}
    >
      <div
        className={cn(
          'relative isolate h-full overflow-hidden rounded-[inherit]',
          animatedBorder && 'bg-surface',
          innerClassName,
        )}
      >
        {/* Cursor-following spotlight */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px z-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(560px circle at var(--x, 50%) var(--y, 0%), color-mix(in oklab, ${color} 14%, transparent), transparent 42%)`,
          }}
        />
        {/* 1px border highlight that follows the cursor (masked to the ring) */}
        {!animatedBorder && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              padding: 1,
              background: `radial-gradient(380px circle at var(--x, 50%) var(--y, 0%), color-mix(in oklab, ${color} 60%, transparent), transparent 40%)`,
              WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
        )}
        <div className="relative z-10 h-full">{children}</div>
      </div>
    </div>
  )
}
