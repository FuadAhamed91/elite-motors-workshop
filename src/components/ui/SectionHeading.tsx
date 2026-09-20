import { cn } from '@/lib/cn'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
  /** Heading level — page titles use h1, sections h2, nested blocks h3. */
  level?: 1 | 2 | 3
  id?: string
  /** `dark` = on a navy band: cream title, sand description, gold eyebrow. */
  tone?: 'light' | 'dark'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  level = 2,
  id,
  tone = 'light',
}: SectionHeadingProps) {
  const Heading = level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3'

  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <p
          className={cn(
            'mb-3 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase',
            tone === 'dark' ? 'text-gold-500' : 'text-primary',
            align === 'center' && 'justify-center',
          )}
        >
          <span aria-hidden="true" className="brand-stripe h-[3px] w-7 rounded-full" />
          {eyebrow}
        </p>
      )}
      <Heading
        id={id}
        className={cn(
          'font-display font-bold tracking-tight text-balance',
          tone === 'dark' ? 'text-on-navy' : 'text-fg',
          level === 1 ? 'text-[2.4rem] leading-[1.08] sm:text-5xl lg:text-[3.4rem]' : 'text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]',
        )}
      >
        {title}
      </Heading>
      {description && (
        <p className={cn('mt-4 text-base leading-relaxed text-pretty sm:text-lg', tone === 'dark' ? 'text-on-navy-muted' : 'text-fg-muted')}>
          {description}
        </p>
      )}
    </div>
  )
}
