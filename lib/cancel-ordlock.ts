/**
 * OPL-4696 — cancel wallet-owned OrdLock listings on load / BSV sweep.
 * Create stays off. Buy and explicit cancel stay on.
 */

export const ORDLOCK_TAG = 'ordlock'

export type ListedOut = {
  outpoint: string
  tags?: string[]
}

export type CancelResult = {
  attempted: number
  cancelled: number
  skipped: number
  txids: string[]
  errors: string[]
}

export type WalletPort = {
  listOrdLock: () => Promise<ListedOut[]>
  cancelListing: (outpoint: string, id?: string) => Promise<{ txid?: string; error?: string }>
}

const ran = new Set<string>()

export function readAssetIdTag(tags: string[] | undefined): string | undefined {
  if (!tags) return undefined
  for (const t of tags) {
    if (t.startsWith('id:')) return t.slice(3)
  }
  return undefined
}

export function isOrdLockListed(output: { tags?: string[] }): boolean {
  return output.tags?.includes(ORDLOCK_TAG) ?? false
}

export function resetCancelSessions(): void {
  ran.clear()
}

function empty(): CancelResult {
  return { attempted: 0, cancelled: 0, skipped: 0, txids: [], errors: [] }
}

/** Cancel listed OrdLock UTXOs the wallet controls. Fail soft. */
export async function cancelOwnedOrdLockListings(
  wallet: WalletPort,
  options?: { sessionKey?: string; force?: boolean; limit?: number },
): Promise<CancelResult> {
  const result = empty()
  const key = options?.sessionKey
  if (key && !options?.force && ran.has(key)) return result
  if (key) ran.add(key)

  try {
    const listed = (await wallet.listOrdLock()).filter(isOrdLockListed)
    const cap = options?.limit ?? 25
    for (const row of listed.slice(0, cap)) {
      const id = readAssetIdTag(row.tags)
      if (!id) {
        result.skipped += 1
        result.errors.push(`${row.outpoint}: missing-id`)
        continue
      }
      result.attempted += 1
      try {
        const res = await wallet.cancelListing(row.outpoint, id)
        if (res.error || !res.txid) {
          result.errors.push(`${row.outpoint}: ${res.error ?? 'cancel-failed'}`)
          continue
        }
        result.cancelled += 1
        result.txids.push(res.txid)
      } catch (err) {
        result.errors.push(`${row.outpoint}: ${err instanceof Error ? err.message : String(err)}`)
      }
    }
  } catch (err) {
    result.errors.push(err instanceof Error ? err.message : String(err))
  }

  return result
}

/**
 * BSV sweep: cancel listed OrdLock first (cancel→BRC-100), then optional sweep
 * (cancel→new address / continue send-all). Sweep errors do not undo cancels.
 */
export async function cancelThenSweep(
  wallet: WalletPort | null,
  sweep?: () => Promise<void>,
): Promise<CancelResult & { swept: boolean }> {
  if (!wallet) return { ...empty(), swept: false }
  const cancel = await cancelOwnedOrdLockListings(wallet, {
    sessionKey: 'bsv-sweep',
    force: true,
  })
  if (!sweep) return { ...cancel, swept: false }
  try {
    await sweep()
    return { ...cancel, swept: true }
  } catch (err) {
    return {
      ...cancel,
      swept: false,
      errors: [...cancel.errors, err instanceof Error ? err.message : String(err)],
    }
  }
}
