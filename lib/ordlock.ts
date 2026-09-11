/** OPL-4693 — OrdLock listing create is off on 1sat.app. Buy/cancel stay on. */
export const ORDLOCK_LISTING_DISABLED = true

export const ORDLOCK_BUY_ENABLED = true
export const ORDLOCK_CANCEL_ENABLED = true

/**
 * This host is infra/marketing only — no wallet or sweep runtime.
 * Cancel-on-load / BSV sweep lives on wallet surfaces (OPL-4696).
 */
export const ORDLOCK_WALLET_RUNTIME = false

export const LISTING_CREATE_OFF_MESSAGE =
  'OrdLock listing create is disabled pending a replacement contract. Existing listings can still be bought or cancelled.'

export function listingCreateDisabledBody() {
  return {
    error: LISTING_CREATE_OFF_MESSAGE,
    create: false,
    buy: ORDLOCK_BUY_ENABLED,
    cancel: ORDLOCK_CANCEL_ENABLED,
    ticket: 'OPL-4693',
  }
}

export function assertListingCreateAllowed(): void {
  if (ORDLOCK_LISTING_DISABLED) {
    throw new Error(LISTING_CREATE_OFF_MESSAGE)
  }
}
