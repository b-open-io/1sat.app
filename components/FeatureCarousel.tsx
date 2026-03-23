"use client"

import { useRef, useState } from "react"

interface Slide {
  title: string
  description: string
}

interface FeatureCarouselProps {
  slides: Slide[]
  gradientFrom: string
  gradientTo: string
}

export function FeatureCarousel({
  slides,
  gradientFrom,
  gradientTo,
}: FeatureCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const index = Math.round(el.scrollLeft / el.clientWidth)
    setActiveIndex(index)
  }

  const scrollTo = (index: number) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" })
    setActiveIndex(index)
  }

  return (
    <div className="w-full">
      {/* Scroll container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="flex-none w-full snap-center px-2"
            style={{ minWidth: "100%" }}
          >
            <div
              className="relative rounded-2xl overflow-hidden border"
              style={{
                background: `linear-gradient(135deg, ${gradientFrom}18 0%, ${gradientTo}08 100%)`,
                borderColor: `${gradientFrom}20`,
                minHeight: 340,
              }}
            >
              {/* Subtle top glow */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${gradientFrom}60, transparent)`,
                }}
              />

              {/* Content */}
              <div className="relative z-10 p-8 md:p-10 flex flex-col gap-4">
                {/* Slide number badge */}
                <span
                  className="self-start text-xs font-mono px-2.5 py-1 rounded-full border"
                  style={{
                    color: gradientFrom,
                    borderColor: `${gradientFrom}30`,
                    background: `${gradientFrom}10`,
                  }}
                >
                  0{i + 1}
                </span>

                <h3
                  className="text-2xl md:text-3xl font-semibold tracking-tight"
                  style={{ color: "rgba(255,255,255,0.95)" }}
                >
                  {slide.title}
                </h3>

                <p
                  className="text-base leading-relaxed max-w-lg"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {slide.description}
                </p>
              </div>

              {/* Screenshot placeholder */}
              <div
                className="absolute bottom-0 right-0 w-48 md:w-64 h-36 md:h-48 rounded-tl-2xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${gradientFrom}15, ${gradientTo}08)`,
                  border: `1px solid ${gradientFrom}20`,
                  borderBottom: "none",
                  borderRight: "none",
                }}
              >
                {/* Simulated browser chrome */}
                <div
                  className="flex items-center gap-1.5 px-3 py-2 border-b"
                  style={{ borderColor: `${gradientFrom}15` }}
                >
                  {[gradientFrom, gradientTo, `${gradientFrom}80`].map(
                    (color, ci) => (
                      <div
                        key={ci}
                        className="w-2 h-2 rounded-full"
                        style={{ background: color, opacity: 0.6 }}
                      />
                    ),
                  )}
                </div>
                <div className="p-3 flex flex-col gap-2">
                  {[70, 45, 60].map((w, li) => (
                    <div
                      key={li}
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${w}%`,
                        background: `${gradientFrom}25`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === activeIndex ? 24 : 6,
              height: 6,
              background:
                i === activeIndex ? gradientFrom : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>
    </div>
  )
}
