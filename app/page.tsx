import type { Metadata } from 'next'
import { FeatureSection, type FeatureSectionProps } from '@/components/FeatureSection'
import { FinalCTA } from '@/components/FinalCTA'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { Nav } from '@/components/Nav'
import { StatsBar } from '@/components/StatsBar'

export const metadata: Metadata = {
  title: '1Sat — The Browser Built for the Open Web',
  description:
    'Create, own, and connect on Bitcoin SV. Inscribe files, mint ordinals, manage your self-sovereign identity, and transact peer-to-peer — all from one native browser.',
}

const features: FeatureSectionProps[] = [
  {
    keyword: 'Creating',
    subtitle:
      'Publish anything on-chain. Inscribe files. Mint ordinals. Directly from your browser.',
    gradientColors: ['#FF8C00', '#FFD700', '#FF6B35'],
    id: 'creating',
    slides: [
      {
        title: 'File Inscription',
        description:
          'Drag, drop, inscribe. Any file type becomes a permanent on-chain artifact in seconds — no command line required.',
      },
      {
        title: 'Mint Ordinals',
        description:
          'Create 1Sat Ordinals with a native minting interface. Set metadata, royalties, and publish directly to the blockchain.',
      },
      {
        title: 'On-Chain Publishing',
        description:
          'Publish text, images, or full applications immutably. Your content lives on the chain, not in a cloud that can disappear.',
      },
    ],
  },
  {
    keyword: 'Owning',
    subtitle: 'Your keys. Your identity. Your data. No custodians. No middlemen. Just you.',
    gradientColors: ['#6B3FA0', '#9B6DFF', '#B794F6'],
    id: 'owning',
    slides: [
      {
        title: 'BAP Identity',
        description:
          'Bitcoin Attestation Protocol gives you a portable, self-sovereign identity that no platform can revoke or delete.',
      },
      {
        title: 'Self-Sovereign Keys',
        description:
          'Your private keys never leave your device. Sign transactions locally with hardware-level Secure Enclave protection.',
      },
      {
        title: 'No Cloud',
        description:
          'Zero data stored on 1Sat servers. Browse, transact, and collect with full privacy by default.',
      },
    ],
  },
  {
    keyword: 'Connecting',
    subtitle: 'Peer-to-peer. Interoperable. No middlemen between you and the network.',
    gradientColors: ['#0D9488', '#06B6D4', '#22D3EE'],
    id: 'connecting',
    slides: [
      {
        title: 'dApp Browser',
        description:
          'Connect to any BSV application natively. No extensions, no wallet popups — just seamless, in-browser dApp integration.',
      },
      {
        title: 'Peer-to-Peer',
        description:
          'Send and receive value directly between peers. The network routes around intermediaries by design.',
      },
      {
        title: 'Interoperable',
        description:
          'Open protocols mean your assets and identity work across every BSV app in the ecosystem, not just ours.',
      },
    ],
  },
  {
    keyword: 'Securing',
    subtitle: 'Trustless by design. Hardware-level protection. Nothing to trust but math.',
    gradientColors: ['#059669', '#10B981', '#34D399'],
    id: 'securing',
    slides: [
      {
        title: 'Secure Enclave',
        description:
          "Keys live in Apple's Secure Enclave — isolated hardware that even the OS cannot access. No software vulnerability can expose them.",
      },
      {
        title: 'Trustless',
        description:
          "Every transaction is cryptographically verifiable. You don't need to trust 1Sat — the math does it for you.",
      },
      {
        title: 'Native Performance',
        description:
          'Built with Swift and native APIs, not an Electron wrapper. Security and speed are not a trade-off.',
      },
    ],
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '1Sat Browser',
  description:
    'The browser that pays you back. Browse, collect, and own your internet with Secure Enclave protection.',
  url: 'https://1sat.app',
  applicationCategory: 'BrowserApplication',
  operatingSystem: 'macOS',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
}

export default function Home() {
  return (
    <main id="main-content" className="bg-background min-h-screen overflow-x-hidden">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: controlled static JSON-LD, no user input
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <Hero />

      <div id="features" className="flex flex-col items-center border-t border-divider">
        {features.map((feature) => (
          <FeatureSection key={feature.id} {...feature} />
        ))}
      </div>

      <StatsBar />
      <FinalCTA />
      <Footer />
    </main>
  )
}
