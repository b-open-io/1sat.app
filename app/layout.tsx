import { GeistMono } from 'geist/font/mono'
import { GeistPixelLine } from 'geist/font/pixel'
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://1sat.app'),
  title: '1Sat — Bitcoin infrastructure',
  description:
    'Public APIs and indexers for 1Sat Ordinals on BSV: unified indexing, transaction broadcast, wallet hosting, encrypted messaging, and identity overlays.',
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
    title: '1Sat — Bitcoin infrastructure',
    description:
      'Public APIs and indexers for 1Sat Ordinals on BSV: unified indexing, transaction broadcast, wallet hosting, encrypted messaging, and identity overlays.',
    url: 'https://1sat.app',
    siteName: '1Sat',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '1Sat Infrastructure — Your keys. Your data. Your internet.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '1Sat — Bitcoin infrastructure',
    description:
      'Public APIs and indexers for 1Sat Ordinals on BSV: unified indexing, transaction broadcast, wallet hosting, encrypted messaging, and identity overlays.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [{ url: '/icon', type: 'image/png', sizes: '32x32' }],
    apple: [{ url: '/apple-icon', type: 'image/png', sizes: '180x180' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelLine.variable}`}
    >
      <head>
        <meta name="theme-color" content="#050505" />
        <meta name="color-scheme" content="dark" />
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
