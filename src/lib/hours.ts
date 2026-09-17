import type { DaySchedule, DayKey, TimeRange } from '@/config/workshop'

export type StatusKind = 'open' | 'break' | 'opens-later' | 'closed'

export interface WorkshopStatus {
  kind: StatusKind
  /** Headline label: "Open Now" | "Open Today" | "Closed" */
  label: string
  /** Supporting detail: "Closes 1:00 PM" | "Back at 3:00 PM" | "Opens Mon 8:00 AM" */
  detail: string
  isOpen: boolean
  /** Key of the current day in the workshop's time zone. */
  today: DayKey
}

export interface ZonedNow {
  day: DayKey
  /** Minutes since midnight, local to the time zone. */
  minutes: number
  /** "8:42 AM" style clock string. */
  clock: string
}

/** Everything the engine needs to speak a language — see `en.status` / `ar.status`. */
export interface HoursStrings {
  am: string
  pm: string
  openNow: string
  openToday: string
  closed: string
  closes: (time: string) => string
  backAt: (time: string) => string
  opensAt: (time: string) => string
  opensTomorrow: (time: string) => string
  opensOn: (day: string, time: string) => string
  seeHours: string
  /** Short weekday name, e.g. "Mon" / "الإثنين". */
  dayShort: (day: DayKey) => string
}

export const EN_HOURS: HoursStrings = {
  am: 'AM',
  pm: 'PM',
  openNow: 'Open Now',
  openToday: 'Open Today',
  closed: 'Closed',
  closes: (time) => `Closes ${time}`,
  backAt: (time) => `On break · Back at ${time}`,
  opensAt: (time) => `Opens at ${time}`,
  opensTomorrow: (time) => `Opens tomorrow ${time}`,
  opensOn: (day, time) => `Opens ${day} ${time}`,
  seeHours: 'See opening hours',
  dayShort: (day) => day.slice(0, 3).replace(/^./, (c) => c.toUpperCase()),
}

const DAY_KEYS: readonly DayKey[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

const WEEKDAY_TO_KEY: Record<string, DayKey> = {
  Sun: 'sunday',
  Mon: 'monday',
  Tue: 'tuesday',
  Wed: 'wednesday',
  Thu: 'thursday',
  Fri: 'friday',
  Sat: 'saturday',
}

/** Parses "HH:mm" → minutes since midnight. */
export function toMinutes(time: string): number {
  const [h = 0, m = 0] = time.split(':').map(Number)
  return h * 60 + m
}

/**
 * Formats "HH:mm" (24h) as "8:00 AM" (or "8:00 ص" with Arabic markers). The
 * result is wrapped in a left-to-right bidi isolate so a time never reorders
 * inside Arabic text ("8:00 ص – 1:00 م" stays readable in both directions).
 */
export function formatTime(time: string, strings: HoursStrings = EN_HOURS): string {
  const [h = 0, m = 0] = time.split(':').map(Number)
  const period = h >= 12 ? strings.pm : strings.am
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `\u2066${hour12}:${String(m).padStart(2, '0')} ${period}\u2069`
}

/** "8:00 AM – 1:00 PM" for a single range. */
export function formatRange(range: TimeRange, strings: HoursStrings = EN_HOURS): string {
  return `${formatTime(range.open, strings)} – ${formatTime(range.close, strings)}`
}

/**
 * Current weekday + minutes in the given IANA time zone, computed with Intl
 * so the badge is correct for visitors browsing from anywhere in the world.
 */
export function getZonedNow(timeZone: string, date: Date = new Date(), strings: HoursStrings = EN_HOURS): ZonedNow {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? ''

  const day = WEEKDAY_TO_KEY[get('weekday')] ?? 'monday'
  const hour = Number(get('hour')) % 24
  const minute = Number(get('minute'))
  const period = hour >= 12 ? strings.pm : strings.am
  const hour12 = hour % 12 === 0 ? 12 : hour % 12

  return {
    day,
    minutes: hour * 60 + minute,
    clock: `\u2066${hour12}:${String(minute).padStart(2, '0')} ${period}\u2069`,
  }
}

function findDay(schedule: readonly DaySchedule[], day: DayKey): DaySchedule | undefined {
  return schedule.find((d) => d.day === day)
}

/** Next day (searching forward up to a week) that has at least one interval. */
function nextOpeningDay(
  schedule: readonly DaySchedule[],
  from: DayKey,
): { day: DaySchedule; daysAhead: number } | undefined {
  const start = DAY_KEYS.indexOf(from)
  for (let offset = 1; offset <= 7; offset++) {
    const key = DAY_KEYS[(start + offset) % 7]
    const day = key ? findDay(schedule, key) : undefined
    if (day && day.intervals.length > 0) return { day, daysAhead: offset }
  }
  return undefined
}

/**
 * Derives the live status from the structured schedule.
 * Pure function — pass `now` explicitly for tests or previews.
 */
export function getWorkshopStatus(
  schedule: readonly DaySchedule[],
  now: ZonedNow,
  strings: HoursStrings = EN_HOURS,
): WorkshopStatus {
  const today = findDay(schedule, now.day)
  const intervals = today?.intervals ?? []

  for (const range of intervals) {
    if (now.minutes >= toMinutes(range.open) && now.minutes < toMinutes(range.close)) {
      return {
        kind: 'open',
        label: strings.openNow,
        detail: strings.closes(formatTime(range.close, strings)),
        isOpen: true,
        today: now.day,
      }
    }
  }

  const upcoming = intervals.find((range) => now.minutes < toMinutes(range.open))
  if (upcoming) {
    const alreadyOpenedToday = intervals.some((range) => now.minutes >= toMinutes(range.close))
    return alreadyOpenedToday
      ? {
          kind: 'break',
          label: strings.openToday,
          detail: strings.backAt(formatTime(upcoming.open, strings)),
          isOpen: false,
          today: now.day,
        }
      : {
          kind: 'opens-later',
          label: strings.openToday,
          detail: strings.opensAt(formatTime(upcoming.open, strings)),
          isOpen: false,
          today: now.day,
        }
  }

  const next = nextOpeningDay(schedule, now.day)
  const firstRange = next?.day.intervals[0]
  const when =
    next && firstRange
      ? next.daysAhead === 1
        ? strings.opensTomorrow(formatTime(firstRange.open, strings))
        : strings.opensOn(strings.dayShort(next.day.day), formatTime(firstRange.open, strings))
      : strings.seeHours

  return { kind: 'closed', label: strings.closed, detail: when, isOpen: false, today: now.day }
}
