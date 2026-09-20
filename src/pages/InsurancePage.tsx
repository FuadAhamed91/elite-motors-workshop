import { ArrowLeft, Navigation, Phone } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { WhatsAppFab } from '@/components/layout/WhatsAppFab'
import { BeforeAfterStrip } from '@/components/sections/BeforeAfter'
import { AfterAccident, BringChecklist, ClaimSteps, InsuranceFaq, InsurerWall } from '@/components/sections/InsuranceContent'
import { CtaLink } from '@/components/ui/CtaLink'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { assistant } from '@/config/assistant'
import { workshop } from '@/config/workshop'
import { useIdle } from '@/hooks/useIdle'
import { useT } from '@/i18n'
import { buildTelLink } from '@/lib/whatsapp'

const AssistantWidget = lazy(() =>
  import('@/components/assistant/AssistantWidget').then((mod) => ({ default: mod.AssistantWidget })),
)

/** Page header — also rendered into insurance.html at build time (see src/shell). */
export function InsuranceHero() {
  const t = useT()
  const c = t.insurance
  return (
    <section aria-labelledby="insurance-heading" className="relative overflow-hidden pt-28 pb-12 sm:pt-32 lg:pt-40 lg:pb-16">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black_20%,transparent_75%)]" />
        <div className="absolute -top-48 left-1/2 h-[720px] w-[1100px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--color-primary-bright)_16%,transparent),transparent_62%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-bg to-transparent" />
      </div>
      <div className="container-x">
        <Reveal eager>
          <a href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-primary">
            <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" />
            {t.common.backHome}
          </a>
        </Reveal>
        <Reveal eager>
          <SectionHeading id="insurance-heading" level={1} eyebrow={c.eyebrow} title={c.pageTitle} description={c.pageLead} className="mt-6" />
        </Reveal>
        <Reveal eager>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CtaLink href={buildTelLink(workshop.phone)} size="lg" icon={<Phone />}>
              {t.common.call(workshop.phone)}
            </CtaLink>
            <CtaLink href={workshop.directionsLink} external variant="outline" size="lg" icon={<Navigation />}>
              {t.common.getDirections}
            </CtaLink>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/** /insurance — everything about claims: insurers, steps, documents, first steps after an accident, FAQ. */
export default function InsurancePage() {
  const idle = useIdle()
  const t = useT()

  return (
    <>
      <Navbar />
      <main id="main">
        <InsuranceHero />

        <section className="container-x pb-16 lg:pb-20" aria-label={t.insurance.approvedBy}>
          <InsurerWall />
        </section>

        <section className="relative bg-navy-900 py-16 lg:py-20" aria-label={t.insurance.stepsTitle}>
          <div aria-hidden="true" className="brand-stripe absolute inset-x-0 top-0 h-1" />
          <div className="container-x grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <Reveal>
              <ClaimSteps />
            </Reveal>
            <Reveal delay={0.1}>
              <BringChecklist />
            </Reveal>
          </div>
        </section>

        <section className="container-x py-16 lg:py-20" aria-label={t.beforeAfter.compactTitle}>
          <Reveal>
            <BeforeAfterStrip limit={3} />
          </Reveal>
        </section>

        <section className="container-x grid gap-10 border-t border-line py-16 lg:grid-cols-2 lg:gap-14 lg:py-20" aria-label={t.insurance.faqTitle}>
          <Reveal>
            <AfterAccident />
          </Reveal>
          <Reveal delay={0.1}>
            <InsuranceFaq />
          </Reveal>
        </section>
      </main>
      <Footer />
      <WhatsAppFab />
      {assistant.enabled && idle && (
        <Suspense fallback={null}>
          <AssistantWidget />
        </Suspense>
      )}
    </>
  )
}
