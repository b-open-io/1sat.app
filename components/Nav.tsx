import { DOWNLOAD_URL } from '@/components/constants'
import { DownloadIcon } from '@/components/DownloadIcon'
import { LogoMark } from '@/components/LogoMark'
import { externalLinkProps } from '@/components/link-utils'

const navLinks = [
  { label: 'Features', href: '#features', external: false },
  { label: 'Changelog', href: '/changelog', external: false },
  { label: 'GitHub', href: 'https://github.com/b-open-io/1sat-sdk', external: true },
  { label: 'Docs', href: '#docs', external: false },
]

export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 pointer-events-none">
      <nav
        aria-label="Main navigation"
        className="pointer-events-auto flex items-center gap-6 px-4 py-2.5 rounded-full border border-glass-border bg-glass-surface backdrop-blur-[24px]"
      >
        <div className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-sm font-semibold tracking-tight font-mono text-foreground">
            1Sat
          </span>
        </div>

        <div className="hidden md:block w-px h-4 self-center bg-foreground-quaternary" />

        <div className="hidden md:flex items-center gap-5">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external ? externalLinkProps(link.label) : {})}
              className="text-sm text-foreground-secondary hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      <a
        href={DOWNLOAD_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download 1Sat for Mac (opens in new tab)"
        className="pointer-events-auto flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-black cta-glow bg-gradient-to-br from-[#FF8C00] to-[#FFD700]"
      >
        <DownloadIcon />
        <span aria-hidden="true" className="hidden sm:inline">
          Download for Mac
        </span>
        <span aria-hidden="true" className="sm:hidden">
          Download
        </span>
      </a>
    </header>
  )
}
