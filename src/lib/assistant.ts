import { workshop, type DaySchedule } from '@/config/workshop'
import { equipment } from '@/data/gallery'
import { reviews } from '@/data/reviews'
import { insurers } from '@/data/insurers'
import { brands, services, type Service } from '@/data/services'
import { hoursStrings, type Dictionary, type Locale } from '@/i18n'
import { ar } from '@/i18n/ar'
import { en } from '@/i18n/en'
import { formatRange, formatTime, getWorkshopStatus, getZonedNow, type HoursStrings } from '@/lib/hours'
import { buildTelLink, waLinks } from '@/lib/whatsapp'

/**
 * Rule-based assistant, in English and Arabic. Every reply is assembled from
 * data that is already on the site — the workshop config, the schedule
 * engine, the service cards and the review excerpts. Questions outside that
 * scope get the landline. The language of the answer follows the language of
 * the question (Arabic script → Arabic), falling back to the UI language.
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
  /** Language of the reply (drives text direction in the chat log). */
  locale: Locale
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
  | 'insurance'
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

/* ── English intents ─────────────────────────────────────────────────── */

const INTENTS_EN: readonly Intent[] = [
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
    patterns: ['hour', 'timing', 'time', 'schedule', 'when do you', 'what time', 'until', 'till', 'break', 'lunch', 'weekend', 'friday', 'saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'working day', 'days open', 'opening', 'closing'],
  },
  {
    id: 'location',
    patterns: ['where', 'location', 'located', 'address', 'map', 'direction', 'find you', 'reach you', 'get to you', 'mussafah', 'musaffah', 'm21', 'area', 'near', 'plus code', 'pin'],
  },
  { id: 'phone', patterns: ['phone', 'call', 'number', 'landline', 'contact', 'telephone', 'ring', 'speak to', 'talk to'] },
  { id: 'whatsapp', patterns: ['whatsapp', 'whats app', 'chat', 'message', 'text you', 'dm'] },
  {
    id: 'services',
    patterns: ['service', 'what do you do', 'what do you offer', 'offer', 'repair', 'fix', 'work on', 'do you do', 'can you do', 'specialis', 'specializ'],
  },
  { id: 'bodyshop', patterns: ['body', 'paint', 'dent', 'accident', 'scratch', 'collision', 'bumper', 'crash', 'panel'], weight: 2 },
  {
    id: 'insurance',
    patterns: ['insurance', 'insurer', 'insured', 'claim', 'policy', 'takaful', 'excess', 'deductible', 'approved', 'sukoon', 'adamjee', 'fidelity', 'watania', 'noor', 'tokio', 'qic', 'qatar insurance', 'dubai insurance', 'dubai national', 'dni', 'oman insurance', 'company car', 'trade licen'],
    weight: 3,
  },
  { id: 'price', patterns: ['price', 'cost', 'how much', 'quote', 'estimate', 'rate', 'charge', 'fee', 'aed', 'dirham', 'expensive', 'cheap'], weight: 2 },
  { id: 'reviews', patterns: ['review', 'rating', 'rated', 'google', 'trust', 'reliable', 'recommend', 'reputation', 'feedback'], weight: 2 },
  { id: 'booking', patterns: ['book', 'appointment', 'reserve', 'slot', 'walk in', 'walk-in', 'come in', 'bring my car', 'drop off', 'visit'], weight: 2 },
  { id: 'parts', patterns: ['genuine', 'oem', 'original part', 'parts', 'spare'], weight: 2 },
  { id: 'facility', patterns: ['photo', 'picture', 'gallery', 'facility', 'equipment', 'workshop look', 'inside', 'lift', 'paint booth', 'machines', 'tools', 'how big', 'premises'], weight: 1 },
  {
    id: 'brands',
    patterns: ['brand', 'make', 'mercedes', 'bmw', 'audi', 'porsche', 'volkswagen', 'toyota', 'lexus', 'honda', 'nissan', 'infiniti', 'mitsubishi', 'hyundai', 'kia', 'patrol', 'land cruiser', 'european', 'japanese', 'korean', 'german'],
    weight: 2,
  },
  { id: 'experience', patterns: ['how long', 'years', 'since', 'experience', 'established', 'old is'], weight: 2 },
]

/** Keywords that identify one specific service card (English). */
const SERVICE_KEYWORDS_EN: Record<string, readonly (string | RegExp)[]> = {
  engine: ['engine', 'gearbox', 'transmission', 'gear', 'clutch', 'cvt', '4x4', 'drivetrain', 'differential', 'timing', 'head gasket', 'rebuild', 'misfire', 'slipping', 'overhaul'],
  service: ['oil', 'filter', 'fluid', 'periodic', 'maintenance', 'servicing', 'general service', 'minor service', 'major service', 'km service', 'tune up', 'tune-up'],
  ac: [/\bac\b/, 'a/c', 'air con', 'aircon', 'cooling', 'cold air', 'not cold', 'compressor', 'gas refill', 'regas', 'radiator', 'overheat', 'thermostat', 'coolant', 'water pump'],
  brakes: ['brake', 'suspension', 'alignment', 'shock', 'steering', 'wheel', 'tyre', 'tire', 'pulling', 'vibrat', 'noise when braking', 'balancing', 'bearing', 'rotor', 'disc'],
  body: ['dent', 'denting', 'accident', 'body work', 'bodywork', 'bumper', 'panel', 'collision', 'crash', 'chassis', 'frame', 'car-o-liner', 'insurance', 'claim', 'scratch'],
  paint: ['paint', 'painting', 'respray', 'spray', 'colour', 'color', 'clear coat', 'polish', 'booth', 'refinish'],
  electrical: ['electric', 'electrical', 'diagnos', 'check engine', 'engine light', 'warning light', 'scan', 'obd', 'computer', 'sensor', 'fault code', 'battery', 'alternator', 'starter', 'not starting', 'wont start', "won't start", 'wiring', 'x431'],
  detailing: ['detail', 'detailing', 'wash', 'cleaning', 'clean', 'valet', 'interior clean', 'shampoo', 'wax'],
}

/* ── Arabic intents (patterns are written in normalised form: no hamza on alef, no tashkeel, ة→ه) ── */

const INTENTS_AR: readonly Intent[] = [
  { id: 'greeting', patterns: [/^(هلا|مرحبا|اهلا|السلام|سلام|صباح|مساء|هاي|يا هلا)/] },
  { id: 'thanks', patterns: ['شكرا', 'مشكور', 'تسلم', 'يعطيك العافيه', 'باي', 'مع السلامه', 'الله يعطيك'] },
  {
    id: 'status',
    patterns: [
      /(مفتوح|فاتح|مغلق|مسكر|مقفل|شغال|مفتوحين|فاتحين|مسكرين).*(الحين|الان|اليوم|حاليا|هالحين|توا)/,
      /(الحين|الان|اليوم|حاليا|هالحين|توا).*(مفتوح|فاتح|مغلق|مسكر|مقفل|شغال|مفتوحين|فاتحين)/,
      'فاتحين',
      'مفتوحين',
      'شغالين',
      'مسكرين',
    ],
    weight: 3,
  },
  {
    id: 'hours',
    patterns: ['ساعات', 'اوقات', 'وقت', 'دوام', 'متى', 'الساعه كم', 'تفتح', 'تغلق', 'تسكر', 'استراحه', 'غداء', 'الجمعه', 'السبت', 'الاحد', 'الاثنين', 'الثلاثاء', 'الاربعاء', 'الخميس', 'ايام', 'عطله', 'نهايه الاسبوع', 'ويكند'],
  },
  {
    id: 'location',
    patterns: ['وين', 'اين', 'موقع', 'عنوان', 'مكان', 'خريطه', 'اتجاه', 'طريق', 'اوصل', 'مصفح', 'المصفح', 'm21', 'قريب', 'منطقه', 'لوكيشن', 'بلس كود'],
  },
  { id: 'phone', patterns: ['رقم', 'هاتف', 'تلفون', 'اتصل', 'اتصال', 'تواصل', 'اكلم', 'اتكلم', 'خط ارضي', 'موبايل', 'اتواصل'] },
  { id: 'whatsapp', patterns: ['واتس', 'رساله', 'راسل', 'مسج', 'دردشه', 'شات', 'اراسل'] },
  {
    id: 'services',
    patterns: ['خدمات', 'خدمه', 'تصلحون', 'تسوون', 'شو تسوون', 'ايش تسوون', 'وش تسوون', 'تشتغلون', 'اصلاح', 'تصليح', 'تخصص', 'شغل'],
  },
  { id: 'bodyshop', patterns: ['سمكره', 'صبغ', 'دهان', 'حادث', 'حوادث', 'خدش', 'صدمه', 'بودي', 'صدام'], weight: 2 },
  {
    id: 'insurance',
    patterns: ['تامين', 'مطالبه', 'بوليصه', 'وثيقه', 'تكافل', 'معتمد', 'معتمدين', 'تحمل', 'سكون', 'ادمجي', 'آدمجي', 'فيدلتي', 'وطنيه', 'نور', 'طوكيو', 'قطر للتامين', 'دبي للتامين', 'دبي الوطنيه', 'شركه التامين', 'شركات التامين', 'سياره شركه', 'رخصه تجاريه'],
    weight: 3,
  },
  { id: 'price', patterns: ['سعر', 'اسعار', 'بكم', 'كم يكلف', 'تكلفه', 'تسعيره', 'عرض سعر', 'تقدير', 'درهم', 'غالي', 'رخيص', 'رسوم', 'كم تاخذون'], weight: 2 },
  { id: 'reviews', patterns: ['تقييم', 'تقييمات', 'مراجعات', 'جوجل', 'قوقل', 'راي', 'اراء', 'ثقه', 'انصح', 'توصيه', 'سمعه', 'ممتازين'], weight: 2 },
  { id: 'booking', patterns: ['حجز', 'احجز', 'موعد', 'اجي', 'اجيكم', 'اجيب السياره', 'ازوركم', 'زياره', 'اروح لكم', 'اخذ موعد'], weight: 2 },
  { id: 'parts', patterns: ['قطع', 'قطعه', 'غيار', 'اصلي', 'اصليه', 'وكاله'], weight: 2 },
  { id: 'facility', patterns: ['صور', 'صوره', 'معرض', 'معدات', 'اجهزه', 'من داخل', 'رافعه', 'غرفه الصبغ', 'مكائن', 'الورشه كبيره', 'حجم الورشه'], weight: 1 },
  {
    id: 'brands',
    patterns: ['ماركه', 'ماركات', 'مرسيدس', 'بي ام', 'اودي', 'بورش', 'فولكس', 'تويوتا', 'لكزس', 'هوندا', 'نيسان', 'انفينيتي', 'ميتسوبيشي', 'هيونداي', 'كيا', 'باترول', 'لاندكروزر', 'لاند كروزر', 'اوروبي', 'ياباني', 'كوري', 'الماني', 'نوع السياره', 'تشتغلون على'],
    weight: 2,
  },
  { id: 'experience', patterns: ['منذ متى', 'كم سنه', 'خبره', 'سنوات', 'تاسست', 'من متى', 'قديمه', 'كم لكم'], weight: 2 },
]

const SERVICE_KEYWORDS_AR: Record<string, readonly (string | RegExp)[]> = {
  engine: ['محرك', 'مكينه', 'ماكينه', 'انجن', 'جير', 'قير', 'ناقل الحركه', 'كلتش', 'دبرياج', 'تايمنج', 'جوان', 'عمره كامله', 'تفويت', 'يفوت', 'يزحف'],
  service: ['زيت', 'فلتر', 'صيانه دوريه', 'صيانه', 'سيرفس', 'تغيير زيت', 'خدمه دوريه'],
  ac: ['مكيف', 'تكييف', 'ايسي', 'ايه سي', 'تبريد', 'ما يبرد', 'مايبرد', 'كمبروسر', 'غاز', 'فريون', 'رديتر', 'راديتر', 'حراره', 'يسخن', 'ثرموستات', 'مضخه'],
  brakes: ['فرامل', 'بريك', 'فحمات', 'مساعدات', 'تعليق', 'ميزان', 'ترصيص', 'دركسون', 'ستيرنج', 'تاير', 'تواير', 'اطار', 'اهتزاز', 'رجه', 'رمان بلي'],
  body: ['سمكره', 'سمكري', 'صدمه', 'حادث', 'بودي', 'صدام', 'لوح', 'شاصي', 'تامين', 'خدش', 'خدوش', 'تعديل'],
  paint: ['صبغ', 'صباغ', 'دهان', 'بويه', 'رش السياره', 'تغيير لون', 'لون السياره', 'كلير', 'غرفه صبغ'],
  electrical: ['كهرباء', 'كهربائي', 'كمبيوتر', 'لمبه', 'شيك انجن', 'تحذير', 'سكان', 'حساس', 'بطاريه', 'دينمو', 'سلف', 'ما تشتغل', 'ماتشتغل', 'ما تدور', 'اسلاك', 'obd', 'فحص'],
  detailing: ['تنظيف', 'غسيل', 'تلميع', 'بوليش', 'ديتيلنج', 'نظافه', 'شامبو', 'واكس', 'غسل'],
}

/* ── reply copy per language ─────────────────────────────────────────── */

interface AssistantStrings {
  links: {
    call: (phone: string) => string
    whatsapp: string
    maps: string
    directions: string
    hoursSection: string
    servicesSection: string
    reviewsSection: string
    aboutSection: string
    workshopSection: string
    insuranceSection: string
    readReviews: string
  }
  suggestions: {
    hours: string
    status: string
    location: string
    services: string
    contact: string
    reviews: string
  }
  closed: string
  closedAllDay: string
  nowLine: (label: string, detail: string, clock: string) => string
  dayRange: (first: string, last: string) => string
  findUsAt: string
  fallback: (phone: string) => string
  greeting: (name: string) => string
  thanks: (phone: string) => string
  status: (now: string, schedule: string[]) => string
  hours: (schedule: string[], breakLabel: string, now: string) => string
  location: (line1: string, line2: string, city: string, landmarks: string) => string
  phone: (phone: string) => string
  whatsapp: (responseTime: string) => string
  services: (name: string, list: string[]) => string
  service: (title: string, description: string, includes: string[]) => string
  bodyshop: (name: string) => string
  insurance: (name: string, list: string[], phone: string) => string
  price: string
  reviews: (name: string, count: number, quotes: string[]) => string
  booking: (phone: string, now: string) => string
  parts: string
  facility: (name: string, lines: string[]) => string
  brands: (eu: string, jp: string, kr: string) => string
  experience: (name: string, year: number, years: number) => string
}

const STRINGS: Record<Locale, AssistantStrings> = {
  en: {
    links: {
      call: (phone) => `Call ${phone}`,
      whatsapp: 'Chat on WhatsApp',
      maps: 'Open in Google Maps',
      directions: 'Get directions',
      hoursSection: 'Hours & location section',
      servicesSection: 'See all services',
      reviewsSection: 'Reviews section',
      aboutSection: 'About the workshop',
      workshopSection: 'See the workshop photos',
      insuranceSection: 'Insurance claims page',
      readReviews: 'Read reviews on Google',
    },
    suggestions: {
      hours: 'Opening hours',
      status: 'Are you open now?',
      location: 'Where are you located?',
      services: 'What services do you offer?',
      contact: 'How do I contact you?',
      reviews: 'Reviews',
    },
    closed: 'Closed',
    closedAllDay: 'Closed all day',
    nowLine: (label, detail, clock) => `${label} · ${detail} (it's ${clock} in Abu Dhabi)`,
    dayRange: (first, last) => `${first} – ${last}`,
    findUsAt: 'Find us at:',
    fallback: (phone) =>
      `I can only help with what's on this website — opening hours, location, services and how to reach the workshop. For anything else, please call the workshop directly on ${phone} and the team will help.`,
    greeting: (name) => `Hello! Welcome to ${name}. Ask me about opening hours, our location, services or how to get in touch.`,
    thanks: (phone) => `You're welcome! If you need anything else, the workshop is a call away on ${phone}.`,
    status: (now, schedule) => `${now}\n\nRegular hours:\n${schedule.join('\n')}`,
    hours: (schedule, breakLabel, now) => `Opening hours (Abu Dhabi time):\n${schedule.join('\n')}\n${breakLabel}.\n\nRight now: ${now}`,
    location: (line1, line2, city, landmarks) => `${line1}\n${line2}\n${city}\n${landmarks}`,
    phone: (phone) => `You can call the workshop on ${phone} (landline, during working hours). Prefer to type? Use the green WhatsApp button at the bottom of this page.`,
    whatsapp: (responseTime) => `You can message the workshop on WhatsApp with the green button at the bottom of this page — send your car's make, model and the issue. ${responseTime}.`,
    services: (name, list) => `Services at ${name}:\n${list.map((s) => `• ${s}`).join('\n')}\n\nAsk about any of these for details.`,
    service: (title, description, includes) =>
      `${title}\n${description}\n\nIncludes: ${includes.join(', ')}.\n\nEvery job starts with an estimate before any work begins — call the workshop with your car's make, model and the issue.`,
    bodyshop: (name) =>
      `${name} is an insurance-approved body shop — accident, body and paint repairs are handled here alongside mechanical work. Call the workshop or bring the car in and the team will assess the damage and guide you through the insurance process.`,
    insurance: (name, list, phone) =>
      `${name} is an approved repairer for:\n${list.map((l) => `• ${l}`).join('\n')}\n\nBring the police report, the registration card, your insurance policy, and the Emirates ID and driving licence of both the driver and the car's owner (for a company car, add the company's trade licence). We prepare the estimate and photos, the insurer's surveyor inspects the car here, and after approval you pay only your policy excess. Insured with another company? Call ${phone} and we'll check with them.`,
    price: `Prices depend on the car and the job, so the workshop gives an estimate before any work starts — no surprises on the invoice. Call the workshop with your car's make, model and the issue for an estimate.`,
    reviews: (name, count, quotes) => `${name} has ${count} reviews on Google. A couple of recent ones:\n${quotes.join('\n')}`,
    booking: (phone, now) => `There's no online booking — just call the workshop on ${phone} to arrange a visit, or simply drop in during working hours.\n\nRight now: ${now}`,
    parts: 'Genuine OEM parts only — the workshop fits genuine manufacturer parts. For a specific part or price, call the workshop.',
    facility: (name, lines) =>
      `${name} is a full mechanical, body and paint facility in Mussafah. Equipment includes:\n${lines.map((l) => `• ${l}`).join('\n')}\n\nPhotos are in the Gallery in the Workshop section of this site.`,
    brands: (eu, jp, kr) => `The workshop services all major makes:\nEuropean: ${eu}\nJapanese: ${jp}\nKorean: ${kr}\n\nNot sure about yours? Call the workshop.`,
    experience: (name, year, years) =>
      `${name} has been in Mussafah since ${year} — ${years}+ years of all-makes repairs, with trained technicians and an insurance-approved body & paint shop.`,
  },
  ar: {
    links: {
      call: (phone) => `اتصل على ${ltr(phone)}`,
      whatsapp: 'تحدث على واتساب',
      maps: 'افتح في خرائط جوجل',
      directions: 'الاتجاهات',
      hoursSection: 'قسم ساعات العمل والموقع',
      servicesSection: 'عرض كل الخدمات',
      reviewsSection: 'قسم التقييمات',
      aboutSection: 'عن الورشة',
      workshopSection: 'صور الورشة',
      insuranceSection: 'صفحة مطالبات التأمين',
      readReviews: 'اقرأ التقييمات على جوجل',
    },
    suggestions: {
      hours: 'ساعات العمل',
      status: 'هل أنتم مفتوحون الآن؟',
      location: 'أين موقعكم؟',
      services: 'ما هي خدماتكم؟',
      contact: 'كيف أتواصل معكم؟',
      reviews: 'التقييمات',
    },
    closed: 'مغلق',
    closedAllDay: 'مغلق طوال اليوم',
    nowLine: (label, detail, clock) => `${label} · ${detail} (الساعة الآن ${clock} في أبوظبي)`,
    dayRange: (first, last) => `${first} – ${last}`,
    findUsAt: 'تجدنا في:',
    fallback: (phone) =>
      `أستطيع المساعدة فقط فيما يخص معلومات هذا الموقع — ساعات العمل، الموقع، الخدمات وطرق التواصل مع الورشة. لأي استفسار آخر، يرجى الاتصال بالورشة مباشرة على ${ltr(phone)} وسيساعدك الفريق.`,
    greeting: (name) => `أهلاً بك في ${name}! اسألني عن ساعات العمل أو موقعنا أو خدماتنا أو طرق التواصل.`,
    thanks: (phone) => `على الرحب والسعة! إذا احتجت أي شيء آخر، الورشة على بُعد اتصال على ${ltr(phone)}.`,
    status: (now, schedule) => `${now}\n\nساعات العمل المعتادة:\n${schedule.join('\n')}`,
    hours: (schedule, breakLabel, now) => `ساعات العمل (بتوقيت أبوظبي):\n${schedule.join('\n')}\n${breakLabel}.\n\nالآن: ${now}`,
    location: (line1, line2, city, landmarks) => `${line1}\n${line2}\n${city}\n${landmarks}`,
    phone: (phone) => `يمكنك الاتصال بالورشة على ${ltr(phone)} (خط أرضي، خلال ساعات العمل). تفضّل الكتابة؟ استخدم زر واتساب الأخضر أسفل الصفحة.`,
    whatsapp: (responseTime) => `يمكنك مراسلة الورشة على واتساب عبر الزر الأخضر أسفل الصفحة — أرسل نوع السيارة والموديل والمشكلة. ${responseTime}.`,
    services: (name, list) => `خدمات ${name}:\n${list.map((s) => `• ${s}`).join('\n')}\n\nاسأل عن أي منها لمعرفة التفاصيل.`,
    service: (title, description, includes) =>
      `${title}\n${description}\n\nتشمل: ${includes.join('، ')}.\n\nكل عمل يبدأ بتقدير للتكلفة قبل البدء — اتصل بالورشة مع ذكر نوع السيارة والموديل والمشكلة.`,
    bodyshop: (name) =>
      `${name} ورشة سمكرة معتمدة لدى شركات التأمين — إصلاح الحوادث والسمكرة والصبغ تتم هنا إلى جانب الأعمال الميكانيكية. اتصل بالورشة أو أحضر السيارة وسيقيّم الفريق الضرر ويرشدك في إجراءات التأمين.`,
    insurance: (name, list, phone) =>
      `${name} ورشة معتمدة لدى:\n${list.map((l) => `• ${l}`).join('\n')}\n\nأحضر تقرير الشرطة وملكية السيارة ووثيقة التأمين، والهوية الإماراتية ورخصة القيادة لكلٍّ من السائق ومالك السيارة (ولسيارة الشركة أضف الرخصة التجارية). نجهّز التقدير والصور، ويعاين خبير شركة التأمين السيارة عندنا، وبعد الموافقة تدفع فقط مبلغ التحمّل. مؤمَّن لدى شركة أخرى؟ اتصل على ${ltr(phone)} ونتأكد منها.`,
    price: 'تعتمد الأسعار على السيارة ونوع العمل، لذلك تقدّم الورشة تقديراً للتكلفة قبل بدء أي عمل — بلا مفاجآت في الفاتورة. اتصل بالورشة مع ذكر نوع السيارة والموديل والمشكلة للحصول على تقدير.',
    reviews: (name, count, quotes) => `لدى ${name} ${count} تقييماً على جوجل. بعض التقييمات الأخيرة (بالإنجليزية):\n${quotes.join('\n')}`,
    booking: (phone, now) => `لا يوجد حجز إلكتروني — اتصل بالورشة على ${ltr(phone)} لترتيب زيارتك، أو تفضّل بالحضور مباشرة خلال ساعات العمل.\n\nالآن: ${now}`,
    parts: 'قطع غيار أصلية فقط — تركّب الورشة قطع الغيار الأصلية من الشركة المصنّعة. لقطعة أو سعر محدد، اتصل بالورشة.',
    facility: (name, lines) =>
      `${name} منشأة متكاملة للميكانيكا والسمكرة والصبغ في المصفح. من المعدات:\n${lines.map((l) => `• ${l}`).join('\n')}\n\nالصور في معرض الصور ضمن قسم الورشة في هذا الموقع.`,
    brands: (eu, jp, kr) => `تخدم الورشة جميع الماركات الرئيسية:\nأوروبية: ${eu}\nيابانية: ${jp}\nكورية: ${kr}\n\nغير متأكد من سيارتك؟ اتصل بالورشة.`,
    experience: (name, year, years) =>
      `${name} في المصفح منذ ${year} — أكثر من ${years} سنوات من إصلاح جميع الماركات، بفنيين مدرّبين وورشة سمكرة وصبغ معتمدة لدى شركات التأمين.`,
  },
}

/* ── helpers ──────────────────────────────────────────────────────────── */

const ARABIC = /[؀-ۿ]/
/** Left-to-right isolate for phone numbers inside Arabic sentences. */
const ltr = (value: string) => `\u2066${value}\u2069`

/** Language of a question: Arabic script wins, then Latin letters, then the UI language. */
export function questionLocale(question: string, fallback: Locale): Locale {
  if (ARABIC.test(question)) return 'ar'
  if (/[a-z]/i.test(question)) return 'en'
  return fallback
}

function normalizeEn(input: string): string {
  return ` ${input.toLowerCase().replace(/[^a-z0-9/\s]/g, ' ').replace(/\s+/g, ' ').trim()} `
}

/** Strips tashkeel, unifies alef/yaa/taa-marbuta variants and drops punctuation. */
function normalizeAr(input: string): string {
  return ` ${input
    .toLowerCase()
    .replace(/[ً-ْـ]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^؀-ۿa-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()} `
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * English keywords match at a word start (so "pin" matches "pin location" but
 * not "slipping"); multi-word phrases match anywhere; regexes are used as-is.
 * Arabic keywords match anywhere — prefixes such as ال، و، ب are attached to
 * the word, so a word-boundary test would miss "والمكيف".
 */
function matches(text: string, pattern: string | RegExp, locale: Locale): boolean {
  if (pattern instanceof RegExp) return pattern.test(text.trim())
  if (locale === 'ar' || pattern.includes(' ') || pattern.includes('/')) return text.includes(pattern)
  return new RegExp(`\\b${escapeRegex(pattern)}`).test(text)
}

function score(text: string, patterns: readonly (string | RegExp)[], locale: Locale): number {
  return patterns.reduce((total, pattern) => total + (matches(text, pattern, locale) ? 1 : 0), 0)
}

function findService(text: string, locale: Locale): Service | undefined {
  const keywords = locale === 'ar' ? SERVICE_KEYWORDS_AR : SERVICE_KEYWORDS_EN
  let best: { service: Service; hits: number } | undefined
  for (const service of services) {
    const hits = (keywords[service.id] ?? []).filter((keyword) => matches(text, keyword, locale)).length
    if (hits > 0 && (!best || hits > best.hits)) best = { service, hits }
  }
  return best?.service
}

/** Groups consecutive days with identical hours ("Monday – Saturday"). */
function describeSchedule(schedule: readonly DaySchedule[], t: Dictionary, hours: HoursStrings, s: AssistantStrings): string[] {
  const lines: string[] = []
  let start = 0
  while (start < schedule.length) {
    let end = start
    const key = JSON.stringify(schedule[start]?.intervals ?? [])
    while (end + 1 < schedule.length && JSON.stringify(schedule[end + 1]?.intervals ?? []) === key) end++
    const first = schedule[start]
    const last = schedule[end]
    if (first && last) {
      const label = start === end ? t.days[first.day].label : s.dayRange(t.days[first.day].label, t.days[last.day].label)
      const ranges = first.intervals.length ? first.intervals.map((range) => formatRange(range, hours)).join(' · ') : s.closed
      lines.push(`${label}: ${ranges}`)
    }
    start = end + 1
  }
  return lines
}

function statusLine(hours: HoursStrings, s: AssistantStrings): string {
  const now = getZonedNow(workshop.timeZone, new Date(), hours)
  const status = getWorkshopStatus(workshop.schedule, now, hours)
  return s.nowLine(status.label, status.detail, now.clock)
}

/* ── replies ──────────────────────────────────────────────────────────── */

interface ReplyContext {
  locale: Locale
  t: Dictionary
  s: AssistantStrings
  hours: HoursStrings
}

function links(ctx: ReplyContext) {
  const { s } = ctx
  return {
    call: { label: s.links.call(workshop.phone), href: buildTelLink(workshop.phone), kind: 'call' } as ReplyLink,
    whatsapp: { label: s.links.whatsapp, href: waLinks.quote(), kind: 'whatsapp' } as ReplyLink,
    maps: { label: s.links.maps, href: workshop.mapsLink, kind: 'maps' } as ReplyLink,
    directions: { label: s.links.directions, href: workshop.directionsLink, kind: 'directions' } as ReplyLink,
    anchor: (label: string, href: string): ReplyLink => ({ label, href, kind: 'anchor' }),
  }
}

function fallbackReply(ctx: ReplyContext): AssistantReply {
  const { s, locale } = ctx
  const L = links(ctx)
  return {
    text: s.fallback(workshop.phone),
    links: [L.call],
    suggestions: [s.suggestions.hours, s.suggestions.location, s.suggestions.services],
    locale,
  }
}

function serviceReply(service: Service, ctx: ReplyContext): AssistantReply {
  const { t, s, locale } = ctx
  const L = links(ctx)
  const copy = t.services.items[service.id] ?? { title: service.title, description: service.description, includes: [...service.includes] }
  return {
    text: s.service(copy.title, copy.description, copy.includes),
    links: [L.call, L.anchor(s.links.servicesSection, '#services')],
    suggestions: [s.suggestions.services, s.suggestions.status, s.suggestions.location],
    locale,
  }
}

function buildReply(id: IntentId, ctx: ReplyContext): AssistantReply {
  const { t, s, hours, locale } = ctx
  const L = links(ctx)
  const name = t.brand.name
  const schedule = () => describeSchedule(workshop.schedule, t, hours, s)
  const now = () => statusLine(hours, s)
  const sg = s.suggestions
  const serviceTitle = (service: Service) => t.services.items[service.id]?.title ?? service.title

  switch (id) {
    case 'greeting':
      return { text: s.greeting(name), suggestions: [sg.status, sg.hours, sg.location, sg.services], locale }
    case 'thanks':
      return { text: s.thanks(workshop.phone), links: [L.call], locale }
    case 'status':
      return { text: s.status(now(), schedule()), links: [L.call], suggestions: [sg.location, sg.services], locale }
    case 'hours':
      return { text: s.hours(schedule(), t.hours.breakLabel, now()), links: [L.call], suggestions: [sg.location, sg.contact], locale }
    case 'location':
      return {
        text: s.location(t.location.line1, t.location.line2, t.location.city, t.location.landmarks),
        links: [L.maps, L.directions, L.anchor(s.links.hoursSection, '#location')],
        suggestions: [sg.status, sg.contact],
        locale,
      }
    case 'phone':
      return { text: s.phone(workshop.phone), links: [L.call, L.whatsapp], suggestions: [sg.hours, sg.location], locale }
    case 'whatsapp':
      return { text: s.whatsapp(workshop.responseTime), links: [L.whatsapp, L.call], suggestions: [sg.services, sg.hours], locale }
    case 'services':
      return {
        text: s.services(name, services.map(serviceTitle)),
        links: [L.anchor(s.links.servicesSection, '#services'), L.call],
        suggestions: services.slice(0, 3).map(serviceTitle),
        locale,
      }
    case 'bodyshop':
      return { text: s.bodyshop(name), links: [L.call, L.directions], suggestions: [sg.status, sg.location], locale }
    case 'insurance': {
      const list = insurers.map((insurer) => {
        const label = t.insurance.names[insurer.id] ?? insurer.name
        const note = t.insurance.notes[insurer.id]
        return note ? `${label} (${note})` : label
      })
      return {
        text: s.insurance(name, list, workshop.phone),
        links: [L.anchor(s.links.insuranceSection, '/insurance'), L.call],
        suggestions: [sg.status, sg.location],
        locale,
      }
    }
    case 'price':
      return { text: s.price, links: [L.call], suggestions: [sg.services, sg.hours], locale }
    case 'reviews':
      return {
        text: s.reviews(name, workshop.googleReviews.count, reviews.slice(0, 2).map((r) => `“${r.excerpt}” — ${r.name}`)),
        links: [{ label: s.links.readReviews, href: workshop.googleReviews.url, kind: 'external' }, L.anchor(s.links.reviewsSection, '#reviews')],
        suggestions: [sg.services, sg.location],
        locale,
      }
    case 'booking':
      return { text: s.booking(workshop.phone, now()), links: [L.call, L.directions], suggestions: [sg.hours, sg.location], locale }
    case 'parts':
      return { text: s.parts, links: [L.call], locale }
    case 'facility':
      return {
        text: s.facility(
          name,
          equipment.map((item) => {
            const copy = t.workshop.equipment[item.id] ?? item
            return `${copy.title} — ${copy.detail}`
          }),
        ),
        links: [L.anchor(s.links.workshopSection, '#workshop')],
        suggestions: [sg.services, sg.location],
        locale,
      }
    case 'brands':
      return {
        text: s.brands(brands.European.join(', '), brands.Japanese.join(', '), brands.Korean.join(', ')),
        links: [L.call],
        suggestions: [sg.services, sg.status],
        locale,
      }
    case 'experience':
      return {
        text: s.experience(name, workshop.foundedYear, new Date().getFullYear() - workshop.foundedYear),
        links: [L.anchor(s.links.aboutSection, '#about')],
        suggestions: [sg.services, sg.reviews],
        locale,
      }
    case 'service':
      return fallbackReply(ctx)
  }
}

/** "open on friday?" → that day's hours first, then the full schedule. */
function dayReply(text: string, ctx: ReplyContext): AssistantReply | undefined {
  const { t, s, hours, locale } = ctx
  const day = workshop.schedule.find((d) => {
    const label = locale === 'ar' ? normalizeAr(t.days[d.day].label).trim() : d.label.toLowerCase()
    return text.includes(label)
  })
  if (!day) return undefined
  const ranges = day.intervals.length ? day.intervals.map((range) => formatRange(range, hours)).join(' · ') : s.closedAllDay
  const base = buildReply('hours', ctx)
  return { ...base, text: `${t.days[day.day].label}: ${ranges}\n\n${base.text}` }
}

const DICTIONARIES: Record<Locale, Dictionary> = { en, ar }

/** Answers a visitor's question from site data, or hands off to the landline. */
export function answerQuestion(question: string, uiLocale: Locale): AssistantReply {
  const locale = questionLocale(question, uiLocale)
  const t = DICTIONARIES[locale]
  const ctx: ReplyContext = { locale, t, s: STRINGS[locale], hours: hoursStrings(t) }
  const text = locale === 'ar' ? normalizeAr(question) : normalizeEn(question)
  if (text.trim().length === 0) return fallbackReply(ctx)

  const intents = locale === 'ar' ? INTENTS_AR : INTENTS_EN
  // A specific service mention wins over everything except explicit price/body/booking questions.
  const service = findService(text, locale)

  let best: { id: IntentId; score: number } | undefined
  for (const intent of intents) {
    const hits = score(text, intent.patterns, locale)
    if (hits === 0) continue
    const total = hits + (intent.weight ?? 0)
    if (!best || total > best.score) best = { id: intent.id, score: total }
  }

  if (service && (!best || !['price', 'booking', 'status', 'hours', 'location', 'phone', 'insurance'].includes(best.id))) {
    return serviceReply(service, ctx)
  }
  if (best?.id === 'hours' || best?.id === 'status') {
    const reply = dayReply(text, ctx) ?? buildReply(best.id, ctx)
    // "where are you and when do you close?" — answer both halves.
    const asksLocation = score(text, intents.find((i) => i.id === 'location')?.patterns ?? [], locale) > 0
    if (!asksLocation) return reply
    const location = buildReply('location', ctx)
    return {
      text: `${reply.text}\n\n${ctx.s.findUsAt}\n${location.text}`,
      links: [...(location.links ?? []), ...(reply.links ?? [])],
      suggestions: reply.suggestions,
      locale,
    }
  }
  if (best) return buildReply(best.id, ctx)
  return fallbackReply(ctx)
}

export { formatTime }
