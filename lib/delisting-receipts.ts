import type { WalletInterface } from '@bsv/sdk'

export type DelistingReceipts = {
  wallet: WalletInterface | null
  identity?: string
  txids: string[]
}

type ReceiptEvent =
  | { type: 'checking'; wallet: WalletInterface | null }
  | { type: 'account'; wallet: WalletInterface; identity: string }
  | { type: 'completed'; wallet: WalletInterface; identity: string; txids: string[] }
  | { type: 'clear' }

export const EMPTY_DELISTING_RECEIPTS: DelistingReceipts = { wallet: null, txids: [] }

/** Receipts survive retries, while each pass keeps its own counts and errors. */
export function delistingReceipts(
  current: DelistingReceipts,
  event: ReceiptEvent,
): DelistingReceipts {
  if (event.type === 'clear') return EMPTY_DELISTING_RECEIPTS
  if (event.type === 'checking') {
    return current.wallet === event.wallet ? current : { wallet: event.wallet, txids: [] }
  }
  const sameAccount = current.wallet === event.wallet && current.identity === event.identity
  if (event.type === 'account') {
    return sameAccount ? current : { wallet: event.wallet, identity: event.identity, txids: [] }
  }
  // An old account's pending request must never append to a newer account's receipts.
  if (!sameAccount) return current
  return { ...current, txids: [...new Set([...current.txids, ...event.txids])] }
}
