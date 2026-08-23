import { LogoMark } from '@/components/LogoMark'
import { externalLinkProps } from '@/components/link-utils'

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'SDK', href: '#sdk' },
  { label: 'Resources', href: '#resources' },
  { label: 'Browser', href: '/browser' },
  { label: 'Changelog', href: '/changelog' },
  { label: 'GitHub', href: 'https://github.com/b-open-io/1sat-sdk', external: true },
]

export function InfraNav() {
  return (
    <header className="pointer-events-none fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-4 py-4">
      <nav
        aria-label="Main navigation"
        className="pointer-events-auto flex items-center gap-6 rounded-full border border-glass-border bg-glass-surface px-4 py-2.5 backdrop-blur-[24px]"
      >
        <a href="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
            1Sat
          </span>
        </a>

        <div className="hidden h-4 w-px self-center bg-foreground-quaternary md:block" />

        <div className="hidden items-center gap-5 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...('external' in link ? externalLinkProps(link.label) : {})}
              className="text-sm text-foreground-secondary transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      <a
        href="https://api.1sat.app/1sat/home/"
        {...externalLinkProps('API Docs')}
        className="pointer-events-auto rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-black"
      >
        API Docs
      </a>
    </header>
  )
}
