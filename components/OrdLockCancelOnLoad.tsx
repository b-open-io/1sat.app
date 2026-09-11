'use client'

import { useEffect } from 'react'
import { cancelOwnedOrdLockListings, cancelThenSweep } from '@/lib/cancel-ordlock'
import {
  ORDLOCK_CANCEL_ENABLED,
  ORDLOCK_CANCEL_ON_LOAD,
  ORDLOCK_CANCEL_ON_SWEEP,
} from '@/lib/ordlock'
import { detectWalletPort } from '@/lib/wallet-port'

/** On wallet load: cancel listed OrdLock UTXOs (fail soft). Does not prompt connect. */
export function OrdLockCancelOnLoad({ sessionKey = '1sat.app-load' }: { sessionKey?: string }) {
  useEffect(() => {
    if (!ORDLOCK_CANCEL_ON_LOAD || !ORDLOCK_CANCEL_ENABLED) return
    const run = () => {
      const port = detectWalletPort()
      if (!port) return
      void cancelOwnedOrdLockListings(port, { sessionKey }).catch(() => {})
    }
    run()
    window.addEventListener('onesat:ready', run)
    window.addEventListener('yours:ready', run)
    return () => {
      window.removeEventListener('onesat:ready', run)
      window.removeEventListener('yours:ready', run)
    }
  }, [sessionKey])
  return null
}

/** BSV sweep path: cancel listed OrdLock first (cancel→BRC-100). */
export function OrdLockCancelOnSweep() {
  useEffect(() => {
    if (!ORDLOCK_CANCEL_ON_SWEEP || !ORDLOCK_CANCEL_ENABLED) return
    const port = detectWalletPort()
    void cancelThenSweep(port).catch(() => {})
  }, [])
  return null
}
