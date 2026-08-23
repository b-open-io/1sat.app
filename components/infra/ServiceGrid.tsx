import { GeistPixelLine } from 'geist/font/pixel'
import { SERVICES } from '@/components/infra/services'
import { externalLinkProps } from '@/components/link-utils'

export function ServiceGrid() {
  return (
    <section id="services" className="border-t border-divider">
      <div className="mx-auto max-w-5xl px-4 py-24 md:px-8 md:py-32">
        <p className="font-mono text-xs tracking-[0.2em] text-brand">SERVICES</p>
        <h2
          className={`${GeistPixelLine.className} mt-3 text-3xl font-medium text-white md:text-5xl`}
        >
          Live on 1sat.app
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-foreground-tertiary">
          Every service below is public infrastructure. No keys, no signups — point your client at a
          host and go.
        </p>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <a
              key={service.host}
              href={service.href}
              {...externalLinkProps(service.name)}
              className="rounded-xl border border-glass-border bg-glass-surface p-5 transition-colors hover:border-brand/40"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm text-brand">{service.host}</span>
                <span className="text-foreground-quaternary">↗</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">{service.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-foreground-tertiary">
                {service.desc}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-glass-border px-1.5 py-0.5 font-mono text-[10px] text-foreground-quaternary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
