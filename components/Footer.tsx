import { LogoMark } from '@/components/LogoMark'
import { externalLinkProps } from '@/components/link-utils'

const links = [
  { label: 'GitHub', href: 'https://github.com/b-open-io/1sat-sdk', external: true },
  { label: 'Docs', href: '#docs', external: false },
  { label: 'Twitter', href: 'https://twitter.com/1satordinals', external: true },
]

export function Footer() {
  return (
    <footer className="w-full px-4 md:px-8 py-6 border-t border-glass-border">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <LogoMark size="sm" />
          <span className="text-xs font-mono text-foreground-quaternary">&copy; 2026 1Sat</span>
        </div>

        <nav aria-label="Footer navigation" className="flex items-center gap-5">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external ? externalLinkProps(link.label) : {})}
              className="text-xs text-foreground-quaternary hover:text-foreground-secondary transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
