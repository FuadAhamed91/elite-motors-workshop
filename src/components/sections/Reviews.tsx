import { BadgeCheck, Car, ExternalLink } from 'lucide-react'
import { GlowCard } from '@/components/ui/GlowCard'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Stars } from '@/components/ui/Stars'
import { workshop } from '@/config/workshop'
import { reviews, type Review } from '@/data/reviews'

export function Reviews() {
  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="relative py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/3 -z-10 h-[480px] bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,color-mix(in_oklab,var(--color-secondary)_10%,transparent),transparent_70%)]"
      />
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <SectionHeading
              id="reviews-heading"
              eyebrow="Reviews"
              title="Abu Dhabi drivers don't just come back. They bring their friends."
              description="Real feedback from Patrol, Land Cruiser, BMW and Pajero owners who value speed, honesty and fair pricing."
            />
          </Reveal>
          <Reveal delay={0.1} className="shrink-0">
            <RatingBadge />
          </Reveal>
        </div>

        <StaggerGroup as="ul" className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <StaggerItem as="li" key={review.id} className="h-full">
              <ReviewCard review={review} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}

/** "Rated 4.8 / 5 on Google Reviews by Abu Dhabi Drivers" trust badge. */
function RatingBadge() {
  const { value, outOf, platform, count } = workshop.rating
  return (
    <a
      href={workshop.googleReviewsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-2xl border border-line bg-surface/80 p-4 pr-5 shadow-card backdrop-blur-sm transition-colors hover:border-line-strong"
    >
      <span className="flex flex-col items-center justify-center rounded-xl bg-star/12 px-3 py-2">
        <span className="font-display text-3xl leading-none font-extrabold text-fg tabular-nums">
          {value}
        </span>
        <span className="mt-1 text-[10px] font-semibold tracking-widest text-fg-muted uppercase">
          / {outOf}
        </span>
      </span>
      <span className="flex flex-col gap-1">
        <Stars rating={value} size="md" />
        <span className="text-sm font-semibold text-fg">
          Rated {value} / {outOf} on {platform}
        </span>
        <span className="flex items-center gap-1 text-xs text-fg-muted">
          by {count}+ Abu Dhabi drivers
          <ExternalLink
            className="size-3 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </span>
    </a>
  )
}

interface ReviewCardProps {
  review: Review
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase()
}

function ReviewCard({ review }: ReviewCardProps) {
  return (
    <GlowCard accent="secondary" innerClassName="flex flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary/30 to-secondary/30 font-display text-sm font-bold text-fg ring-1 ring-line-strong"
          >
            {initials(review.name)}
          </span>
          <div>
            <p className="font-semibold text-fg">{review.name}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-fg-muted">
              <Car className="size-3.5" aria-hidden="true" />
              {review.car}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-pill border border-line bg-white/3 px-2 py-1 text-[11px] font-medium text-fg-muted">
          <BadgeCheck className="size-3.5 text-secondary" aria-hidden="true" />
          Google
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <Stars rating={review.rating} />
        <span className="text-xs text-fg-muted">{review.when}</span>
      </div>

      <blockquote className="mt-3 text-sm leading-relaxed text-fg/90">
        <p>“{review.text}”</p>
      </blockquote>

      <p className="mt-auto pt-5">
        <span className="inline-flex rounded-pill bg-primary/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-primary">
          {review.service}
        </span>
      </p>
    </GlowCard>
  )
}
