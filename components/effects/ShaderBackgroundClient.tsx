'use client'

import dynamic from 'next/dynamic'

/**
 * Client Component boundary required for `ssr: false` dynamic import.
 * `next/dynamic` with `ssr: false` is not allowed in Server Components.
 */
const ShaderBackground = dynamic(
  () => import('@/components/effects/ShaderBackground').then((m) => m.ShaderBackground),
  { ssr: false },
)

interface Props {
  videoSrc: string
  className?: string
}

export function ShaderBackgroundClient({ videoSrc, className }: Props) {
  return <ShaderBackground videoSrc={videoSrc} className={className} />
}
