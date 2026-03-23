import { Nav } from "@/components/Nav"
import { FeatureSection } from "@/components/FeatureSection"
import { StatsBar } from "@/components/StatsBar"
import { FinalCTA } from "@/components/FinalCTA"
import { Footer } from "@/components/Footer"

const creating = {
  keyword: "Creating",
  subtitle:
    "Publish anything on-chain. Inscribe files. Mint ordinals. Directly from your browser.",
  gradientColors: ["#FF8C00", "#FFD700", "#FF6B35"] as [
    string,
    string,
    string,
  ],
  id: "creating",
  slides: [
    {
      title: "File Inscription",
      description:
        "Drag, drop, inscribe. Any file type becomes a permanent on-chain artifact in seconds — no command line required.",
    },
    {
      title: "Mint Ordinals",
      description:
        "Create 1Sat Ordinals with a native minting interface. Set metadata, royalties, and publish directly to the blockchain.",
    },
    {
      title: "On-Chain Publishing",
      description:
        "Publish text, images, or full applications immutably. Your content lives on the chain, not in a cloud that can disappear.",
    },
  ],
}

const owning = {
  keyword: "Owning",
  subtitle:
    "Your keys. Your identity. Your data. No custodians. No middlemen. Just you.",
  gradientColors: ["#6B3FA0", "#9B6DFF", "#B794F6"] as [
    string,
    string,
    string,
  ],
  id: "owning",
  slides: [
    {
      title: "BAP Identity",
      description:
        "Bitcoin Attestation Protocol gives you a portable, self-sovereign identity that no platform can revoke or delete.",
    },
    {
      title: "Self-Sovereign Keys",
      description:
        "Your private keys never leave your device. Sign transactions locally with hardware-level Secure Enclave protection.",
    },
    {
      title: "No Cloud",
      description:
        "Zero data stored on 1Sat servers. Browse, transact, and collect with full privacy by default.",
    },
  ],
}

const connecting = {
  keyword: "Connecting",
  subtitle:
    "Peer-to-peer. Interoperable. No middlemen between you and the network.",
  gradientColors: ["#0D9488", "#06B6D4", "#22D3EE"] as [
    string,
    string,
    string,
  ],
  id: "connecting",
  slides: [
    {
      title: "dApp Browser",
      description:
        "Connect to any BSV application natively. No extensions, no wallet popups — just seamless, in-browser dApp integration.",
    },
    {
      title: "Peer-to-Peer",
      description:
        "Send and receive value directly between peers. The network routes around intermediaries by design.",
    },
    {
      title: "Interoperable",
      description:
        "Open protocols mean your assets and identity work across every BSV app in the ecosystem, not just ours.",
    },
  ],
}

const securing = {
  keyword: "Securing",
  subtitle:
    "Trustless by design. Hardware-level protection. Nothing to trust but math.",
  gradientColors: ["#059669", "#10B981", "#34D399"] as [
    string,
    string,
    string,
  ],
  id: "securing",
  slides: [
    {
      title: "Secure Enclave",
      description:
        "Keys live in Apple's Secure Enclave — isolated hardware that even the OS cannot access. No software vulnerability can expose them.",
    },
    {
      title: "Trustless",
      description:
        "Every transaction is cryptographically verifiable. You don't need to trust 1Sat — the math does it for you.",
    },
    {
      title: "Native Performance",
      description:
        "Built with Swift and native APIs, not an Electron wrapper. Security and speed are not a trade-off.",
    },
  ],
}

export default function Home() {
  return (
    <main className="bg-[#050505] min-h-screen overflow-x-hidden">
      <Nav />

      {/* Hero — placeholder for Hero component from parallel agent */}
      <div id="hero" className="min-h-screen" />

      {/* Feature sections */}
      <div
        id="features"
        className="flex flex-col items-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <FeatureSection {...creating} />
        <FeatureSection {...owning} />
        <FeatureSection {...connecting} />
        <FeatureSection {...securing} />
      </div>

      <StatsBar />
      <FinalCTA />
      <Footer />
    </main>
  )
}
