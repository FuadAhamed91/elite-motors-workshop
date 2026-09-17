/**
 * ─────────────────────────────────────────────────────────────────────
 *  Elite Motors Workshop — business configuration
 *  Single source of truth for every name, number, address and opening
 *  time rendered on the page. Every section, CTA, WhatsApp link, the
 *  live status badge and the SEO schema read from this file.
 * ─────────────────────────────────────────────────────────────────────
 */

export type DayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

/** 24-hour "HH:mm" strings, local to `workshop.timeZone`. */
export interface TimeRange {
  open: string
  close: string
}

export interface DaySchedule {
  day: DayKey
  label: string
  short: string
  /** Empty array = closed all day. Gaps between ranges are breaks. */
  intervals: readonly TimeRange[]
  /** Optional callout shown next to the day (e.g. prayer break). */
  note?: string
  /** Distinguishes the type of note so the UI can pick the right icon/colour. */
  noteKind?: 'prayer' | 'closed'
}

export interface NavLink {
  label: string
  href: `#${string}`
}

const STANDARD_DAY: readonly TimeRange[] = [
  { open: '08:00', close: '13:00' },
  { open: '15:00', close: '20:00' },
]

/**
 * Friday: the morning session closes at 12:00 PM so the team can attend
 * Jumu'ah prayer (≈12:15–1:00 PM in Abu Dhabi) before the usual 3:00 PM reopening.
 * Change `close` below if the workshop keeps the standard 1:00 PM close on Fridays.
 */
const FRIDAY: readonly TimeRange[] = [
  { open: '08:00', close: '12:00' },
  { open: '15:00', close: '20:00' },
]

export const workshop = {
  name: 'Elite Motors Workshop',
  shortName: 'Elite Motors',
  /** Used in the navbar title and SEO title. */
  displayTitle: 'Elite Motors Workshop Abu Dhabi',
  tagline: 'Precision Auto Care & Mechanical Excellence in Abu Dhabi',
  city: 'Mussafah, Abu Dhabi, UAE',
  timeZone: 'Asia/Dubai',

  /**
   * WhatsApp number in display format.
   * The link builder strips spaces/plus signs → https://wa.me/971565017797?text=...
   */
  whatsappNumber: '+971 56 501 7797',
  phone: '+971 2 558 3441',

  /** Human-readable summary used in the footer and SEO schema. */
  hoursSummary:
    'Monday – Saturday: 8:00 AM – 1:00 PM & 3:00 PM – 8:00 PM | Sunday: Closed',

  /** Structured schedule driving the live status badge and the hours card. */
  schedule: [
    { day: 'monday', label: 'Monday', short: 'Mon', intervals: STANDARD_DAY },
    { day: 'tuesday', label: 'Tuesday', short: 'Tue', intervals: STANDARD_DAY },
    { day: 'wednesday', label: 'Wednesday', short: 'Wed', intervals: STANDARD_DAY },
    { day: 'thursday', label: 'Thursday', short: 'Thu', intervals: STANDARD_DAY },
    {
      day: 'friday',
      label: 'Friday',
      short: 'Fri',
      intervals: FRIDAY,
      note: "Jumu'ah prayer break",
      noteKind: 'prayer',
    },
    { day: 'saturday', label: 'Saturday', short: 'Sat', intervals: STANDARD_DAY },
    {
      day: 'sunday',
      label: 'Sunday',
      short: 'Sun',
      intervals: [],
      note: 'Closed all day',
      noteKind: 'closed',
    },
  ] as const satisfies readonly DaySchedule[],

  /** Daily midday break (shown as a hint on the schedule card). */
  breakLabel: '1:00 PM – 3:00 PM daily break',

  address: {
    line1: 'Workshop 12, Plot M-9',
    line2: 'Mussafah Industrial Area (M9)',
    city: 'Abu Dhabi, United Arab Emirates',
    landmarks: 'Behind Capital Mall · 4 min from Dalma Mall · off Al Ain Road (E22)',
    /** Free-text query used for the map links below. */
    mapQuery: 'Mussafah Industrial Area M9, Abu Dhabi',
  },

  /**
   * Map embed — no API key required. To use the exact pin, open the location
   * in Google Maps → Share → "Embed a map" and paste the iframe `src` here.
   */
  mapEmbedUrl:
    'https://maps.google.com/maps?q=Mussafah%20Industrial%20Area%20M9%2C%20Abu%20Dhabi&t=&z=14&ie=UTF8&iwloc=&output=embed',
  mapsLink:
    'https://www.google.com/maps/search/?api=1&query=Mussafah+Industrial+Area+M9%2C+Abu+Dhabi',
  directionsLink:
    'https://www.google.com/maps/dir/?api=1&destination=Mussafah+Industrial+Area+M9%2C+Abu+Dhabi',
  /** Link to the Google Business reviews page. */
  googleReviewsUrl:
    'https://www.google.com/maps/search/?api=1&query=Elite+Motors+Workshop+Mussafah+Abu+Dhabi',

  rating: {
    value: 4.8,
    outOf: 5,
    count: 312,
    platform: 'Google Reviews',
  },

  /** Typical WhatsApp first-reply time shown near CTAs. */
  responseTime: 'Replies within ~5 minutes during working hours',

  nav: [
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Hours & Location', href: '#hours' },
  ] as const satisfies readonly NavLink[],
} as const

export type Workshop = typeof workshop
