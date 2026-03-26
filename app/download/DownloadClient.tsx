'use client'

import { useEffect, useRef, useState } from 'react'

const GITHUB_RELEASES_URL = 'https://github.com/b-open-io/1sat-sdk/releases/latest'

export function DownloadClient() {
  const triggered = useRef(false)
  const [status, setStatus] = useState<'loading' | 'downloading' | 'failed'>('loading')
  const [version, setVersion] = useState<string | null>(null)

  useEffect(() => {
    if (triggered.current) return
    triggered.current = true

    fetch('/api/download/macos')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch download URL')
        return res.json()
      })
      .then((data: { url: string; version: string | null }) => {
        setVersion(data.version)
        setStatus('downloading')
        window.location.assign(data.url)
      })
      .catch(() => {
        setStatus('failed')
      })
  }, [])

  if (status === 'loading') {
    return (
      <div className="mt-5 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-glass-surface border border-glass-border text-sm text-foreground-secondary">
        <Spinner />
        Preparing download…
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <a
        href={GITHUB_RELEASES_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-black bg-gradient-to-br from-[#FF8C00] to-[#FFD700] cta-glow"
      >
        Download manually
      </a>
    )
  }

  return (
    <div className="mt-5 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-glass-surface border border-glass-border text-sm">
      <Spinner />
      <span className="text-[#FFD700]">
        Downloading 1Sat Browser{version ? ` v${version}` : ''} for macOS…
      </span>
    </div>
  )
}

function Spinner() {
  return (
    <div
      className="w-3.5 h-3.5 rounded-full border-2 border-[rgba(255,140,0,0.3)] border-t-[#FF8C00] animate-spin"
      aria-hidden="true"
    />
  )
}
