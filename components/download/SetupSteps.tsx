import { RevealDiv } from '@/components/effects/Reveal'

const steps = [
  {
    number: 1,
    title: 'Create your account.',
    description: (
      <>
        Open 1Sat and create a new wallet — it takes seconds. Your{' '}
        <span className="text-foreground font-medium">private keys are generated locally</span> and
        stored in the Secure Enclave. Nothing leaves your device.
      </>
    ),
  },
  {
    number: 2,
    title: 'Configure your browser.',
    description: (
      <>
        Import bookmarks from your old browser, or start fresh. Configure your{' '}
        <span className="text-foreground font-medium">local stack options</span> — indexer
        preferences, default apps, and network settings.
      </>
    ),
  },
  {
    number: 3,
    title: 'Explore the metanet.',
    description: (
      <>
        Browse with <span className="text-foreground font-medium">agentic AI control</span>,
        interact with on-chain apps natively, and use your{' '}
        <span className="text-foreground font-medium">built-in wallet</span> to transact
        peer-to-peer — all from a browser that&rsquo;s{' '}
        <span className="text-foreground font-medium">metanet-native</span>.
      </>
    ),
  },
] as const

export function SetupSteps() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex flex-col gap-24">
        {steps.map((step, i) => {
          const reversed = i % 2 === 1
          return (
            <RevealDiv key={step.number} threshold={0.15}>
              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${reversed ? 'md:[direction:rtl]' : ''}`}
              >
                <div className={reversed ? 'md:[direction:ltr]' : ''}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF8C00] to-[#FFD700] flex items-center justify-center text-black font-bold text-sm mb-4">
                    {step.number}
                  </div>
                  <h3 className="font-mono font-semibold text-2xl text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-foreground-secondary leading-relaxed">{step.description}</p>
                </div>
                <div
                  className={`aspect-[4/3] rounded-xl border border-glass-border bg-glass-surface flex items-center justify-center text-foreground-quaternary text-sm italic ${reversed ? 'md:[direction:ltr]' : ''}`}
                >
                  Screenshot coming soon
                </div>
              </div>
            </RevealDiv>
          )
        })}
      </div>
    </section>
  )
}
