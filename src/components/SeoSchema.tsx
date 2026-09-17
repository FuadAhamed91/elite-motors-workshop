import { workshop } from '@/config/workshop'

const DAY_NAMES: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

/**
 * schema.org AutoRepair JSON-LD generated from the config, so Google can show
 * opening hours, phone and rating in local search results.
 * No aggregateRating is emitted — the page intentionally doesn't show a star rating.
 */
function buildSchema() {
  const openingHoursSpecification = workshop.schedule.flatMap((day) =>
    day.intervals.map((range) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: DAY_NAMES[day.day],
      opens: range.open,
      closes: range.close,
    })),
  )

  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    name: workshop.name,
    legalName: workshop.legalName,
    foundingDate: String(workshop.foundedYear),
    description: workshop.tagline,
    telephone: workshop.phone,
    url: typeof window !== 'undefined' ? window.location.origin : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${workshop.address.line1}, ${workshop.address.line2}`,
      addressLocality: 'Abu Dhabi',
      addressRegion: 'Abu Dhabi',
      addressCountry: 'AE',
    },
    areaServed: workshop.city,
    openingHoursSpecification,
    hasMap: workshop.mapsLink,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: workshop.address.geo.lat,
      longitude: workshop.address.geo.lng,
    },
    priceRange: 'AED',
  }
}

export function SeoSchema() {
  return (
    <script
      type="application/ld+json"
      // JSON-LD must be raw text inside the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSchema()) }}
    />
  )
}
