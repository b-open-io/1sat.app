import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'

export const metadata: Metadata = {
  title: 'Changelog — 1Sat Browser',
  description: 'Release history and notable changes to 1Sat Browser.',
  alternates: {
    canonical: 'https://1sat.app/changelog',
  },
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChangelogItem {
  text: string
}

interface ChangelogCategory {
  name: string
  items: ChangelogItem[]
}

interface ChangelogVersion {
  version: string
  date: string
  categories: ChangelogCategory[]
}

// ---------------------------------------------------------------------------
// Category color map
// ---------------------------------------------------------------------------

const CATEGORY_COLORS: Record<string, string> = {
  Added: '#10B981',
  Changed: '#FF8C00',
  Fixed: '#06B6D4',
  Removed: '#EF4444',
  Security: '#9B6DFF',
  Improved: '#0D9488',
  Deprecated: '#F59E0B',
}

function categoryColor(name: string): string {
  return CATEGORY_COLORS[name] ?? 'rgba(255,255,255,0.6)'
}

// ---------------------------------------------------------------------------
// Parser
// ---------------------------------------------------------------------------

function parseChangelog(raw: string): ChangelogVersion[] {
  const versions: ChangelogVersion[] = []

  // Split on version headers: ## [X.Y.Z] - YYYY-MM-DD
  const versionRegex = /^## \[([^\]]+)\] - (\d{4}-\d{2}-\d{2})/m
  const sections = raw.split(/^(?=## \[)/m).filter((s) => versionRegex.test(s))

  for (const section of sections) {
    const lines = section.split('\n')
    const headerLine = lines[0]
    const headerMatch = headerLine.match(/^## \[([^\]]+)\] - (\d{4}-\d{2}-\d{2})/)
    if (!headerMatch) continue

    const version = headerMatch[1]
    const date = headerMatch[2]
    const categories: ChangelogCategory[] = []
    let currentCategory: ChangelogCategory | null = null

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]

      // Category header: ### Name
      const categoryMatch = line.match(/^### (.+)/)
      if (categoryMatch) {
        currentCategory = { name: categoryMatch[1].trim(), items: [] }
        categories.push(currentCategory)
        continue
      }

      // Bullet item: - text
      const itemMatch = line.match(/^- (.+)/)
      if (itemMatch && currentCategory) {
        currentCategory.items.push({ text: itemMatch[1].trim() })
      }
    }

    versions.push({ version, date, categories })
  }

  return versions
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ChangelogPage() {
  const filePath = join(process.cwd(), 'CHANGELOG.md')
  const raw = await readFile(filePath, 'utf-8')
  const versions = parseChangelog(raw)

  return (
    <main id="main-content" className="bg-background min-h-screen overflow-x-hidden">
      <Nav />

      <div className="max-w-3xl mx-auto px-4 md:px-6 pt-32 pb-24">
        {/* Page header */}
        <div className="mb-12">
          <p
            className="text-xs font-mono tracking-widest uppercase mb-3"
            style={{ color: 'rgba(255,255,255,0.38)' }}
          >
            Release history
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            Changelog
          </h1>
          <p className="mt-3 text-sm text-foreground-secondary">
            All notable changes to 1Sat Browser, following{' '}
            <a
              href="https://keepachangelog.com/en/1.1.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors duration-200"
            >
              Keep a Changelog
            </a>{' '}
            and{' '}
            <a
              href="https://semver.org/spec/v2.0.0.html"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors duration-200"
            >
              Semantic Versioning
            </a>
            .
          </p>
        </div>

        {/* Version cards */}
        <div className="flex flex-col gap-6">
          {versions.map((v) => (
            <article
              key={v.version}
              className="rounded-2xl border px-6 py-6 md:px-8 md:py-7"
              style={{
                borderColor: 'rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
              }}
            >
              {/* Version header row */}
              <div className="flex items-baseline gap-4 mb-5">
                <span
                  className="text-xl font-semibold tracking-tight font-mono"
                  style={{ color: 'rgba(255,255,255,0.9)' }}
                >
                  v{v.version}
                </span>
                <span
                  className="text-xs font-mono tracking-wide"
                  style={{ color: 'rgba(255,255,255,0.38)' }}
                >
                  {v.date}
                </span>
              </div>

              {/* Categories */}
              <div className="flex flex-col gap-5">
                {v.categories.map((cat) => (
                  <div key={cat.name}>
                    <h3
                      className="text-xs font-mono font-semibold tracking-widest uppercase mb-2.5"
                      style={{ color: categoryColor(cat.name) }}
                    >
                      {cat.name}
                    </h3>
                    <ul className="flex flex-col gap-1.5">
                      {cat.items.map((item, idx) => (
                        <li
                          // biome-ignore lint/suspicious/noArrayIndexKey: static parsed content, no reordering
                          key={idx}
                          className="flex items-start gap-2.5 text-sm"
                          style={{ color: 'rgba(255,255,255,0.6)' }}
                        >
                          <span
                            className="mt-[0.4em] shrink-0 w-1 h-1 rounded-full"
                            style={{ background: categoryColor(cat.name), opacity: 0.7 }}
                            aria-hidden="true"
                          />
                          {item.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  )
}
