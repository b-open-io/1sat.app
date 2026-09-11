import { isOrdLockListed, type ListedOut, type WalletPort } from '@/lib/cancel-ordlock'

type LooseWallet = {
  isConnected?: () => boolean
  listOutputs?: (q: unknown) => Promise<{ outputs?: ListedOut[] } | ListedOut[]>
  getOrdinals?: () => Promise<ListedOut[]>
  cancelListing?: (req: unknown) => Promise<{ txid?: string; error?: string }>
  cancelOrdinalListing?: (req: unknown) => Promise<{ txid?: string; error?: string }>
}

function asOutputs(raw: { outputs?: ListedOut[] } | ListedOut[] | undefined): ListedOut[] {
  if (!raw) return []
  return Array.isArray(raw) ? raw : (raw.outputs ?? [])
}

async function listOrdLock(w: LooseWallet): Promise<ListedOut[]> {
  if (w.listOutputs) {
    const raw = await w.listOutputs({
      tags: ['ordlock'],
      tagQueryMode: 'any',
      includeTags: true,
      limit: 1000,
    })
    return asOutputs(raw).filter(isOrdLockListed)
  }
  if (w.getOrdinals) {
    return (await w.getOrdinals()).filter(isOrdLockListed)
  }
  return []
}

async function cancelListing(
  w: LooseWallet,
  outpoint: string,
  id?: string,
): Promise<{ txid?: string; error?: string }> {
  if (w.cancelListing) {
    return w.cancelListing({ listingOutpoints: [outpoint], outpoint, id })
  }
  if (w.cancelOrdinalListing) {
    return w.cancelOrdinalListing({ id, outpoint })
  }
  return { error: 'no-cancel' }
}

export function portFromWallet(w: LooseWallet | null | undefined): WalletPort | null {
  if (!w) return null
  if (w.isConnected && !w.isConnected()) return null
  if (!w.listOutputs && !w.getOrdinals) return null
  if (!w.cancelListing && !w.cancelOrdinalListing) return null
  return {
    listOrdLock: () => listOrdLock(w),
    cancelListing: (outpoint, id) => cancelListing(w, outpoint, id),
  }
}

/** Injected 1Sat / Yours / BRC-100 wallet, if already available. Does not prompt. */
export function detectWalletPort(): WalletPort | null {
  if (typeof window === 'undefined') return null
  const w = window as Window & { onesat?: LooseWallet; yours?: LooseWallet }
  return portFromWallet(w.onesat) ?? portFromWallet(w.yours)
}
