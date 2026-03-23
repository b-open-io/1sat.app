# 1Sat Browser Landing Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder 1sat.app with a high-craft dark landing page promoting the 1Sat Browser desktop app, modeled after Dia Browser's design language.

**Architecture:** Next.js 16 single-page landing with 9 sections. Hero uses a WebGL2 shader canvas fed by an HTML5 video texture (adapted from droplit's AsciiBackground pattern). Feature sections use a reusable "1Sat is for [X]" component with CSS scroll-snap carousels. All animations use Intersection Observer for scroll-triggered entrance effects.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Geist fonts (Sans/Mono/Pixel), WebGL2 GLSL shaders, Bun, Biome

**Spec:** `docs/superpowers/specs/2026-03-23-landing-page-design.md`

**Reference:** droplit's hero at `~/code/droplit/components/effects/AsciiBackground.tsx` and `~/code/droplit/components/marketing/HeroSection.tsx`

---

### Task 1: Foundation — Tailwind v4 migration, fonts, theme variables

**Files:**
- Modify: `frontend/app/globals.css`
- Modify: `frontend/app/layout.tsx`
- Modify: `frontend/package.json`
- Delete: `frontend/tailwind.config.ts` (Tailwind v4 uses CSS-based config)
- Modify: `frontend/next.config.ts` (fix `@` alias)

- [ ] **Step 1: Install geist font package**

```bash
cd /Users/satchmo/code/1sat.app/frontend && bun add geist
```

- [ ] **Step 2: Delete tailwind.config.ts**

Tailwind v4 uses CSS-based configuration via `@import "tailwindcss"`. The old `tailwind.config.ts` with `content` arrays is v3 syntax and must be removed.

```bash
rm /Users/satchmo/code/1sat.app/frontend/tailwind.config.ts
```

- [ ] **Step 3: Rewrite globals.css for Tailwind v4 + theme**

Replace the entire file. Use `@import "tailwindcss"` instead of `@tailwind` directives. Define all theme variables as CSS custom properties. Add animation keyframes.

```css
@import "tailwindcss";

:root {
  --background: #050505;
  --foreground: rgba(255, 255, 255, 0.90);
  --foreground-secondary: rgba(255, 255, 255, 0.60);
  --foreground-tertiary: rgba(255, 255, 255, 0.40);
  --foreground-quaternary: rgba(255, 255, 255, 0.20);
  --glass-surface: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.08);
  --gradient-creating-start: #FF8C00;
  --gradient-creating-mid: #FFD700;
  --gradient-creating-end: #FF6B35;
  --gradient-owning-start: #6B3FA0;
  --gradient-owning-mid: #9B6DFF;
  --gradient-owning-end: #B794F6;
  --gradient-connecting-start: #0D9488;
  --gradient-connecting-mid: #06B6D4;
  --gradient-connecting-end: #22D3EE;
  --gradient-securing-start: #059669;
  --gradient-securing-mid: #10B981;
  --gradient-securing-end: #34D399;
}

@theme {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-foreground-secondary: var(--foreground-secondary);
  --color-foreground-tertiary: var(--foreground-tertiary);
  --color-foreground-quaternary: var(--foreground-quaternary);
  --color-glass-surface: var(--glass-surface);
  --color-glass-border: var(--glass-border);
}

body {
  color: var(--foreground);
  background: var(--background);
}

/* Scroll-triggered entrance animation */
.reveal {
  opacity: 0;
  filter: blur(5px);
  transition: opacity 0.8s cubic-bezier(0.87, 0, 0.13, 1),
              filter 0.8s cubic-bezier(0.87, 0, 0.13, 1);
}
.reveal.visible {
  opacity: 1;
  filter: blur(0);
}

/* Chroma sweep for gradient keywords */
@keyframes chroma-sweep {
  0% { background-position: 100% 0; filter: blur(1px); }
  100% { background-position: 0 0; filter: blur(0); }
}
.chroma-text {
  background-size: 300% 100%;
  background-position: 100% 0;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.chroma-text.visible {
  animation: chroma-sweep 0.9s ease-in-out 0.1s forwards;
}

/* Concentric circle pulse */
@keyframes circle-pulse {
  0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.05); }
}

/* CTA glow hover */
.cta-glow {
  box-shadow: 0 0 30px rgba(255, 140, 0, 0.25);
  transition: box-shadow 0.3s ease;
}
.cta-glow:hover {
  box-shadow: 0 0 50px rgba(255, 140, 0, 0.4);
}
```

- [ ] **Step 4: Update layout.tsx with Geist fonts**

```tsx
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: '1Sat Browser — Your keys. Your data. Your internet.',
  description: 'The browser that pays you back. Browse, collect, and own your internet with Secure Enclave protection, on-chain publishing, and native dApp connectivity.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
```

- [ ] **Step 5: Fix `@` path alias in next.config.ts**

The tsconfig maps `@/*` to `./*` (project root), but turbopack maps `@` to `./app`. Fix turbopack to match:

```ts
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
```

- [ ] **Step 6: Verify it compiles**

```bash
cd /Users/satchmo/code/1sat.app/frontend && bun run build
```

Expected: Build succeeds (page.tsx will error because old components are still imported — that's fine, we fix it in the next task).

- [ ] **Step 7: Commit**

```bash
git add frontend/app/globals.css frontend/app/layout.tsx frontend/package.json frontend/next.config.ts frontend/bun.lock
git commit -m "feat: migrate to Tailwind v4, add Geist fonts, set up dark theme variables"
```

---

### Task 2: ShaderBackground component (WebGL2 video+shader)

**Files:**
- Create: `frontend/components/effects/ShaderBackground.tsx`

This is adapted from droplit's `AsciiBackground.tsx` but replaces the ASCII shader with a noise/grain + color grading shader suited to the cosmic aesthetic. Same architecture: video → WebGL texture → custom fragment shader → canvas.

- [ ] **Step 1: Create ShaderBackground component**

```tsx
"use client"

import { useEffect, useRef } from "react"

const VERT = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform float uMix;
uniform float uTime;
out vec4 fragColor;

// Film grain noise
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  uv.y = 1.0 - uv.y;

  vec3 colA = texture(uTexA, uv).rgb;
  vec3 colB = texture(uTexB, uv).rgb;
  vec3 col = mix(colA, colB, uMix);

  // Warm color grading — push shadows warm, highlights slightly cool
  col.r *= 1.05;
  col.b *= 0.95;

  // Subtle vignette
  vec2 center = uv - 0.5;
  float vignette = 1.0 - dot(center, center) * 0.8;
  col *= vignette;

  // Film grain
  float grain = hash(gl_FragCoord.xy + uTime * 100.0) * 0.06 - 0.03;
  col += grain;

  fragColor = vec4(col, 1.0);
}`

function setupTexture(gl: WebGL2RenderingContext): WebGLTexture {
  const tex = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  return tex
}

interface Props {
  videoSrc: string
  className?: string
}

export function ShaderBackground({ videoSrc, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const canvas = document.createElement("canvas")
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    canvas.style.display = "block"
    container.appendChild(canvas)

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: false,
    })
    if (!gl) return

    const vs = gl.createShader(gl.VERTEX_SHADER)!
    gl.shaderSource(vs, VERT)
    gl.compileShader(vs)

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(fs, FRAG)
    gl.compileShader(fs)

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error("Shader frag:", gl.getShaderInfoLog(fs))
      return
    }

    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Shader link:", gl.getProgramInfoLog(prog))
      return
    }

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    )
    const loc = gl.getAttribLocation(prog, "position")
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, "uResolution")
    const uTexALoc = gl.getUniformLocation(prog, "uTexA")
    const uTexBLoc = gl.getUniformLocation(prog, "uTexB")
    const uMixLoc = gl.getUniformLocation(prog, "uMix")
    const uTimeLoc = gl.getUniformLocation(prog, "uTime")

    const texA = setupTexture(gl)
    const texB = setupTexture(gl)

    let ready = false
    let duration = 8
    const FADE = 0.6

    const makeVid = (url: string) => {
      const v = document.createElement("video")
      v.crossOrigin = "anonymous"
      v.loop = true
      v.muted = true
      v.playsInline = true
      v.preload = "auto"
      v.src = url
      return v
    }

    const videoA = makeVid(videoSrc)
    const videoB = makeVid(videoSrc)

    let loaded = 0
    const onReady = () => {
      loaded++
      if (loaded < 2) return
      ready = true
      duration = videoA.duration || 8
      videoA.play()
      videoB.currentTime = FADE
      videoB.play()
    }
    videoA.addEventListener("canplay", onReady, { once: true })
    videoB.addEventListener("canplay", onReady, { once: true })
    videoA.load()
    videoB.load()

    let alive = true
    let rafId = 0
    const startTime = performance.now()

    const tick = () => {
      if (!alive) return
      if (ready && canvas.clientWidth > 0) {
        const dpr = Math.min(devicePixelRatio, 2)
        const w = canvas.clientWidth * dpr
        const h = canvas.clientHeight * dpr
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        let mix = 0
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texA)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, videoA)

        gl.activeTexture(gl.TEXTURE1)
        gl.bindTexture(gl.TEXTURE_2D, texB)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, videoB)

        const t = videoA.currentTime
        if (t > duration - FADE) {
          mix = (t - (duration - FADE)) / FADE
        } else if (t < FADE) {
          mix = 1 - t / FADE
        }
        mix = Math.max(0, Math.min(1, mix))

        gl.useProgram(prog)
        gl.uniform2f(uRes, w, h)
        gl.uniform1i(uTexALoc, 0)
        gl.uniform1i(uTexBLoc, 1)
        gl.uniform1f(uMixLoc, mix)
        gl.uniform1f(uTimeLoc, (performance.now() - startTime) / 1000)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

        if (!container.dataset.rendered) {
          container.dataset.rendered = "true"
        }
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      alive = false
      cancelAnimationFrame(rafId)
      for (const v of [videoA, videoB]) {
        v.pause()
        v.src = ""
      }
      canvas.remove()
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteTexture(texA)
      gl.deleteTexture(texB)
      gl.deleteBuffer(buf)
    }
  }, [videoSrc])

  return <div ref={containerRef} className={className} />
}
```

- [ ] **Step 2: Verify it compiles**

```bash
cd /Users/satchmo/code/1sat.app/frontend && npx tsc --noEmit components/effects/ShaderBackground.tsx
```

- [ ] **Step 3: Commit**

```bash
git add frontend/components/effects/ShaderBackground.tsx
git commit -m "feat: add ShaderBackground WebGL2 video+shader component"
```

---

### Task 3: useReveal hook (Intersection Observer scroll animations)

**Files:**
- Create: `frontend/hooks/useReveal.ts`

- [ ] **Step 1: Create the hook**

```ts
"use client"

import { useEffect, useRef } from "react"

export function useReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15,
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible")
          observer.unobserve(el)
        }
      },
      { threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return ref
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/hooks/useReveal.ts
git commit -m "feat: add useReveal hook for scroll-triggered entrance animations"
```

---

### Task 4: Nav component (floating glass pills)

**Files:**
- Create: `frontend/components/Nav.tsx`

- [ ] **Step 1: Create Nav component**

```tsx
import Link from 'next/link'

const DOWNLOAD_URL = 'https://github.com/b-open-io/1sat-sdk/releases'

export function Nav() {
  return (
    <nav className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between">
      {/* Left pill: Logo + links */}
      <div className="flex items-center gap-6 rounded-full border border-glass-border bg-glass-surface px-5 py-2.5 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-[#FF8C00] to-[#FFD700]">
            <div className="h-2.5 w-2.5 rounded-full border-2 border-white" />
          </div>
          <span className="font-mono text-sm font-medium text-white">1Sat</span>
        </Link>
        <div className="hidden items-center gap-4 sm:flex">
          <a href="#features" className="text-xs text-foreground-tertiary hover:text-foreground-secondary transition-colors">Features</a>
          <a href="https://github.com/b-open-io/1sat-sdk" className="text-xs text-foreground-tertiary hover:text-foreground-secondary transition-colors">GitHub</a>
          <a href="https://docs.1sat.market" className="text-xs text-foreground-tertiary hover:text-foreground-secondary transition-colors">Docs</a>
        </div>
      </div>

      {/* Right pill: Download CTA */}
      <a
        href={DOWNLOAD_URL}
        className="cta-glow rounded-full bg-gradient-to-br from-[#FF8C00] to-[#FFD700] px-5 py-2.5 text-xs font-semibold text-black transition-shadow"
      >
        Download for Mac
      </a>
    </nav>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/components/Nav.tsx
git commit -m "feat: add floating glass Nav component"
```

---

### Task 5: Hero component (cosmic minimal + video shader)

**Files:**
- Create: `frontend/components/Hero.tsx` (replace existing)

- [ ] **Step 1: Write the new Hero component**

The hero is full viewport height with the video shader background, concentric circle motifs, logo icon, Geist Pixel title, tagline, and CTA. Note: GeistPixelSquare may need to be imported from `geist/font/pixel` — check the geist package exports at implementation time. If pixel variants aren't available as Next.js font objects, use Geist Sans with the title and address font separately.

```tsx
"use client"

import { ShaderBackground } from "@/components/effects/ShaderBackground"

const DOWNLOAD_URL = 'https://github.com/b-open-io/1sat-sdk/releases'

export default function Hero() {
  return (
    <section className="relative h-svh overflow-hidden">
      {/* z-0: solid base */}
      <div aria-hidden className="absolute inset-0 z-0 bg-[#050505]" />

      {/* z-1: video shader */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-1000 has-[[data-rendered]]:opacity-70"
      >
        <ShaderBackground
          videoSrc="/videos/hero-bg.mp4"
          className="h-full w-full"
        />
      </div>

      {/* z-2: gradient overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background: 'linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.1) 40%, rgba(5,5,5,0.8) 100%)',
        }}
      />

      {/* z-3: concentric circles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[3]">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] rounded-full border border-[rgba(255,140,0,0.06)]" style={{ animation: 'circle-pulse 4s ease-in-out infinite', transform: 'translate(-50%, -50%)' }} />
        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] rounded-full border border-[rgba(255,140,0,0.1)]" style={{ animation: 'circle-pulse 4s ease-in-out infinite 0.5s', transform: 'translate(-50%, -50%)' }} />
        <div className="absolute left-1/2 top-1/2 h-[200px] w-[200px] rounded-full border border-[rgba(255,140,0,0.15)]" style={{ animation: 'circle-pulse 4s ease-in-out infinite 1s', transform: 'translate(-50%, -50%)' }} />
      </div>

      {/* z-4: conic gradient depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[4]"
        style={{
          background: 'conic-gradient(from 180deg at 50% 50%, rgba(255,140,0,0.06) 0deg, rgba(255,215,0,0.04) 90deg, rgba(100,50,200,0.06) 180deg, rgba(255,100,50,0.04) 270deg, rgba(255,140,0,0.06) 360deg)',
        }}
      />

      {/* z-5: content */}
      <div className="relative z-[5] flex h-full flex-col items-center justify-center text-center">
        {/* Logo icon */}
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#FF8C00] to-[#FFD700] shadow-[0_0_40px_rgba(255,140,0,0.3)]">
          <div className="h-[22px] w-[22px] rounded-full border-[3px] border-white" />
        </div>

        {/* Title */}
        <h1 className="font-mono text-5xl font-extralight tracking-[-2px] text-white md:text-7xl lg:text-8xl">
          1Sat Browser
        </h1>

        {/* Tagline */}
        <p className="mt-4 text-sm font-light tracking-wide text-foreground-tertiary md:text-base">
          Your keys. Your data. Your internet.
        </p>

        {/* CTA */}
        <a
          href={DOWNLOAD_URL}
          className="cta-glow mt-8 inline-block rounded-full bg-gradient-to-br from-[#FF8C00] to-[#FFD700] px-9 py-3.5 text-sm font-semibold text-black"
        >
          Download for Mac
        </a>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/components/Hero.tsx
git commit -m "feat: replace Hero with cosmic minimal design + video shader"
```

---

### Task 6: FeatureSection + FeatureCarousel components

**Files:**
- Create: `frontend/components/FeatureSection.tsx`
- Create: `frontend/components/FeatureCarousel.tsx`

- [ ] **Step 1: Create FeatureCarousel component**

CSS scroll-snap horizontal carousel with dot indicators. No library dependency.

```tsx
"use client"

import { useRef, useState, useCallback, useEffect } from "react"

interface Slide {
  title: string
  description: string
}

interface Props {
  slides: Slide[]
  gradientFrom: string
  gradientTo: string
}

export function FeatureCarousel({ slides, gradientFrom, gradientTo }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const index = Math.round(el.scrollLeft / el.clientWidth)
    setActiveIndex(index)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => el.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  return (
    <div>
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-none pb-4"
        style={{ scrollbarWidth: 'none' }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="min-w-[280px] flex-shrink-0 snap-center rounded-2xl border border-glass-border p-5 md:min-w-[320px]"
            style={{
              background: `linear-gradient(135deg, ${gradientFrom}14, ${gradientTo}0A)`,
            }}
          >
            <h4 className="mb-1.5 text-sm font-medium text-[rgba(255,255,255,0.7)]">
              {slide.title}
            </h4>
            <p className="text-xs leading-relaxed text-foreground-tertiary">
              {slide.description}
            </p>
            {/* Placeholder for product screenshot */}
            <div className="mt-3 h-[120px] w-full rounded-lg border border-glass-border bg-[rgba(255,255,255,0.03)]" />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="mt-4 flex justify-center gap-1.5">
        {slides.map((_, i) => (
          <div
            key={i}
            className="h-1.5 w-1.5 rounded-full transition-colors"
            style={{
              background: i === activeIndex ? gradientFrom : 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create FeatureSection component**

Reusable "1Sat is for [X]" section with chroma-sweep keyword animation.

```tsx
"use client"

import { useReveal } from "@/hooks/useReveal"
import { FeatureCarousel } from "@/components/FeatureCarousel"

interface Slide {
  title: string
  description: string
}

interface Props {
  keyword: string
  subtitle: string
  slides: Slide[]
  gradientColors: [string, string, string] // start, mid, end
  id?: string
}

export function FeatureSection({ keyword, subtitle, slides, gradientColors, id }: Props) {
  const ref = useReveal()
  const [start, mid, end] = gradientColors

  return (
    <section id={id} ref={ref} className="reveal px-4 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-light text-white md:text-4xl">
            1Sat is for{" "}
            <span
              className="chroma-text font-normal"
              style={{
                backgroundImage: `linear-gradient(90deg, #000 0%, #000 33.33%, ${start} 40%, ${mid} 50%, ${end} 60%, transparent 66.67%)`,
              }}
            >
              {keyword}
            </span>
          </h2>
          <p className="mt-3 text-sm text-foreground-tertiary">{subtitle}</p>
        </div>

        <FeatureCarousel
          slides={slides}
          gradientFrom={start}
          gradientTo={end}
        />
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/components/FeatureCarousel.tsx frontend/components/FeatureSection.tsx
git commit -m "feat: add FeatureSection and FeatureCarousel components"
```

---

### Task 7: StatsBar component

**Files:**
- Create: `frontend/components/StatsBar.tsx`

- [ ] **Step 1: Create StatsBar component**

```tsx
"use client"

import { useReveal } from "@/hooks/useReveal"

const stats = [
  { value: "14", unit: "MB", label: "App Size" },
  { value: "<50", unit: "ms", label: "Startup" },
  { value: "0", unit: "", label: "Chromium" },
  { value: "100", unit: "%", label: "Your Keys" },
]

export function StatsBar() {
  const ref = useReveal()

  return (
    <section ref={ref} className="reveal px-4 py-20">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-12 md:gap-16">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="font-mono text-4xl font-light text-white">
              {stat.value}
              {stat.unit && (
                <span className="text-lg text-foreground-tertiary">{stat.unit}</span>
              )}
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-[2px] text-foreground-quaternary">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/components/StatsBar.tsx
git commit -m "feat: add StatsBar component with performance metrics"
```

---

### Task 8: FinalCTA component

**Files:**
- Create: `frontend/components/FinalCTA.tsx`

- [ ] **Step 1: Create FinalCTA component**

```tsx
"use client"

import { useReveal } from "@/hooks/useReveal"

const DOWNLOAD_URL = 'https://github.com/b-open-io/1sat-sdk/releases'

export function FinalCTA() {
  const ref = useReveal()

  return (
    <section ref={ref} className="reveal relative flex min-h-[60vh] flex-col items-center justify-center px-4 py-24">
      {/* Radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,140,0,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative text-center">
        <h2 className="font-mono text-6xl font-extralight tracking-[-3px] text-white md:text-8xl">
          1Sat.
        </h2>
        <p
          className="text-6xl font-extralight tracking-[-3px] md:text-8xl"
          style={{
            background: 'linear-gradient(90deg, #FF8C00, #FFD700)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Own it all.
        </p>
        <a
          href={DOWNLOAD_URL}
          className="cta-glow mt-8 inline-block rounded-full bg-gradient-to-br from-[#FF8C00] to-[#FFD700] px-9 py-3.5 text-sm font-semibold text-black"
        >
          Download for Mac
        </a>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/components/FinalCTA.tsx
git commit -m "feat: add FinalCTA component with oversized typography"
```

---

### Task 9: Footer component (replace existing)

**Files:**
- Modify: `frontend/components/Footer.tsx`

- [ ] **Step 1: Rewrite Footer as minimal single-row**

```tsx
export default function Footer() {
  return (
    <footer className="border-t border-glass-border px-4 py-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-[#FF8C00] to-[#FFD700]">
            <div className="h-2 w-2 rounded-full border-[1.5px] border-white" />
          </div>
          <span className="text-xs text-foreground-tertiary">
            &copy; {new Date().getFullYear()} 1Sat
          </span>
        </div>
        <div className="flex gap-5">
          <a href="https://github.com/b-open-io/1sat-sdk" className="text-xs text-foreground-quaternary hover:text-foreground-tertiary transition-colors">GitHub</a>
          <a href="https://docs.1sat.market" className="text-xs text-foreground-quaternary hover:text-foreground-tertiary transition-colors">Docs</a>
          <a href="https://x.com/1satmarket" className="text-xs text-foreground-quaternary hover:text-foreground-tertiary transition-colors">Twitter</a>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/components/Footer.tsx
git commit -m "feat: replace Footer with minimal single-row design"
```

---

### Task 10: Compose page.tsx + delete old components

**Files:**
- Modify: `frontend/app/page.tsx`
- Delete: `frontend/components/Features.tsx`

- [ ] **Step 1: Delete Features.tsx**

```bash
rm /Users/satchmo/code/1sat.app/frontend/components/Features.tsx
```

- [ ] **Step 2: Rewrite page.tsx**

```tsx
import Hero from '@/components/Hero'
import { Nav } from '@/components/Nav'
import { FeatureSection } from '@/components/FeatureSection'
import { StatsBar } from '@/components/StatsBar'
import { FinalCTA } from '@/components/FinalCTA'
import Footer from '@/components/Footer'

const FEATURES = {
  creating: {
    keyword: 'Creating',
    subtitle: 'Publish anything on-chain. Inscribe files. Mint ordinals. Directly from your browser.',
    gradientColors: ['#FF8C00', '#FFD700', '#FF6B35'] as [string, string, string],
    slides: [
      { title: 'File Inscription', description: 'Native file picker. Drag, drop, inscribe. Your files live on-chain forever.' },
      { title: 'Mint Ordinals', description: 'Create 1Sat Ordinals with a single click. No extensions. No third-party tools.' },
      { title: 'On-Chain Publishing', description: 'Permanent, immutable content. Published directly from your browser.' },
    ],
  },
  owning: {
    keyword: 'Owning',
    subtitle: 'Your keys. Your identity. Your data. No custodians. No middlemen. Just you.',
    gradientColors: ['#6B3FA0', '#9B6DFF', '#B794F6'] as [string, string, string],
    slides: [
      { title: 'BAP Identity', description: 'On-chain identity you control. No platform owns your profile.' },
      { title: 'Self-Sovereign Keys', description: 'Private keys never leave your device. Not our servers. Not anyone\'s.' },
      { title: 'No Cloud', description: 'Zero server dependency. Your wallet works offline, always.' },
    ],
  },
  connecting: {
    keyword: 'Connecting',
    subtitle: 'Peer-to-peer. Interoperable. No middlemen between you and the network.',
    gradientColors: ['#0D9488', '#06B6D4', '#22D3EE'] as [string, string, string],
    slides: [
      { title: 'dApp Browser', description: 'Built-in BRC-100 connectivity. Every dApp is one click away.' },
      { title: 'Peer-to-Peer', description: 'Direct connections. No intermediaries. No surveillance.' },
      { title: 'Interoperable', description: 'Works with any BSV dApp through the open BRC-100 protocol.' },
    ],
  },
  securing: {
    keyword: 'Securing',
    subtitle: 'Trustless by design. Hardware-level protection. Nothing to trust but math.',
    gradientColors: ['#059669', '#10B981', '#34D399'] as [string, string, string],
    slides: [
      { title: 'Secure Enclave', description: 'Hardware key protection with Touch ID. Keys never leave the chip.' },
      { title: 'Trustless', description: 'No servers to compromise. No databases to breach. Just cryptography.' },
      { title: 'Native Performance', description: '14MB app. Under 50ms startup. No Chromium. Your computer will thank you.' },
    ],
  },
}

export default function Home() {
  return (
    <main className="bg-[#050505]">
      <Nav />
      <Hero />

      <div id="features">
        <FeatureSection {...FEATURES.creating} />
        <FeatureSection {...FEATURES.owning} />
        <FeatureSection {...FEATURES.connecting} />
        <FeatureSection {...FEATURES.securing} />
      </div>

      <StatsBar />
      <FinalCTA />
      <Footer />
    </main>
  )
}
```

- [ ] **Step 3: Run dev server and verify**

```bash
cd /Users/satchmo/code/1sat.app/frontend && bun dev
```

Open `http://localhost:3000` and verify all sections render. Check:
- Nav floats with glass effect
- Hero shows video shader background (or solid dark if video not loaded yet)
- All 4 feature sections scroll into view with blur-to-focus animation
- Chroma sweep plays on keywords
- Stats bar displays correctly
- Final CTA is massive
- Footer is single row

- [ ] **Step 4: Run production build**

```bash
cd /Users/satchmo/code/1sat.app/frontend && bun run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add -A frontend/app/page.tsx frontend/components/
git commit -m "feat: compose landing page with all sections, delete old placeholder components"
```

---

### Task 11: Git remote setup + initial push

**Files:**
- None (git operations only)

- [ ] **Step 1: Create repo on GitHub**

```bash
gh repo create b-open-io/1sat.app --public --description "1Sat Browser — landing page"
```

- [ ] **Step 2: Set remote**

```bash
cd /Users/satchmo/code/1sat.app && git remote set-url origin git@github.com:b-open-io/1sat.app.git
```

Or if no remote exists:
```bash
cd /Users/satchmo/code/1sat.app && git remote add origin git@github.com:b-open-io/1sat.app.git
```

- [ ] **Step 3: Push**

```bash
git push -u origin main
```

---

### Task 12: Polish and visual QA

**Files:**
- Various tweaks based on visual review

- [ ] **Step 1: Run dev server**

```bash
cd /Users/satchmo/code/1sat.app/frontend && bun dev
```

- [ ] **Step 2: Visual QA checklist**

Open in browser and check each item:
- [ ] Nav glass effect visible on scroll
- [ ] Hero video plays and shader applies grain/color grading
- [ ] Concentric circles pulse subtly
- [ ] CTA buttons have glow shadow on hover
- [ ] Feature sections fade+blur in on scroll
- [ ] Chroma sweep animates on keywords when visible
- [ ] Carousel scrolls horizontally with snap
- [ ] Dot indicators update on carousel scroll
- [ ] Stats bar numbers render in Geist Mono
- [ ] Final CTA gradient text renders correctly
- [ ] Footer links work
- [ ] Mobile responsive (nav collapses, stats stack)

- [ ] **Step 3: Fix any issues found, commit**

```bash
git add -A && git commit -m "fix: visual polish from QA review"
```
