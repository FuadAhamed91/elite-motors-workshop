import { ClipboardCheck, ExternalLink, FileCheck2, Phone, ShieldCheck, Wrench } from 'lucide-react'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { workshop } from '@/config/workshop'
import { insurers } from '@/data/insurers'
import { useT } from '@/i18n'
import { buildTelLink } from '@/lib/whatsapp'

const STEP_ICONS = [FileCheck2, ClipboardCheck, Wrench] as const

/**
 * Insurance claims: the insurers the workshop is approved by (their logos link
 * to their websites), how a claim runs, and what to bring.
 */
export function Insurance() {
  const t = useT()
  const c = t.insurance

  return (
    <section id="insurance" aria-labelledby="insurance-heading" className="below-fold relative border-y border-line bg-surface/40 py-20 lg:py-28">
      <div className="container-x">
        <Reveal>
          <SectionHeading id="insurance-heading" eyebrow={c.eyebrow} title={c.title} description={c.description} />
        </Reveal>

        {/* Approved-by logo wall */}
        <Reveal delay={0.05}>
          <p className="mt-10 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            <ShieldCheck className="size-4" aria-hidden="true" />
            {c.approvedBy}
          </p>
        </Reveal>
        <StaggerGroup as="ul" className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-7">
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
                      className="max-h-14 w-auto max-w-[9.5rem] object-contain"
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

        {/* How a claim works + what to bring */}
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Reveal>
            <div className="h-full rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
              <h3 className="font-display text-xl font-bold tracking-tight text-fg">{c.stepsTitle}</h3>
              <ol className="mt-6 grid gap-6 sm:grid-cols-3">
                {c.steps.map((step, index) => {
                  const Icon = STEP_ICONS[index] ?? Wrench
                  return (
                    <li key={step.title} className="relative">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <p className="mt-4 text-xs font-semibold tracking-[0.18em] text-fg-muted uppercase">{String(index + 1).padStart(2, '0')}</p>
                      <p className="mt-1 font-semibold text-fg">{step.title}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{step.body}</p>
                    </li>
                  )
                })}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
              <h3 className="font-display text-xl font-bold tracking-tight text-fg">{c.bringTitle}</h3>
              <ul className="mt-5 space-y-2.5">
                {c.bring.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-fg/90">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <ClipboardCheck className="size-3" strokeWidth={2.5} aria-hidden="true" />
                    </span>
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
          </Reveal>
        </div>
      </div>
    </section>
  )
}
