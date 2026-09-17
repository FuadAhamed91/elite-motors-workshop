/**
 * ─────────────────────────────────────────────────────────────────────
 *  Elite Motors Workshop — business configuration
 *  Single source of truth for every name, number, address and opening
 *  time rendered on the page. Every section, CTA, WhatsApp link, the
 *  live status badge and the SEO schema read from this file.
 *
 *  Location, map links and review data follow the workshop's Google
 *  Business listing ("Elite Motors Workshop", Musaffah M21, Abu Dhabi).
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

/** Monday – Saturday: morning shift, one-hour lunch break, afternoon shift. */
const STANDARD_DAY: readonly TimeRange[] = [
  { open: '08:00', close: '13:00' },
  { open: '14:00', close: '17:30' },
]

/** Google Maps pin for the workshop (Musaffah M21). */
const GEO = { lat: 24.3772101, lng: 54.4746864 } as const

/** Google Maps customer id of the listing — opens the exact business card. */
const GOOGLE_CID = '3957074303703546179'

export const workshop = {
  name: 'Elite Motors Workshop',
  legalName: 'Elite Motors Workshop L.L.C',
  shortName: 'Elite Motors',
  /** Used in the navbar title and SEO title. */
  displayTitle: 'Elite Motors Workshop Abu Dhabi',
  tagline: 'Precision Auto Care & Mechanical Excellence in Abu Dhabi',
  city: 'Mussafah, Abu Dhabi, UAE',
  timeZone: 'Asia/Dubai',

  /**
   * WhatsApp is for chat only — the number is never displayed as a phone number.
   * The link builder strips spaces/plus signs → https://wa.me/971565017797?text=...
   */
  whatsappNumber: '+971 56 501 7797',
  /** Landline — the only number shown on the page and used by every "Call" button. */
  phone: '+971 2 558 3441',

  /** Human-readable summary used in the footer and SEO schema. */
  hoursSummary: 'Monday – Saturday: 8:00 AM – 1:00 PM & 2:00 PM – 5:30 PM | Sunday: Closed',

  /** Structured schedule driving the live status badge and the hours card. */
  schedule: [
    { day: 'monday', label: 'Monday', short: 'Mon', intervals: STANDARD_DAY },
    { day: 'tuesday', label: 'Tuesday', short: 'Tue', intervals: STANDARD_DAY },
    { day: 'wednesday', label: 'Wednesday', short: 'Wed', intervals: STANDARD_DAY },
    { day: 'thursday', label: 'Thursday', short: 'Thu', intervals: STANDARD_DAY },
    { day: 'friday', label: 'Friday', short: 'Fri', intervals: STANDARD_DAY },
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
  breakLabel: '1:00 PM – 2:00 PM lunch break',

  address: {
    line1: 'Elite Motors Workshop L.L.C',
    line2: 'Musaffah M21, Mussafah Industrial Area',
    city: 'Abu Dhabi, United Arab Emirates',
    /** Google plus code — the quickest way to share the exact pin. */
    landmarks: 'Plus code 9FGF+VV · Abu Dhabi',
    geo: GEO,
  },

  /** Map embed centred on the Google pin — no API key required. */
  mapEmbedUrl: `https://maps.google.com/maps?q=Elite%20Motors%20Workshop%2C%20Musaffah%20M21%2C%20Abu%20Dhabi&ll=${GEO.lat}%2C${GEO.lng}&z=16&ie=UTF8&output=embed`,
  /** Opens the exact Google Business listing. */
  mapsLink: `https://maps.google.com/?cid=${GOOGLE_CID}`,
  directionsLink: `https://www.google.com/maps/dir/?api=1&destination=${GEO.lat}%2C${GEO.lng}`,

  /**
   * Google reviews — the page shows short excerpts of the top reviews and links
   * here so visitors can read them in full. The overall star rating is
   * intentionally not displayed.
   */
  googleReviews: {
    count: 283,
    url: 'https://www.google.com/maps/place/Elite+Motors+Workshop/@24.3772101,54.4746864,17z/data=!4m8!3m7!1s0x3e5e41c28360946d:0x36ea5a1d1e137943!8m2!3d24.3772101!4d54.4746864!9m1!1b1!16s%2Fg%2F11h_bqg108',
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
