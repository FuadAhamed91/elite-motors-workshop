import type { ImgHTMLAttributes } from 'react'

interface PictureProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  /** JPEG path; a sibling .webp with the same name is served to browsers that support it. */
  src: string
  /** Optional 800px version — when given, the browser picks it on small screens via srcset. */
  thumb?: string
  alt: string
  width: number
  height: number
}

const toWebp = (path: string) => path.replace(/\.jpe?g$/i, '.webp')

/** JPEG with an automatic WebP source (≈40% smaller) — every photo on the site goes through this. */
export function Picture({ src, thumb, alt, width, height, loading = 'lazy', decoding = 'async', sizes, ...rest }: PictureProps) {
  const set = (full: string, small?: string) => (small ? `${small} 800w, ${full} ${width}w` : undefined)
  return (
    <picture className="contents">
      <source srcSet={set(toWebp(src), thumb && toWebp(thumb)) ?? toWebp(src)} sizes={sizes} type="image/webp" />
      <img
        src={src}
        srcSet={set(src, thumb)}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        {...rest}
      />
    </picture>
  )
}
