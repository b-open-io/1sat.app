import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { InfraHero } from '@/components/infra/InfraHero'
import { InfraNav } from '@/components/infra/InfraNav'
import { Quickstart } from '@/components/infra/Quickstart'
import { Resources } from '@/components/infra/Resources'
import { ServiceGrid } from '@/components/infra/ServiceGrid'
import { externalLinkProps } from '@/components/link-utils'

export const metadata: Metadata = {
  title: '1Sat — Bitcoin infrastructure',
  description:
    'Public APIs and indexers for 1Sat Ordinals on BSV: unified indexing, transaction broadcast, wallet hosting, encrypted messaging, and identity overlays.',
  alternates: { canonical: 'https://1sat.app' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '1Sat',
  url: 'https://1sat.app',
}

export default function Home() {
  return (
    <main id="main-content" className="bg-background min-h-screen overflow-x-hidden">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: controlled static JSON-LD, no user input
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InfraNav />
      <InfraHero />
      <ServiceGrid />
      <Quickstart />
      <Resources />

      <section className="border-t border-divider px-4 py-16">
        <p className="mx-auto max-w-xl text-center text-sm text-foreground-tertiary">
          We're also building a browser for the open web.{' '}
          <a href="/browser" className="text-brand hover:underline">
            Preview 1Sat Browser →
          </a>
        </p>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-foreground-tertiary">
          Want a wallet right now?{' '}
          <a
            href="https://1satwallet.com"
            {...externalLinkProps('1satwallet.com')}
            className="text-brand hover:underline"
          >
            1satwallet.com →
          </a>
        </p>
      </section>

      <Footer />
    </main>
  )
}
