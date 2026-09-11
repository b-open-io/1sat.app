import { afterEach, expect, spyOn, test } from 'bun:test'
import { cancelOpnsListing, cancelOrdinalListing } from '@1sat/actions'
import { Beef, PrivateKey, type WalletInterface, type WalletOutput } from '@bsv/sdk'
import { cancelOwnedOrdLockListings, WALLET_CHANGED_MESSAGE } from '@/lib/cancel-ordlock'
import { detectWalletPort, portFromWallet } from '@/lib/wallet-port'

const identity = PrivateKey.fromHex('1').toPublicKey().toString()
const anotherIdentity = PrivateKey.fromHex('2').toPublicKey().toString()
const spies: Array<{ mockRestore(): void }> = []
afterEach(() => {
  for (const spy of spies.splice(0)) spy.mockRestore()
})

function fixture(rows: Record<string, WalletOutput[]> = {}, pageSize = 7): WalletInterface {
  const wallet: Partial<WalletInterface> = {
    isAuthenticated: async () => ({ authenticated: true }),
    getPublicKey: async () => ({ publicKey: identity }),
    listOutputs: async ({ basket, offset = 0, limit = 1000, tags }) => {
      const all = (rows[basket] ?? []).filter(
        (row) => !tags || tags.every((tag) => row.tags?.includes(tag)),
      )
      return {
        totalOutputs: all.length,
        outputs: all.slice(offset, offset + Math.min(limit, pageSize)),
        BEEF: new Beef().toBinary(),
      }
    },
    createAction: async () => {
      throw new Error('Native wallet fee approval declined')
    },
    createSignature: async () => {
      throw new Error('Signing must not run after fee rejection')
    },
    signAction: async () => {
      throw new Error('Signing must not run after fee rejection')
    },
    abortAction: async () => ({ aborted: true }),
  }
  return wallet as WalletInterface
}
function listing(id: string): WalletOutput {
  return { outpoint: `${id}.0`, tags: ['ordlock', `id:${id}`], satoshis: 1, spendable: true }
}

test('detects the actual window.CWI contract without invented cancellation methods', async () => {
  const wallet = fixture()
  const prior = Object.getOwnPropertyDescriptor(globalThis, 'window')
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { CWI: wallet } })
  try {
    expect(detectWalletPort()).toBe(wallet)
    expect(
      portFromWallet({ getOrdinals: async () => [], cancelListing: async () => ({}) }),
    ).toBeNull()
    // Yours returns false when locked even though SDK 2.6 declares only the true literal.
    Object.assign(wallet, { isAuthenticated: async () => ({ authenticated: false }) })
    expect((await detectWalletPort()?.isAuthenticated({}))?.authenticated).toBeFalse()
    wallet.isAuthenticated = async () => {
      throw new Error('Wallet locked')
    }
    await expect(detectWalletPort()?.isAuthenticated({})).rejects.toThrow('Wallet locked')
  } finally {
    if (prior) Object.defineProperty(globalThis, 'window', prior)
    else Reflect.deleteProperty(globalThis, 'window')
  }
})

test('native action snapshots all pages in both baskets before cancellation and keeps receipts', async () => {
  const rows = {
    '1sat': Array.from({ length: 37 }, (_, i) => listing(`ordinal-${i}`)),
    opns: [listing('name')],
  }
  const wallet = fixture(rows)
  let cancellations = 0
  let discoveredBoth = false
  const original = wallet.listOutputs
  wallet.listOutputs = async (args) => {
    expect(cancellations).toBe(0)
    if (args.basket === 'opns') discoveredBoth = true
    return original(args)
  }
  for (const action of [cancelOrdinalListing, cancelOpnsListing]) {
    spies.push(
      spyOn(action, 'execute').mockImplementation(async (_context, input) => {
        expect(discoveredBoth).toBe(true)
        expect(input.fundingProvider).toBeUndefined()
        cancellations++
        return { txid: `receipt-${input.id}` }
      }),
    )
  }
  const result = await cancelOwnedOrdLockListings(wallet)
  expect(result.cancelled).toBe(38)
  expect(result.txids).toHaveLength(38)
  expect(result.errors).toEqual([])
})

test('a failed discovery does not cache success or suppress an explicit retry', async () => {
  const wallet = fixture()
  const original = wallet.listOutputs
  let first = true
  wallet.listOutputs = async (args) => {
    if (first) {
      first = false
      throw new Error('Discovery unavailable')
    }
    return original(args)
  }
  expect((await cancelOwnedOrdLockListings(wallet)).errors).toEqual(['Discovery unavailable'])
  expect(await cancelOwnedOrdLockListings(wallet)).toEqual({ cancelled: 0, txids: [], errors: [] })
})

test('partial cancellations retain successful txids and report failure for retry', async () => {
  const wallet = fixture({ '1sat': [listing('ok'), listing('retry')] })
  spies.push(
    spyOn(cancelOrdinalListing, 'execute').mockImplementation(async (_context, input) =>
      input.id === 'ok' ? { txid: 'completed' } : { error: 'Wallet approval declined' },
    ),
  )
  expect(await cancelOwnedOrdLockListings(wallet)).toEqual({
    cancelled: 1,
    txids: ['completed'],
    errors: ['retry.0: Wallet approval declined'],
  })
})

test('an account change before native fee creation stops the old account run', async () => {
  const wallet = fixture({ '1sat': [listing('owned')] })
  let selected = identity
  wallet.getPublicKey = async () => ({ publicKey: selected })
  const create = spyOn(wallet, 'createAction')
  spies.push(
    create,
    spyOn(cancelOrdinalListing, 'execute').mockImplementation(async (context) => {
      selected = anotherIdentity
      await context.wallet.createAction({ description: 'Cancel ordinal listing' })
      return { txid: 'must-not-happen' }
    }),
  )
  const result = await cancelOwnedOrdLockListings(wallet, { identityKey: identity })
  expect(create).not.toHaveBeenCalled()
  expect(result.cancelled).toBe(0)
  expect(result.errors.join(' ')).toContain(WALLET_CHANGED_MESSAGE)
})

test('unmount or stop during discovery prevents further native cancellation', async () => {
  const wallet = fixture({ '1sat': [listing('owned')] })
  const controller = new AbortController()
  const original = wallet.listOutputs
  wallet.listOutputs = async (args) => {
    controller.abort()
    return original(args)
  }
  const cancel = spyOn(cancelOrdinalListing, 'execute')
  spies.push(cancel)
  const result = await cancelOwnedOrdLockListings(wallet, { signal: controller.signal })
  expect(cancel).not.toHaveBeenCalled()
  expect(result.errors.length).toBeGreaterThan(0)
})

test('overlapping mounts serialize runs and leave a fresh retry available', async () => {
  const wallet = fixture()
  let active = 0
  const original = wallet.listOutputs
  wallet.listOutputs = async (args) => {
    expect(++active).toBe(1)
    await Promise.resolve()
    const page = await original(args)
    active--
    return page
  }
  const results = await Promise.all([
    cancelOwnedOrdLockListings(wallet),
    cancelOwnedOrdLockListings(wallet),
  ])
  expect(results.every((result) => result.errors.length === 0)).toBe(true)
})

test('real SDK cancellation requests native wallet funding and reports fee rejection before signing', async () => {
  const row = {
    ...listing('tracked'),
    outpoint: `${'ab'.repeat(32)}.0`,
    customInstructions: JSON.stringify({
      protocolID: [2, '1sat'],
      keyID: 'listing',
      counterparty: 'self',
    }),
  }
  const wallet = fixture({ '1sat': [row] })
  const create = spyOn(wallet, 'createAction')
  const sign = spyOn(wallet, 'signAction')
  spies.push(create, sign)
  const result = await cancelOwnedOrdLockListings(wallet)
  expect(create).toHaveBeenCalledTimes(1)
  expect(create.mock.calls[0][0]).toMatchObject({
    description: 'Cancel ordinal listing',
    inputs: [{ outpoint: row.outpoint }],
    outputs: [{ satoshis: 1, basket: '1sat' }],
    options: { signAndProcess: false, randomizeOutputs: false },
  })
  expect(sign).not.toHaveBeenCalled()
  expect(result.cancelled).toBe(0)
  expect(result.errors.join(' ')).toContain('Native wallet fee approval declined')
})
