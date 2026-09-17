interface TopDownF1CarProps {
  className?: string
}

interface TyreProps {
  x: number
  y: number
  width: number
  height: number
}

/** Wide slick from above: rubber gradient across the tread, contact-patch shading, faint groove lines. */
function Tyre({ x, y, width, height }: TyreProps) {
  const grooves = [0.2, 0.35, 0.5, 0.65, 0.8]
  return (
    <g>
      <rect x={x + 3} y={y + 6} width={width} height={height} rx={16} fill="#000" opacity={0.45} />
      <rect x={x} y={y} width={width} height={height} rx={16} fill="url(#td-tyre)" />
      <rect x={x + 4} y={y + 4} width={width - 8} height={height - 8} rx={13} fill="none" stroke="#3b3b40" strokeWidth={1.5} opacity={0.7} />
      {grooves.map((g) => (
        <line
          key={g}
          x1={x + 6}
          x2={x + width - 6}
          y1={y + height * g}
          y2={y + height * g}
          stroke="#000"
          strokeWidth={1}
          opacity={0.35}
        />
      ))}
      {/* contact patch — darker band across the middle */}
      <rect x={x + 2} y={y + height * 0.42} width={width - 4} height={height * 0.16} fill="#000" opacity={0.22} />
      {/* soft-compound sidewall marking peeking at the edges */}
      <rect x={x} y={y + height * 0.3} width={3} height={height * 0.4} fill="#f4c414" opacity={0.9} />
      <rect x={x + width - 3} y={y + height * 0.3} width={3} height={height * 0.4} fill="#f4c414" opacity={0.9} />
    </g>
  )
}

/**
 * Top-down view of a current-regulations single-seater in the EMW livery,
 * nose pointing up. 400 × 1100 viewBox ≈ real 2.0 m × 5.5 m proportions.
 * Metallic gradients, carbon aero, halo, ground-effect sidepods, layered wings.
 */
export function TopDownF1Car({ className }: TopDownF1CarProps) {
  return (
    <svg viewBox="0 0 400 1100" aria-hidden="true" focusable="false" className={className}>
      <defs>
        {/* metallic paint: dark edges, bright spine highlight */}
        <linearGradient id="td-red" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7d0d09" />
          <stop offset="0.42" stopColor="#e2231a" />
          <stop offset="0.5" stopColor="#ff6a60" />
          <stop offset="0.58" stopColor="#e2231a" />
          <stop offset="1" stopColor="#7d0d09" />
        </linearGradient>
        <linearGradient id="td-blue-l" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0f2262" />
          <stop offset="0.7" stopColor="#2149b0" />
          <stop offset="1" stopColor="#5b84ee" />
        </linearGradient>
        <linearGradient id="td-blue-r" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#0f2262" />
          <stop offset="0.7" stopColor="#2149b0" />
          <stop offset="1" stopColor="#5b84ee" />
        </linearGradient>
        <linearGradient id="td-carbon" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#141417" />
          <stop offset="0.5" stopColor="#3d3d44" />
          <stop offset="1" stopColor="#141417" />
        </linearGradient>
        <linearGradient id="td-carbon-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#45454c" />
          <stop offset="1" stopColor="#141417" />
        </linearGradient>
        <linearGradient id="td-tyre" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#060606" />
          <stop offset="0.5" stopColor="#2e2e32" />
          <stop offset="1" stopColor="#060606" />
        </linearGradient>
        <linearGradient id="td-yellow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d9a400" />
          <stop offset="0.5" stopColor="#ffe066" />
          <stop offset="1" stopColor="#d9a400" />
        </linearGradient>
        <linearGradient id="td-gloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="td-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.5" />
        </linearGradient>
        <radialGradient id="td-helmet" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#fff1a8" />
          <stop offset="0.5" stopColor="#f4c414" />
          <stop offset="1" stopColor="#b07d00" />
        </radialGradient>
        <linearGradient id="td-visor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5f8fd6" />
          <stop offset="1" stopColor="#0b1a33" />
        </linearGradient>
        <radialGradient id="td-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.55" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0.25" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="td-exhaust" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd28a" stopOpacity="0.95" />
          <stop offset="0.4" stopColor="#ff7a1a" stopOpacity="0.6" />
          <stop offset="1" stopColor="#ff7a1a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="206" cy="560" rx="200" ry="520" fill="url(#td-shadow)" />

      {/* ── front wing ─────────────────────────────────────────── */}
      <rect x="14" y="30" width="12" height="94" rx="3" fill="url(#td-carbon-v)" />
      <rect x="374" y="30" width="12" height="94" rx="3" fill="url(#td-carbon-v)" />
      <path d="M26 58 Q200 36 374 58 L374 78 Q200 56 26 78 Z" fill="url(#td-carbon)" />
      <path d="M28 82 Q200 62 372 82 L372 94 Q200 74 28 94 Z" fill="#2a2a30" />
      <path d="M30 97 Q200 78 370 97 L370 106 Q200 87 30 106 Z" fill="url(#td-red)" />
      <path d="M32 109 Q200 90 368 109 L368 116 Q200 97 32 116 Z" fill="url(#td-yellow)" />
      {/* wing shadow on the ground */}
      <path d="M30 118 Q200 100 370 118 L370 128 Q200 110 30 128 Z" fill="#000" opacity={0.3} />

      {/* ── front suspension ───────────────────────────────────── */}
      <g stroke="#1c1c20" strokeWidth={6} strokeLinecap="round">
        <path d="M152 300 L96 186" />
        <path d="M154 334 L96 236" />
        <path d="M248 300 L304 186" />
        <path d="M246 334 L304 236" />
      </g>

      {/* ── nose + monocoque ───────────────────────────────────── */}
      <path d="M182 50 L218 50 L232 330 L252 344 L252 640 L148 640 L148 344 L168 330 Z" fill="url(#td-red)" />
      <path d="M182 50 L218 50 L226 220 L174 220 Z" fill="url(#td-shade)" opacity={0.6} transform="rotate(180 200 135)" />
      {/* spine highlight */}
      <path d="M196 52 L204 52 L206 640 L194 640 Z" fill="#fff" opacity={0.18} />
      {/* nose camera pod + pitot */}
      <rect x="196" y="60" width="8" height="26" rx="2" fill="#141417" />
      {/* mirrors */}
      <rect x="128" y="426" width="22" height="12" rx="3" fill="#1c1c20" />
      <rect x="250" y="426" width="22" height="12" rx="3" fill="#1c1c20" />

      {/* ── floor edges + sidepods ─────────────────────────────── */}
      <path d="M40 440 L66 446 L70 742 L48 782 Z" fill="url(#td-carbon-v)" />
      <path d="M360 440 L334 446 L330 742 L352 782 Z" fill="url(#td-carbon-v)" />
      <path d="M148 430 L66 446 C 56 510, 56 640, 70 742 L148 762 Z" fill="url(#td-blue-l)" />
      <path d="M252 430 L334 446 C 344 510, 344 640, 330 742 L252 762 Z" fill="url(#td-blue-r)" />
      {/* inlets */}
      <path d="M66 446 L148 430 L148 452 L72 470 Z" fill="#070c1f" />
      <path d="M334 446 L252 430 L252 452 L328 470 Z" fill="#070c1f" />
      {/* sidepod contour: top-surface gloss falling away toward the floor and tail */}
      <path d="M148 452 L82 470 C 74 540, 76 620, 88 690 L148 700 Z" fill="url(#td-gloss)" />
      <path d="M252 452 L318 470 C 326 540, 324 620, 312 690 L252 700 Z" fill="url(#td-gloss)" />
      <path d="M70 640 L148 650 L148 762 L70 742 Z" fill="url(#td-shade)" />
      <path d="M330 640 L252 650 L252 762 L330 742 Z" fill="url(#td-shade)" />
      {/* yellow accent along the pods */}
      <path d="M74 700 L148 712 L148 726 L76 716 Z" fill="url(#td-yellow)" />
      <path d="M326 700 L252 712 L252 726 L324 716 Z" fill="url(#td-yellow)" />

      {/* ── cockpit, halo, driver ──────────────────────────────── */}
      <path d="M170 436 Q200 420 230 436 L228 548 Q200 564 172 548 Z" fill="#0b0b0d" />
      <path d="M176 548 L224 548 L228 600 L172 600 Z" fill="#a8140e" />
      <circle cx="200" cy="500" r="21" fill="url(#td-helmet)" />
      <path d="M182 494 Q200 476 218 494 L216 488 Q200 470 184 488 Z" fill="url(#td-visor)" />
      <path d="M186 502 Q200 508 214 502" stroke="#8a6200" strokeWidth={2} fill="none" />
      {/* halo: front pillar + ring around the opening */}
      <path d="M200 424 L200 452" stroke="#1c1c20" strokeWidth={9} strokeLinecap="round" />
      <path d="M162 480 C 164 440, 236 440, 238 480 L238 548 M162 480 L162 548" fill="none" stroke="#1c1c20" strokeWidth={9} strokeLinecap="round" />
      <path d="M162 480 C 164 440, 236 440, 238 480" fill="none" stroke="#5a5a62" strokeWidth={2.5} />
      {/* airbox / roll hoop */}
      <path d="M184 566 L216 566 L212 606 L188 606 Z" fill="#141417" />
      <path d="M190 572 L210 572 L208 598 L192 598 Z" fill="#050506" />

      {/* ── engine cover spine → tail ──────────────────────────── */}
      <path d="M148 640 L252 640 L236 900 L200 936 L164 900 Z" fill="url(#td-red)" />
      <path d="M156 760 L244 760 L236 900 L200 936 L164 900 Z" fill="url(#td-shade)" />
      <path d="M196 640 L204 640 L203 900 L197 900 Z" fill="#fff" opacity={0.16} />
      <text
        x="200"
        y="712"
        textAnchor="middle"
        fontFamily="Outfit, 'Arial Black', Arial, sans-serif"
        fontWeight={800}
        fontSize={34}
        fill="#f8fafc"
      >
        EMW
      </text>
      <text
        x="200"
        y="742"
        textAnchor="middle"
        fontFamily="Outfit, Inter, Arial, sans-serif"
        fontWeight={700}
        fontSize={13}
        letterSpacing={3}
        fill="#f8fafc"
        opacity={0.9}
      >
        ELITE MOTORS
      </text>

      {/* ── rear suspension ────────────────────────────────────── */}
      <g stroke="#1c1c20" strokeWidth={6} strokeLinecap="round">
        <path d="M164 850 L100 828" />
        <path d="M168 890 L100 892" />
        <path d="M236 850 L300 828" />
        <path d="M232 890 L300 892" />
      </g>

      {/* ── diffuser + exhaust ─────────────────────────────────── */}
      <path d="M150 926 L250 926 L264 1044 L136 1044 Z" fill="url(#td-carbon)" />
      <g stroke="#0a0a0c" strokeWidth={2}>
        <path d="M170 930 L160 1040" />
        <path d="M200 930 L200 1040" />
        <path d="M230 930 L240 1040" />
      </g>
      <circle cx="200" cy="1036" r="14" fill="url(#td-exhaust)" />
      <circle cx="200" cy="1034" r="6" fill="#1a1a1d" />

      {/* ── rear wing ──────────────────────────────────────────── */}
      <rect x="36" y="932" width="14" height="124" rx="3" fill="url(#td-carbon-v)" />
      <rect x="350" y="932" width="14" height="124" rx="3" fill="url(#td-carbon-v)" />
      <path d="M50 958 Q200 942 350 958 L350 984 Q200 968 50 984 Z" fill="url(#td-carbon)" />
      <path d="M54 990 Q200 976 346 990 L346 1006 Q200 992 54 1006 Z" fill="#2a2a30" />
      <path d="M58 1010 Q200 998 342 1010 L342 1016 Q200 1004 58 1016 Z" fill="url(#td-yellow)" />
      <rect x="194" y="936" width="12" height="22" rx="3" fill="#1c1c20" />
      <text
        x="200"
        y="978"
        textAnchor="middle"
        fontFamily="Outfit, Inter, Arial, sans-serif"
        fontWeight={800}
        fontSize={15}
        letterSpacing={4}
        fill="#f8fafc"
      >
        ELITE MOTORS
      </text>
      {/* beam wing */}
      <path d="M120 1024 Q200 1016 280 1024 L280 1032 Q200 1024 120 1032 Z" fill="#1c1c20" />

      {/* ── tyres (drawn last so they sit over the floor edges) ── */}
      <Tyre x={24} y={128} width={72} height={134} />
      <Tyre x={304} y={128} width={72} height={134} />
      <Tyre x={14} y={790} width={86} height={170} />
      <Tyre x={300} y={790} width={86} height={170} />
    </svg>
  )
}
