import { Star } from 'lucide-react'
import { useT } from '@/i18n'
import { cn } from '@/lib/cn'

interface StarsProps {
  rating: number
  outOf?: number
  className?: string
  size?: 'sm' | 'md'
}

/** Filled star row with an accessible label ("5 out of 5 stars"). */
export function Stars({ rating, outOf = 5, className, size = 'sm' }: StarsProps) {
  const t = useT()
  const dimension = size === 'sm' ? 'size-4' : 'size-5'
  return (
    <span
      role="img"
      aria-label={t.reviews.ratingAria(rating)}
      className={cn('inline-flex items-center gap-0.5', className)}
    >
      {Array.from({ length: outOf }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={cn(dimension, index < Math.round(rating) ? 'fill-star text-star' : 'text-sand-300')}
          strokeWidth={1.5}
        />
      ))}
    </span>
  )
}
