'use client'

import { useState } from 'react'
import { RevealSection } from '@/components/effects/Reveal'

const faqs = [
  {
    q: 'What is 1Sat Browser?',
    a: 'A native macOS browser with a built-in Bitcoin wallet, AI assistant, and direct access to on-chain applications. No extensions, no wrappers — everything is integrated at the browser level.',
  },
  {
    q: 'How is this different from Chrome with a wallet extension?',
    a: 'Extensions are sandboxed and limited. 1Sat integrates wallet, identity, and AI at the browser level — no popups, no middlemen. Transactions are signed in the Secure Enclave, not in a JavaScript sandbox.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes. Keys live in the Secure Enclave. No data is stored on our servers. Browse and transact with full privacy by default.',
  },
  {
    q: 'Can I import from my current browser?',
    a: 'Yes — bookmarks, history, and passwords can be imported from Chrome, Safari, Arc, and other Chromium browsers.',
  },
  {
    q: 'What does it cost?',
    a: 'Free and open source. No subscriptions, no data brokers.',
  },
  {
    q: 'What are the system requirements?',
    a: 'macOS 14 (Sonoma) or later. Apple Silicon or Intel.',
  },
] as const

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <RevealSection threshold={0.1} className="max-w-2xl mx-auto px-4 py-16 border-t border-divider">
      <h2 className="font-mono font-semibold text-3xl text-center mb-10">FAQs</h2>
      <div className="flex flex-col">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i
          return (
            <div key={faq.q} className="border-b border-glass-border">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left text-[15px] font-medium text-foreground hover:text-[#FFD700] transition-colors"
                aria-expanded={isOpen}
              >
                {faq.q}
                <span
                  className="text-foreground-quaternary text-xl ml-4 transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-200"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <p className="pb-5 text-sm text-foreground-secondary leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </RevealSection>
  )
}
