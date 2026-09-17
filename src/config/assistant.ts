/**
 * On-site assistant settings. The assistant is rule-based and answers only
 * from the data already on this website (config, schedule, services, reviews).
 * Anything it cannot answer is redirected to the workshop's landline.
 */
export const assistant = {
  enabled: true,
  name: 'EMW Assistant',
  /** Shown as the first message when the panel opens. */
  greeting:
    "Hi! I can help with the workshop's opening hours, location, services and how to get in touch. What would you like to know?",
  /** One-tap questions shown under the greeting. */
  quickReplies: [
    'Are you open now?',
    'Opening hours',
    'Where are you located?',
    'What services do you offer?',
    'How do I contact you?',
  ],
} as const
