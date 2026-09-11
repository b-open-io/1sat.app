import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { InfraNav } from '@/components/infra/InfraNav'
import { externalLinkProps } from '@/components/link-utils'
import { OrdLockCancelOnSweep } from '@/components/OrdLockCancelOnLoad'

export const metadata: Metadata = {
  title: '1Sat — Sweep',
  description: 'Cancel listed OrdLock UTXOs, then sweep BSV into a new address or BRC-100 wallet.',
  robots: { index: false, follow: false },
}

export default function SweepPage() {
  return (
    <main id="main-content" className="bg-background min-h-screen">
      <OrdLockCancelOnSweep />
      <InfraNav />
      <section className="mx-auto max-w-xl px-4 pt-28 pb-16">
        <p className="font-mono text-xs tracking-[0.2em] text-brand">SWEEP</p>
        <h1 className="mt-3 text-3xl font-medium text-white">Cancel, then sweep</h1>
        <p className="mt-4 text-sm text-foreground-secondary">
          Listed OrdLock UTXOs are cancelled first (cancel→BRC-100) when a wallet is already loaded.
          Create listing stays off. Buy and cancel stay on.
        </p>
        <p className="mt-4 text-sm text-foreground-tertiary">
          Full BSV sweep (cancel→new address or continue into BRC-100) runs in the 1Sat wallet /
          desktop sweep UI. This page will not create listings.
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
