/**
 * Top 5-star reviews from the workshop's Google Business listing
 * (captured September 2026, "most relevant" order). Each card shows a short
 * excerpt and links to the full review on Google — see `workshop.googleReviews.url`.
 */
export interface Review {
  id: string
  name: string
  rating: 1 | 2 | 3 | 4 | 5
  /** Approximate month of the review, derived from Google's relative date. */
  when: string
  /** Short excerpt of the review text. */
  excerpt: string
  /** Google review topic the comment relates to — displayed as a chip. */
  topic: string
}

export const reviews: readonly Review[] = [
  {
    id: 'ahmad-sankar',
    name: 'Ahmad Sankar',
    rating: 5,
    when: 'March 2026',
    excerpt: 'Truly shocked, surprised, and more than satisfied with the level of service I received.',
    topic: 'Excellent team',
  },
  {
    id: 'shannon-corera',
    name: 'Shannon Corera',
    rating: 5,
    when: 'March 2026',
    excerpt: 'Fantastic service… guided me through the complete procedure… delivered the car on time.',
    topic: 'Accident repair',
  },
  {
    id: 'ali-afzal',
    name: 'Ali Afzal',
    rating: 5,
    when: 'March 2026',
    excerpt: 'They made it so easy… so helpful and professional… best service station to recommend.',
    topic: 'Polite staff',
  },
  {
    id: 'petro-nixon',
    name: 'Petro A R Nixon',
    rating: 5,
    when: 'March 2026',
    excerpt: 'Prompt response, frequent status updates and quick repair. He delivered exactly what he promised.',
    topic: 'Quick repair',
  },
  {
    id: 'kashyap-patel',
    name: 'Kashyap Patel',
    rating: 5,
    when: 'April 2026',
    excerpt: 'A strong and competent body shop that’s approved by many reputed insurers.',
    topic: 'Insurance work',
  },
  {
    id: 'long-sc',
    name: 'Long SC',
    rating: 5,
    when: 'July 2026',
    excerpt: 'Very good and helping in sorting out my car problem… courteous and helpful.',
    topic: 'Customer support',
  },
]
