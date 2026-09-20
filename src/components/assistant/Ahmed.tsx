import { cn } from '@/lib/cn'

/*
 * "Ahmed", the assistant's face: a friendly Emirati man in a white kandura and
 * ghutra with a black agal, drawn as flat vector art. Colours are literal here
 * on purpose — skin, cloth and cord are not theme colours. The waving arm is
 * on the character's left (the viewer's left), so when he peeks in from the
 * end edge of the screen the wave faces the page; under RTL the whole figure
 * is mirrored by the parent.
 */

const SKIN = '#c98a5e'
const SKIN_SHADE = '#b5744b'
const CLOTH = '#fbfaf6'
const CLOTH_LINE = '#d9d2c3'
const HAIR = '#3a2a20'
const INK = '#2b211b'

interface AhmedProps {
  className?: string
  /** Plays the wave (three beats) — set when the character has just appeared. */
  waving?: boolean
}

/** Full figure (head, shoulders and the waving arm), 120 × 150. */
export function Ahmed({ className, waving = false }: AhmedProps) {
  return (
    <svg viewBox="0 0 120 150" className={className} aria-hidden="true" focusable="false">
      {/* Body — kandura */}
      <path d="M14 150V121c0-15 10-24 26-27l12-2 8 6 8-6 12 2c16 3 26 12 26 27v29z" fill={CLOTH} stroke={CLOTH_LINE} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M52 92l8 8 8-8" fill="none" stroke={CLOTH_LINE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M60 100v50" stroke={CLOTH_LINE} strokeWidth="1.5" strokeLinecap="round" />

      {/* Neck */}
      <path d="M50 76h20v18l-10 8-10-8z" fill={SKIN_SHADE} />

      {/* Ghutra — the two drapes beside the face */}
      <path d="M36 46c-4 12-8 30-12 52h20c-2-16-2-32 0-48z" fill={CLOTH} stroke={CLOTH_LINE} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M84 46c4 12 8 30 12 52H76c2-16 2-32 0-48z" fill={CLOTH} stroke={CLOTH_LINE} strokeWidth="1.5" strokeLinejoin="round" />

      {/* Face */}
      <circle cx="60" cy="58" r="23" fill={SKIN} />
      {/* Ears */}
      <circle cx="37.5" cy="60" r="3.5" fill={SKIN_SHADE} />
      <circle cx="82.5" cy="60" r="3.5" fill={SKIN_SHADE} />
      {/* Beard — trimmed, along the jaw */}
      <path d="M38.5 62c1 14 9 22 21.5 22S80.5 76 81.5 62c-3 8-10 12-21.5 12S41.5 70 38.5 62z" fill={HAIR} />
      {/* Ghutra cap over the forehead */}
      <path d="M33 49a27 27 0 0 1 54 0z" fill={CLOTH} stroke={CLOTH_LINE} strokeWidth="1.5" strokeLinejoin="round" />
      {/* Agal — the black cord */}
      <ellipse cx="60" cy="35.5" rx="26.5" ry="6.5" fill="none" stroke={INK} strokeWidth="5" />
      <ellipse cx="60" cy="40.5" rx="26.5" ry="6" fill="none" stroke={INK} strokeWidth="2.4" />

      {/* Eyebrows, eyes, nose, smile */}
      <path d="M47 53.5c3-2.5 7-2.5 10-1M63 52.5c3-1.5 7-1.5 10 1" fill="none" stroke={HAIR} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="51.5" cy="59.5" r="2.4" fill={INK} />
      <circle cx="68.5" cy="59.5" r="2.4" fill={INK} />
      <circle cx="52.3" cy="58.7" r="0.7" fill="#fff" />
      <circle cx="69.3" cy="58.7" r="0.7" fill="#fff" />
      <path d="M60 62c-1.5 3-1.5 5 0 7" fill="none" stroke={SKIN_SHADE} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M52 71c4 4.5 12 4.5 16 0" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M53.5 72.5c3.5 3 9.5 3 13 0" fill="#fff" />

      {/* Waving arm (viewer's left) — sleeve + hand; rotates at the shoulder */}
      <g className={cn('origin-[26px_106px]', waving && 'motion-safe:animate-wave')}>
        <path d="M30 108L12 76l14-8 20 34z" fill={CLOTH} stroke={CLOTH_LINE} strokeWidth="1.5" strokeLinejoin="round" />
        {/* Open palm: four fingers up, thumb out */}
        <path d="M8.5 62V49M13.5 60V45.5M18.5 60V45.5M23.5 62V49" fill="none" stroke={SKIN} strokeWidth="4.6" strokeLinecap="round" />
        <path d="M9 69l-5-6" fill="none" stroke={SKIN} strokeWidth="4.6" strokeLinecap="round" />
        <rect x="6" y="58" width="20" height="14" rx="6" fill={SKIN} />
      </g>
    </svg>
  )
}

/** Head only — for the chat launcher and the panel header (a circle). */
export function AhmedFace({ className }: { className?: string }) {
  return (
    <svg viewBox="27 25 66 66" className={className} aria-hidden="true" focusable="false">
      <path d="M36 46c-4 12-8 30-12 52h20c-2-16-2-32 0-48z" fill={CLOTH} />
      <path d="M84 46c4 12 8 30 12 52H76c2-16 2-32 0-48z" fill={CLOTH} />
      <path d="M50 76h20v18l-10 8-10-8z" fill={SKIN_SHADE} />
      <circle cx="60" cy="58" r="23" fill={SKIN} />
      <path d="M38.5 62c1 14 9 22 21.5 22S80.5 76 81.5 62c-3 8-10 12-21.5 12S41.5 70 38.5 62z" fill={HAIR} />
      <path d="M33 49a27 27 0 0 1 54 0z" fill={CLOTH} />
      <ellipse cx="60" cy="35.5" rx="26.5" ry="6.5" fill="none" stroke={INK} strokeWidth="5" />
      <ellipse cx="60" cy="40.5" rx="26.5" ry="6" fill="none" stroke={INK} strokeWidth="2.4" />
      <path d="M47 53.5c3-2.5 7-2.5 10-1M63 52.5c3-1.5 7-1.5 10 1" fill="none" stroke={HAIR} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="51.5" cy="59.5" r="2.4" fill={INK} />
      <circle cx="68.5" cy="59.5" r="2.4" fill={INK} />
      <path d="M60 62c-1.5 3-1.5 5 0 7" fill="none" stroke={SKIN_SHADE} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M52 71c4 4.5 12 4.5 16 0" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}
