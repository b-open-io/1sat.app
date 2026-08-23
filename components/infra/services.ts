export type Service = {
  host: string
  name: string
  desc: string
  href: string
  tags: string[]
}

export const SERVICES: Service[] = [
  {
    host: 'api.1sat.app',
    name: '1Sat Stack',
    desc: 'Unified BSV indexing: UTXOs, ordinals, BSV21 tokens, ORDFS content, BAP identities, and transaction broadcast.',
    href: 'https://api.1sat.app/1sat/home/',
    tags: ['REST', 'SSE', 'ORDFS'],
  },
  {
    host: 'arcade.1sat.app',
    name: 'Arcade',
    desc: 'Transaction broadcasting with status callbacks. Submit raw or BEEF transactions to the BSV network.',
    href: 'https://arcade.1sat.app',
    tags: ['Broadcast', 'Callbacks'],
  },
  {
    host: 'wallet.1sat.app',
    name: 'Wallet Host',
    desc: 'BRC-100 wallet host: remote storage, sync, and hosted wallet services. OpenAPI reference at the root.',
    href: 'https://wallet.1sat.app',
    tags: ['BRC-100', 'OpenAPI'],
  },
  {
    host: 'messagebox.1sat.app',
    name: 'MessageBox',
    desc: 'Encrypted peer-to-peer message delivery for payment and token inboxes.',
    href: 'https://messagebox.1sat.app',
    tags: ['BRC-2', 'P2P'],
  },
  {
    host: 'sigma.1sat.app',
    name: 'Sigma Overlay',
    desc: 'BAP identity and social overlay index. Resolve on-chain identities and social data.',
    href: 'https://sigma.1sat.app/1sat/home/',
    tags: ['BAP', 'Social'],
  },
  {
    host: 'bsv21.1sat.app',
    name: 'BSV21 Overlay',
    desc: 'Overlay index for BSV21 fungible tokens.',
    href: 'https://bsv21.1sat.app',
    tags: ['BSV21', 'Tokens'],
  },
]
