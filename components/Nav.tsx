'use client'

import { useState } from 'react'
import { DOWNLOAD_URL } from '@/components/constants'
import { DownloadIcon } from '@/components/DownloadIcon'
import { LogoMark } from '@/components/LogoMark'
import { externalLinkProps } from '@/components/link-utils'

const DOCS_PROMPT = `# 1Sat SDK — AI Developer Setup

## 1. Load context (any LLM)
Fetch the project context file to give your AI assistant full SDK knowledge:
https://raw.githubusercontent.com/b-open-io/1sat-sdk/master/packages/wallet-desktop/llms.txt

## 2. Install the 1Sat plugin (Claude Code)
\`\`\`bash
claude plugin install 1sat@b-open-io
\`\`\`

## 3. Install individual skills (any AI tool — Claude Code, Cursor, Gemini CLI, VS Code, etc.)
\`\`\`bash
npx skills add https://github.com/b-open-io/1sat-sdk --skill <skill-name>
\`\`\`

## Available Skills

| Skill | What it does |
|-------|-------------|
| 1sat-stack | Unified BSV indexing API — UTXOs, inscriptions, ordinals, token balances |
| 1sat-cli | CLI tool for wallet ops, minting, tokens, listings from the terminal |
| ordinals-marketplace | List, buy, cancel ordinal listings on the marketplace |
| token-operations | BSV21 token deployment, minting, transfers |
| transaction-building | Build BSV transactions — payments, OP_RETURN, custom scripts |
| wallet-setup | Create wallets, sync addresses, configure storage, restore from backup |
| wallet-create-ordinals | Mint ordinals and inscribe files from a wallet |
| dapp-connect | Connect dApps to 1Sat wallet via popup or browser extension |
| sweep-import | Sweep/import UTXOs and ordinals from external wallets |
| opns-names | Register and manage OpNS (on-chain DNS) names |
| timelock | Lock BSV with time-based release conditions |
| extract-blockchain-media | Extract inscribed media (images, videos, files) from transactions |
| pow20-mining | Mine POW20 tokens with proof-of-work |

## SDK Packages (npm)
\`\`\`
@1sat/actions    — High-level ordinal/token actions
@1sat/client     — API client for 1sat-stack
@1sat/connect    — dApp wallet connection
@1sat/react      — React hooks for wallet integration
@1sat/types      — Shared TypeScript types
@1sat/utils      — Utility functions
@1sat/wallet     — Core wallet logic
@1sat/templates  — Script templates
\`\`\`

## Quick start
Ask your AI: "Use the 1sat-stack skill to fetch ordinals for an address" or "Use transaction-building to send BSV"
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
        aria-label="Download 1Sat for Mac"
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
