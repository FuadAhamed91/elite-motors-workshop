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

function Wheel({ cx, cy, r, spinning }: WheelProps) {
  const rim = r * 0.55
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#141210" />
      <circle cx={cx} cy={cy} r={r - 2} fill="none" stroke="#2b2724" strokeWidth={2} />
      <g
        className={cn(spinning && 'motion-safe:animate-wheel-spin')}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        <circle cx={cx} cy={cy} r={rim} fill="#3d3935" />
        <path
          d={`M${cx} ${cy - rim} V${cy + rim} M${cx - rim} ${cy} H${cx + rim} M${cx - rim * 0.7} ${cy - rim * 0.7} L${cx + rim * 0.7} ${cy + rim * 0.7} M${cx + rim * 0.7} ${cy - rim * 0.7} L${cx - rim * 0.7} ${cy + rim * 0.7}`}
          stroke="#b8b2aa"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={r * 0.16} fill="#f8c21c" />
      </g>
    </g>
  )
}

/**
 * Side-view single-seater in the EMW livery (red body, blue sidepod, yellow
 * stripe). Purely decorative — the intro overlay carries the accessible text.
 */
export function F1Car({ className, spinning = false }: F1CarProps) {
  return (
    <svg viewBox="0 0 340 110" aria-hidden="true" focusable="false" className={className}>
      {/* ground shadow */}
      <ellipse cx="176" cy="97" rx="150" ry="6" fill="#000" opacity="0.22" />

      {/* rear wing */}
      <path d="M10 24 h6 v46 h-6 z" fill="#1c1917" />
      <path d="M14 28 h58 v8 h-58 z" fill="#1c1917" />
      <path d="M18 46 h50 v6 h-50 z" fill="#1c1917" />
      <path d="M60 36 h10 v18 h-10 z" fill="#1c1917" />

      {/* floor & diffuser */}
      <path d="M50 80 h180 v8 h-180 z" fill="#1c1917" />

      {/* engine cover → nose */}
      <path
        d="M62 80 C 66 60, 88 46, 116 44 L 150 40 C 168 37, 182 36, 196 37 L 214 42 C 254 50, 292 62, 326 72 L 330 80 Z"
        fill="#e2231a"
      />
      {/* airbox */}
      <path d="M114 44 C 120 28, 138 24, 154 30 L 150 40 Z" fill="#c81c14" />
      {/* sidepod */}
      <path d="M100 60 L 206 56 L 216 80 L 96 80 Z" fill="#2149b0" />
      {/* stripe */}
      <path d="M110 70 L 316 66 L 322 72 L 110 76 Z" fill="#f8c21c" />
      {/* cockpit */}
      <path d="M152 40 L 194 38 L 190 50 L 158 52 Z" fill="#1c1917" />
      {/* halo */}
      <path
        d="M148 40 C 156 24, 194 22, 204 38"
        fill="none"
        stroke="#1c1917"
        strokeWidth={4}
        strokeLinecap="round"
      />
      <path d="M172 40 V 30" stroke="#1c1917" strokeWidth={3} strokeLinecap="round" />
      {/* helmet */}
      <circle cx="173" cy="42" r="7" fill="#f8c21c" />
      <path d="M167 42 h12" stroke="#1c1917" strokeWidth={2} />

      {/* front wing */}
      <path d="M292 74 L 338 78 L 338 83 L 288 85 Z" fill="#1c1917" />
      <path d="M334 62 h4 v24 h-4 z" fill="#1c1917" />

      <Wheel cx={82} cy={74} r={22} spinning={spinning} />
      <Wheel cx={262} cy={76} r={20} spinning={spinning} />
    </svg>
  )
}
