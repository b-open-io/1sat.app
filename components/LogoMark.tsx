interface LogoMarkProps {
  size?: 'sm' | 'md'
}

const sizes = {
  sm: { outer: 'w-5 h-5 rounded-md', inner: 'w-2.5 h-2.5' },
  md: { outer: 'w-6 h-6 rounded-lg', inner: 'w-3 h-3' },
}

export function LogoMark({ size = 'md' }: LogoMarkProps) {
  const s = sizes[size]
  return (
    <div
      aria-hidden="true"
      className={`${s.outer} flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#FF8C00] to-[#FFD700]`}
    >
      <div className={`${s.inner} rounded-full bg-white opacity-90`} />
    </div>
  )
}
