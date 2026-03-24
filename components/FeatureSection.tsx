import { RevealSection } from '@/components/effects/Reveal'
import { FeatureCarousel, type Slide } from '@/components/FeatureCarousel'

export interface FeatureSectionProps {
  keyword: string
  subtitle: string
  slides: Slide[]
  gradientColors: [string, string, string]
  id?: string
}

export function FeatureSection({
  keyword,
  subtitle,
  slides,
  gradientColors,
  id,
}: FeatureSectionProps) {
  const [c1, c2, c3] = gradientColors

  return (
    <RevealSection
      id={id}
      threshold={0.1}
      className="w-full max-w-5xl mx-auto px-4 md:px-8 py-24 md:py-32 flex flex-col gap-12"
    >
      {/* Heading */}
      <div className="flex flex-col gap-4 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground text-balance">
          1Sat is for{' '}
          <span
            className="chroma-text"
            style={{
              backgroundImage: `linear-gradient(90deg, ${c1}, ${c2}, ${c3}, ${c1})`,
              backgroundSize: '300% 100%',
            }}
          >
            {keyword}
          </span>
        </h2>

        <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed text-foreground-secondary">
          {subtitle}
        </p>
      </div>

      {/* Carousel */}
      <FeatureCarousel slides={slides} gradientFrom={c1} gradientTo={c2} />
    </RevealSection>
  )
}
