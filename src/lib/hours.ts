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

/** Formats "HH:mm" (24h) as "8:00 AM". */
export function formatTime(time: string): string {
  const [h = 0, m = 0] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

/** "8:00 AM – 1:00 PM" for a single range. */
export function formatRange(range: TimeRange): string {
  return `${formatTime(range.open)} – ${formatTime(range.close)}`
}

/**
 * Current weekday + minutes in the given IANA time zone, computed with Intl
 * so the badge is correct for visitors browsing from anywhere in the world.
 */
export function getZonedNow(timeZone: string, date: Date = new Date()): ZonedNow {
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
  const period = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 === 0 ? 12 : hour % 12

  return {
    day,
    minutes: hour * 60 + minute,
    clock: `${hour12}:${String(minute).padStart(2, '0')} ${period}`,
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
): WorkshopStatus {
  const today = findDay(schedule, now.day)
  const intervals = today?.intervals ?? []

  for (const range of intervals) {
    if (now.minutes >= toMinutes(range.open) && now.minutes < toMinutes(range.close)) {
      return {
        kind: 'open',
        label: 'Open Now',
        detail: `Closes ${formatTime(range.close)}`,
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
          label: 'Open Today',
          detail: `On break · Back at ${formatTime(upcoming.open)}`,
          isOpen: false,
          today: now.day,
        }
      : {
          kind: 'opens-later',
          label: 'Open Today',
          detail: `Opens at ${formatTime(upcoming.open)}`,
          isOpen: false,
          today: now.day,
        }
  }

  const next = nextOpeningDay(schedule, now.day)
  const firstRange = next?.day.intervals[0]
  const when =
    next && firstRange
      ? next.daysAhead === 1
        ? `Opens tomorrow ${formatTime(firstRange.open)}`
        : `Opens ${next.day.short} ${formatTime(firstRange.open)}`
      : 'Message us on WhatsApp'

  return { kind: 'closed', label: 'Closed', detail: when, isOpen: false, today: now.day }
}
