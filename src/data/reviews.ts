export interface Review {
  id: string
  name: string
  car: string
  rating: 1 | 2 | 3 | 4 | 5
  /** Relative label as shown on Google. */
  when: string
  text: string
  /** Service the customer came in for — displayed as a chip. */
  service: string
}

export const reviews: readonly Review[] = [
  {
    id: 'r1',
    name: 'Khalid Al Mazrouei',
    car: 'Nissan Patrol',
    rating: 5,
    when: '2 weeks ago',
    text: 'Patrol had a gearbox judder that two other garages could not trace. Elite scanned it, showed me the live data and fixed it the same day. Honest pricing, no upsell.',
    service: 'Transmission',
  },
  {
    id: 'r2',
    name: 'Fatima Al Hammadi',
    car: 'Toyota Land Cruiser',
    rating: 5,
    when: '1 month ago',
    text: 'AC went weak in August. They found a tiny condenser leak instead of just regassing it like everyone else. Cabin is freezing again and they messaged me photos on WhatsApp during the job.',
    service: 'AC Repair',
  },
  {
    id: 'r3',
    name: 'Daniel Okafor',
    car: 'BMW 530i',
    rating: 5,
    when: '3 weeks ago',
    text: 'Quoted less than half of what the dealer wanted for brakes and used genuine parts. Alignment is perfect, steering is dead straight on the E11. Quick turnaround too.',
    service: 'Brakes & Alignment',
  },
  {
    id: 'r4',
    name: 'Mohammed Siddiqui',
    car: 'Mitsubishi Pajero',
    rating: 5,
    when: '1 month ago',
    text: 'Booked a pre-purchase inspection over WhatsApp in the morning, had the full report by lunch. They caught a repaired chassis rail so I walked away from the deal. Saved me a fortune.',
    service: 'Pre-Purchase Inspection',
  },
  {
    id: 'r5',
    name: 'Sara Al Ketbi',
    car: 'Lexus LX 570',
    rating: 5,
    when: '2 months ago',
    text: 'Transparent from start to finish. They send the price before starting, explain what is urgent and what can wait. Finally a workshop in Mussafah I trust with the family car.',
    service: 'Periodic Maintenance',
  },
  {
    id: 'r6',
    name: 'James Whitfield',
    car: 'Mitsubishi Montero Sport',
    rating: 5,
    when: '3 months ago',
    text: 'Check-engine light diagnosed in 20 minutes with a proper written report. Fixed a faulty sensor for a fair price and the light has not returned. Fast, honest, professional.',
    service: 'Engine Diagnostics',
  },
]
