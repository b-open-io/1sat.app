import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '1Sat - Bitcoin Ordinals Marketplace',
  description: 'The premier marketplace for Bitcoin SV ordinals, tokens, and digital collectibles',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
