'use client'

import { useCallback, useId, useRef, useState } from 'react'

// Hoisted to module scope — avoids creating new object on every render
const scrollContainerStyle: React.CSSProperties = {
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
}

const slideItemStyle: React.CSSProperties = { minWidth: '100%' }

export interface Slide {
  title: string
  description: string
}

interface FeatureCarouselProps {
  slides: Slide[]
  gradientFrom: string
  gradientTo: string
}

export function FeatureCarousel({ slides, gradientFrom, gradientTo }: FeatureCarouselProps) {
  const scrollRef = useRef<HTMLUListElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const ticking = useRef(false)
  const baseId = useId()

  const handleScroll = useCallback(() => {
    if (ticking.current) return
    ticking.current = true
    requestAnimationFrame(() => {
      const el = scrollRef.current
      if (el) {
        const index = Math.round(el.scrollLeft / el.clientWidth)
        setActiveIndex(index)
      }
      ticking.current = false
    })
  }, [])

  const scrollTo = useCallback((index: number) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' })
    setActiveIndex(index)
  }, [])

  return (
    <section className="w-full" aria-roledescription="carousel" aria-label="Feature slides">
      {/* Scroll container */}
      <ul
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none rounded-2xl list-none m-0 p-0"
        style={scrollContainerStyle}
      >
        {slides.map((slide, i) => (
          <li
            key={slide.title}
            id={`${baseId}-slide-${i}`}
            className="flex-none w-full snap-center px-2"
            style={slideItemStyle}
            aria-label={`${i + 1} of ${slides.length}: ${slide.title}`}
            aria-hidden={i !== activeIndex}
          >
            <div
              className="relative rounded-2xl overflow-hidden border"
              style={{
                background: `linear-gradient(135deg, ${gradientFrom}18 0%, ${gradientTo}08 100%)`,
                borderColor: `${gradientFrom}20`,
                minHeight: 340,
              }}
            >
              {/* Subtle top glow — decorative */}
              <div
                aria-hidden="true"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${gradientFrom}60, transparent)`,
                }}
              />

              {/* Content */}
              <div className="relative z-10 p-8 md:p-10 flex flex-col gap-4">
                {/* Slide number badge — decorative, screen readers get slide position from aria-label */}
                <span
                  aria-hidden="true"
                  className="self-start text-xs font-mono px-2.5 py-1 rounded-full border"
                  style={{
                    color: gradientFrom,
                    borderColor: `${gradientFrom}30`,
                    background: `${gradientFrom}10`,
                  }}
                >
                  0{i + 1}
                </span>

                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                  {slide.title}
                </h3>

                <p className="text-base leading-relaxed max-w-lg text-foreground-secondary">
                  {slide.description}
                </p>
              </div>

              {/* Decorative screenshot placeholder — hidden from assistive technology */}
              <div
                aria-hidden="true"
                className="absolute bottom-0 right-0 w-48 md:w-64 h-36 md:h-48 rounded-tl-2xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${gradientFrom}15, ${gradientTo}08)`,
                  border: `1px solid ${gradientFrom}20`,
                  borderBottom: 'none',
                  borderRight: 'none',
                }}
              >
                {/* Simulated browser chrome */}
                <div
                  className="flex items-center gap-1.5 px-3 py-2 border-b"
                  style={{ borderColor: `${gradientFrom}15` }}
                >
                  {[gradientFrom, gradientTo, `${gradientFrom}80`].map((color) => (
                    <div
                      key={color}
                      className="w-2 h-2 rounded-full"
                      style={{ background: color, opacity: 0.6 }}
                    />
                  ))}
                </div>
                <div className="p-3 flex flex-col gap-2">
                  {[70, 45, 60].map((w) => (
                    <div
                      key={w}
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
          </li>
        ))}
      </ul>

      {/* Pagination buttons */}
      <nav className="flex items-center justify-center gap-2 mt-6" aria-label="Carousel pagination">
        {slides.map((slide, i) => (
          <button
            key={slide.title}
            type="button"
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}: ${slide.title}`}
            aria-current={i === activeIndex ? 'true' : undefined}
            aria-controls={`${baseId}-slide-${i}`}
            className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            style={{
              width: i === activeIndex ? 24 : 6,
              height: 6,
              background: i === activeIndex ? gradientFrom : 'rgba(255,255,255,0.2)',
              transition: 'width 0.3s ease, background-color 0.3s ease',
            }}
          />
        ))}
      </nav>
    </section>
  )
}
