# Download Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the GitHub redirect with a Dia-style download page that auto-starts the .dmg download and shows setup instructions.

**Architecture:** New `/download` page (server + client components) with an `/api/download/macos` JSON endpoint. The existing redirect route becomes a backward-compat redirect to `/download`. Page sections are split into focused components under `components/download/`.

**Tech Stack:** Next.js 16, React 19, TailwindCSS v4, Geist fonts, existing reveal animation system.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `app/api/download/macos/route.ts` | Create | JSON API — returns `{ url, version, filename }` from blob storage |
| `app/download/page.tsx` | Create | Server component — metadata, page layout, assembles sections |
| `app/download/DownloadClient.tsx` | Create | Client component — auto-download trigger + status badge |
| `components/download/SetupSteps.tsx` | Create | The 1-2-3 numbered steps with alternating layout |
| `components/download/FAQ.tsx` | Create | Collapsible FAQ accordion |
| `app/download/macos/route.ts` | Modify | Change from blob-fetch-redirect to simple redirect to `/download` |
| `components/constants.ts` | Modify | Change `DOWNLOAD_URL` from `/download/macos` to `/download` |
| `components/Hero.tsx` | Modify | Remove `target="_blank"` — download link is now an internal page |
| `components/Nav.tsx` | Modify | Remove `target="_blank"` from download link |
| `components/FinalCTA.tsx` | Modify | Remove external link props from download link |

---

### Task 1: JSON API Endpoint

**Files:**
- Create: `app/api/download/macos/route.ts`

- [ ] **Step 1: Create the JSON API endpoint**

```ts
// app/api/download/macos/route.ts
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
```

- [ ] **Step 2: Verify the endpoint works**

Run: `curl http://localhost:3000/api/download/macos 2>/dev/null | jq .`

Expected: JSON response with `url`, `version`, `filename` fields.

- [ ] **Step 3: Commit**

```bash
git add app/api/download/macos/route.ts
git commit -m "feat: add JSON API endpoint for download URL"
```

---

### Task 2: Download Page Server Component

**Files:**
- Create: `app/download/page.tsx`

- [ ] **Step 1: Create the download page with metadata**

```tsx
// app/download/page.tsx
import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { SetupSteps } from '@/components/download/SetupSteps'
import { FAQ } from '@/components/download/FAQ'
import { DownloadClient } from './DownloadClient'

export const metadata: Metadata = {
  title: '1Sat — Download for Mac',
  description:
    'Download 1Sat Browser for macOS. Create your account, configure your browser, and explore the metanet.',
}

export default function DownloadPage() {
  return (
    <main id="main-content" className="bg-background min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center max-w-3xl mx-auto">
        <h1 className="font-mono font-bold leading-tight" style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)' }}>
          <span className="text-foreground">Getting started with </span>
          <span className="bg-gradient-to-r from-[#FF8C00] to-[#FFD700] bg-clip-text text-transparent">
            1Sat
          </span>
          <br />
          <span className="text-foreground">is as easy as </span>
          <span className="bg-gradient-to-r from-[#FF8C00] to-[#FFD700] bg-clip-text text-transparent">
            1&#8209;2&#8209;3
          </span>
        </h1>
        <p className="mt-4 text-foreground-secondary">Your download should begin automatically.</p>
        <DownloadClient />
      </section>

      <SetupSteps />
      <FAQ />
      <Footer />
    </main>
  )
}
```

- [ ] **Step 2: Create stub components so the page compiles**

Create minimal stubs for `DownloadClient`, `SetupSteps`, and `FAQ` so the page renders without errors. These will be fully implemented in subsequent tasks.

`app/download/DownloadClient.tsx`:
```tsx
'use client'

export function DownloadClient() {
  return (
    <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-glass-surface border border-glass-border text-sm text-foreground-secondary">
      Loading...
    </div>
  )
}
```

`components/download/SetupSteps.tsx`:
```tsx
export function SetupSteps() {
  return <section className="max-w-4xl mx-auto px-4 py-16" />
}
```

`components/download/FAQ.tsx`:
```tsx
export function FAQ() {
  return <section className="max-w-2xl mx-auto px-4 py-16" />
}
```

- [ ] **Step 3: Verify the page renders**

Run: `open http://localhost:3000/download`

Expected: Page loads with the hero heading, "Your download should begin automatically.", Nav, and Footer. No errors in terminal.

- [ ] **Step 4: Commit**

```bash
git add app/download/page.tsx app/download/DownloadClient.tsx components/download/SetupSteps.tsx components/download/FAQ.tsx
git commit -m "feat: scaffold download page with stub components"
```

---

### Task 3: Auto-Download Client Component

**Files:**
- Modify: `app/download/DownloadClient.tsx`

- [ ] **Step 1: Implement the auto-download trigger**

```tsx
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
```

- [ ] **Step 2: Verify auto-download triggers**

Run: `open http://localhost:3000/download`

Expected: Page loads, shows "Preparing download…" briefly, then switches to "Downloading 1Sat Browser for macOS…" and the browser's download dialog appears (or navigates to the .dmg URL).

- [ ] **Step 3: Commit**

```bash
git add app/download/DownloadClient.tsx
git commit -m "feat: auto-download trigger with status badge"
```

---

### Task 4: Setup Steps Component

**Files:**
- Modify: `components/download/SetupSteps.tsx`

- [ ] **Step 1: Implement the 1-2-3 steps with alternating layout**

```tsx
// components/download/SetupSteps.tsx
import { RevealDiv } from '@/components/effects/Reveal'

const steps = [
  {
    number: 1,
    title: 'Create your account.',
    description: (
      <>
        Open 1Sat and create a new wallet — it takes seconds. Your{' '}
        <span className="text-foreground font-medium">private keys are generated locally</span> and
        stored in the Secure Enclave. Nothing leaves your device.
      </>
    ),
  },
  {
    number: 2,
    title: 'Configure your browser.',
    description: (
      <>
        Import bookmarks from your old browser, or start fresh. Configure your{' '}
        <span className="text-foreground font-medium">local stack options</span> — node connection,
        indexer preferences, and network settings.
      </>
    ),
  },
  {
    number: 3,
    title: 'Explore the metanet.',
    description: (
      <>
        Browse with <span className="text-foreground font-medium">agentic AI control</span>,
        interact with on-chain apps natively, and use your{' '}
        <span className="text-foreground font-medium">built-in wallet</span> to transact
        peer-to-peer — all from a browser that&rsquo;s{' '}
        <span className="text-foreground font-medium">metanet-native</span>.
      </>
    ),
  },
] as const

export function SetupSteps() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex flex-col gap-24">
        {steps.map((step, i) => {
          const reversed = i % 2 === 1
          return (
            <RevealDiv key={step.number} threshold={0.15}>
              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${reversed ? 'md:[direction:rtl]' : ''}`}
              >
                <div className={reversed ? 'md:[direction:ltr]' : ''}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF8C00] to-[#FFD700] flex items-center justify-center text-black font-bold text-sm mb-4">
                    {step.number}
                  </div>
                  <h3 className="font-mono font-semibold text-2xl text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-foreground-secondary leading-relaxed">{step.description}</p>
                </div>
                <div
                  className={`aspect-[4/3] rounded-xl border border-glass-border bg-glass-surface flex items-center justify-center text-foreground-quaternary text-sm italic ${reversed ? 'md:[direction:ltr]' : ''}`}
                >
                  Screenshot coming soon
                </div>
              </div>
            </RevealDiv>
          )
        })}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify steps render with alternating layout**

Run: `open http://localhost:3000/download`

Expected: Three numbered steps visible. Step 1 has text-left/image-right, Step 2 has text-right/image-left, Step 3 has text-left/image-right. Reveal animations trigger on scroll.

- [ ] **Step 3: Commit**

```bash
git add components/download/SetupSteps.tsx
git commit -m "feat: setup steps with alternating layout"
```

---

### Task 5: FAQ Accordion Component

**Files:**
- Modify: `components/download/FAQ.tsx`

- [ ] **Step 1: Implement the collapsible FAQ accordion**

```tsx
// components/download/FAQ.tsx
'use client'

import { useState } from 'react'
import { RevealSection } from '@/components/effects/Reveal'

const faqs = [
  {
    q: 'What is 1Sat Browser?',
    a: 'A native macOS browser with a built-in Bitcoin wallet, AI assistant, and direct access to on-chain applications. No extensions, no wrappers — everything is integrated at the browser level.',
  },
  {
    q: 'How is this different from Chrome with a wallet extension?',
    a: "Extensions are sandboxed and limited. 1Sat integrates wallet, identity, and AI at the browser level — no popups, no middlemen. Transactions are signed in the Secure Enclave, not in a JavaScript sandbox.",
  },
  {
    q: 'Is my data private?',
    a: 'Yes. Keys live in the Secure Enclave. No data is stored on our servers. Browse and transact with full privacy by default.',
  },
  {
    q: 'Can I import from my current browser?',
    a: 'Yes — bookmarks, history, and passwords can be imported from Chrome, Safari, Arc, and other Chromium browsers.',
  },
  {
    q: 'What does it cost?',
    a: 'Free and open source. No subscriptions, no data brokers.',
  },
  {
    q: 'What are the system requirements?',
    a: 'macOS 14 (Sonoma) or later. Apple Silicon or Intel.',
  },
] as const

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <RevealSection threshold={0.1} className="max-w-2xl mx-auto px-4 py-16 border-t border-divider">
      <h2 className="font-mono font-semibold text-3xl text-center mb-10">FAQs</h2>
      <div className="flex flex-col">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i
          return (
            <div key={faq.q} className="border-b border-glass-border">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left text-[15px] font-medium text-foreground hover:text-[#FFD700] transition-colors"
                aria-expanded={isOpen}
              >
                {faq.q}
                <span
                  className="text-foreground-quaternary text-xl ml-4 transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-200"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <p className="pb-5 text-sm text-foreground-secondary leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </RevealSection>
  )
}
```

- [ ] **Step 2: Verify FAQ accordion works**

Run: `open http://localhost:3000/download`

Expected: 6 FAQ items visible. Clicking a question expands the answer with a smooth animation. Clicking again collapses it. Only one can be open at a time.

- [ ] **Step 3: Commit**

```bash
git add components/download/FAQ.tsx
git commit -m "feat: collapsible FAQ accordion"
```

---

### Task 6: Route Restructuring + Link Updates

**Files:**
- Modify: `app/download/macos/route.ts`
- Modify: `components/constants.ts`
- Modify: `components/Hero.tsx`
- Modify: `components/Nav.tsx`
- Modify: `components/FinalCTA.tsx`

- [ ] **Step 1: Convert `/download/macos` to a redirect**

Replace the contents of `app/download/macos/route.ts`:

```ts
// app/download/macos/route.ts
import { redirect } from 'next/navigation'

export async function GET() {
  redirect('/download')
}
```

- [ ] **Step 2: Update the download URL constant**

In `components/constants.ts`, change:

```ts
export const DOWNLOAD_URL = '/download'
```

- [ ] **Step 3: Update Hero.tsx download link**

In `components/Hero.tsx`, change the download `<a>` tag from:

```tsx
<a
  href={DOWNLOAD_URL}
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Download 1Sat Browser for Mac (opens in new tab)"
  className="cta-glow mt-8 inline-block rounded-full bg-gradient-to-br from-[#FF8C00] to-[#FFD700] px-9 py-3.5 text-sm font-semibold text-black"
>
  Download for Mac
</a>
```

To:

```tsx
<a
  href={DOWNLOAD_URL}
  aria-label="Download 1Sat Browser for Mac"
  className="cta-glow mt-8 inline-block rounded-full bg-gradient-to-br from-[#FF8C00] to-[#FFD700] px-9 py-3.5 text-sm font-semibold text-black"
>
  Download for Mac
</a>
```

- [ ] **Step 4: Update Nav.tsx download link**

In `components/Nav.tsx`, change the download `<a>` tag from:

```tsx
<a
  href={DOWNLOAD_URL}
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Download 1Sat for Mac (opens in new tab)"
  className="pointer-events-auto flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-black cta-glow bg-gradient-to-br from-[#FF8C00] to-[#FFD700]"
>
```

To:

```tsx
<a
  href={DOWNLOAD_URL}
  aria-label="Download 1Sat for Mac"
  className="pointer-events-auto flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-black cta-glow bg-gradient-to-br from-[#FF8C00] to-[#FFD700]"
>
```

- [ ] **Step 5: Update FinalCTA.tsx download link**

In `components/FinalCTA.tsx`, change:

```tsx
import { externalLinkProps } from '@/components/link-utils'
```

Remove that import. Then change the download `<a>` from:

```tsx
<a
  href={DOWNLOAD_URL}
  {...externalLinkProps('Download 1Sat Browser for Mac')}
  className="mt-4 flex items-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-black cta-glow text-base bg-gradient-to-br from-[#FF8C00] to-[#FFD700]"
>
```

To:

```tsx
<a
  href={DOWNLOAD_URL}
  aria-label="Download 1Sat Browser for Mac"
  className="mt-4 flex items-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-black cta-glow text-base bg-gradient-to-br from-[#FF8C00] to-[#FFD700]"
>
```

- [ ] **Step 6: Verify all links work**

Run: `open http://localhost:3000`

Test each download button:
1. Hero "Download for Mac" → navigates to `/download` (not new tab)
2. Nav download button → navigates to `/download` (not new tab)
3. Final CTA "Download for Mac" → navigates to `/download` (not new tab)
4. Direct visit to `/download/macos` → redirects to `/download`

- [ ] **Step 7: Run lint**

Run: `bun run lint`

Expected: No errors.

- [ ] **Step 8: Commit**

```bash
git add app/download/macos/route.ts components/constants.ts components/Hero.tsx components/Nav.tsx components/FinalCTA.tsx
git commit -m "feat: route download links to /download page"
```

---

### Task 7: Build Verification

- [ ] **Step 1: Run production build**

Run: `bun run build`

Expected: Build succeeds with no errors. The `/download` page is statically generated or server-rendered without issues.

- [ ] **Step 2: Verify no unused imports**

Run: `bun run lint`

Expected: Clean — no warnings about unused `externalLinkProps` import in `FinalCTA.tsx` or other dead imports.

- [ ] **Step 3: Test the full flow end-to-end**

Start the production server: `bun run start`

1. Visit `http://localhost:3000` — click "Download for Mac" in hero → lands on `/download`, download starts
2. Visit `http://localhost:3000/download` directly — download auto-starts, instructions visible
3. Visit `http://localhost:3000/download/macos` — redirects to `/download`
4. Visit `http://localhost:3000/api/download/macos` — returns JSON with `url` field
5. Scroll down on `/download` — steps reveal with animation, FAQ accordion works

- [ ] **Step 4: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: build and lint cleanup"
```
