import { GeistPixelLine } from 'geist/font/pixel'
import { DOWNLOAD_URL } from '@/components/constants'
import { ShaderBackgroundClient } from '@/components/effects/ShaderBackgroundClient'
import { LogoMark } from '@/components/LogoMark'

const pulseRings: Array<{ size: number; opacity: number; delay: string }> = [
  { size: 500, opacity: 0.06, delay: '0s' },
  { size: 350, opacity: 0.1, delay: '0.5s' },
  { size: 200, opacity: 0.15, delay: '1s' },
]

// Hoisted static style objects — avoids recreating on every render (rendering-hoist-jsx)
const gradientOverlayStyle: React.CSSProperties = {
  background:
    'linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.1) 40%, rgba(5,5,5,0.8) 100%)',
}

const conicGradientStyle: React.CSSProperties = {
  background:
    'conic-gradient(from 180deg at 50% 50%, rgba(255,140,0,0.06) 0deg, rgba(255,215,0,0.04) 90deg, rgba(100,50,200,0.06) 180deg, rgba(255,100,50,0.04) 270deg, rgba(255,140,0,0.06) 360deg)',
}

export function Hero() {
  return (
    <section className="relative h-svh overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 z-0 bg-background" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-1000 has-[[data-rendered]]:opacity-70"
      >
        <ShaderBackgroundClient videoSrc="/videos/hero-bg.mp4" className="h-full w-full" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2]"
        style={gradientOverlayStyle}
      />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[3]">
        {pulseRings.map((ring) => (
          <div
            key={ring.size}
            className="circle-pulse-ring absolute left-1/2 top-1/2 rounded-full border"
            style={
              {
                '--pulse-delay': ring.delay,
                width: ring.size,
                height: ring.size,
                borderColor: `rgba(255,140,0,${ring.opacity})`,
                transform: 'translate(-50%, -50%)',
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[4]"
        style={conicGradientStyle}
      />

      <div className="relative z-[5] flex h-full flex-col items-center justify-center text-center">
        <div className="mb-6 drop-shadow-[0_0_30px_rgba(240,187,0,0.4)]">
          <LogoMark size="lg" />
        </div>
        <h1
          className={`${GeistPixelLine.className} text-5xl font-medium tracking-[-2px] text-white md:text-7xl lg:text-8xl`}
        >
          1Sat Browser
        </h1>
        <p className="mt-4 text-sm font-light tracking-wide text-foreground-tertiary md:text-base">
          Your keys. Your data. Your internet.
        </p>
        <a
          href={DOWNLOAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download 1Sat Browser for Mac (opens in new tab)"
          className="cta-glow mt-8 inline-block rounded-full bg-gradient-to-br from-[#FF8C00] to-[#FFD700] px-9 py-3.5 text-sm font-semibold text-black"
        >
          Download for Mac
        </a>
      </div>
    </section>
  )
}
