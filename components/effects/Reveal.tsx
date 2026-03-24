'use client'

import { useReveal } from '@/hooks/useReveal'

interface RevealProps {
  as?: 'section' | 'div'
  children: React.ReactNode
  threshold?: number
  id?: string
  className?: string
}

function Reveal({ as: Tag = 'div', children, threshold = 0.15, id, className }: RevealProps) {
  const ref = useReveal<HTMLElement>(threshold)
  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement & HTMLDivElement>}
      id={id}
      className={`reveal ${className ?? ''}`.trim()}
    >
      {children}
    </Tag>
  )
}

export function RevealSection(props: Omit<RevealProps, 'as'>) {
  return <Reveal {...props} as="section" />
}

export function RevealDiv(props: Omit<RevealProps, 'as'>) {
  return <Reveal {...props} as="div" />
}
