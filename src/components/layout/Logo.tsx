import { workshop } from '@/config/workshop'
import { cn } from '@/lib/cn'

interface LogoProps {
  className?: string
  /** Larger lockup for the footer. */
  size?: 'md' | 'lg'
}

/** Brand lockup: gradient "EM" monogram tile + two-line wordmark. */
export function Logo({ className, size = 'md' }: LogoProps) {
  return (
    <a
      href="#top"
      aria-label={`${workshop.displayTitle} — back to top`}
      className={cn('group inline-flex items-center gap-2.5 rounded-lg', className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          'relative flex shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary p-px shadow-[0_0_24px_-6px_color-mix(in_oklab,var(--color-primary)_70%,transparent)] transition-transform duration-300 group-hover:rotate-[-4deg] motion-reduce:group-hover:rotate-0',
          size === 'md' ? 'size-9' : 'size-11',
        )}
      >
        <span className="flex size-full items-center justify-center rounded-[11px] bg-bg font-display text-sm font-extrabold tracking-tight text-fg">
          EM
        </span>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-display font-bold tracking-tight text-fg',
            size === 'md' ? 'text-[15px] sm:text-base' : 'text-lg',
          )}
        >
          {workshop.name}
        </span>
        <span className="mt-1 text-[10px] font-semibold tracking-[0.22em] text-fg-muted uppercase">
          Abu Dhabi
        </span>
      </span>
    </a>
  )
}
