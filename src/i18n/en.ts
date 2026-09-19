import type { DayKey } from '@/config/workshop'

/**
 * English copy — the source of truth for every string on the page. `ar.ts`
 * must provide the same shape (enforced by the `Dictionary` type), so a
 * missing translation is a compile error, never a blank spot on the site.
 */
export type Locale = 'en' | 'ar'

export const en = {
  locale: 'en' as Locale,
  dir: 'ltr' as 'ltr' | 'rtl',
  /** Label of the *other* language, shown on the toggle. */
  switchLabel: 'العربية',
  switchAria: 'التبديل إلى العربية — switch to Arabic',

  meta: {
    insuranceTitle: 'Insurance Claims & Accident Repair | Elite Motors Workshop, Abu Dhabi',
    insuranceDescription:
      'Approved repairer for Dubai Insurance, Sukoon, Adamjee, Fidelity United, Watania Takaful, Tokio Marine, QIC and Dubai National Insurance. We handle the estimate, surveyor and paperwork in Mussafah, Abu Dhabi.',
    beforeAfterTitle: 'Before & After Accident Repairs | Elite Motors Workshop, Abu Dhabi',
    beforeAfterDescription:
      'Real accident repairs from our body shop in Mussafah, Abu Dhabi — BMW, Toyota, Nissan, Honda, Alfa Romeo and more, photographed on arrival and after the repair.',
    title: 'Elite Motors Workshop | Auto Service & Repair in Mussafah, Abu Dhabi',
    description:
      'Elite Motors Workshop — mechanical, electrical, body and paint repairs in Mussafah M21, Abu Dhabi. Trained technicians, insurance-approved body shop, genuine parts.',
  },

  brand: {
    name: 'Elite Motors Workshop',
    legalName: 'Elite Motors Workshop L.L.C',
    /** Navbar lockup: two bold lines on phones, one line + tag on larger screens. */
    navLine1: 'Elite Motors',
    navLine2: 'Workshop L.L.C',
    navFull: 'Elite Motors Workshop',
    navTag: 'L.L.C · Abu Dhabi',
    /** Footer wordmark. */
    stacked: 'Elite Motors Workshop',
    llc: 'L.L.C',
  },

  common: {
    skipToContent: 'Skip to content',
    call: (phone: string) => `Call ${phone}`,
    callShort: 'Call',
    callWorkshop: 'Call Workshop',
    getDirections: 'Get Directions',
    directions: 'Directions',
    insuranceClaim: 'Insurance claim',
    beforeAfter: 'Before & after',
    backHome: 'Back to the main page',
    openInGoogleMaps: 'Open in Google Maps',
    largerMap: 'Larger map',
    backToTop: (title: string) => `${title} — back to top`,
    closed: 'Closed',
  },

  nav: {
    services: 'Services',
    insurance: 'Insurance',
    beforeAfter: 'Before & After',
    workshop: 'Workshop',
    about: 'About',
    reviews: 'Reviews',
    hoursLocation: 'Hours & Location',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    primary: 'Primary',
    footer: 'Footer',
  },

  /** Live status + time formatting (used by the hours engine). */
  status: {
    am: 'AM',
    pm: 'PM',
    openNow: 'Open Now',
    openToday: 'Open Today',
    closed: 'Closed',
    closes: (time: string) => `Closes ${time}`,
    backAt: (time: string) => `On break · Back at ${time}`,
    opensAt: (time: string) => `Opens at ${time}`,
    opensTomorrow: (time: string) => `Opens tomorrow ${time}`,
    opensOn: (day: string, time: string) => `Opens ${day} ${time}`,
    seeHours: 'See opening hours',
  },

  days: {
    monday: { label: 'Monday', short: 'Mon' },
    tuesday: { label: 'Tuesday', short: 'Tue' },
    wednesday: { label: 'Wednesday', short: 'Wed' },
    thursday: { label: 'Thursday', short: 'Thu' },
    friday: { label: 'Friday', short: 'Fri' },
    saturday: { label: 'Saturday', short: 'Sat' },
    sunday: { label: 'Sunday', short: 'Sun' },
  } satisfies Record<DayKey, { label: string; short: string }>,

  hero: {
    reviewsChip: (count: number) => `${count} reviews on Google`,
    headlineStart: 'Precision Auto Care &',
    headlineAccent: 'Mechanical Excellence',
    headlineEnd: 'in Abu Dhabi',
    lead: 'Trusted diagnostics, transparent pricing and fast turnaround — right here in Mussafah. Call the workshop or drop in; every job starts with a clear estimate.',
    addressLine: (area: string) => `${area} · landline answered during working hours`,
    proofPoints: (year: number) => [
      `In Mussafah since ${year}`,
      'Mechanical, body & paint under one roof',
      'Estimate before any work starts',
    ],
  },

  about: {
    eyebrow: 'Why drivers choose us',
    title: (year: number) => `Serving Abu Dhabi from Mussafah since ${year}.`,
    body: (year: number) =>
      `Elite Motors Workshop L.L.C has run as an all-makes repair centre since ${year}. A trained, experienced team handles mechanical, electrical, body and paint work in one facility — for private owners, fleets and insurance companies alike — with an estimate agreed before we touch a bolt.`,
    photoAlt: 'Elite Motors Workshop sign above the blue perimeter fence in Mussafah',
  },

  stats: {
    years: { value: (n: number) => `${n}+`, label: (year: number) => `Years in Mussafah · since ${year}` },
    insurance: { value: 'Insurance', label: 'Approved Body & Paint Shop' },
    techs: { value: 'All makes', label: 'European, Japanese & Korean cars' },
    parts: { value: 'Genuine', label: 'OEM Parts Only' },
  },

  services: {
    eyebrow: 'Services',
    title: 'Mechanical, body and paint — under one roof.',
    description:
      'Engine and gearbox work, servicing, AC, brakes, denting, painting, electrical diagnosis and detailing. Every job starts with a clear estimate — no surprises on the invoice.',
    includesLabel: (title: string) => `What ${title} includes`,
    facilitiesLabel: 'Where the work happens',
    multiBrand: 'Multi-brand workshop',
    regions: { European: 'European', Japanese: 'Japanese', Korean: 'Korean' },
    notSure: 'Not sure what your car needs?',
    callAndDescribe: (phone: string) => `Call ${phone} and describe the problem`,
    items: {
      engine: {
        title: 'Engine & Gearbox Repair',
        description:
          'Engine work from timing and gaskets to full rebuilds, plus automatic and manual gearbox repairs — with a 2-tonne engine crane for removal and installation.',
        includes: ['Engine repair & rebuild', 'Gearbox & transmission work', 'Clutch, mounts & drivetrain'],
      },
      service: {
        title: 'General Service & Oil Change',
        description:
          'Scheduled servicing at the intervals your manufacturer specifies: engine oil and filters, fluids, belts and a full inspection, recorded in your service book.',
        includes: ['Engine oil & filter change', 'Fluids, belts & filters', 'Multi-point inspection'],
        badge: 'Most requested',
      },
      ac: {
        title: 'AC & Radiator Service',
        description:
          'Ice-cold cabin air for Abu Dhabi summers and a cooling system that copes with 45°C traffic — AC repair and regas, radiator flushing, thermostat and water pump work.',
        includes: ['AC repair, leak test & regas', 'Radiator flush & replacement', 'Thermostat & water pump'],
        badge: 'UAE summer essential',
      },
      brakes: {
        title: 'Brakes, Suspension & Alignment',
        description:
          'Pads, discs and calipers with an in-house brake lathe for rotors and drums, suspension repairs, and wheel alignment to manufacturer specifications.',
        includes: ['Brake pads, discs & lathe work', 'Shocks, bushes & links', 'Wheel alignment & bearings'],
      },
      body: {
        title: 'Denting & Accident Repair',
        description:
          'Dent removal, panel and bumper repairs and full accident restoration on a Car-O-Liner measuring bench — insurance-approved, with claims handled for you.',
        includes: ['Dent & panel repair', 'Chassis measuring & straightening', 'Insurance claim repairs'],
        badge: 'Insurance approved',
      },
      paint: {
        title: 'Painting & Refinishing',
        description:
          'Factory-quality finishes in a full-size paint booth with a drying oven: colour-matched panel resprays, full repaints and clear-coat correction.',
        includes: ['Full-size booth with drying oven', 'Colour matching & resprays', 'Clear coat & polishing'],
      },
      electrical: {
        title: 'Electrical & Computer Diagnosis',
        description:
          'Starting, charging and warning-light faults traced with the Launch X431 scanner — reads ECM fault codes on European, Japanese and Korean vehicles.',
        includes: ['OBD scan & fault report', 'Battery, alternator & starter', 'Wiring & sensor repairs'],
      },
      detailing: {
        title: 'Express Detailing & Wash',
        description:
          'Interior and exterior detailing in the dedicated wash bay — a proper clean-up after every repair, or on its own to keep the car looking its best.',
        includes: ['Exterior wash & polish', 'Interior deep clean', 'Engine bay cleaning'],
      },
    } as Record<string, { title: string; description: string; includes: string[]; badge?: string }>,
    facilities: {
      paint: { service: 'Painting', caption: 'Paint booth', blurb: 'Full-size paint booth with drying oven', alt: 'Enclosed paint booth with red doors' },
      body: { service: 'Denting & accident repair', caption: 'Body shop', blurb: 'Measuring bench for chassis and panel work', alt: 'Body shop bench with panels being repaired' },
      lifts: { service: 'Mechanical work', caption: 'Mechanical bays', blurb: 'Two-post lifts for engine, gearbox and brake jobs', alt: 'Vehicles raised on lifts with a technician at work' },
    } as Record<string, { service: string; caption: string; blurb: string; alt: string }>,
  },

  insurance: {
    eyebrow: 'Insurance claims',
    title: 'Approved repairer for the UAE’s leading insurers.',
    description:
      'Had an accident? Bring the car and your policy — we prepare the estimate and photos, deal with your insurer’s surveyor and follow the claim through to approval, so you don’t run between offices.',
    approvedBy: 'Approved by',
    logoAlt: (name: string) => `${name} logo`,
    visit: (name: string) => `Visit ${name}`,
    stepsTitle: 'How a claim works here',
    steps: [
      { title: 'Report and bring the car', body: 'Get your police report (Abu Dhabi Police / Saaed), then drive in or have the car recovered to us.' },
      { title: 'We handle the paperwork', body: 'We photograph the damage, write the estimate and send everything to your insurer. Their surveyor inspects the car at our workshop.' },
      { title: 'Approval, repair, hand-over', body: 'Once approved, the repair starts on the Car-O-Liner bench and in the paint booth. You pay only your policy excess, as stated in your policy.' },
    ],
    bringTitle: 'What to bring',
    bring: [
      'Police report',
      'Registration card (Mulkiya)',
      'Insurance policy or card',
      'Driver’s Emirates ID and driving licence',
      'Car owner’s Emirates ID and driving licence (if the owner is not the driver)',
      'Company car: the company’s trade licence',
    ],
    /* Dedicated page */
    pageTitle: 'Accident? We handle the claim with your insurer.',
    pageLead:
      'Elite Motors Workshop is an approved repairer for the insurers below. Bring the car and your documents — we prepare the estimate and photos, host the surveyor at the workshop and follow the claim through approval, repair and hand-over.',
    homeLead: 'Approved repairer for eight UAE insurers. Bring the car and your policy — we handle the estimate, the surveyor and the paperwork.',
    openPage: 'How claims work & what to bring',
    afterAccidentTitle: 'Just had an accident?',
    afterAccident: [
      'If anyone is hurt or the road is blocked, call 999. For minor accidents in Abu Dhabi, move the cars to a safe spot (the police require it) and request the report through the Saaed app or 800 72233.',
      'Photograph both cars, the plates and the damage before anything is moved further.',
      'Bring the car to us with the police report — or call us and we will tell you what to do next.',
    ],
    faqTitle: 'Common questions',
    faq: [
      { q: 'Do I pay anything?', a: 'Only the excess (deductible) written in your policy, if any. The insurer settles the rest of the approved repair with us directly.' },
      { q: 'How long does approval take?', a: 'It depends on the insurer and the damage. We send the estimate and photos the same day the surveyor has inspected the car, and we follow up until it is approved.' },
      { q: 'Do you use genuine parts?', a: 'Yes — genuine manufacturer parts, fitted by trained technicians. Body repairs are measured on a Car-O-Liner bench and painted in a full-size booth with a drying oven.' },
      { q: 'My insurer is not on the list', a: 'Call us. Many insurers accept repairs at approved workshops on request, and we check with them before you bring the car.' },
    ],
    otherInsurer: 'Insured with another company?',
    otherInsurerCall: (phone: string) => `Call ${phone} — we check with your insurer whether they accept repairs here.`,
    names: {
      'dubai-insurance': 'Dubai Insurance Company',
      sukoon: 'Sukoon Insurance',
      adamjee: 'Adamjee Insurance',
      'fidelity-united': 'Fidelity United',
      'watania-takaful': 'Watania Takaful',
      'tokio-marine': 'Tokio Marine',
      qic: 'Qatar Insurance Company',
      dni: 'Dubai National Insurance',
    } as Record<string, string>,
    notes: {
      'fidelity-united': 'United Fidelity Insurance Co.',
      'watania-takaful': 'formerly Noor Takaful',
    } as Record<string, string>,
  },

  beforeAfter: {
    eyebrow: 'Before & after',
    title: 'Accident repairs — before and after.',
    description:
      'Real cars from our body shop, photographed on arrival and again when the repair was finished. Number plates are blurred for the owners’ privacy.',
    before: 'Before',
    after: 'After',
    listLabel: 'Before and after repair photos',
    openPhoto: (car: string, stage: string) => `Open photo: ${car}, ${stage.toLowerCase()} repair`,
    hint: 'Tap any photo to view it full size.',
    insuranceCta: 'How an insurance claim works',
    seeAll: (n: number) => `See all ${n} repairs`,
    /* Home-page teaser + dedicated page */
    homeLead: 'Real cars from our body shop, photographed on arrival and again when the repair was finished — see the full set on its own page.',
    openPage: (n: number) => `See all ${n} before & after repairs`,
    pageTitle: 'Accident repairs — before and after.',
    pageLead:
      'Every car here came in after an accident and left repaired and repainted at Elite Motors Workshop in Mussafah. Each pair shows the same car on arrival and on hand-over. Number plates are blurred for the owners’ privacy.',
    accidentTitle: 'Had an accident?',
    accidentBody: 'We are an approved repairer for eight UAE insurers — bring the car and your policy and we handle the estimate, the surveyor and the paperwork.',
    compactTitle: 'Recent accident repairs',
    captionBefore: (car: string) => `${car} — before repair`,
    captionAfter: (car: string) => `${car} — after repair`,
    altBefore: (car: string) => `${car} with accident damage, on arrival at the workshop`,
    altAfter: (car: string) => `${car} after the repair, repainted`,
    cars: {
      'bmw-5-series': { name: 'BMW 5 Series', work: 'Front-end collision: bonnet, bumper and headlamp' },
      'toyota-hilux': { name: 'Toyota Hilux', work: 'Frontal impact: bonnet, grille and bumper' },
      'alfa-romeo-giulia': { name: 'Alfa Romeo Giulia', work: 'Front bumper and bonnet repair, repainted' },
      'nissan-x-trail': { name: 'Nissan X-Trail', work: 'Front-end rebuild after a collision' },
      'toyota-land-cruiser': { name: 'Toyota Land Cruiser', work: 'Front-corner impact: bumper, wing and headlamp' },
      'honda-civic': { name: 'Honda Civic', work: 'Major front-end rebuild' },
      'changan-suv': { name: 'Changan SUV', work: 'Front-end collision repair and paint' },
    } as Record<string, { name: string; work: string }>,
  },

  workshop: {
    eyebrow: 'Inside the workshop',
    title: 'A full mechanical, body and paint facility in Mussafah.',
    description: (year: number) =>
      `Serving Abu Dhabi since ${year} with dealer-grade equipment under one roof — so your car doesn’t travel between garages for mechanical work, bodywork and paint.`,
    equipment: {
      booth: { title: 'Full-size paint booth', detail: 'with drying oven for factory-quality finishes' },
      caroliner: { title: 'Car-O-Liner measuring system', detail: 'wireless chassis measurement against a 15,000+ vehicle database' },
      x431: { title: 'Launch X431 diagnostics', detail: 'ECM fault codes on European, Japanese and Korean cars' },
      lathe: { title: 'Brake lathe', detail: 'turns rotors and drums for a true, shudder-free finish' },
      crane: { title: 'Engine crane & bearing press', detail: '2-tonne crane; press-fit wheel bearings and bushes' },
      team: { title: 'Trained technicians', detail: 'an experienced team across mechanical, electrical, body and paint work' },
    } as Record<string, { title: string; detail: string }>,
    gallery: {
      eyebrow: 'Gallery',
      title: 'Around the workshop',
      viewAll: (n: number) => `View all ${n} photos`,
      openGallery: (n: number) => `Open gallery · ${n} photos`,
      openPhoto: (caption: string) => `Open photo: ${caption}`,
      remainingAria: (n: number) => `Open the remaining ${n} photos`,
      more: 'more',
      morePhotos: 'More photos',
      hint: 'Tap any photo to browse the gallery. Number plates are blurred.',
    },
    photos: {
      hall: { caption: 'Main service hall', alt: 'Main service hall with two-post lifts' },
      wash: { caption: 'Wash & detailing bay', alt: 'Covered wash bay' },
      front: { caption: 'The entrance on Mussafah M21', alt: 'Workshop entrance with signage and palm trees' },
      reception: { caption: 'Reception', alt: 'Reception desk with the EMW logo' },
      lounge: { caption: 'Customer lounge', alt: 'Customer waiting lounge with sofas' },
    } as Record<string, { caption: string; alt: string }>,
  },

  lightbox: {
    close: 'Close',
    previous: 'Previous photo',
    next: 'Next photo',
    allPhotos: 'All photos',
    photoOf: (caption: string, index: number, total: number) => `${caption} — photo ${index} of ${total}`,
    showPhoto: (index: number, caption: string) => `Show photo ${index}: ${caption}`,
  },

  reviews: {
    eyebrow: 'Reviews',
    title: 'What customers say on Google.',
    description:
      "Excerpts from the workshop's top Google reviews — tap any card to read the full review on Google Maps.",
    badgeTitle: 'Reviews from Google',
    badgeSub: (count: number) => `See all ${count} reviews on Google Maps`,
    readAria: (name: string) => `Read ${name}'s review on Google`,
    readOnGoogle: 'Read on Google',
    google: 'Google',
    ratingAria: (rating: number) => `${rating} out of 5 stars`,
    topics: {
      'ahmad-sankar': 'Excellent team',
      'shannon-corera': 'Accident repair',
      'ali-afzal': 'Polite staff',
      'petro-nixon': 'Quick repair',
      'kashyap-patel': 'Insurance work',
      'long-sc': 'Customer support',
    } as Record<string, string>,
    when: {
      'ahmad-sankar': 'March 2026',
      'shannon-corera': 'March 2026',
      'ali-afzal': 'March 2026',
      'petro-nixon': 'March 2026',
      'kashyap-patel': 'April 2026',
      'long-sc': 'July 2026',
    } as Record<string, string>,
  },

  hours: {
    eyebrow: 'Working hours',
    title: 'Open six days a week, with a lunch break.',
    description:
      'Drop in during working hours or call ahead on the landline — the team will tell you whether to bring the car straight in.',
    weekly: 'Weekly schedule',
    timesNote: 'Times in Abu Dhabi (GST, UTC+4)',
    breakLabel: '1:00 PM – 2:00 PM lunch break',
    sundayClosed: 'Sunday: closed',
    today: 'Today',
    closed: 'Closed',
    closedAllDay: 'Closed all day',
    live: 'Live workshop status',
    localTime: 'Local time in Abu Dhabi',
    monSat: 'Monday – Saturday',
    lunch: 'Lunch break',
    sunday: 'Sunday',
    openCall: (phone: string) => `We’re open — call ${phone}`,
    landlineNote: 'Landline · answered during working hours',
    planVisit: 'Plan your visit — get directions',
    closedHint: (detail: string, phone: string) => `${detail} · call ${phone} once we’re open.`,
    summary: 'Monday – Saturday: 8:00 AM – 1:00 PM & 2:00 PM – 5:30 PM | Sunday: Closed',
  },

  location: {
    eyebrow: 'Find us',
    title: 'In the heart of Mussafah Industrial Area.',
    description:
      'Sector M21 of Mussafah Industrial Area — a short drive from Abu Dhabi city, Khalifa City and the Al Ain Road.',
    line1: 'Elite Motors Workshop L.L.C',
    line2: 'Musaffah M21, Mussafah Industrial Area',
    city: 'Abu Dhabi, United Arab Emirates',
    landmarks: 'Plus code 9FGF+VV · Abu Dhabi',
    phone: 'Phone',
    phoneNote: 'Landline · call during working hours',
    mapTitle: (name: string, area: string) => `Map showing ${name} in ${area}, Abu Dhabi`,
    openInMaps: 'Open in Maps',
  },

  footer: {
    eyebrow: 'Ready when you are',
    title: 'Talk to the workshop directly. No forms, no waiting.',
    body: 'Call the landline during working hours or drop in at Musaffah M21 — a certified technician looks at the car and gives you a clear estimate before any work starts.',
    orDirections: 'or get directions',
    blurb: (city: string, year: number) =>
      `Mechanical, electrical, body and paint repairs in ${city} since ${year}. Trained technicians, genuine parts and honest pricing.`,
    quickLinks: 'Quick links',
    services: 'Services',
    googleMaps: 'Google Maps',
    visitUs: 'Visit us',
    rights: (year: number, legalName: string) => `© ${year} ${legalName}. All rights reserved.`,
    group: 'Group companies: Alkayed Workshop LLC · Motor World Workshop (Dubai, Ajman, Fujairah) · Dubai Classic Motors · Repute Spare Parts Trading.',
    disclaimer: (name: string) =>
      `${name} is an independent workshop and is not affiliated with any vehicle manufacturer. Prices quoted over the phone or in chat are estimates until the vehicle is inspected. Brand names are used for identification only.`,
    city: 'Mussafah, Abu Dhabi, UAE',
  },

  fab: {
    aria: (name: string) => `Chat with ${name} on WhatsApp`,
    label: 'Chat with us',
  },

  intro: {
    skip: 'Skip',
    welcome: (name: string) => `Welcome to ${name}`,
  },

  assistant: {
    name: 'EMW Assistant',
    greeting:
      "Hi! I can help with the workshop's opening hours, location, services and how to get in touch. What would you like to know?",
    quickReplies: ['Are you open now?', 'Opening hours', 'Where are you located?', 'Which insurers do you work with?', 'What services do you offer?'],
    open: (name: string) => `Open ${name}`,
    close: 'Close assistant',
    inputLabel: 'Ask about hours, location or services',
    placeholder: 'Ask about hours, location, services…',
    send: 'Send',
    typing: (name: string) => `${name} is typing`,
    footnote: (phone: string) => `Answers use this website’s information only. For anything else, call ${phone}.`,
  },
}

export type Dictionary = typeof en
