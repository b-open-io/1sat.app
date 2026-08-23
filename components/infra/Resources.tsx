import { GeistPixelLine } from 'geist/font/pixel'
import type { ComponentType } from 'react'
import { HandCashIcon, OneSatIcon, OrdinalsIcon, XIcon, YoursIcon } from '@/components/infra/icons'
import { externalLinkProps } from '@/components/link-utils'

type Resource = {
  label: string
  desc: string
  href: string
  icon: ComponentType<{ className?: string }>
}

const RESOURCES: Resource[] = [
  {
    label: '1satordinals.com',
    desc: 'Official 1Sat Ordinals website and protocol docs.',
    href: 'https://1satordinals.com',
    icon: OrdinalsIcon,
  },
  {
    label: '1sat.name',
    desc: 'OpNS names — minting, mining, and registry.',
    href: 'https://1sat.name',
    icon: OneSatIcon,
  },
  {
    label: '1satwallet.com',
    desc: '1Sat web wallet.',
    href: 'https://1satwallet.com',
    icon: OneSatIcon,
  },
  {
    label: '1sat.market',
    desc: 'Ordinals marketplace and wallet.',
    href: 'https://1sat.market',
    icon: OneSatIcon,
  },
  {
    label: 'yours.org',
    desc: 'Yours Wallet — 1Sat-enabled browser wallet.',
    href: 'https://yours.org',
    icon: YoursIcon,
  },
  {
    label: 'handcash.io',
    desc: 'HandCash — 1Sat-enabled wallet.',
    href: 'https://handcash.io',
    icon: HandCashIcon,
  },
  {
    label: '@1satordinals',
    desc: 'Official 1Sat Ordinals account on X.',
    href: 'https://x.com/1satordinals',
    icon: XIcon,
  },
]

export function Resources() {
  return (
    <section id="resources" className="border-t border-divider">
      <div className="mx-auto max-w-5xl px-4 py-24 md:px-8 md:py-32">
        <p className="font-mono text-xs tracking-[0.2em] text-brand">RESOURCES</p>
        <h2
          className={`${GeistPixelLine.className} mt-3 text-3xl font-medium text-white md:text-5xl`}
        >
          Around the ecosystem
        </h2>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((r) => (
            <a
              key={r.label}
              href={r.href}
              {...externalLinkProps(r.label)}
              className="flex items-center gap-4 rounded-xl border border-glass-border bg-glass-surface p-4 transition-colors hover:border-brand/40 group"
            >
              <r.icon className="h-5 w-5 shrink-0 text-foreground-secondary transition-colors group-hover:text-brand" />
              <div>
                <p className="font-mono text-sm text-foreground">{r.label}</p>
                <p className="mt-0.5 text-xs text-foreground-tertiary">{r.desc}</p>
              </div>
              <span className="ml-auto text-foreground-quaternary">↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
