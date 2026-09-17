import { BrandMark } from '@/components/icons/BrandMark'
import { workshop } from '@/config/workshop'
import { cn } from '@/lib/cn'

interface LogoProps {
  className?: string
  /**
   * `inline`  — mark beside a two-line wordmark (navbar).
   * `stacked` — mark above the full "ELITE MOTORS WORKSHOP L.L.C" wordmark
   *             with the tri-colour rule, mirroring the original badge (footer).
   */
  variant?: 'inline' | 'stacked'
}

export function Logo({ className, variant = 'inline' }: LogoProps) {
  const label = `${workshop.displayTitle} — back to top`

  if (variant === 'stacked') {
    return (
      <a
        href="#top"
        aria-label={label}
        className={cn('group inline-flex flex-col items-start gap-3 rounded-lg', className)}
      >
        <BrandMark className="h-12 w-auto transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-y-0" />
        <span className="flex flex-col gap-2">
          <span className="font-display text-sm font-bold tracking-[0.14em] text-fg uppercase">
            Elite Motors Workshop <span className="text-fg-muted">L.L.C</span>
          </span>
          <TriColourRule />
        </span>
      </a>
    )
  }

  return (
    <a
      href="#top"
      aria-label={label}
      className={cn('group inline-flex items-center gap-2.5 rounded-lg', className)}
    >
      <BrandMark className="h-8 w-auto transition-transform duration-300 group-hover:-rotate-2 motion-reduce:group-hover:rotate-0 sm:h-9" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[13px] font-bold tracking-tight whitespace-nowrap text-fg sm:text-[15px]">
          Elite Motors<span className="hidden sm:inline"> Workshop</span>
        </span>
        {/* Phones: second bold line keeps the lockup narrow enough for the 375px bar */}
        <span className="mt-1 font-display text-[13px] font-bold tracking-tight whitespace-nowrap text-fg sm:hidden">
          Workshop L.L.C
        </span>
        <span className="mt-1 hidden text-[10px] font-semibold tracking-[0.2em] whitespace-nowrap text-fg-muted uppercase sm:block">
          L.L.C · Abu Dhabi
        </span>
      </span>
    </a>
  )
}

/** Thin red / blue / yellow rule from the original badge. */
function TriColourRule() {
  return (
    <span aria-hidden="true" className="flex h-0.5 w-full overflow-hidden rounded-full">
      <span className="flex-1 bg-brand-red" />
      <span className="flex-1 bg-brand-blue" />
      <span className="flex-1 bg-brand-yellow" />
    </span>
  )
}
