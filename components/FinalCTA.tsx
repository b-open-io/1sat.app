import { DOWNLOAD_URL } from '@/components/constants'
import { DownloadIcon } from '@/components/DownloadIcon'
import { RevealSection } from '@/components/effects/Reveal'
import { externalLinkProps } from '@/components/link-utils'

// Hoisted static style objects — avoids recreating on every render (rendering-hoist-jsx)
const ambientGlowStyle: React.CSSProperties = {
  background:
    'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,140,0,0.12) 0%, transparent 70%)',
}

const softRingStyle: React.CSSProperties = {
  width: '600px',
  height: '600px',
  background: 'radial-gradient(ellipse at center, rgba(255,140,0,0.08) 0%, transparent 65%)',
}

const headingFontStyle: React.CSSProperties = { fontSize: 'clamp(4rem, 12vw, 8rem)' }

const gradientTextStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #FF8C00 0%, #FFD700 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}

export function FinalCTA() {
  return (
    <RevealSection
      threshold={0.15}
      className="relative w-full flex flex-col items-center justify-center text-center px-4 py-32 md:py-48 overflow-hidden"
    >
      {/* Ambient glow — decorative */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={ambientGlowStyle}
      />

      {/* Soft outer ring — decorative */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={softRingStyle}
      />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/*
          The full heading is "1Sat. Take the keys." — announced as one phrase by
          screen readers via the visually-hidden sr-only span.  The two visual
          lines are aria-hidden so AT doesn't double-announce them.
        */}
        <h2
          className="font-mono font-semibold leading-none tracking-tight"
          style={headingFontStyle}
        >
          {/* Accessible text — shown to screen readers only */}
          <span className="sr-only">1Sat. Take the keys.</span>

          {/* Visual first line */}
          <span aria-hidden="true" className="block text-foreground">
            1Sat.
          </span>

          {/* Visual gradient second line */}
          <span aria-hidden="true" className="block" style={gradientTextStyle}>
            Take the keys.
          </span>
        </h2>

        <p className="text-base md:text-lg max-w-sm mt-2 leading-relaxed text-foreground-secondary">
          The browser built for the open web. No subscriptions. No data brokers. Just you.
        </p>

        <a
          href={DOWNLOAD_URL}
          {...externalLinkProps('Download 1Sat Browser for Mac')}
          className="mt-4 flex items-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-black cta-glow text-base bg-gradient-to-br from-[#FF8C00] to-[#FFD700]"
        >
          <DownloadIcon size={16} />
          Download for Mac
        </a>

        <span className="text-xs mt-1 text-foreground-tertiary">
          macOS 14+ &middot; Free &middot; Open Source
        </span>
      </div>
    </RevealSection>
  )
}
