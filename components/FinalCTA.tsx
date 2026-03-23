"use client"

import { useReveal } from "@/hooks/useReveal"

export function FinalCTA() {
  const ref = useReveal<HTMLElement>(0.15)

  return (
    <section
      ref={ref}
      className="reveal relative w-full flex flex-col items-center justify-center text-center px-4 py-32 md:py-48 overflow-hidden"
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,140,0,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Outer soft ring */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(ellipse at center, rgba(255,140,0,0.06) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <h2
          className="font-mono font-semibold leading-none tracking-tight"
          style={{
            fontSize: "clamp(4rem, 12vw, 8rem)",
            color: "rgba(255,255,255,0.95)",
            fontFamily: "var(--font-geist-mono)",
          }}
        >
          1Sat.
        </h2>

        <p
          className="font-mono font-semibold leading-none tracking-tight"
          style={{
            fontSize: "clamp(4rem, 12vw, 8rem)",
            fontFamily: "var(--font-geist-mono)",
            background: "linear-gradient(135deg, #FF8C00 0%, #FFD700 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Own it all.
        </p>

        <p
          className="text-base md:text-lg max-w-sm mt-2 leading-relaxed"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          The browser built for the open web. No subscriptions. No data
          brokers. Just you.
        </p>

        <a
          href="https://github.com/b-open-io/1sat-sdk/releases"
          className="mt-4 flex items-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-white cta-glow transition-all duration-300 text-base"
          style={{
            background: "linear-gradient(135deg, #FF8C00 0%, #FFD700 100%)",
            fontFamily: "var(--font-geist-sans)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-80"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download for Mac
        </a>

        <span
          className="text-xs mt-1"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          macOS 14+ · Free · Open Source
        </span>
      </div>
    </section>
  )
}
