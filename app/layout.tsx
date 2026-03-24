import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '1Sat Browser — Your keys. Your data. Your internet.',
  description:
    'The browser that pays you back. Browse, collect, and own your internet with Secure Enclave protection, on-chain publishing, and native dApp connectivity.',
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
