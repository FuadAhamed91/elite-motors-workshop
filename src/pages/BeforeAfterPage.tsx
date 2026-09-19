import { ArrowLeft, ArrowUpRight, Phone, ShieldCheck } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { WhatsAppFab } from '@/components/layout/WhatsAppFab'
import { RepairGrid } from '@/components/sections/BeforeAfter'
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

/** Page header — also rendered into before-after.html at build time (see src/shell). */
export function BeforeAfterHero() {
  const t = useT()
  const c = t.beforeAfter
  return (
    <section aria-labelledby="before-after-heading" className="relative overflow-hidden pt-28 pb-10 sm:pt-32 lg:pt-40 lg:pb-14">
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
          <SectionHeading id="before-after-heading" level={1} eyebrow={c.eyebrow} title={c.pageTitle} description={c.pageLead} className="mt-6" />
        </Reveal>
        <Reveal eager>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CtaLink href={buildTelLink(workshop.phone)} size="lg" icon={<Phone />}>
              {t.common.call(workshop.phone)}
            </CtaLink>
            <CtaLink href="/insurance" variant="outline" size="lg" icon={<ShieldCheck />}>
              {t.common.insuranceClaim}
            </CtaLink>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/** /before-after — every accident repair pair, largest first, plus the insurance hand-off. */
export default function BeforeAfterPage() {
  const idle = useIdle()
  const t = useT()
  const c = t.beforeAfter

  return (
    <>
      <Navbar />
      <main id="main">
        <BeforeAfterHero />

        <section className="container-x pb-16 lg:pb-20" aria-label={c.listLabel}>
          <RepairGrid columns={2} />
        </section>

        <section className="border-t border-line bg-surface/40 py-16 lg:py-20" aria-labelledby="accident-heading">
          <div className="container-x grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <Reveal>
              <h2 id="accident-heading" className="font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl">
                {c.accidentTitle}
              </h2>
              <p className="mt-3 max-w-2xl text-fg-muted">{c.accidentBody}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <CtaLink href="/insurance" size="lg" iconRight={<ArrowUpRight className="rtl:-scale-x-100" />}>
                  {c.insuranceCta}
                </CtaLink>
                <CtaLink href={buildTelLink(workshop.phone)} variant="outline" size="lg" icon={<Phone />}>
                  {t.common.callShort}
                </CtaLink>
              </div>
            </Reveal>
          </div>
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
