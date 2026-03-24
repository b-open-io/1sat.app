const GITHUB_REPO = 'b-open-io/1sat-sdk'

export interface GitHubRelease {
  id: number
  tag_name: string
  name: string
  body: string | null
  published_at: string
  html_url: string
  prerelease: boolean
}

function parseVersion(tag: string): [number, number, number] | null {
  const match = tag.replace(/^v/, '').match(/^(\d+)\.(\d+)\.(\d+)/)
  if (!match) return null
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

export function isStableRelease(release: GitHubRelease): boolean {
  const version = parseVersion(release.tag_name)
  if (!version) return false
  return !release.prerelease
}

export async function getReleases(): Promise<GitHubRelease[]> {
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': '1sat-app',
    }

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`
    }

    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases`, {
      headers,
      next: { revalidate: 300 },
    })

    if (!response.ok) return []

    const all: GitHubRelease[] = await response.json()
    return all.sort(
      (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
    )
  } catch {
    return []
  }
}
