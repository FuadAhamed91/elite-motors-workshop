import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/Reveal'
import { stats } from '@/data/stats'

/** Trust & credibility strip — doubles as the "About" anchor from the navbar. */
export function TrustStrip() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative border-y border-line bg-surface/40"
    >
      <div className="container-x grid gap-8 py-12 lg:grid-cols-[1fr_1.6fr] lg:items-center lg:gap-14 lg:py-16">
        <Reveal>
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            <span aria-hidden="true" className="h-px w-6 bg-linear-to-r from-primary to-secondary" />
            Why drivers choose us
          </p>
          <h2
            id="about-heading"
            className="font-display text-2xl font-bold tracking-tight text-balance text-fg sm:text-3xl"
          >
            Fifteen years of honest wrenching in Mussafah.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-pretty text-fg-muted">
            Certified technicians, genuine parts and an estimate agreed before we touch a
            bolt — from routine servicing to insurance-approved accident and body repairs.
            That is why drivers across Abu Dhabi keep coming back.
          </p>
        </Reveal>

        <StaggerGroup as="ul" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <StaggerItem
                as="li"
                key={stat.id}
                className="rounded-2xl border border-line bg-bg/60 p-4 sm:p-5"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <p className="mt-4 font-display text-2xl font-bold tracking-tight text-fg sm:text-[1.7rem]">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm leading-snug text-fg-muted">{stat.label}</p>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}
