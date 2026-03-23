"use client"

import { useReveal } from "@/hooks/useReveal"

const stats = [
  { value: "14", unit: "MB", label: "App Size" },
  { value: "<50", unit: "ms", label: "Startup" },
  { value: "0", unit: "", label: "Chromium" },
  { value: "100", unit: "%", label: "Your Keys" },
]

export function StatsBar() {
  const ref = useReveal<HTMLDivElement>(0.2)

  return (
    <div
      ref={ref}
      className="reveal w-full max-w-5xl mx-auto px-4 md:px-8 py-16 md:py-24"
    >
      <div
        className="rounded-2xl border px-8 py-10 md:py-14 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-0"
        style={{
          background: "rgba(255,255,255,0.03)",
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-2 text-center relative"
          >
            {/* Vertical divider (desktop only, not on last item) */}
            {i < stats.length - 1 && (
              <div
                className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12"
                style={{ background: "rgba(255,255,255,0.07)" }}
              />
            )}

            {/* Number + unit */}
            <div className="flex items-end gap-0.5">
              <span
                className="font-mono font-semibold leading-none"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  color: "rgba(255,255,255,0.92)",
                  fontFamily: "var(--font-geist-mono)",
                }}
              >
                {stat.value}
              </span>
              {stat.unit && (
                <span
                  className="font-mono font-medium pb-1"
                  style={{
                    fontSize: "clamp(1rem, 2vw, 1.5rem)",
                    color: "rgba(255,255,255,0.35)",
                    fontFamily: "var(--font-geist-mono)",
                  }}
                >
                  {stat.unit}
                </span>
              )}
            </div>

            {/* Label */}
            <span
              className="text-xs font-medium tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
