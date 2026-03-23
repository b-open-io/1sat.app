"use client"

import { ShaderBackground } from "@/components/effects/ShaderBackground"

const DOWNLOAD_URL = "https://github.com/b-open-io/1sat-sdk/releases"

export function Hero() {
  return (
    <section className="relative h-svh overflow-hidden">
      <div aria-hidden className="absolute inset-0 z-0 bg-[#050505]" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-1000 has-[[data-rendered]]:opacity-70"
      >
        <ShaderBackground videoSrc="/videos/hero-bg.mp4" className="h-full w-full" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.1) 40%, rgba(5,5,5,0.8) 100%)",
        }}
      />

      <div aria-hidden className="pointer-events-none absolute inset-0 z-[3]">
        <div
          className="absolute left-1/2 top-1/2 h-[500px] w-[500px] rounded-full border border-[rgba(255,140,0,0.06)]"
          style={{ animation: "circle-pulse 4s ease-in-out infinite", transform: "translate(-50%, -50%)" }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[350px] w-[350px] rounded-full border border-[rgba(255,140,0,0.1)]"
          style={{
            animation: "circle-pulse 4s ease-in-out infinite 0.5s",
            transform: "translate(-50%, -50%)",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[200px] w-[200px] rounded-full border border-[rgba(255,140,0,0.15)]"
          style={{
            animation: "circle-pulse 4s ease-in-out infinite 1s",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[4]"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 50%, rgba(255,140,0,0.06) 0deg, rgba(255,215,0,0.04) 90deg, rgba(100,50,200,0.06) 180deg, rgba(255,100,50,0.04) 270deg, rgba(255,140,0,0.06) 360deg)",
        }}
      />

      <div className="relative z-[5] flex h-full flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#FF8C00] to-[#FFD700] shadow-[0_0_40px_rgba(255,140,0,0.3)]">
          <div className="h-[22px] w-[22px] rounded-full border-[3px] border-white" />
        </div>
        <h1 className="font-mono text-5xl font-extralight tracking-[-2px] text-white md:text-7xl lg:text-8xl">
          1Sat Browser
        </h1>
        <p className="mt-4 text-sm font-light tracking-wide text-foreground-tertiary md:text-base">
          Your keys. Your data. Your internet.
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
