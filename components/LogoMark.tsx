interface LogoMarkProps {
  size?: 'sm' | 'md' | 'lg'
}

const config = {
  sm: { px: 20, radius: '22%', ring: 0.82, gold: 0.58, border: 1 },
  md: { px: 24, radius: '22%', ring: 0.82, gold: 0.58, border: 1.5 },
  lg: { px: 56, radius: '22%', ring: 0.82, gold: 0.58, border: 2.5 },
}

export function LogoMark({ size = 'md' }: LogoMarkProps) {
  const { px, radius, ring, gold, border } = config[size]
  return (
    <div
      aria-hidden="true"
      className="relative flex-shrink-0"
      style={{
        width: px,
        height: px,
        borderRadius: radius,
        background: '#2a2a2a',
        overflow: 'hidden',
      }}
    >
      {/* Black ring with white edge border */}
      <div
        className="absolute rounded-full"
        style={{
          width: px * ring,
          height: px * ring,
          background: '#111',
          border: `${border}px solid white`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
      {/* Gold circle with white border */}
      <div
        className="absolute rounded-full"
        style={{
          width: px * gold,
          height: px * gold,
          background: '#F0BB00',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  )
}
