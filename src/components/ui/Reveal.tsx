import { m, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { useIntroActive } from '@/hooks/useIntroGate'

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

interface RevealProps {
  children: ReactNode
  className?: string
  /** Seconds to wait before the reveal starts. */
  delay?: number
  /** Initial vertical offset in px (ignored under reduced motion). */
  y?: number
  /** Render as a different element (defaults to div). */
  as?: 'div' | 'section' | 'article' | 'li' | 'header' | 'footer'
  /**
   * No entrance animation at all — the block is simply there. Used for the
   * hero: it is already on screen from the build-time shell before React
   * runs, so animating it in would make it vanish and fade back, and the
   * page's largest text must count as painted at the first paint.
   */
  eager?: boolean
}

/**
 * Fades + slides content in the first time it scrolls into view.
 * Respects `prefers-reduced-motion` by rendering the final state immediately.
 */
export function Reveal({ children, className, delay = 0, y = 24, as = 'div', eager = false }: RevealProps) {
  const reduce = useReducedMotion()
  const introActive = useIntroActive()
  const Tag = m[as]

  if (eager) {
    return <Tag className={className}>{children}</Tag>
  }

  // While the intro overlay is up, hold the hidden state (no wasted animation
  // work behind it); the reveal runs as the overlay fades.
  if (introActive && !reduce) {
    return (
      <Tag className={className} initial={{ opacity: 0, y }} animate={{ opacity: 0, y }}>
        {children}
      </Tag>
    )
  }

  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -72px 0px' }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </Tag>
  )
}

const groupVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT_EXPO } },
}

interface StaggerGroupProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'ul' | 'ol'
  'aria-label'?: string
}

/** Parent that staggers its `StaggerItem` children (30–80 ms apart). */
export function StaggerGroup({ children, className, as = 'div', 'aria-label': ariaLabel }: StaggerGroupProps) {
  const reduce = useReducedMotion()
  const introActive = useIntroActive()
  const Tag = m[as]
  return (
    <Tag
      className={className}
      aria-label={ariaLabel}
      variants={groupVariants}
      initial={reduce ? false : 'hidden'}
      animate={introActive && !reduce ? 'hidden' : undefined}
      whileInView={introActive && !reduce ? undefined : 'show'}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
    >
      {children}
    </Tag>
  )
}

interface StaggerItemProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'li' | 'article'
}

export function StaggerItem({ children, className, as = 'div' }: StaggerItemProps) {
  const Tag = m[as]
  return (
    <Tag className={className} variants={itemVariants}>
      {children}
    </Tag>
  )
}
