import { workshop, type DaySchedule } from '@/config/workshop'
import { reviews } from '@/data/reviews'
import { equipment } from '@/data/gallery'
import { brands, services, type Service } from '@/data/services'
import { stats } from '@/data/stats'
import { formatRange, formatTime, getWorkshopStatus, getZonedNow } from '@/lib/hours'
import { buildTelLink, waLinks } from '@/lib/whatsapp'

/**
 * Rule-based assistant. Every reply is assembled from data that is already on
 * the site — the workshop config, the schedule engine, the service cards and
 * the review excerpts. Questions outside that scope get the landline.
 */

export type LinkKind = 'call' | 'whatsapp' | 'maps' | 'directions' | 'anchor' | 'external'

export interface ReplyLink {
  label: string
  href: string
  kind: LinkKind
}

export interface AssistantReply {
  /** Plain text; line breaks are preserved when rendered. */
  text: string
  links?: ReplyLink[]
  /** Follow-up suggestions shown as chips. */
  suggestions?: string[]
}

type IntentId =
  | 'greeting'
  | 'thanks'
  | 'status'
  | 'hours'
  | 'location'
  | 'phone'
  | 'whatsapp'
  | 'services'
  | 'service'
  | 'bodyshop'
  | 'price'
  | 'reviews'
  | 'booking'
  | 'parts'
  | 'experience'
  | 'facility'
  | 'brands'

interface Intent {
  id: IntentId
  /** Lower-cased substrings or regexes; each hit adds to the score. */
  patterns: readonly (string | RegExp)[]
  /** Extra weight so specific intents beat generic ones on ties. */
  weight?: number
}

/* ── shared links ─────────────────────────────────────────────────────── */

const callLink: ReplyLink = { label: `Call ${workshop.phone}`, href: buildTelLink(workshop.phone), kind: 'call' }
/** Only offered when the visitor asks about WhatsApp or how to get in touch — every other answer points to the landline. */
const whatsappLink: ReplyLink = { label: 'Chat on WhatsApp', href: waLinks.quote(), kind: 'whatsapp' }
const mapsLink: ReplyLink = { label: 'Open in Google Maps', href: workshop.mapsLink, kind: 'maps' }
const directionsLink: ReplyLink = { label: 'Get directions', href: workshop.directionsLink, kind: 'directions' }

/* ── intents ──────────────────────────────────────────────────────────── */

const INTENTS: readonly Intent[] = [
  { id: 'greeting', patterns: [/^(hi|hello|hey|salam|salaam|good (morning|afternoon|evening)|marhaba)\b/] },
  { id: 'thanks', patterns: [/\b(thanks|thank you|thx|shukran|cheers|bye|goodbye)\b/] },
  {
    id: 'status',
    patterns: [
      /\b(open|opened|closed|close|closing)\b.*\b(now|today|currently|right now|at the moment|still|yet)\b/,
      /\b(now|today|currently|right now|at the moment|still)\b.*\b(open|opened|closed|close|closing)\b/,
      /\bare you open\b/,
      /\bstill open\b/,
      /\bopen or closed\b/,
      /^(is it |are you |you )?open$/,
    ],
    weight: 3,
  },
  {
    id: 'hours',
    patterns: [
      'hour',
      'timing',
      'time',
      'schedule',
      'when do you',
      'what time',
      'until',
      'till',
      'break',
      'lunch',
      'weekend',
      'friday',
      'saturday',
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'working day',
      'days open',
      'opening',
      'closing',
    ],
  },
  {
    id: 'location',
    patterns: [
      'where',
      'location',
      'located',
      'address',
      'map',
      'direction',
      'find you',
      'reach you',
      'get to you',
      'mussafah',
      'musaffah',
      'm21',
      'area',
      'near',
      'plus code',
      'pin',
    ],
  },
  {
    id: 'phone',
    patterns: ['phone', 'call', 'number', 'landline', 'contact', 'telephone', 'ring', 'speak to', 'talk to'],
  },
  { id: 'whatsapp', patterns: ['whatsapp', 'whats app', 'chat', 'message', 'text you', 'dm'] },
  {
    id: 'services',
    patterns: [
      'service',
      'what do you do',
      'what do you offer',
      'offer',
      'repair',
      'fix',
      'work on',
      'do you do',
      'can you do',
      'specialis',
      'specializ',
    ],
  },
  {
    id: 'bodyshop',
    patterns: [
      'body',
      'paint',
      'dent',
      'accident',
      'insurance',
      'scratch',
      'collision',
      'bumper',
      'crash',
      'panel',
      'claim',
    ],
    weight: 2,
  },
  {
    id: 'price',
    patterns: ['price', 'cost', 'how much', 'quote', 'estimate', 'rate', 'charge', 'fee', 'aed', 'dirham', 'expensive', 'cheap'],
    weight: 2,
  },
  {
    id: 'reviews',
    patterns: ['review', 'rating', 'rated', 'google', 'trust', 'reliable', 'recommend', 'reputation', 'feedback'],
    weight: 2,
  },
  {
    id: 'booking',
    patterns: ['book', 'appointment', 'reserve', 'slot', 'walk in', 'walk-in', 'come in', 'bring my car', 'drop off', 'visit'],
    weight: 2,
  },
  { id: 'parts', patterns: ['genuine', 'oem', 'original part', 'parts', 'spare'], weight: 2 },
  {
    id: 'facility',
    patterns: ['photo', 'picture', 'gallery', 'facility', 'equipment', 'workshop look', 'inside', 'lift', 'paint booth', 'machines', 'tools', 'how big', 'premises'],
    weight: 1,
  },
  {
    id: 'brands',
    patterns: ['brand', 'make', 'mercedes', 'bmw', 'audi', 'porsche', 'volkswagen', 'toyota', 'lexus', 'honda', 'nissan', 'infiniti', 'mitsubishi', 'hyundai', 'kia', 'patrol', 'land cruiser', 'european', 'japanese', 'korean', 'german'],
    weight: 2,
  },
  { id: 'experience', patterns: ['how long', 'years', 'since', 'experience', 'established', 'old is'], weight: 2 },
]

/** Keywords that identify one specific service card. */
const SERVICE_KEYWORDS: Record<string, readonly (string | RegExp)[]> = {
  engine: ['engine', 'gearbox', 'transmission', 'gear', 'clutch', 'cvt', '4x4', 'drivetrain', 'differential', 'timing', 'head gasket', 'rebuild', 'misfire', 'slipping', 'overhaul'],
  service: ['oil', 'filter', 'fluid', 'periodic', 'maintenance', 'servicing', 'general service', 'minor service', 'major service', 'km service', 'tune up', 'tune-up'],
  ac: [/\bac\b/, 'a/c', 'air con', 'aircon', 'cooling', 'cold air', 'not cold', 'compressor', 'gas refill', 'regas', 'radiator', 'overheat', 'thermostat', 'coolant', 'water pump'],
  brakes: ['brake', 'suspension', 'alignment', 'shock', 'steering', 'wheel', 'tyre', 'tire', 'pulling', 'vibrat', 'noise when braking', 'balancing', 'bearing', 'rotor', 'disc'],
  body: ['dent', 'denting', 'accident', 'body work', 'bodywork', 'bumper', 'panel', 'collision', 'crash', 'chassis', 'frame', 'car-o-liner', 'insurance', 'claim', 'scratch'],
  paint: ['paint', 'painting', 'respray', 'spray', 'colour', 'color', 'clear coat', 'polish', 'booth', 'refinish'],
  electrical: ['electric', 'electrical', 'diagnos', 'check engine', 'engine light', 'warning light', 'scan', 'obd', 'computer', 'sensor', 'fault code', 'battery', 'alternator', 'starter', 'not starting', 'wont start', "won't start", 'wiring', 'x431'],
  detailing: ['detail', 'detailing', 'wash', 'cleaning', 'clean', 'valet', 'interior clean', 'shampoo', 'wax'],
}

/* ── helpers ──────────────────────────────────────────────────────────── */

function normalize(input: string): string {
  return ` ${input.toLowerCase().replace(/[^a-z0-9/\s]/g, ' ').replace(/\s+/g, ' ').trim()} `
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * String keywords match at a word start (so "pin" matches "pin location" but
 * not "slipping"); multi-word phrases match anywhere; regexes are used as-is.
 */
function matches(text: string, pattern: string | RegExp): boolean {
  if (pattern instanceof RegExp) return pattern.test(text.trim())
  if (pattern.includes(' ') || pattern.includes('/')) return text.includes(pattern)
  return new RegExp(`\\b${escapeRegex(pattern)}`).test(text)
}

function score(text: string, patterns: readonly (string | RegExp)[]): number {
  return patterns.reduce((total, pattern) => total + (matches(text, pattern) ? 1 : 0), 0)
}

function findService(text: string): Service | undefined {
  let best: { service: Service; hits: number } | undefined
  for (const service of services) {
    const keywords = SERVICE_KEYWORDS[service.id] ?? []
    const hits = keywords.filter((keyword) => matches(text, keyword)).length
    if (hits > 0 && (!best || hits > best.hits)) best = { service, hits }
  }
  return best?.service
}

/** Groups consecutive days with identical hours ("Monday – Saturday"). */
function describeSchedule(schedule: readonly DaySchedule[]): string[] {
  const lines: string[] = []
  let start = 0
  while (start < schedule.length) {
    let end = start
    const key = JSON.stringify(schedule[start]?.intervals ?? [])
    while (end + 1 < schedule.length && JSON.stringify(schedule[end + 1]?.intervals ?? []) === key) end++
    const first = schedule[start]
    const last = schedule[end]
    if (first && last) {
      const label = start === end ? first.label : `${first.label} – ${last.label}`
      const hours = first.intervals.length ? first.intervals.map(formatRange).join(' · ') : 'Closed'
      lines.push(`${label}: ${hours}`)
    }
    start = end + 1
  }
  return lines
}

function statusLine(): string {
  const now = getZonedNow(workshop.timeZone)
  const status = getWorkshopStatus(workshop.schedule, now)
  return `${status.label} · ${status.detail} (it's ${now.clock} in Abu Dhabi)`
}

function stat(id: string): string | undefined {
  const entry = stats.find((s) => s.id === id)
  return entry ? `${entry.value} ${entry.label}` : undefined
}

/* ── replies ──────────────────────────────────────────────────────────── */

const FALLBACK_TEXT = `I can only help with what's on this website — opening hours, location, services and how to reach the workshop. For anything else, please call the workshop directly on ${workshop.phone} and the team will help.`

export function fallbackReply(): AssistantReply {
  return {
    text: FALLBACK_TEXT,
    links: [callLink],
    suggestions: ['Opening hours', 'Where are you located?', 'What services do you offer?'],
  }
}

function serviceReply(service: Service): AssistantReply {
  return {
    text: `${service.title}\n${service.description}\n\nIncludes: ${service.includes.join(', ')}.\n\nEvery job starts with an estimate before any work begins — call the workshop with your car's make, model and the issue.`,
    links: [callLink, { label: 'See all services', href: '#services', kind: 'anchor' }],
    suggestions: ['What services do you offer?', 'Are you open now?', 'Where are you located?'],
  }
}

const REPLIES: Record<IntentId, () => AssistantReply> = {
  greeting: () => ({
    text: `Hello! Welcome to ${workshop.name}. Ask me about opening hours, our location, services or how to get in touch.`,
    suggestions: ['Are you open now?', 'Opening hours', 'Where are you located?', 'What services do you offer?'],
  }),
  thanks: () => ({
    text: `You're welcome! If you need anything else, the workshop is a call away on ${workshop.phone}.`,
    links: [callLink],
  }),
  status: () => ({
    text: `${statusLine()}\n\nRegular hours:\n${describeSchedule(workshop.schedule).join('\n')}`,
    links: [callLink],
    suggestions: ['Where are you located?', 'What services do you offer?'],
  }),
  hours: () => ({
    text: `Opening hours (Abu Dhabi time):\n${describeSchedule(workshop.schedule).join('\n')}\n${workshop.breakLabel}.\n\nRight now: ${statusLine()}`,
    links: [callLink],
    suggestions: ['Where are you located?', 'How do I contact you?'],
  }),
  location: () => ({
    text: `${workshop.address.line1}\n${workshop.address.line2}\n${workshop.address.city}\n${workshop.address.landmarks}`,
    links: [mapsLink, directionsLink, { label: 'Hours & location section', href: '#location', kind: 'anchor' }],
    suggestions: ['Are you open now?', 'How do I contact you?'],
  }),
  phone: () => ({
    text: `You can call the workshop on ${workshop.phone} (landline, during working hours). Prefer to type? Use the green WhatsApp button at the bottom right of this page.`,
    links: [callLink, whatsappLink],
    suggestions: ['Opening hours', 'Where are you located?'],
  }),
  whatsapp: () => ({
    text: `You can message the workshop on WhatsApp with the green button at the bottom right of this page — send your car's make, model and the issue. ${workshop.responseTime}.`,
    links: [whatsappLink, callLink],
    suggestions: ['What services do you offer?', 'Opening hours'],
  }),
  services: () => ({
    text: `Services at ${workshop.name}:\n${services.map((s) => `• ${s.title}`).join('\n')}\n\nAsk about any of these for details.`,
    links: [{ label: 'See all services', href: '#services', kind: 'anchor' }, callLink],
    suggestions: services.slice(0, 3).map((s) => s.title),
  }),
  service: () => fallbackReply(), // replaced at match time with the specific service
  bodyshop: () => ({
    text: `${workshop.name} is an insurance-approved body shop — accident, body and paint repairs are handled here alongside mechanical work. Call the workshop or bring the car in and the team will assess the damage and guide you through the insurance process.`,
    links: [callLink, directionsLink],
    suggestions: ['Are you open now?', 'Where are you located?'],
  }),
  price: () => ({
    text: `Prices depend on the car and the job, so the workshop gives an estimate before any work starts — no surprises on the invoice. Call the workshop with your car's make, model and the issue for an estimate.`,
    links: [callLink],
    suggestions: ['What services do you offer?', 'Opening hours'],
  }),
  reviews: () => ({
    text: `${workshop.name} has ${workshop.googleReviews.count} reviews on Google. A couple of recent ones:\n${reviews
      .slice(0, 2)
      .map((r) => `“${r.excerpt}” — ${r.name}`)
      .join('\n')}`,
    links: [
      { label: 'Read reviews on Google', href: workshop.googleReviews.url, kind: 'external' },
      { label: 'Reviews section', href: '#reviews', kind: 'anchor' },
    ],
    suggestions: ['What services do you offer?', 'Where are you located?'],
  }),
  booking: () => ({
    text: `There's no online booking — just call the workshop on ${workshop.phone} to arrange a visit, or simply drop in during working hours.\n\nRight now: ${statusLine()}`,
    links: [callLink, directionsLink],
    suggestions: ['Opening hours', 'Where are you located?'],
  }),
  parts: () => ({
    text: `${stat('parts') ?? 'Genuine OEM parts only'} — the workshop fits genuine manufacturer parts. For a specific part or price, call the workshop.`,
    links: [callLink],
  }),
  facility: () => ({
    text: `${workshop.name} is a full mechanical, body and paint facility in Mussafah. Equipment includes:\n${equipment
      .map((e) => `• ${e.title} — ${e.detail}`)
      .join('\n')}\n\nPhotos are in the Workshop section of this site.`,
    links: [{ label: 'See the workshop photos', href: '#workshop', kind: 'anchor' }],
    suggestions: ['What services do you offer?', 'Where are you located?'],
  }),
  brands: () => ({
    text: `The workshop services all major makes:\nEuropean: ${brands.European.join(', ')}\nJapanese: ${brands.Japanese.join(', ')}\nKorean: ${brands.Korean.join(', ')}\n\nNot sure about yours? Call the workshop.`,
    links: [callLink],
    suggestions: ['What services do you offer?', 'Are you open now?'],
  }),
  experience: () => ({
    text: `${workshop.name} has been in Mussafah since ${workshop.foundedYear} — ${new Date().getFullYear() - workshop.foundedYear}+ years of all-makes repairs, with a team supervised by a U.S.-certified auto engineer and an insurance-approved body & paint shop.`,
    links: [{ label: 'About the workshop', href: '#about', kind: 'anchor' }],
    suggestions: ['What services do you offer?', 'Reviews'],
  }),
}

/** "open on friday?" → that day's hours first, then the full schedule. */
function dayReply(text: string): AssistantReply | undefined {
  const day = workshop.schedule.find((d) => new RegExp(`\\b${d.label.toLowerCase()}`).test(text))
  if (!day) return undefined
  const hours = day.intervals.length ? day.intervals.map(formatRange).join(' · ') : 'Closed all day'
  const base = REPLIES.hours()
  return { ...base, text: `${day.label}: ${hours}\n\n${base.text}` }
}

/** Answers a visitor's question from site data, or hands off to the landline. */
export function answerQuestion(question: string): AssistantReply {
  const text = normalize(question)
  if (text.trim().length === 0) return fallbackReply()

  // A specific service mention wins over everything except explicit price/body/booking questions.
  const service = findService(text)

  let best: { id: IntentId; score: number } | undefined
  for (const intent of INTENTS) {
    const hits = score(text, intent.patterns)
    if (hits === 0) continue
    const total = hits + (intent.weight ?? 0)
    if (!best || total > best.score) best = { id: intent.id, score: total }
  }

  if (service && (!best || !['price', 'booking', 'status', 'hours', 'location', 'phone'].includes(best.id))) {
    return serviceReply(service)
  }
  if (best?.id === 'hours' || best?.id === 'status') {
    const reply = dayReply(text) ?? REPLIES[best.id]()
    // "where are you and when do you close?" — answer both halves.
    const asksLocation = score(text, INTENTS.find((i) => i.id === 'location')?.patterns ?? []) > 0
    if (!asksLocation) return reply
    const location = REPLIES.location()
    return {
      text: `${reply.text}\n\nFind us at:\n${location.text}`,
      links: [...(location.links ?? []), ...(reply.links ?? [])],
      suggestions: reply.suggestions,
    }
  }
  if (best) return REPLIES[best.id]()
  return fallbackReply()
}

/** First message when the panel opens, including the live status for context. */
export function openingStatus(): string {
  return statusLine()
}

export { formatTime }
