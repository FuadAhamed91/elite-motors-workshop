/**
 * On-site assistant settings. The assistant is rule-based and answers only
 * from the data already on this website (config, schedule, services, reviews),
 * in English and Arabic — copy lives in `src/i18n` and `src/lib/assistant.ts`.
 * Anything it cannot answer is redirected to the workshop's landline.
 */
export const assistant = {
  enabled: true,
  /**
   * `ahmed` — the assistant is "Ahmed": his face on the launcher and in the
   *           panel header, and once per session he peeks in from the side of
   *           the screen, waves and asks how he can help.
   * `plain` — the previous nameless assistant with a chat icon (git tag
   *           v7-before-ahmed is the full earlier state).
   */
  persona: 'ahmed' as 'ahmed' | 'plain',
  /** How long after the page settles before Ahmed appears, and how long he stays. */
  mascotDelayMs: 1800,
  mascotStayMs: 11000,
} as const
