import { RevealDiv } from '@/components/effects/Reveal'

interface Stat {
  value: string
  unit: string
  label: string
  /** Human-readable description for screen readers (overrides value+unit+label concatenation when needed) */
  ariaLabel?: string
}

const stats: Stat[] = [
  { value: '14', unit: 'MB', label: 'App Size', ariaLabel: '14 megabytes app size' },
  {
    value: '<50',
    unit: 'ms',
    label: 'Startup',
    ariaLabel: 'Less than 50 milliseconds startup time',
  },
  { value: '0', unit: '', label: 'Chromium', ariaLabel: 'Zero Chromium — not an Electron wrapper' },
  { value: '100', unit: '%', label: 'Your Keys', ariaLabel: '100 percent your keys' },
]

export function StatsBar() {
  return (
    <RevealDiv threshold={0.2} className="w-full max-w-5xl mx-auto px-4 md:px-8 py-16 md:py-24">
      <dl className="rounded-2xl border border-glass-border bg-glass-surface px-8 py-10 md:py-14 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-0">
        {stats.map((stat, i) => (
          <div key={stat.label} className="flex flex-col items-center gap-2 text-center relative">
            {/* Vertical divider (desktop only, not on last item) */}
            {i < stats.length - 1 ? (
              <div
                aria-hidden="true"
                className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-glass-border"
              />
            ) : null}

            {/* Number + unit — hidden from AT; the dt/dd pair conveys the meaning */}
            <div aria-hidden="true" className="flex items-end gap-0.5">
              <span
                className="font-mono font-semibold leading-none tabular-nums text-foreground"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
              >
                {stat.value}
              </span>
              {stat.unit ? (
                <span
                  className="font-mono font-medium pb-1 text-foreground-secondary"
                  style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}
                >
                  {stat.unit}
                </span>
              ) : null}
            </div>

            {/* Screen-reader accessible label */}
            <dt className="sr-only">{stat.label}</dt>
            <dd className="sr-only">
              {stat.ariaLabel ?? `${stat.value}${stat.unit} ${stat.label}`}
            </dd>

            {/* Visible label */}
            <span
              aria-hidden="true"
              className="text-xs font-medium tracking-widest uppercase text-foreground-tertiary"
            >
              {stat.label}
            </span>
          </div>
        ))}
      </dl>
    </RevealDiv>
  )
}
