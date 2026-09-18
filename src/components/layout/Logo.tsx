import { BrandMark } from '@/components/icons/BrandMark'
import { useT } from '@/i18n'
import { cn } from '@/lib/cn'
import { useHref } from '@/lib/page'

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
  const t = useT()
  const href = useHref()
  const label = t.common.backToTop(t.brand.legalName)

  if (variant === 'stacked') {
    return (
      <a
        href={href('#top')}
        aria-label={label}
        className={cn('group inline-flex flex-col items-start gap-3 rounded-lg', className)}
      >
        <BrandMark className="h-12 w-auto transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-y-0" />
        <span className="flex flex-col gap-2">
          <span className="font-display text-sm font-bold tracking-[0.14em] text-fg uppercase">
            {t.brand.stacked} <span className="text-fg-muted">{t.brand.llc}</span>
          </span>
          <TriColourRule />
        </span>
      </a>
    )
  }

  return (
    <a
      href={href('#top')}
      aria-label={label}
      className={cn('group inline-flex shrink-0 items-center gap-2 rounded-lg sm:gap-2.5', className)}
    >
      <BrandMark className="h-7 w-auto transition-transform duration-300 group-hover:-rotate-2 motion-reduce:group-hover:rotate-0 sm:h-9" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[12px] font-bold tracking-tight whitespace-nowrap text-fg sm:text-[15px]">
          <span className="sm:hidden">{t.brand.navLine1}</span>
          <span className="hidden sm:inline">{t.brand.navFull}</span>
        </span>
        {/* Phones: second bold line keeps the lockup narrow enough for the 375px bar */}
        <span className="mt-0.5 font-display text-[12px] font-bold tracking-tight whitespace-nowrap text-fg sm:hidden">
          {t.brand.navLine2}
        </span>
        <span className="mt-1 hidden text-[10px] font-semibold tracking-[0.2em] whitespace-nowrap text-fg-muted uppercase sm:block">
          {t.brand.navTag}
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
