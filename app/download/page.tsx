import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { SetupSteps } from '@/components/download/SetupSteps'
import { FAQ } from '@/components/download/FAQ'
import { DownloadClient } from './DownloadClient'

export const metadata: Metadata = {
  title: '1Sat — Download for Mac',
  description:
    'Download 1Sat Browser for macOS. Create your account, configure your browser, and explore the metanet.',
}

export default function DownloadPage() {
  return (
    <main id="main-content" className="bg-background min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center max-w-3xl mx-auto">
        <h1 className="font-mono font-bold leading-tight" style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)' }}>
          <span className="text-foreground">Getting started with </span>
          <span className="bg-gradient-to-r from-[#FF8C00] to-[#FFD700] bg-clip-text text-transparent">
            1Sat
          </span>
          <br />
          <span className="text-foreground">is as easy as </span>
          <span className="bg-gradient-to-r from-[#FF8C00] to-[#FFD700] bg-clip-text text-transparent">
            1&#8209;2&#8209;3
          </span>
        </h1>
        <p className="mt-4 text-foreground-secondary">Your download should begin automatically.</p>
        <DownloadClient />
      </section>

      <SetupSteps />
      <FAQ />
      <Footer />
    </main>
  )
}
