'use client'

import { useState } from 'react'
import { DOWNLOAD_URL } from '@/components/constants'
import { DownloadIcon } from '@/components/DownloadIcon'
import { LogoMark } from '@/components/LogoMark'
import { externalLinkProps } from '@/components/link-utils'

const DOCS_PROMPT = `# 1Sat Browser — Developer Setup

## 1. Load the LLMs context file
Fetch https://raw.githubusercontent.com/b-open-io/1sat-sdk/master/packages/wallet-desktop/llms.txt for project documentation.

## 2. Install the 1Sat skill plugin (Claude Code)
\`\`\`bash
claude plugin install 1sat@b-open-io
\`\`\`

This gives you skills for:
- 1sat-stack (unified BSV indexing API)
- Ordinals marketplace (list/buy/cancel)
- BSV21 token operations
- Wallet setup (BRC-100)
- Transaction building
- dApp wallet connection
- OpNS names
- File inscription & media extraction
- CLI tool

## 3. Install the 1Sat skill (any AI tool)
\`\`\`bash
npx skills add https://github.com/b-open-io/1sat-sdk --skill 1sat-stack
\`\`\`

## 4. Start building
Ask your AI assistant to use the 1sat skills to build with the 1Sat SDK.
`

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'Changelog', href: '/changelog' },
  { label: 'GitHub', href: 'https://github.com/b-open-io/1sat-sdk', external: true },
]

export function Nav() {
  const [copied, setCopied] = useState(false)

  const handleCopyDocs = async () => {
    await navigator.clipboard.writeText(DOCS_PROMPT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 pointer-events-none">
      <nav
        aria-label="Main navigation"
        className="pointer-events-auto flex items-center gap-6 px-4 py-2.5 rounded-full border border-glass-border bg-glass-surface backdrop-blur-[24px]"
      >
        <a href="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-sm font-semibold tracking-tight font-mono text-foreground">
            1Sat
          </span>
        </a>

        <div className="hidden md:block w-px h-4 self-center bg-foreground-quaternary" />

        <div className="hidden md:flex items-center gap-5">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...('external' in link ? externalLinkProps(link.label) : {})}
              className="text-sm text-foreground-secondary hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={handleCopyDocs}
            className="text-sm text-foreground-secondary hover:text-foreground transition-colors duration-200"
          >
            {copied ? 'Instructions copied!' : 'Docs'}
          </button>
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
