import type { WalletInterface } from '@bsv/sdk'

/** The standard methods used by native OrdLock cancellation and wallet status. */
const requiredMethods = [
  'isAuthenticated',
  'getPublicKey',
  'listOutputs',
  'createAction',
  'createSignature',
  'signAction',
  'abortAction',
] as const

export function portFromWallet(wallet: unknown): WalletInterface | null {
  if (!wallet || typeof wallet !== 'object') return null
  if (!requiredMethods.every((method) => typeof Reflect.get(wallet, method) === 'function')) {
    return null
  }
  return wallet as WalletInterface
}

/** Yours injects this native BRC-100 provider before page scripts execute. */
export function detectWalletPort(): WalletInterface | null {
  if (typeof window === 'undefined') return null
  return portFromWallet((window as Window & { CWI?: WalletInterface }).CWI)
}
