import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { InfraNav } from '@/components/infra/InfraNav'
import { externalLinkProps } from '@/components/link-utils'

export const metadata: Metadata = {
  title: '1Sat — Wallet session',
  description:
    'BRC-100 wallet session. Listed OrdLock UTXOs are cancelled into the wallet on load.',
  robots: { index: false, follow: false },
}

export default function Brc100Page() {
  return (
    <main id="main-content" className="bg-background min-h-screen">
      <InfraNav />
      <section className="mx-auto max-w-xl px-4 pt-28 pb-16">
        <p className="font-mono text-xs tracking-[0.2em] text-brand">BRC-100</p>
        <h1 className="mt-3 text-3xl font-medium text-white">Wallet session</h1>
        <p className="mt-4 text-sm text-foreground-secondary">
          Listing create is off. Buy and cancel of existing listings stay on. When a wallet is
          already loaded on this origin, listed OrdLock UTXOs are cancelled into BRC-100 (OPL-4696).
        </p>
        <p className="mt-4 text-sm text-foreground-tertiary">
          Native 1Sat Wallet handles <code className="font-mono">/brc100/pay</code> via Universal
          Links. Web fallback does not prompt a new connect.
        </p>
        <p className="mt-6 text-sm">
          <a
            href="https://1satwallet.com"
            {...externalLinkProps('1satwallet.com')}
            className="text-brand hover:underline"
          >
            Open 1satwallet.com →
          </a>
        </p>
      </section>
      <Footer />
    </main>
  )
}
