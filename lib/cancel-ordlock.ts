import { type CancelOwnedListingsResult, cancelOwnedListings, createContext } from '@1sat/actions'
import type { WalletInterface } from '@bsv/sdk'

export type CancelResult = CancelOwnedListingsResult
export const WALLET_CHANGED_MESSAGE =
  'Wallet account changed. Select the account and retry delisting.'

// Serialize mounts/retries for one provider. Failed passes never suppress a later retry.
const running = new WeakMap<WalletInterface, Promise<CancelResult>>()

/** Check the captured account before each native call, including signing and fee funding. */
function accountWallet(
  wallet: WalletInterface,
  identity: string,
  signal?: AbortSignal,
): WalletInterface {
  return new Proxy(wallet, {
    get(target, property) {
      const method = Reflect.get(target, property)
      if (typeof method !== 'function') return method
      return async (...args: unknown[]) => {
        // Native action cleanup may still need to release an unsigned transaction after a stop.
        if (property !== 'abortAction') signal?.throwIfAborted()
        const current = await wallet.getPublicKey({ identityKey: true })
        if (current.publicKey !== identity) throw new Error(WALLET_CHANGED_MESSAGE)
        if (property !== 'abortAction') signal?.throwIfAborted()
        return Reflect.apply(method, wallet, args)
      }
    },
  })
}

/** Native actions discover both baskets completely and retain partial receipts on failure. */
export async function cancelOwnedOrdLockListings(
  wallet: WalletInterface,
  options: { signal?: AbortSignal; identityKey?: string } = {},
): Promise<CancelResult> {
  const previous = running.get(wallet)
  const task = Promise.resolve(previous)
    .then(async () => {
      options.signal?.throwIfAborted()
      const identity =
        options.identityKey ?? (await wallet.getPublicKey({ identityKey: true })).publicKey
      if (!identity) throw new Error('The wallet did not return an account identity.')
      const context = createContext(accountWallet(wallet, identity, options.signal))
      // Omit custom funding: createAction/signAction use the wallet's native fee and approval flow.
      return cancelOwnedListings.execute(context, { signal: options.signal })
    })
    .catch(
      (error): CancelResult => ({
        cancelled: 0,
        txids: [],
        errors: [error instanceof Error ? error.message : String(error)],
      }),
    )
  running.set(wallet, task)
  try {
    return await task
  } finally {
    if (running.get(wallet) === task) running.delete(wallet)
  }
}
