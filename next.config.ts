import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: false,
  turbopack: {
    resolveAlias: {
      '@': './',
    },
  },
}

export default nextConfig
