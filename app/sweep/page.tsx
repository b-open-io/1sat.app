import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { InfraNav } from '@/components/infra/InfraNav'
import { externalLinkProps } from '@/components/link-utils'

export const metadata: Metadata = {
  title: '1Sat — Sweep',
  description: 'Cancel listed OrdLock UTXOs, then sweep BSV into a new address or BRC-100 wallet.',
  robots: { index: false, follow: false },
}

export default function SweepPage() {
  return (
    <main id="main-content" className="bg-background min-h-screen">
      <InfraNav />
      <section className="mx-auto max-w-xl px-4 pt-28 pb-16">
        <p className="font-mono text-xs tracking-[0.2em] text-brand">SWEEP</p>
        <h1 className="mt-3 text-3xl font-medium text-white">Cancel, then sweep</h1>
        <p className="mt-4 text-sm text-foreground-secondary">
          The delisting panel uses your connected Yours wallet to cancel owned OrdLock listings.
          Review its completed transactions and retry any unresolved listings before sweeping funds.
        </p>
        <p className="mt-4 text-sm text-foreground-tertiary">
          Your wallet funds and approves cancellation fees. Sweeping funds runs separately in the
          wallet or desktop sweep screen linked below. Listing creation remains deprecated.
        </p>
        <p className="mt-6 flex flex-col gap-2 text-sm">
          <a
            href="https://1satwallet.com"
            {...externalLinkProps('1satwallet.com')}
            className="text-brand hover:underline"
          >
            1satwallet.com →
          </a>
          <a href="/download" className="text-brand hover:underline">
            Download 1Sat Browser →
          </a>
        </p>
      </section>
      <Footer />
    </main>
  )
}
