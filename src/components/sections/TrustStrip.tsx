import { Picture } from '@/components/ui/Picture'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/Reveal'
import { workshop } from '@/config/workshop'
import { stats } from '@/data/stats'
import { useT } from '@/i18n'

/** Trust & credibility strip — doubles as the "About" anchor from the navbar. */
export function TrustStrip() {
  const t = useT()
  const yearsInBusiness = new Date().getFullYear() - workshop.foundedYear
  const copy: Record<string, { value: string; label: string }> = {
    years: { value: t.stats.years.value(yearsInBusiness), label: t.stats.years.label(workshop.foundedYear) },
    insurance: t.stats.insurance,
    techs: t.stats.techs,
    parts: t.stats.parts,
  }

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative border-y border-line bg-surface/40"
    >
      <div className="container-x grid gap-8 py-12 lg:grid-cols-[1fr_1.6fr] lg:items-center lg:gap-14 lg:py-16">
        <Reveal>
          <Picture
            src="/photos/workshop-exterior.jpg"
            thumb="/photos/workshop-exterior-thumb.jpg"
            alt={t.about.photoAlt}
            width={1400}
            height={673}
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="mb-6 aspect-[2/1] w-full rounded-2xl border border-line object-cover shadow-card"
          />
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            <span aria-hidden="true" className="brand-stripe h-[3px] w-7 rounded-full" />
            {t.about.eyebrow}
          </p>
          <h2
            id="about-heading"
            className="font-display text-2xl font-bold tracking-tight text-balance text-fg sm:text-3xl"
          >
            {t.about.title(workshop.foundedYear)}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-pretty text-fg-muted">{t.about.body(workshop.foundedYear)}</p>
        </Reveal>

        <StaggerGroup as="ul" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat) => {
            const text = copy[stat.id] ?? { value: stat.value, label: stat.label }
            return (
              <StaggerItem
                as="li"
                key={stat.id}
                className="rounded-2xl border border-navy-800 bg-navy-900 p-4 text-on-navy shadow-[0_18px_40px_-24px_rgb(15_27_61/0.7)] sm:p-5"
              >
                <span aria-hidden="true" className="block h-[3px] w-8 rounded-full bg-gold-500" />
                <p className="mt-4 font-display text-[1.35rem] font-bold tracking-tight sm:text-[1.7rem]">
                  {text.value}
                </p>
                <p className="mt-1 text-sm leading-snug text-on-navy-muted">{text.label}</p>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}
