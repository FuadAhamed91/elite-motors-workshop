import type { ImgHTMLAttributes } from 'react'

interface PictureProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  /** JPEG path; a sibling .webp with the same name is served to browsers that support it. */
  src: string
  alt: string
  width: number
  height: number
}

/** JPEG with an automatic WebP source (≈40% smaller) — every photo on the site goes through this. */
export function Picture({ src, alt, width, height, loading = 'lazy', decoding = 'async', ...rest }: PictureProps) {
  return (
    <picture className="contents">
      <source srcSet={src.replace(/\.jpe?g$/i, '.webp')} type="image/webp" />
      <img src={src} alt={alt} width={width} height={height} loading={loading} decoding={decoding} {...rest} />
    </picture>
  )
}
