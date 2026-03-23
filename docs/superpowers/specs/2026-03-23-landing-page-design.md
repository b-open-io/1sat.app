# 1Sat Browser — Landing Page Design Spec

## Overview

Replace the current 1sat.app placeholder with a high-craft landing page promoting the 1Sat Browser desktop app (wallet-desktop). Design modeled after [Dia Browser](https://www.diabrowser.com/) but adapted for dark mode with the 1Sat brand identity.

## Tech Stack

- **Framework**: Next.js 16 (already in place at `frontend/`)
- **Runtime**: Bun
- **Styling**: Tailwind CSS v4
- **Fonts**: `geist` package — GeistSans, GeistMono, GeistPixelSquare, GeistPixelGrid, GeistPixelCircle, GeistPixelTriangle, GeistPixelLine
- **Linting**: Biome
- **Effects**: WebGL2 custom shader + HTML5 video (droplit pattern)

## Git Setup

- Set remote to `b-open-io/1sat.app` (new repo in b-open-io organization)

## Design System

### Typography

| Usage | Font | Weight |
|-------|------|--------|
| Hero title "1Sat Browser" | Geist Pixel Square | default (single weight) |
| Final CTA "1Sat." | Geist Pixel Square | default (single weight) |
| Section keywords (Creating, Owning, etc.) | Geist Sans | 400 (with gradient) |
| Section headings "1Sat is for" | Geist Sans | 300 |
| Body / Nav text | Geist Sans | 300-400 |
| Stats numbers | Geist Mono | 300 |

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#050505` | Page background |
| Text primary | `rgba(255,255,255,0.90)` | Headings |
| Text secondary | `rgba(255,255,255,0.60)` | Subtitles |
| Text tertiary | `rgba(255,255,255,0.40)` | Descriptions |
| Text quaternary | `rgba(255,255,255,0.20)` | Labels |
| Creating gradient | `#FF8C00 → #FFD700 → #FF6B35` | Orange/gold |
| Owning gradient | `#6B3FA0 → #9B6DFF → #B794F6` | Violet/lavender |
| Connecting gradient | `#0D9488 → #06B6D4 → #22D3EE` | Teal/cyan |
| Securing gradient | `#059669 → #10B981 → #34D399` | Green/emerald |
| Glass surface | `rgba(255,255,255,0.05)` | Nav, cards |
| Glass border | `rgba(255,255,255,0.08)` | Subtle borders |
| CTA gradient | `#FF8C00 → #FFD700` | Download buttons |

### Animations

| Effect | Implementation |
|--------|---------------|
| Section entrance | `opacity: 0 → 1`, `filter: blur(5px) → blur(0)`, cubic-bezier(0.87, 0, 0.13, 1), triggered via Intersection Observer |
| Chroma sweep | `background-position` slide on 300%-wide gradient, 0.9s ease-in-out |
| Concentric circles | Subtle scale pulse, 4s infinite |
| CTA hover | Glow shadow intensify |
| Hero background | Video + WebGL shader layered (droplit pattern) |

### Surfaces

| Element | Style |
|---------|-------|
| Floating nav | `rgba(255,255,255,0.05)` + `backdrop-filter: blur(20px)` + `border-radius: 999px` |
| Feature cards | `rgba(255,255,255,0.03)` + `border: 1px solid rgba(255,255,255,0.06)` + `border-radius: 16px` |
| Carousel slides | Section-specific gradient tint on dark |
| CTA buttons | Orange→gold gradient pill with `border-radius: 999px` |

## Page Sections

### 1. Floating Glass Nav (fixed)

Two floating pill components:
- **Left pill**: Logo icon (orange→gold gradient square with circle) + "1Sat" wordmark + nav links (Features, GitHub, Docs)
- **Right pill**: "Download for Mac" CTA with orange→gold gradient

Style: frosted dark glass (`backdrop-filter: blur(20px)`), `position: fixed`, offset from edges.

### 2. Cosmic Minimal Hero (100vh)

Full-viewport hero with layered background:

**Background layers (bottom to top):**
1. `z-0`: Solid `#050505` base layer
2. `z-[1]`: HTML5 `<video>` element with generated cosmic orbital animation, fed as texture to WebGL2 canvas with custom shader effect (adapted from droplit's AsciiBackground pattern). If WebGL2 is unavailable, this layer simply doesn't render — the base layer remains visible.
3. `z-[2]`: Gradient overlay for text contrast (linear gradient from transparent to background)
4. `z-[3]`: Content

**Content:**
- 1Sat logo icon (56px, orange→gold gradient, glow shadow)
- "1Sat Browser" in Geist Pixel Square, massive scale, ultralight weight
- "Your keys. Your data. Your internet." tagline in Geist Sans
- "Download for Mac" pill CTA

**Effects:**
- Concentric circle motifs in CSS (subtle, pulsing)
- Conic gradient adds depth behind the shader
- Logo icon has `box-shadow: 0 0 40px rgba(255,140,0,0.3)`

### 3. "1Sat is for Creating"

**Heading**: "1Sat is for **Creating**" — keyword gets chroma-sweep gradient animation (orange→gold)

**Subtitle**: "Publish anything on-chain. Inscribe files. Mint ordinals. Directly from your browser."

**Carousel slides** (horizontal, CSS scroll-snap — no carousel library):
- File Inscription — native file picker, drag-drop-inscribe
- Mint Ordinals — single-click ordinal creation
- On-Chain Publishing — permanent, immutable content

Each slide: title + description + product screenshot, gradient-tinted background (orange family).

### 4. "1Sat is for Owning"

**Heading**: "1Sat is for **Owning**" — violet→lavender gradient

**Subtitle**: "Your keys. Your identity. Your data. No custodians. No middlemen. Just you."

**Carousel slides**:
- BAP Identity — on-chain identity you control
- Self-Sovereign Keys — private keys never leave your device
- No Cloud — zero server dependency

Gradient-tinted backgrounds (purple family).

### 5. "1Sat is for Connecting"

**Heading**: "1Sat is for **Connecting**" — teal→cyan gradient

**Subtitle**: "Peer-to-peer. Interoperable. No middlemen between you and the network."

**Carousel slides**:
- dApp Browser — built-in BRC-100 connectivity
- Peer-to-Peer — direct connections, no intermediaries
- Interoperable — works with any BSV dApp

Gradient-tinted backgrounds (teal family).

### 6. "1Sat is for Securing"

**Heading**: "1Sat is for **Securing**" — green→emerald gradient

**Subtitle**: "Trustless by design. Hardware-level protection. Nothing to trust but math."

**Carousel slides**:
- Secure Enclave — hardware key protection with Touch ID
- Trustless — no servers to compromise
- Native Performance — 14MB app, <50ms startup, no Chromium

Gradient-tinted backgrounds (green family).

### 7. Stats Bar

Four stats in a horizontal row, separated by subtle vertical dividers:

| Stat | Label |
|------|-------|
| 14 MB | App Size |
| <50 ms | Startup |
| 0 | Chromium |
| 100% | Your Keys |

Numbers in Geist Mono at large scale, units dimmed. Labels in small uppercase with letter-spacing.

### 8. Final CTA

- "1Sat." in Geist Pixel Square at massive scale (72px+), white
- "Own it all." in orange→gold gradient text
- "Download for Mac" pill CTA
- Subtle radial orange glow callback to hero

### 9. Minimal Footer

Single-row footer:
- Left: Logo icon + "2026 1Sat" copyright
- Right: GitHub, Docs, Twitter links
- Top border: `1px solid rgba(255,255,255,0.06)`

## Hero Video + Shader Implementation

Adapted from droplit's `AsciiBackground.tsx` pattern:

### Architecture

```
video element (offscreen) → WebGL2 texture upload → custom fragment shader → canvas overlay
```

### Layering (z-index stack)

```
z-0: solid background fallback
z-1: WebGL canvas (shader effect applied to video texture)
z-2: gradient overlay (transparent → background color)
z-3: hero content (text, CTA)
```

### Video

- Source: `/videos/hero-bg.mp4` (generated from hero-bg.png via Veo 3.1)
- Properties: `loop`, `muted`, `playsInline`, `preload="auto"`
- No static image fallback — if video fails to load, the z-0 solid background remains visible
- Seamless loop with crossfade (dual video elements offset by fade duration)

### Shader

Custom GLSL fragment shader (NOT the ASCII effect — something suited to 1Sat's cosmic aesthetic). Primary effect: **subtle noise/grain overlay with color grading** — adds film grain texture and warm tone mapping to the video. This keeps the cosmic imagery intact while adding tactile depth.

### Fade-In

Canvas starts at `opacity: 0`, transitions to target opacity after first frame renders via `data-rendered` attribute + CSS `:has()` selector.

## Migration Notes

- **Delete** existing `Hero.tsx`, `Features.tsx`, `Footer.tsx` — these are placeholder components being fully replaced
- **Tailwind v4 migration**: Current `globals.css` uses `@tailwind base/components/utilities` (v3 syntax). Replace with `@import "tailwindcss"` for v4.
- **Path alias**: Verify `@` alias resolves to project root in both `tsconfig.json` and `next.config.ts` turbopack aliases, since components live at `frontend/components/` (outside `app/`)
- **Download URL**: Use GitHub releases link as placeholder until a dedicated download page exists: `https://github.com/b-open-io/1sat-sdk/releases`

## Component Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with Geist fonts
│   ├── page.tsx            # Home page composing all sections
│   └── globals.css         # Theme variables, animations, Tailwind
├── components/
│   ├── Nav.tsx             # Floating glass navigation
│   ├── Hero.tsx            # Full-viewport hero with video+shader
│   ├── FeatureSection.tsx  # Reusable "1Sat is for [X]" section
│   ├── FeatureCarousel.tsx # Horizontal slide carousel
│   ├── StatsBar.tsx        # Performance stats row
│   ├── FinalCTA.tsx        # Closing CTA section
│   ├── Footer.tsx          # Minimal footer
│   └── effects/
│       └── ShaderBackground.tsx  # WebGL2 video+shader (droplit pattern)
├── public/
│   ├── hero-bg.png         # Source image (not served, kept for regeneration)
│   └── videos/
│       └── hero-bg.mp4     # Animated hero background
└── package.json
```

## Responsive Behavior

- **Desktop (1024+)**: Full layout as designed
- **Tablet (768-1023)**: Single-column feature sections, smaller hero text
- **Mobile (<768)**: Nav collapses to single pill (nav links hidden, only logo + download CTA), carousel becomes swipeable via CSS scroll-snap, stats stack 2x2

## Performance Targets

- First Contentful Paint: <1.5s
- Video loads lazily after hero text is visible
- If WebGL2 is unavailable, shader layer doesn't render — solid background remains
- Total JS bundle: minimal (mostly CSS + one WebGL component)
