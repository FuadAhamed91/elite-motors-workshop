import type { SVGProps } from 'react'
import { cn } from '@/lib/cn'

/**
 * "EMW" brand mark — vector recreation of the Elite Motors Workshop badge:
 * three italic tiles in the brand's red, blue and yellow with white letters.
 * Rebuilt as SVG so it stays crisp at any size and sits cleanly on dark surfaces.
 * Decorative by default; the surrounding link carries the accessible name.
 */
export function BrandMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 146 48"
      aria-hidden="true"
      focusable="false"
      className={cn('shrink-0', className)}
      {...props}
    >
      <g transform="translate(11 0) skewX(-12)">
        <rect x="0" y="0" width="41" height="48" rx="1.5" className="fill-brand-red" />
        <rect x="44" y="0" width="41" height="48" rx="1.5" className="fill-brand-blue" />
        <rect x="88" y="0" width="47" height="48" rx="1.5" className="fill-brand-yellow" />
        <g
          fontFamily="Outfit, 'Arial Black', Arial, sans-serif"
          fontWeight={800}
          fontSize={34}
          fill="#fff"
          stroke="#0f172a"
          strokeWidth={1.2}
          paintOrder="stroke"
          textAnchor="middle"
        >
          <text x="20.5" y="37">E</text>
          <text x="64.5" y="37">M</text>
          <text x="111.5" y="37">W</text>
        </g>
      </g>
    </svg>
  )
}
