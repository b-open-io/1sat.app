# Download Page — Design Spec

## Overview

Replace the current `/download/macos` redirect-to-GitHub with a proper download page at `/download` that auto-starts the .dmg download and shows setup instructions, modeled after Dia Browser's `/download/thanks` page.

## Current State

- `/download/macos` is an API route that fetches the latest release URL from Vercel blob storage (`download.json`) and issues an HTTP redirect
- All download buttons on the site link to `/download/macos` which redirects away from 1sat.app entirely
- No post-download experience — user lands on GitHub releases or gets a raw file download

## New Flow

1. User clicks "Download for Mac" anywhere on the site
2. Browser navigates to `/download` (a rendered page, not a redirect)
3. Page loads and immediately triggers the .dmg download via the existing blob storage URL
4. User sees the download page with setup instructions while the file downloads

## Page Structure

### Auto-Download Mechanism

- Client component fetches `/api/download/macos` (new JSON endpoint) to get the download URL
- Triggers `window.location.assign(url)` on mount to start the download
- Shows a "Downloading..." indicator with spinner
- Fallback link if auto-download doesn't trigger: "Download didn't start? Click here."

### Hero Section

- Heading: "Getting started with **1Sat** is as easy as **1-2-3**"
- Subtitle: "Your download should begin automatically."
- Download status badge with spinner animation

### Three Setup Steps

Each step: numbered badge, title, description, screenshot placeholder.

**Step 1 — "Create your account."**
- Open 1Sat and create a new wallet
- Private keys generated locally, stored in Secure Enclave
- Nothing leaves your device

**Step 2 — "Configure your browser."**
- Import bookmarks from old browser or start fresh
- Configure local stack options — node connection, indexer preferences, network settings

**Step 3 — "Explore the metanet."**
- Agentic AI control via the sidebar
- Metanet-native browsing — interact with on-chain apps directly
- Built-in wallet for peer-to-peer transactions

Steps alternate text-left/image-right and text-right/image-left (like Dia).

### FAQ Section

Collapsible accordion with these questions:

1. What is 1Sat Browser?
2. How is this different from Chrome with a wallet extension?
3. Is my data private?
4. Can I import from my current browser?
5. What does it cost?
6. What are the system requirements?

### Nav + Footer

Reuse existing `Nav` and `Footer` components from the homepage.

## Route Changes

| Route | Before | After |
|-------|--------|-------|
| `/download` | Does not exist | New page (rendered) — auto-starts download, shows instructions |
| `/download/macos` | API route, HTTP redirect | Redirect to `/download` (backward compat) |
| `/api/download/macos` | Does not exist | New API route — returns JSON `{ url: "..." }` for the client-side download trigger |

## Component Plan

```
app/
  download/
    page.tsx              — Server component, metadata, layout
    DownloadClient.tsx    — Client component: auto-download trigger + status badge
  api/
    download/
      macos/
        route.ts          — New JSON API endpoint (moved from app/download/macos/route.ts)
components/
  download/
    SetupSteps.tsx        — The 1-2-3 steps section
    FAQ.tsx               — Collapsible FAQ accordion
```

## Auto-Download Implementation

```
DownloadClient mounts
  → fetch('/api/download/macos')
  → receive { url, version, filename }
  → window.location.assign(url) to trigger download
  → show "Downloading 1Sat Browser vX.X for macOS..."
  → if fetch fails, show direct fallback link to GitHub releases
```

No `useEffect` side-effect on mount for the download — use a ref guard to ensure single execution.

## Design Tokens

Uses existing 1sat.app design system:
- Background: `var(--background)` (#050505)
- Text: `var(--foreground)`, `var(--foreground-secondary)`, etc.
- Glass surfaces for cards: `var(--glass-surface)`, `var(--glass-border)`
- CTA gradient: `from-[#FF8C00] to-[#FFD700]`
- Font: Geist Mono for headings, Geist Sans for body
- Reveal animations via existing `.reveal` / `.visible` CSS classes

## Screenshots

Step images will be placeholder divs initially. Real screenshots to be added later from the actual browser UI.

## Scope Boundaries

**In scope:**
- The `/download` page with all sections described above
- Route restructuring (`/download/macos` → redirect, new `/api/download/macos`)
- Updating all download links across the site to point to `/download`

**Out of scope:**
- Email capture or auth gating (separate workstream)
- Resend integration (separate workstream)
- Account association / Sigma Auth changes (separate workstream)
- Windows/Linux download support (macOS only for now)
- Real screenshot assets (placeholders for now)
