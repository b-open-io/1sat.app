import { describe, expect, test } from 'bun:test'
import {
  cancelOwnedOrdLockListings,
  cancelThenSweep,
  isOrdLockListed,
  readAssetIdTag,
  resetCancelSessions,
  type WalletPort,
} from '@/lib/cancel-ordlock'
import {
  ORDLOCK_CANCEL_ON_LOAD,
  ORDLOCK_CANCEL_ON_SWEEP,
  ORDLOCK_LISTING_DISABLED,
} from '@/lib/ordlock'
import { portFromWallet } from '@/lib/wallet-port'

function mockWallet(
  outputs: Array<{ outpoint: string; tags?: string[] }>,
  cancel: WalletPort['cancelListing'] = async () => ({ txid: 'tx1' }),
): WalletPort {
  return {
    listOrdLock: async () => outputs,
    cancelListing: cancel,
  }
}

describe('OPL-4696 cancel on load/sweep', () => {
  test('create stays off; cancel-on-load and cancel-on-sweep are on', () => {
    expect(ORDLOCK_LISTING_DISABLED).toBe(true)
    expect(ORDLOCK_CANCEL_ON_LOAD).toBe(true)
    expect(ORDLOCK_CANCEL_ON_SWEEP).toBe(true)
  })

  test('readAssetIdTag and isOrdLockListed', () => {
    expect(readAssetIdTag(['ordlock', 'id:abc'])).toBe('abc')
    expect(isOrdLockListed({ tags: ['ordlock'] })).toBe(true)
    expect(isOrdLockListed({ tags: ['origin:x'] })).toBe(false)
  })

  test('no-ops when wallet has no ordlock tags', async () => {
    const result = await cancelOwnedOrdLockListings(mockWallet([]))
    expect(result.cancelled).toBe(0)
    expect(result.attempted).toBe(0)
  })

  test('cancels listed outputs with an id tag', async () => {
    resetCancelSessions()
    const result = await cancelOwnedOrdLockListings(
      mockWallet([{ outpoint: 'aa.0', tags: ['ordlock', 'id:abc'] }]),
    )
    expect(result.attempted).toBe(1)
    expect(result.cancelled).toBe(1)
    expect(result.txids).toEqual(['tx1'])
  })

  test('skips listed outputs missing id', async () => {
    resetCancelSessions()
    const result = await cancelOwnedOrdLockListings(
      mockWallet([{ outpoint: 'aa.0', tags: ['ordlock'] }]),
    )
    expect(result.cancelled).toBe(0)
    expect(result.skipped).toBe(1)
    expect(result.errors).toEqual(['aa.0: missing-id'])
  })

  test('does not cancel unlisted ordinals', async () => {
    resetCancelSessions()
    const result = await cancelOwnedOrdLockListings(
      mockWallet([{ outpoint: 'aa.0', tags: ['id:abc'] }]),
    )
    expect(result.attempted).toBe(0)
    expect(result.cancelled).toBe(0)
  })

  test('session key runs once', async () => {
    resetCancelSessions()
    const wallet = mockWallet([{ outpoint: 'aa.0', tags: ['ordlock', 'id:abc'] }])
    const first = await cancelOwnedOrdLockListings(wallet, { sessionKey: 'load' })
    const second = await cancelOwnedOrdLockListings(wallet, { sessionKey: 'load' })
    expect(first.cancelled).toBe(1)
    expect(second.cancelled).toBe(0)
  })

  test('cancelThenSweep cancels first, then sweep', async () => {
    resetCancelSessions()
    let swept = false
    const result = await cancelThenSweep(
      mockWallet([{ outpoint: 'aa.0', tags: ['ordlock', 'id:abc'] }]),
      async () => {
        swept = true
      },
    )
    expect(result.cancelled).toBe(1)
    expect(result.swept).toBe(true)
    expect(swept).toBe(true)
  })

  test('cancelThenSweep without wallet is a no-op', async () => {
    const result = await cancelThenSweep(null)
    expect(result.cancelled).toBe(0)
    expect(result.swept).toBe(false)
  })

  test('portFromWallet ignores disconnected and unlisted getOrdinals', async () => {
    expect(portFromWallet({ isConnected: () => false, getOrdinals: async () => [] })).toBeNull()
    const port = portFromWallet({
      getOrdinals: async () => [
        { outpoint: 'aa.0', tags: ['id:abc'] },
        { outpoint: 'bb.1', tags: ['ordlock', 'id:xyz'] },
      ],
      cancelListing: async () => ({ txid: 'tx2' }),
    })
    expect(port).not.toBeNull()
    const listed = await port?.listOrdLock()
    expect(listed).toEqual([{ outpoint: 'bb.1', tags: ['ordlock', 'id:xyz'] }])
  })
})
