/**
 * On-site assistant settings. The assistant is rule-based and answers only
 * from the data already on this website (config, schedule, services, reviews),
 * in English and Arabic — copy lives in `src/i18n` and `src/lib/assistant.ts`.
 * Anything it cannot answer is redirected to the workshop's landline.
 */
export const assistant = {
  enabled: true,
} as const
