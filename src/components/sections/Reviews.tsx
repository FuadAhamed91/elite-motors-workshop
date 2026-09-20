import { ExternalLink } from 'lucide-react'
import { GlowCard } from '@/components/ui/GlowCard'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Stars } from '@/components/ui/Stars'
import { workshop } from '@/config/workshop'
import { reviews, type Review } from '@/data/reviews'
import { useT } from '@/i18n'

export function Reviews() {
  const t = useT()
  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="below-fold relative overflow-hidden bg-navy-900 py-20 text-on-navy lg:py-28">
      <div aria-hidden="true" className="brand-stripe absolute inset-x-0 top-0 h-1" />
      <div
        aria-hidden="true"
        className="absolute -top-32 right-0 h-[520px] w-[760px] bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--color-royal-500)_26%,transparent),transparent_65%)]"
      />
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <SectionHeading
              id="reviews-heading"
              tone="dark"
              eyebrow={t.reviews.eyebrow}
              title={t.reviews.title}
              description={t.reviews.description}
            />
          </Reveal>
          <Reveal delay={0.1} className="shrink-0">
            <GoogleReviewsBadge />
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

/** Links to the full review list on Google — deliberately shows no star average. */
function GoogleReviewsBadge() {
  const t = useT()
  const { count, url } = workshop.googleReviews
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-white/5 p-4 pe-5 text-on-navy transition-colors hover:border-white/30 hover:bg-white/10"
    >
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold">{t.reviews.badgeTitle}</span>
        <span className="flex items-center gap-1 text-xs text-on-navy-muted">
          {t.reviews.badgeSub(count)}
          <ExternalLink
            className="size-3 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
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
  const t = useT()
  return (
    <GlowCard accent="secondary" innerClassName="flex flex-col p-6">
      <a
        href={workshop.googleReviews.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.reviews.readAria(review.name)}
        className="flex h-full flex-col rounded-lg"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary/30 to-secondary/30 font-display text-sm font-bold text-fg ring-1 ring-line-strong"
            >
              {initials(review.name)}
            </span>
            <div>
              <p className="font-semibold text-fg" dir="ltr">{review.name}</p>
              <p className="mt-0.5 text-xs text-fg-muted">{t.reviews.when[review.id] ?? review.when}</p>
            </div>
          </div>
          <span className="inline-flex items-center rounded-pill border border-line bg-fg/3 px-2 py-1 text-[11px] font-medium text-fg-muted">
            {t.reviews.google}
          </span>
        </div>

        <div className="mt-4">
          <Stars rating={review.rating} />
        </div>

        <blockquote className="mt-3 text-sm leading-relaxed text-fg/90" lang="en" dir="ltr">
          <p className="text-start">“{review.excerpt}”</p>
        </blockquote>

        <p className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="inline-flex rounded-pill bg-primary/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-primary">
            {t.reviews.topics[review.id] ?? review.topic}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-fg-muted transition-colors group-hover:text-fg">
            {t.reviews.readOnGoogle}
            <ExternalLink className="size-3" aria-hidden="true" />
          </span>
        </p>
      </a>
    </GlowCard>
  )
}
