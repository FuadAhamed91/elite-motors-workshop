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
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  level = 2,
  id,
}: SectionHeadingProps) {
  const Heading = level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3'

  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <p
          className={cn(
            'mb-3 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-primary uppercase',
            align === 'center' && 'justify-center',
          )}
        >
          <span aria-hidden="true" className="h-px w-6 bg-linear-to-r from-primary to-secondary" />
          {eyebrow}
        </p>
      )}
      <Heading
        id={id}
        className={cn(
          'font-display font-bold tracking-tight text-balance text-fg',
          level === 1 ? 'text-[2.4rem] leading-[1.08] sm:text-5xl lg:text-[3.4rem]' : 'text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]',
        )}
      >
        {title}
      </Heading>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-pretty text-fg-muted sm:text-lg">
          {description}
        </p>
      )}
    </div>
  )
}
