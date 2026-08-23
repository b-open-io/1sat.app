import { GeistPixelLine } from 'geist/font/pixel'
import { externalLinkProps } from '@/components/link-utils'

export function Quickstart() {
  return (
    <section id="sdk" className="border-t border-divider">
      <div className="mx-auto max-w-5xl px-4 py-24 md:px-8 md:py-32">
        <p className="font-mono text-xs tracking-[0.2em] text-brand">SDK</p>
        <h2
          className={`${GeistPixelLine.className} mt-3 text-3xl font-medium text-white md:text-5xl`}
        >
          Build with it
        </h2>

        <div className="mt-12 rounded-xl border border-glass-border bg-glass-surface p-5 font-mono text-xs md:text-sm">
          <p className="text-foreground-quaternary"># unified indexer client</p>
          <p>
            <span className="text-foreground-quaternary">$ </span>
            <span className="text-foreground">bun add @1sat/client</span>
          </p>
          <p className="mt-4 text-foreground-quaternary">
            # agent skills (Claude Code, Cursor, ...)
          </p>
          <p>
            <span className="text-foreground-quaternary">$ </span>
            <span className="text-foreground">
              npx skills add b-open-io/1sat-sdk --skill 1sat-stack
            </span>
          </p>
          <p className="mt-4 text-foreground-quaternary"># hit the stack directly</p>
          <p>
            <span className="text-foreground-quaternary">$ </span>
            <span className="text-foreground">
              curl https://api.1sat.app/1sat/chaintracks/height
            </span>
          </p>
        </div>

        <p className="mt-4 font-mono text-xs text-foreground-quaternary">
          Packages: @1sat/client · @1sat/actions · @1sat/wallet · @1sat/connect · @1sat/react ·
          @1sat/types{' '}
          <a
            href="https://github.com/b-open-io/1sat-sdk"
            {...externalLinkProps('1Sat SDK on GitHub')}
            className="text-brand hover:underline"
          >
            github.com/b-open-io/1sat-sdk
          </a>
        </p>
      </div>
    </section>
  )
}
