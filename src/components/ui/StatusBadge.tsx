import { useWorkshopStatus } from '@/hooks/useWorkshopStatus'
import type { StatusKind } from '@/lib/hours'
import { cn } from '@/lib/cn'

interface StatusBadgeProps {
  className?: string
  /** Compact variant hides the detail text (used in tight spots like the navbar). */
  compact?: boolean
}

const TONE: Record<StatusKind, { dot: string; ring: string; text: string; border: string }> = {
  open: {
    dot: 'bg-primary',
    ring: 'bg-primary',
    text: 'text-primary',
    border: 'border-primary/30 bg-primary/10',
  },
  break: {
    dot: 'bg-warn',
    ring: 'bg-warn',
    text: 'text-warn',
    border: 'border-warn/30 bg-warn/10',
  },
  'opens-later': {
    dot: 'bg-warn',
    ring: 'bg-warn',
    text: 'text-warn',
    border: 'border-warn/30 bg-warn/10',
  },
  closed: {
    dot: 'bg-danger',
    ring: 'bg-danger',
    text: 'text-danger',
    border: 'border-danger/30 bg-danger/10',
  },
}

/**
 * Live "Open Now / Open Today / Closed" pill computed in Asia/Dubai time.
 * Announced politely to screen readers whenever the status flips.
 */
export function StatusBadge({ className, compact = false }: StatusBadgeProps) {
  const { status } = useWorkshopStatus()
  const tone = TONE[status.kind]

  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        'inline-flex items-center gap-2 rounded-pill border px-3 py-1.5 text-sm font-medium',
        tone.border,
        className,
      )}
    >
      <span className="relative flex size-2.5 shrink-0" aria-hidden="true">
        {status.isOpen && (
          <span
            className={cn(
              'absolute inset-0 rounded-full opacity-60 motion-safe:animate-pulse-ring',
              tone.ring,
            )}
          />
        )}
        <span className={cn('relative inline-flex size-2.5 rounded-full', tone.dot)} />
      </span>
      <span className={cn('font-semibold', tone.text)}>{status.label}</span>
      {!compact && (
        <>
          <span aria-hidden="true" className="text-fg-muted/60">
            ·
          </span>
          <span className="text-fg-muted">{status.detail}</span>
        </>
      )}
    </span>
  )
}
