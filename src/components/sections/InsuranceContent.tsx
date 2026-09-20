import { ExternalLink, Phone } from 'lucide-react'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/Reveal'
import { workshop } from '@/config/workshop'
import { insurers } from '@/data/insurers'
import { useT } from '@/i18n'
import { buildTelLink } from '@/lib/whatsapp'

/** Logo wall of the insurers the workshop is approved by — each tile links to the insurer. */
export function InsurerWall() {
  const t = useT()
  const c = t.insurance
  return (
    <>
      <Reveal delay={0.05}>
        <p className="mt-10 text-xs font-semibold tracking-[0.18em] text-primary uppercase">{c.approvedBy}</p>
      </Reveal>
      <StaggerGroup as="ul" className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {insurers.map((insurer) => {
          const name = c.names[insurer.id] ?? insurer.name
          const note = c.notes[insurer.id]
          return (
            <StaggerItem as="li" key={insurer.id} className="h-full">
              <a
                href={insurer.url}
                target="_blank"
                rel="noopener noreferrer"
                title={c.visit(name)}
                className="group flex h-full flex-col items-center rounded-2xl border border-line bg-white p-4 text-center shadow-card transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/50 motion-reduce:hover:translate-y-0"
              >
                <span className="flex h-16 w-full items-center justify-center">
                  <img
                    src={insurer.logo}
                    alt={c.logoAlt(name)}
                    width={Math.round(64 * insurer.ratio)}
                    height={64}
                    loading="lazy"
                    decoding="async"
                    className="max-h-14 w-auto max-w-[10rem] object-contain"
                  />
                </span>
                <span className="mt-3 text-xs font-semibold leading-snug text-fg">{name}</span>
                {note && <span className="mt-0.5 text-[11px] leading-snug text-fg-muted">{note}</span>}
                <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-fg-muted opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {c.visit(name)}
                  <ExternalLink className="size-3" aria-hidden="true" />
                </span>
              </a>
            </StaggerItem>
          )
        })}
      </StaggerGroup>
    </>
  )
}

/** The three claim steps. */
export function ClaimSteps() {
  const t = useT()
  const c = t.insurance
  return (
    <div className="h-full rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
      <h3 className="font-display text-xl font-bold tracking-tight text-fg">{c.stepsTitle}</h3>
      <ol className="mt-6 grid gap-6 sm:grid-cols-3">
        {c.steps.map((step, index) => {
          return (
            <li key={step.title} className="relative border-t-2 border-primary/30 pt-4">
              <p className="font-display text-2xl font-bold text-primary">{String(index + 1).padStart(2, '0')}</p>
              <p className="mt-1 font-semibold text-fg">{step.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{step.body}</p>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/** Document checklist + "insured elsewhere?" note. */
export function BringChecklist() {
  const t = useT()
  const c = t.insurance
  return (
    <div className="flex h-full flex-col rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
      <h3 className="font-display text-xl font-bold tracking-tight text-fg">{c.bringTitle}</h3>
      <ul className="mt-5 space-y-2.5">
        {c.bring.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-fg/90">
            <span aria-hidden="true" className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-primary" />
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-auto border-t border-line pt-5">
        <p className="text-sm font-semibold text-fg">{c.otherInsurer}</p>
        <p className="mt-1 text-sm leading-relaxed text-fg-muted">{c.otherInsurerCall(workshop.phone)}</p>
        <a
          href={buildTelLink(workshop.phone)}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-bright"
        >
          <Phone className="size-4" aria-hidden="true" />
          <span dir="ltr">{workshop.phone}</span>
        </a>
      </div>
    </div>
  )
}

/** What to do right after an accident (Abu Dhabi). */
export function AfterAccident() {
  const t = useT()
  const c = t.insurance
  return (
    <div className="rounded-card border border-warn/30 bg-warn/8 p-6 sm:p-8">
      <h3 className="font-display text-xl font-bold tracking-tight text-fg">{c.afterAccidentTitle}</h3>
      <ol className="mt-5 space-y-3">
        {c.afterAccident.map((item, index) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-fg/90">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-warn/20 text-xs font-bold text-fg">
              {index + 1}
            </span>
            {item}
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Short FAQ. */
export function InsuranceFaq() {
  const t = useT()
  const c = t.insurance
  return (
    <div>
      <h3 className="font-display text-xl font-bold tracking-tight text-fg">{c.faqTitle}</h3>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        {c.faq.map((item) => (
          <div key={item.q} className="rounded-2xl border border-line bg-surface p-5">
            <dt className="font-semibold text-fg">{item.q}</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-fg-muted">{item.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
