import { CalendarX, Clock, Coffee, MoonStar, Navigation, Phone, Sun } from 'lucide-react'
import { CtaLink } from '@/components/ui/CtaLink'
import { GlowCard } from '@/components/ui/GlowCard'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { workshop, type DaySchedule } from '@/config/workshop'
import { useWorkshopStatus } from '@/hooks/useWorkshopStatus'
import { hoursStrings, useT } from '@/i18n'
import { cn } from '@/lib/cn'
import { formatRange } from '@/lib/hours'
import { buildTelLink } from '@/lib/whatsapp'

export function Hours() {
  const t = useT()
  return (
    <section id="hours" aria-labelledby="hours-heading" className="below-fold container-x py-20 lg:py-28">
      <Reveal>
        <SectionHeading
          id="hours-heading"
          eyebrow={t.hours.eyebrow}
          title={t.hours.title}
          description={t.hours.description}
        />
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <Reveal>
          <ScheduleCard />
        </Reveal>
        <Reveal delay={0.1}>
          <LiveStatusCard />
        </Reveal>
      </div>
    </section>
  )
}

/** Weekly schedule with today highlighted and prayer/closure indicators. */
function ScheduleCard() {
  const t = useT()
  const { status } = useWorkshopStatus()

  return (
    <GlowCard innerClassName="p-5 sm:p-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <h3 className="flex items-center gap-2 font-display text-lg font-bold text-fg">
          <Clock className="size-5 text-primary" aria-hidden="true" />
          {t.hours.weekly}
        </h3>
        <span className="text-xs text-fg-muted">{t.hours.timesNote}</span>
      </div>

      <ol className="mt-5 divide-y divide-line">
        {workshop.schedule.map((day) => (
          <ScheduleRow key={day.day} day={day} isToday={day.day === status.today} />
        ))}
      </ol>

      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-4 text-xs text-fg-muted">
        <li className="flex items-center gap-1.5">
          <Coffee className="size-3.5 text-fg-muted" aria-hidden="true" />
          {t.hours.breakLabel}
        </li>
        <li className="flex items-center gap-1.5">
          <CalendarX className="size-3.5 text-danger" aria-hidden="true" />
          {t.hours.sundayClosed}
        </li>
      </ul>
    </GlowCard>
  )
}

interface ScheduleRowProps {
  day: DaySchedule
  isToday: boolean
}

function ScheduleRow({ day, isToday }: ScheduleRowProps) {
  const t = useT()
  const strings = hoursStrings(t)
  const closed = day.intervals.length === 0

  return (
    <li
      aria-current={isToday ? 'date' : undefined}
      className={cn(
        'flex flex-col gap-1 py-3 sm:grid sm:grid-cols-[7rem_1fr_auto] sm:items-center sm:gap-x-3',
        isToday && '-mx-3 rounded-xl border border-primary/25 bg-primary/6 px-3',
      )}
    >
      <span className="flex items-center gap-2 text-sm font-semibold text-fg">
        {t.days[day.day].label}
        {isToday && (
          <span className="rounded-pill bg-primary px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-cta-fg uppercase">
            {t.hours.today}
          </span>
        )}
      </span>

      <span
        className={cn(
          'flex flex-wrap items-center gap-x-2 text-sm tabular-nums',
          closed ? 'font-medium text-danger' : 'text-fg/90',
        )}
      >
        {closed
          ? t.hours.closed
          : day.intervals.map((range, index) => (
              <span key={range.open} className="flex items-center gap-2 whitespace-nowrap">
                {index > 0 && (
                  <span aria-hidden="true" className="hidden text-fg-muted/60 sm:inline">
                    ·
                  </span>
                )}
                {formatRange(range, strings)}
              </span>
            ))}
      </span>

      {day.note && (
        <span
          className={cn(
            'inline-flex w-fit items-center gap-1.5 rounded-pill border px-2 py-0.5 text-[11px] font-medium',
            day.noteKind === 'prayer'
              ? 'border-warn/30 bg-warn/10 text-warn'
              : 'border-danger/30 bg-danger/10 text-danger',
          )}
        >
          {day.noteKind === 'prayer' ? (
            <MoonStar className="size-3" aria-hidden="true" />
          ) : (
            <CalendarX className="size-3" aria-hidden="true" />
          )}
          {day.noteKind === 'closed' ? t.hours.closedAllDay : day.note}
        </span>
      )}
    </li>
  )
}

const STANDARD_DAY = workshop.schedule.find((day) => day.day === 'monday')

/** Live status panel — flips copy and CTA depending on whether the bay is open. */
function LiveStatusCard() {
  const t = useT()
  const strings = hoursStrings(t)
  const { status, now } = useWorkshopStatus(15_000)
  const standardHours = STANDARD_DAY?.intervals.map((range) => formatRange(range, strings)).join(' · ') ?? ''

  return (
    <GlowCard accent="secondary" innerClassName="flex h-full flex-col p-5 sm:p-6">
      <h3 className="flex items-center gap-2 font-display text-lg font-bold text-fg">
        <Sun className="size-5 text-secondary" aria-hidden="true" />
        {t.hours.live}
      </h3>

      <div className="mt-5 rounded-2xl border border-line bg-bg/60 p-4">
        <StatusBadge />
        <p className="mt-4 text-xs font-medium tracking-wide text-fg-muted uppercase">
          {t.hours.localTime}
        </p>
        <p className="mt-1 font-display text-3xl font-bold text-fg tabular-nums" dir="ltr">{now.clock}</p>
      </div>

      <dl className="mt-5 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-fg-muted">{t.hours.monSat}</dt>
          <dd className="text-end font-medium text-fg tabular-nums">{standardHours}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-fg-muted">{t.hours.lunch}</dt>
          <dd className="text-end font-medium text-fg tabular-nums">{t.hours.breakLabel}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-fg-muted">{t.hours.sunday}</dt>
          <dd className="text-end font-medium text-danger">{t.hours.closed}</dd>
        </div>
      </dl>

      <div className="mt-auto pt-6">
        {status.isOpen ? (
          <>
            <CtaLink href={buildTelLink(workshop.phone)} icon={<Phone />} fullWidth>
              {t.hours.openCall(workshop.phone)}
            </CtaLink>
            <p className="mt-3 text-center text-xs text-fg-muted">{t.hours.landlineNote}</p>
          </>
        ) : (
          <>
            <CtaLink href={workshop.directionsLink} external variant="outline" icon={<Navigation />} fullWidth>
              {t.hours.planVisit}
            </CtaLink>
            <p className="mt-3 text-center text-xs text-fg-muted">{t.hours.closedHint(status.detail, workshop.phone)}</p>
          </>
        )}
      </div>
    </GlowCard>
  )
}
