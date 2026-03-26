import { NextResponse } from 'next/server'

const DOWNLOAD_JSON_URL =
  'https://dbopkrmhgavaffea.public.blob.vercel-storage.com/releases/download.json'

const GITHUB_RELEASES_URL = 'https://github.com/b-open-io/1sat-sdk/releases/latest'

export async function GET() {
  try {
    const response = await fetch(DOWNLOAD_JSON_URL, {
      next: { revalidate: 60 },
    })

    if (response.ok) {
      const data = await response.json()
      const url = data?.macos?.url ?? data?.url
      if (url) {
        return NextResponse.json({
          url,
          version: data?.macos?.version ?? data?.version ?? null,
          filename: data?.macos?.filename ?? data?.filename ?? null,
        })
      }
    }
  } catch {
    // Fall through to fallback
  }

  return NextResponse.json({ url: GITHUB_RELEASES_URL, version: null, filename: null })
}
