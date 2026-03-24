import Image from 'next/image'

interface LogoMarkProps {
  size?: 'sm' | 'md' | 'lg'
}

const pxSizes = {
  sm: 20,
  md: 24,
  lg: 56,
}

export function LogoMark({ size = 'md' }: LogoMarkProps) {
  const px = pxSizes[size]
  return (
    <Image
      src="/icon-128.png"
      alt=""
      aria-hidden="true"
      width={px}
      height={px}
      className="flex-shrink-0"
      style={{ borderRadius: size === 'lg' ? 14 : size === 'md' ? 8 : 6 }}
    />
  )
}
