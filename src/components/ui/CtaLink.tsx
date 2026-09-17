import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type CtaVariant = 'whatsapp' | 'outline' | 'ghost' | 'inverse'
export type CtaSize = 'sm' | 'md' | 'lg'

interface CtaLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'href'> {
  href: string
  variant?: CtaVariant
  size?: CtaSize
  icon?: ReactNode
  iconRight?: ReactNode
  className?: string
  /** Opens in a new tab with a safe `rel` (WhatsApp / Maps links). */
  external?: boolean
  fullWidth?: boolean
  children: ReactNode
}

const BASE =
  'inline-flex cursor-pointer touch-manipulation select-none items-center justify-center gap-2 whitespace-nowrap rounded-pill font-semibold ' +
  'transition-[transform,background-color,border-color,box-shadow,color] duration-200 ease-out active:scale-[0.97] motion-reduce:active:scale-100'

const VARIANTS: Record<CtaVariant, string> = {
  whatsapp:
    'bg-cta text-cta-fg shadow-cta hover:bg-cta-hover hover:shadow-[0_18px_44px_-12px_color-mix(in_oklab,var(--color-whatsapp)_85%,transparent)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
  outline:
    'border border-line-strong bg-white/3 text-fg hover:border-primary/60 hover:bg-white/6 hover:text-primary',
  ghost: 'text-fg-muted hover:bg-white/5 hover:text-fg',
  inverse: 'bg-fg text-bg hover:bg-white',
}

/* Heights keep every CTA ≥ 44px on touch devices (Apple HIG / WCAG target size). */
const SIZES: Record<CtaSize, string> = {
  sm: 'h-11 px-4 text-sm sm:h-10',
  md: 'h-12 px-5 text-sm sm:text-[15px]',
  lg: 'h-13 px-7 text-base sm:h-14 sm:px-8',
}

/**
 * Every conversion action on the page is a plain link (WhatsApp, tel:, maps),
 * so the CTA primitive renders an anchor — no forms, no JS handlers required.
 */
export function CtaLink({
  href,
  variant = 'whatsapp',
  size = 'md',
  icon,
  iconRight,
  className,
  external = false,
  fullWidth = false,
  children,
  ...rest
}: CtaLinkProps) {
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <a
      href={href}
      className={cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && 'w-full', className)}
      {...externalProps}
      {...rest}
    >
      {icon && (
        <span aria-hidden="true" className="shrink-0 [&>svg]:size-5">
          {icon}
        </span>
      )}
      <span>{children}</span>
      {iconRight && (
        <span aria-hidden="true" className="shrink-0 [&>svg]:size-4">
          {iconRight}
        </span>
      )}
    </a>
  )
}
