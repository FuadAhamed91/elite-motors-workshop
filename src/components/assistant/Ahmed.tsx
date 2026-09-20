/*
 * "Ahmed", the assistant's face: a friendly Emirati man in a white kandura and
 * ghutra with a black agal, drawn as flat vector art with a little shading.
 * Colours are literal here on purpose — skin, cloth and cord are not theme
 * colours. He does not wave — the owner found the arm awkward — he just
 * looks at you, blinks and breathes.
 */

const SKIN = '#cf9469'
const SKIN_SHADE = '#b97a52'
const CLOTH = '#fdfcf9'
const CLOTH_SHADE = '#ece7dc'
const CLOTH_LINE = '#d6cfc0'
const HAIR = '#3b2b21'
const INK = '#26201b'
const LIP = '#a3624a'

/** Shared face parts (used by both the full figure and the portrait). */
function FaceParts({ eyeClassName }: { eyeClassName?: string }) {
  return (
    <>
      {/* Face with a rounder jaw */}
      <path d="M36.5 56c0-14 10.5-24 23.5-24s23.5 10 23.5 24c0 13-9 27-23.5 27S36.5 69 36.5 56z" fill={SKIN} />
      {/* Cheek warmth */}
      <ellipse cx="45" cy="66" rx="4.5" ry="2.6" fill={SKIN_SHADE} opacity="0.28" />
      <ellipse cx="75" cy="66" rx="4.5" ry="2.6" fill={SKIN_SHADE} opacity="0.28" />
      {/* Trimmed beard along the jaw + moustache */}
      <path d="M38 61.5c1 12.5 9 21.5 22 21.5s21-9 22-21.5c-3 8-10.5 12.5-22 12.5S41 69.5 38 61.5z" fill={HAIR} />
      <path d="M50.5 69.8c2.6-2 6-2.6 9.5-2.6s6.9.6 9.5 2.6c-2.6-.6-6-.9-9.5-.9s-6.9.3-9.5.9z" fill={HAIR} />
      {/* Ghutra cap over the forehead — with a soft fold */}
      <path d="M35 51c0-16 11-27 25-27s25 11 25 27c-8-3-17-4.5-25-4.5S43 48 35 51z" fill={CLOTH} />
      <path d="M40 48.5c6.5-2 13-3 20-3s13.5 1 20 3" fill="none" stroke={CLOTH_LINE} strokeWidth="1.2" strokeLinecap="round" />
      {/* Agal — two black cords */}
      <ellipse cx="60" cy="36" rx="25" ry="6.6" fill="none" stroke={INK} strokeWidth="5" />
      <ellipse cx="60" cy="41.2" rx="25.4" ry="6.2" fill="none" stroke={INK} strokeWidth="2.4" />
      <path d="M40 33.5c6-2.6 13-3.8 20-3.8s14 1.2 20 3.8" fill="none" stroke="#4a3a30" strokeWidth="1.1" strokeLinecap="round" opacity="0.8" />
      {/* Eyebrows */}
      <path d="M45.5 54.2c3-2.8 7.5-3.3 11-1.6M63.5 52.6c3.5-1.7 8-1.2 11 1.6" fill="none" stroke={HAIR} strokeWidth="2.4" strokeLinecap="round" />
      {/* Eyes — whites, iris, pupil, highlight; the group blinks */}
      <g className={eyeClassName} style={{ transformOrigin: '60px 60px' }}>
        <ellipse cx="51.5" cy="60" rx="4.2" ry="3.4" fill="#fff" />
        <ellipse cx="68.5" cy="60" rx="4.2" ry="3.4" fill="#fff" />
        <circle cx="52" cy="60.3" r="2.5" fill="#4a3324" />
        <circle cx="69" cy="60.3" r="2.5" fill="#4a3324" />
        <circle cx="52" cy="60.3" r="1.3" fill={INK} />
        <circle cx="69" cy="60.3" r="1.3" fill={INK} />
        <circle cx="53" cy="59.2" r="0.8" fill="#fff" />
        <circle cx="70" cy="59.2" r="0.8" fill="#fff" />
        <path d="M47.3 59.2c1.2-2.6 7.2-2.6 8.4 0M64.3 59.2c1.2-2.6 7.2-2.6 8.4 0" fill="none" stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
      </g>
      {/* Nose */}
      <path d="M60.3 61c-1.8 3.2-2.3 5.6-.4 7.6" fill="none" stroke={SKIN_SHADE} strokeWidth="1.7" strokeLinecap="round" />
      {/* Smile with teeth */}
      <path d="M52.5 72.5c3 3.6 12 3.6 15 0" fill="#fff" />
      <path d="M52.5 72.5c3 3.6 12 3.6 15 0" fill="none" stroke={LIP} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M52.5 72.5c4.5.9 10.5.9 15 0" fill="none" stroke={INK} strokeWidth="1.1" strokeLinecap="round" opacity="0.75" />
    </>
  )
}

interface AhmedProps {
  className?: string
}

/** Full figure (head and shoulders), 120 × 150. */
export function Ahmed({ className }: AhmedProps) {
  return (
    <svg viewBox="0 0 120 150" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="ahmed-cloth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor={CLOTH_SHADE} />
        </linearGradient>
      </defs>
      {/* The figure breathes very slightly */}
      <g className="motion-safe:animate-breathe" style={{ transformOrigin: '60px 150px' }}>
        {/* Ghutra — the back panel and the two drapes fall behind the head */}
        <path d="M31 46c4-18 54-18 58 0l6 54H25z" fill={CLOTH_SHADE} />
        <path d="M37 47c-6 14-10 32-13 54h22c-2-16-2-32 0-48z" fill={CLOTH} stroke={CLOTH_LINE} strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M83 47c6 14 10 32 13 54H74c2-16 2-32 0-48z" fill={CLOTH} stroke={CLOTH_LINE} strokeWidth="1.3" strokeLinejoin="round" />
        {/* Body — kandura with a round collar */}
        <path d="M10 150v-27c0-17 12-26 32-29l10-2c1 7 15 7 16 0l10 2c20 3 32 12 32 29v27z" fill="url(#ahmed-cloth)" stroke={CLOTH_LINE} strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M60 100v50" stroke={CLOTH_LINE} strokeWidth="1.3" strokeLinecap="round" />
        <path d="M46 96c5 6 23 6 28 0" fill="none" stroke={CLOTH_LINE} strokeWidth="1.3" strokeLinecap="round" />
        {/* Neck */}
        <path d="M50 76h20v18c0 5-20 5-20 0z" fill={SKIN_SHADE} />
        <FaceParts eyeClassName="motion-safe:animate-blink" />
      </g>

    </svg>
  )
}

/** Head only — for the chat launcher, the panel header and the reply avatars (a circle). */
export function AhmedFace({ className }: { className?: string }) {
  return (
    <svg viewBox="26 25 68 68" className={className} aria-hidden="true" focusable="false">
      <path d="M31 46c4-18 54-18 58 0l6 54H25z" fill={CLOTH_SHADE} />
      <path d="M37 47c-6 14-10 32-13 54h22c-2-16-2-32 0-48z" fill={CLOTH} />
      <path d="M83 47c6 14 10 32 13 54H74c2-16 2-32 0-48z" fill={CLOTH} />
      <path d="M50 76h20v18c0 5-20 5-20 0z" fill={SKIN_SHADE} />
      <FaceParts eyeClassName="motion-safe:animate-blink" />
    </svg>
  )
}
