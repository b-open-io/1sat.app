import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  reactCompiler: false,
  turbopack: {
    resolveAlias: {
      '@': './',
    },
  },
  experimental: {
    optimizePackageImports: ['geist'],
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: securityHeaders,
    },
    {
      source: '/videos/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      // The association file has no extension, so it would otherwise be served as
      // octet-stream. With the global nosniff header that makes iOS reject it, and every
      // Universal Link silently falls back to opening this site in Safari instead.
      source: '/.well-known/apple-app-site-association',
      headers: [
        { key: 'Content-Type', value: 'application/json' },
        { key: 'Cache-Control', value: 'public, max-age=3600' },
      ],
    },
  ],
}

export default nextConfig
