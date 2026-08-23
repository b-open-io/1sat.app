import { GeistPixelLine } from 'geist/font/pixel'
import { LogoMark } from '@/components/LogoMark'
import { externalLinkProps } from '@/components/link-utils'

const pulseRings = [
  { size: 500, opacity: 0.05, delay: '0s' },
  { size: 350, opacity: 0.09, delay: '0.5s' },
  { size: 200, opacity: 0.14, delay: '1s' },
]

export function InfraHero() {
  return (
    <section className="relative h-svh overflow-hidden bg-background">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        {pulseRings.map((ring) => (
          <div
            key={ring.size}
            className="circle-pulse-ring absolute top-1/2 left-1/2 rounded-full border"
            style={
              {
                '--pulse-delay': ring.delay,
                width: ring.size,
                height: ring.size,
                borderColor: `rgba(240,187,0,${ring.opacity})`,
                transform: 'translate(-50%, -50%)',
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="relative z-[1] flex h-full flex-col items-center justify-center text-center">
        <div className="mb-6 drop-shadow-[0_0_30px_rgba(240,187,0,0.4)]">
          <LogoMark size="lg" />
        </div>
        <h1
          className={`${GeistPixelLine.className} text-5xl font-medium tracking-[-2px] text-white md:text-7xl lg:text-8xl`}
        >
          1Sat Infrastructure
        </h1>
        <p className="mt-4 text-sm tracking-wide text-foreground-tertiary">
          Public APIs and indexers for 1Sat Ordinals on BSV.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <a
            href="https://api.1sat.app/1sat/home/"
            {...externalLinkProps('Explore the API')}
            className="rounded-full bg-brand px-9 py-3.5 text-sm font-semibold text-black"
          >
            Explore the API
          </a>
          <a
            href="#services"
            className="rounded-full border border-glass-border px-9 py-3.5 text-sm text-foreground-secondary transition-colors hover:border-brand/40 hover:text-foreground"
          >
            View services
          </a>
        </div>
      </div>

      <p className="absolute bottom-8 left-0 right-0 text-center font-mono text-xs text-foreground-quaternary">
        $ curl https://api.1sat.app/1sat/chaintracks/height
      </p>
    </section>
  )
}
