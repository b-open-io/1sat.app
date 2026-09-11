import { expect, test } from 'bun:test'
import type { WalletInterface } from '@bsv/sdk'
import { delistingReceipts, EMPTY_DELISTING_RECEIPTS } from '@/lib/delisting-receipts'

const wallet = {} as WalletInterface
const account = { wallet, identity: 'account-a' }
const completed = () =>
  delistingReceipts(delistingReceipts(EMPTY_DELISTING_RECEIPTS, { type: 'account', ...account }), {
    type: 'completed',
    ...account,
    txids: ['first', 'first'],
  })

test('partial-pass receipts survive checking and running on the same account', () => {
  const prior = completed()
  const checking = delistingReceipts(prior, { type: 'checking', wallet })
  expect(checking.txids).toEqual(['first'])
  const running = delistingReceipts(checking, { type: 'account', ...account })
  expect(running.txids).toEqual(['first'])
  expect(delistingReceipts(running, { type: 'completed', ...account, txids: [] }).txids).toEqual([
    'first',
  ])
})

test('retries accumulate unique completed receipts without mutating earlier results', () => {
  const prior = completed()
  const retried = delistingReceipts(prior, {
    type: 'completed',
    ...account,
    txids: ['first', 'second', 'second'],
  })
  expect(prior.txids).toEqual(['first'])
  expect(retried.txids).toEqual(['first', 'second'])
})

test('an account change clears prior receipts and ignores a late old-account result', () => {
  const next = delistingReceipts(completed(), {
    type: 'account',
    wallet,
    identity: 'account-b',
  })
  expect(next.txids).toEqual([])
  const late = delistingReceipts(next, { type: 'completed', ...account, txids: ['late-a'] })
  expect(late).toBe(next)
  expect(
    delistingReceipts(late, {
      type: 'completed',
      wallet,
      identity: 'account-b',
      txids: ['first-b'],
    }).txids,
  ).toEqual(['first-b'])
})

test('a provider change separates receipts even when the identity is unchanged', () => {
  const replacement = {} as WalletInterface
  const checking = delistingReceipts(completed(), { type: 'checking', wallet: replacement })
  expect(checking.txids).toEqual([])
  const next = delistingReceipts(checking, { type: 'account', ...account, wallet: replacement })
  expect(delistingReceipts(next, { type: 'completed', ...account, txids: ['late'] })).toBe(next)
})

test('cleared or unavailable account state cannot receive old receipts', () => {
  for (const next of [
    delistingReceipts(completed(), { type: 'clear' }),
    delistingReceipts(completed(), { type: 'checking', wallet: null }),
  ]) {
    expect(next.txids).toEqual([])
    expect(delistingReceipts(next, { type: 'completed', ...account, txids: ['late'] })).toBe(next)
  }
})
