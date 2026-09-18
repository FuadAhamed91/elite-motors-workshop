import { ArrowUpRight, Phone } from 'lucide-react'
import { InsurerWall } from '@/components/sections/InsuranceContent'
import { CtaLink } from '@/components/ui/CtaLink'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { workshop } from '@/config/workshop'
import { useT } from '@/i18n'
import { buildTelLink } from '@/lib/whatsapp'

/**
 * Home-page teaser for insurance claims: the approved insurers and a button to
 * the dedicated /insurance page (claim steps, checklist, FAQ live there).
 */
export function Insurance() {
  const t = useT()
  const c = t.insurance

  return (
    <section id="insurance" aria-labelledby="insurance-heading" className="below-fold relative border-y border-line bg-surface/40 py-20 lg:py-28">
      <div className="container-x">
        <Reveal>
          <SectionHeading id="insurance-heading" eyebrow={c.eyebrow} title={c.title} description={c.homeLead} />
        </Reveal>

        <InsurerWall />

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CtaLink href="/insurance" size="lg" iconRight={<ArrowUpRight className="rtl:-scale-x-100" />}>
              {c.openPage}
            </CtaLink>
            <CtaLink href={buildTelLink(workshop.phone)} variant="outline" size="lg" icon={<Phone />}>
              {t.common.call(workshop.phone)}
            </CtaLink>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
