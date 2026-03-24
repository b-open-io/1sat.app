import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://1sat.app'),
  title: '1Sat Browser — Your keys. Your data. Your internet.',
  description:
    'The browser that pays you back. Browse, collect, and own your internet with Secure Enclave protection, on-chain publishing, and native dApp connectivity.',
  keywords: [
    'BSV',
    'Bitcoin SV',
    'Bitcoin',
    'ordinals',
    '1Sat Ordinals',
    'wallet',
    'browser',
    'Secure Enclave',
    'blockchain',
    'dApp',
    'self-sovereign identity',
    'BAP',
    'on-chain',
    'peer-to-peer',
    'crypto browser',
    'Web3 browser',
    'NFT',
    'inscription',
  ],
  authors: [{ name: '1Sat', url: 'https://1sat.app' }],
  creator: '1Sat',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://1sat.app',
  },
  openGraph: {
    title: '1Sat Browser — Your keys. Your data. Your internet.',
    description:
      'The browser that pays you back. Browse, collect, and own your internet with Secure Enclave protection, on-chain publishing, and native dApp connectivity.',
    url: 'https://1sat.app',
    siteName: '1Sat Browser',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '1Sat Browser — Your keys. Your data. Your internet.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '1Sat Browser — Your keys. Your data. Your internet.',
    description:
      'The browser that pays you back. Browse, collect, and own your internet with Secure Enclave protection, on-chain publishing, and native dApp connectivity.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/icon', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon', type: 'image/png', sizes: '180x180' },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <meta name="theme-color" content="#050505" />
        <meta name="color-scheme" content="dark" />
        {/* Preload hero video so the WebGL background renders sooner */}
        <link rel="preload" href="/videos/hero-bg.mp4" as="video" type="video/mp4" />
        {/* DNS prefetch for external links */}
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="dns-prefetch" href="https://twitter.com" />
      </head>
      <body className="font-sans antialiased">
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
