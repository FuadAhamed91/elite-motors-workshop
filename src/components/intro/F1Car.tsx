import { cn } from '@/lib/cn'

interface F1CarProps {
  className?: string
  /** Spins the wheels (only while the car is moving). */
  spinning?: boolean
}

interface WheelProps {
  cx: number
  cy: number
  r: number
  spinning: boolean
}

/**
 * 18-inch wheel: tyre with sidewall stripe, dished rim, spokes and hub.
 * When spinning, the spoke group rotates and a blurred ring fakes motion blur.
 */
function Wheel({ cx, cy, r, spinning }: WheelProps) {
  const rim = r * 0.6
  const spokes = Array.from({ length: 10 }, (_, i) => (i * 360) / 10)
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="url(#emw-tyre)" />
      {/* soft-compound sidewall stripe */}
      <circle cx={cx} cy={cy} r={r * 0.86} fill="none" stroke="#f4c414" strokeWidth={r * 0.045} opacity={0.9} />
      <circle cx={cx} cy={cy} r={r * 0.79} fill="none" stroke="#0a0a0a" strokeWidth={r * 0.04} opacity={0.6} />
      {/* rim */}
      <circle cx={cx} cy={cy} r={rim} fill="url(#emw-rim)" />
      <circle cx={cx} cy={cy} r={rim * 0.94} fill="none" stroke="#1a1a1a" strokeWidth={1.5} />
      <g
        className={cn(spinning && 'motion-safe:animate-wheel-spin')}
        style={{ transformOrigin: `${cx}px ${cy}px`, transformBox: 'view-box' }}
      >
        {spokes.map((angle) => (
          <path
            key={angle}
            d={`M${cx} ${cy} L${cx + rim * 0.9 * Math.cos((angle * Math.PI) / 180)} ${cy + rim * 0.9 * Math.sin((angle * Math.PI) / 180)}`}
            stroke="#8d8d92"
            strokeWidth={r * 0.06}
            strokeLinecap="round"
          />
        ))}
      </g>
      {/* blurred ring reads as spinning spokes at speed */}
      <circle
        cx={cx}
        cy={cy}
        r={rim * 0.55}
        fill="none"
        stroke="#6f6f75"
        strokeWidth={rim * 0.7}
        opacity={spinning ? 0.55 : 0}
        style={{ transition: 'opacity 200ms ease-out' }}
      />
      {/* brake disc glow + hub nut */}
      <circle cx={cx} cy={cy} r={rim * 0.3} fill="#2a2a2e" />
      <circle cx={cx} cy={cy} r={rim * 0.14} fill="#f4c414" />
    </g>
  )
}

/**
 * Side view of a current-regulations single-seater in the EMW livery
 * (red engine cover, blue sidepod, yellow accent) with gradient lighting.
 * Decorative — the intro overlay carries the accessible text.
 */
export function F1Car({ className, spinning = false }: F1CarProps) {
  return (
    <svg viewBox="0 0 1000 300" aria-hidden="true" focusable="false" className={className}>
      <defs>
        <linearGradient id="emw-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff5a4f" />
          <stop offset="0.35" stopColor="#e2231a" />
          <stop offset="1" stopColor="#8c0f0a" />
        </linearGradient>
        <linearGradient id="emw-blue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4f79e6" />
          <stop offset="0.4" stopColor="#2149b0" />
          <stop offset="1" stopColor="#102566" />
        </linearGradient>
        <linearGradient id="emw-carbon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a4a50" />
          <stop offset="0.5" stopColor="#1e1e22" />
          <stop offset="1" stopColor="#0b0b0d" />
        </linearGradient>
        <linearGradient id="emw-yellow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe066" />
          <stop offset="1" stopColor="#e0a800" />
        </linearGradient>
        <linearGradient id="emw-gloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="emw-tyre" cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#3a3a3e" />
          <stop offset="0.7" stopColor="#141416" />
          <stop offset="1" stopColor="#050505" />
        </radialGradient>
        <radialGradient id="emw-rim" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#6a6a70" />
          <stop offset="0.6" stopColor="#2c2c31" />
          <stop offset="1" stopColor="#151518" />
        </radialGradient>
        <radialGradient id="emw-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.42" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="emw-visor" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0d1b2a" />
          <stop offset="1" stopColor="#3b6a9c" />
        </linearGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="500" cy="286" rx="480" ry="13" fill="url(#emw-shadow)" />

      {/* rear wing: endplate, planes, DRS flap, support pylon */}
      <path d="M52 58 L150 52 L152 166 L62 174 Z" fill="url(#emw-carbon)" />
      <path d="M46 62 L158 56 L158 66 L46 72 Z" fill="#26262b" />
      <path d="M50 84 L156 80 L156 88 L50 92 Z" fill="#303036" />
      <path d="M62 148 L150 142 L150 150 L62 156 Z" fill="#303036" />
      <text
        x="104"
        y="128"
        textAnchor="middle"
        fontFamily="Outfit, 'Arial Black', Arial, sans-serif"
        fontWeight={800}
        fontSize={28}
        fill="#f4f4f5"
        transform="rotate(-3 104 128)"
      >
        EMW
      </text>
      <path d="M148 128 C 190 150, 220 176, 262 196 L 262 210 C 214 190, 180 164, 146 140 Z" fill="url(#emw-carbon)" />

      {/* floor + diffuser */}
      <path d="M186 236 L 250 258 L 720 262 L 720 272 L 236 270 L 176 250 Z" fill="url(#emw-carbon)" />

      {/* engine cover → chassis → nose */}
      <path
        d="M196 206 C 236 150, 300 122, 382 106 L 424 82 C 436 66, 470 64, 482 88 L 562 96 C 604 100, 646 128, 704 160 C 784 182, 884 202, 964 212 L 966 232 C 884 236, 770 238, 704 250 L 620 258 L 250 262 C 232 250, 216 230, 196 206 Z"
        fill="url(#emw-red)"
      />
      {/* gloss highlight along the top surface */}
      <path
        d="M236 150 C 290 124, 340 114, 384 108 L 424 84 C 440 74, 462 72, 476 86 L 560 96 C 600 100, 640 124, 700 156 C 640 138, 590 116, 558 112 L 470 102 C 456 94, 440 94, 430 100 L 388 122 C 340 130, 290 142, 236 150 Z"
        fill="url(#emw-gloss)"
      />
      {/* shark-fin engine cover edge */}
      <path d="M262 136 L 384 108 L 386 118 L 268 146 Z" fill="url(#emw-carbon)" opacity={0.9} />

      {/* sidepod (blue) with yellow accent + sponsor decal */}
      <path d="M318 154 C 378 142, 486 144, 566 152 L 640 168 C 660 202, 652 240, 604 258 L 296 262 C 266 240, 272 184, 318 154 Z" fill="url(#emw-blue)" />
      <path d="M300 236 L 640 226 L 646 238 L 300 250 Z" fill="url(#emw-yellow)" />
      <text
        x="470"
        y="212"
        textAnchor="middle"
        fontFamily="Outfit, Inter, Arial, sans-serif"
        fontWeight={800}
        fontSize={30}
        letterSpacing={3}
        fill="#f8fafc"
      >
        ELITE MOTORS
      </text>
      {/* sidepod inlet */}
      <path d="M574 152 L 640 168 L 636 184 L 578 176 Z" fill="#0b1230" />

      {/* airbox intake + roll hoop */}
      <path d="M428 82 L 470 76 L 466 94 L 434 96 Z" fill="#0b0b0d" />
      {/* cockpit opening, headrest */}
      <path d="M488 96 C 500 84, 560 84, 574 98 L 572 108 L 490 106 Z" fill="#0b0b0d" />
      <path d="M496 96 L 522 90 L 526 104 L 498 106 Z" fill="#26262b" />
      {/* helmet (EMW yellow) with visor */}
      <circle cx="536" cy="90" r="17" fill="url(#emw-yellow)" />
      <path d="M540 82 C 552 82, 556 90, 553 96 L 540 96 Z" fill="url(#emw-visor)" />
      <path d="M522 88 L 552 88" stroke="#c48d00" strokeWidth={2} />
      {/* halo */}
      <path d="M470 98 C 486 58, 578 54, 606 92" fill="none" stroke="#141418" strokeWidth={9} strokeLinecap="round" />
      <path d="M470 98 C 486 58, 578 54, 606 92" fill="none" stroke="#5a5a62" strokeWidth={3} strokeLinecap="round" />
      <path d="M528 62 L 532 96" stroke="#141418" strokeWidth={7} strokeLinecap="round" />
      {/* mirror */}
      <path d="M598 106 L 616 104 L 616 116 L 600 118 Z" fill="#1e1e22" />
      <path d="M596 112 L 584 118" stroke="#1e1e22" strokeWidth={3} />

      {/* suspension arms */}
      <g stroke="#1a1a1e" strokeWidth={5} strokeLinecap="round">
        <path d="M252 190 L 208 214" />
        <path d="M262 226 L 214 232" />
        <path d="M690 190 L 752 214" />
        <path d="M700 232 L 748 236" />
      </g>

      {/* front wing: endplate, main plane, flaps, nose pylons */}
      <path d="M986 234 L 1000 232 L 1000 282 L 986 284 Z" fill="url(#emw-carbon)" />
      <path d="M842 266 L 992 258 L 992 268 L 838 278 Z" fill="url(#emw-carbon)" />
      <path d="M858 254 L 990 248 L 990 256 L 856 262 Z" fill="#303036" />
      <path d="M876 244 L 988 240 L 988 246 L 874 250 Z" fill="#3a3a41" />
      <path d="M920 232 L 928 232 L 926 258 L 918 258 Z" fill="#1e1e22" />
      <path d="M950 234 L 958 234 L 956 258 L 948 258 Z" fill="#1e1e22" />

      <Wheel cx={206} cy={222} r={62} spinning={spinning} />
      <Wheel cx={758} cy={224} r={60} spinning={spinning} />
    </svg>
  )
}
