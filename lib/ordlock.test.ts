import { describe, expect, test } from 'bun:test'
import { DOCS_PROMPT } from '@/components/Nav'
import {
  assertListingCreateAllowed,
  listingCreateDisabledBody,
  ORDLOCK_BUY_ENABLED,
  ORDLOCK_CANCEL_ENABLED,
  ORDLOCK_CANCEL_ON_LOAD,
  ORDLOCK_CANCEL_ON_SWEEP,
  ORDLOCK_LISTING_DISABLED,
} from '@/lib/ordlock'

describe('ordlock listing create-off', () => {
  test('create is off; buy and cancel stay on', () => {
    expect(ORDLOCK_LISTING_DISABLED).toBe(true)
    expect(ORDLOCK_BUY_ENABLED).toBe(true)
    expect(ORDLOCK_CANCEL_ENABLED).toBe(true)
  })

  test('cancel on load/sweep stays on (OPL-4696)', () => {
    expect(ORDLOCK_CANCEL_ON_LOAD).toBe(true)
    expect(ORDLOCK_CANCEL_ON_SWEEP).toBe(true)
  })

  test('assertListingCreateAllowed throws', () => {
    expect(assertListingCreateAllowed).toThrow(/listing create is disabled/i)
  })

  test('API body rejects create only', () => {
    const body = listingCreateDisabledBody()
    expect(body.create).toBe(false)
    expect(body.buy).toBe(true)
    expect(body.cancel).toBe(true)
  })

  test('docs prompt does not teach listing create', () => {
    expect(DOCS_PROMPT).not.toMatch(/List, buy, cancel/)
    expect(DOCS_PROMPT).toMatch(/Buy and cancel existing ordinal listings/)
    expect(DOCS_PROMPT).toMatch(/cancel listed OrdLock/)
  })
})
