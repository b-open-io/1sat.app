import type { Metadata } from 'next'
import { Calendar, ExternalLink, Tag } from 'lucide-react'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { getReleases, isStableRelease, type GitHubRelease } from './releases'

export const metadata: Metadata = {
  title: 'Changelog — 1Sat',
  description: 'Release history and notable changes to 1Sat.',
  alternates: {
    canonical: 'https://1sat.app/changelog',
  },
}

const GITHUB_REPO = 'b-open-io/1sat-sdk'

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

function ReleaseCard({ release, isLatest }: { release: GitHubRelease; isLatest: boolean }) {
  const stable = isStableRelease(release)

  return (
    <article className="relative pl-12 pb-10">
      {/* Timeline dot */}
      <div
        className={`absolute left-[7px] top-2 h-6 w-6 rounded-full border-2 ${
          isLatest
            ? 'border-primary bg-primary/10'
            : 'border-[rgba(255,255,255,0.08)] bg-background'
        }`}
      />

      {/* Content */}
      <div className="group">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="font-semibold text-lg group-hover:text-primary transition-colors">
            {release.name || `Release ${release.tag_name}`}
          </h2>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              background: stable ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.08)',
              color: stable ? '#10B981' : 'rgba(255,255,255,0.6)',
            }}
          >
            {stable ? 'Stable' : 'Beta'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm mb-3" style={{ color: 'rgba(255,255,255,0.38)' }}>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(release.published_at)}
          </span>
          <span>{formatRelativeDate(release.published_at)}</span>
          <a
            href={release.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors duration-200"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            GitHub
          </a>
        </div>

        {release.body ? (
          <div
            className="rounded-lg p-4 text-sm font-mono leading-relaxed whitespace-pre-wrap"
            style={{
              background: 'rgba(255,255,255,0.03)',
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            {release.body}
          </div>
        ) : (
          <p className="text-sm italic" style={{ color: 'rgba(255,255,255,0.3)' }}>
            No release notes provided.
          </p>
        )}
      </div>
    </article>
  )
}

export default async function ChangelogPage() {
  const releases = await getReleases()
  const latestRelease = releases[0]

  return (
    <main id="main-content" className="bg-background min-h-screen overflow-x-hidden">
      <Nav />

      <div className="max-w-3xl mx-auto px-4 md:px-6 pt-32 pb-24">
        {/* Page header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-6" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
            <Tag className="h-3.5 w-3.5" />
            <span>{releases.length} releases</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            Changelog
          </h1>
          <p className="mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            New updates and improvements to 1Sat. Follow along as we build in public.
          </p>
        </div>

        {/* Latest release highlight */}
        {latestRelease && (
          <div
            className="relative rounded-xl border p-6 mb-12"
            style={{
              borderColor: 'rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <div className="absolute -top-3 left-6">
              <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                Latest
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 pt-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xl font-bold text-primary">
                    {latestRelease.tag_name}
                  </span>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.38)' }}>
                    {formatRelativeDate(latestRelease.published_at)}
                  </span>
                </div>
                {latestRelease.body && (
                  <p className="text-sm line-clamp-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {latestRelease.body}
                  </p>
                )}
              </div>
              <a
                href="/download"
                className="shrink-0 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Download
              </a>
            </div>
          </div>
        )}

        {/* Release timeline */}
        <div className="relative">
          <div className="absolute left-[19px] top-2 bottom-2 w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="space-y-0">
            {releases.map((release, index) => (
              <ReleaseCard key={release.id} release={release} isLatest={index === 0} />
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        {releases.length > 0 && (
          <div className="mt-12 pt-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.38)' }}>
              View the full source on GitHub
            </p>
            <a
              href={`https://github.com/${GITHUB_REPO}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[rgba(255,255,255,0.05)]"
              style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}
            >
              View on GitHub
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}

        {releases.length === 0 && (
          <div className="text-center py-16">
            <p style={{ color: 'rgba(255,255,255,0.38)' }}>No releases found.</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
