'use client'

import { useEffect, useRef, useState } from 'react'
import {
  type CancelResult,
  cancelOwnedOrdLockListings,
  WALLET_CHANGED_MESSAGE,
} from '@/lib/cancel-ordlock'
import { ORDLOCK_CANCEL_ENABLED, ORDLOCK_CANCEL_ON_LOAD } from '@/lib/ordlock'
import { detectWalletPort } from '@/lib/wallet-port'

type View = {
  phase: 'checking' | 'unavailable' | 'locked' | 'running' | 'finished' | 'error'
  message?: string
  result?: CancelResult
}

/** One run per mounted view/retry. Standard wallet calls handle permission and native fees. */
export function OrdLockCancelOnLoad() {
  const [attempt, setAttempt] = useState(0)
  const [view, setView] = useState<View>({ phase: 'checking' })
  const stop = useRef<AbortController | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: the retry counter intentionally starts a fresh account-bound run.
  useEffect(() => {
    if (!ORDLOCK_CANCEL_ENABLED || !ORDLOCK_CANCEL_ON_LOAD) return
    const controller = new AbortController()
    stop.current = controller
    let active = true
    let checking = false
    const wallet = detectWalletPort()
    let identity: string | undefined
    const show = (next: View) => {
      if (active) setView(next)
    }
    const changed = () => {
      controller.abort()
      if (active)
        setView((current) => ({ ...current, phase: 'error', message: WALLET_CHANGED_MESSAGE }))
    }
    const checkAccount = async () => {
      if (!active || !wallet || !identity || controller.signal.aborted || checking) return
      checking = true
      try {
        if (
          detectWalletPort() !== wallet ||
          !(await wallet.isAuthenticated({})).authenticated ||
          (await wallet.getPublicKey({ identityKey: true })).publicKey !== identity
        )
          changed()
      } catch {
        changed()
      } finally {
        checking = false
      }
    }
    const run = async () => {
      show({ phase: 'checking' })
      if (!wallet) {
        show({ phase: 'unavailable' })
        return
      }
      try {
        if (!(await wallet.isAuthenticated({})).authenticated) {
          show({ phase: 'locked' })
          return
        }
      } catch {
        show({ phase: 'locked' })
        return
      }
      controller.signal.throwIfAborted()
      identity = (await wallet.getPublicKey({ identityKey: true })).publicKey
      controller.signal.throwIfAborted()
      show({ phase: 'running' })
      const result = await cancelOwnedOrdLockListings(wallet, {
        signal: controller.signal,
        identityKey: identity,
      })
      if (controller.signal.aborted) {
        show({
          phase: 'error',
          message: 'Delisting stopped. Review the completed transactions before retrying.',
          result,
        })
      } else {
        show({ phase: result.errors.length ? 'error' : 'finished', result })
      }
    }
    void run().catch((error) =>
      show({ phase: 'error', message: error instanceof Error ? error.message : String(error) }),
    )
    const timer = window.setInterval(() => {
      void checkAccount()
    }, 2000)
    window.addEventListener('focus', checkAccount)
    return () => {
      active = false
      controller.abort()
      window.clearInterval(timer)
      window.removeEventListener('focus', checkAccount)
    }
  }, [attempt])

  if (!ORDLOCK_CANCEL_ENABLED || !ORDLOCK_CANCEL_ON_LOAD) return null
  return (
    <aside
      aria-label="Listing delisting"
      className="fixed right-4 bottom-4 z-50 max-h-[70vh] w-[calc(100%-2rem)] max-w-sm overflow-auto rounded-lg border border-white/15 bg-background p-4 shadow-xl"
    >
      <h2 className="text-sm font-medium text-white">OrdLock listing deprecation</h2>
      <div aria-live="polite" className="mt-2 text-sm text-foreground-secondary">
        {view.phase === 'checking' && <p>Checking the connected wallet…</p>}
        {view.phase === 'unavailable' && (
          <p>Open this page with the current Yours wallet to delist its listings.</p>
        )}
        {view.phase === 'locked' && (
          <p>Unlock your wallet, select the account, then check again.</p>
        )}
        {view.phase === 'running' && (
          <p>
            Delisting this account’s listings. Approve native fees in your wallet and keep this
            account selected.
          </p>
        )}
        {view.result && (
          <p>
            {view.result.cancelled} listing{view.result.cancelled === 1 ? '' : 's'} cancelled.{' '}
            {view.result.errors.length
              ? 'Some listings remain unresolved.'
              : 'This pass finished without errors.'}
          </p>
        )}
        {view.message && <p className="mt-2">{view.message}</p>}
      </div>
      {view.result && view.result.txids.length > 0 && (
        <details className="mt-3 text-xs text-foreground-secondary">
          <summary>Completed transactions ({view.result.txids.length})</summary>
          <ul className="mt-2 space-y-1 break-all">
            {[...new Set(view.result.txids)].map((txid) => (
              <li key={txid}>{txid}</li>
            ))}
          </ul>
        </details>
      )}
      {view.result && view.result.errors.length > 0 && (
        <details className="mt-3 text-xs text-foreground-secondary" open>
          <summary>Unresolved listings ({view.result.errors.length})</summary>
          <ul className="mt-2 space-y-1 break-words">
            {[...new Set(view.result.errors)].map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </details>
      )}
      <button
        type="button"
        className="mt-3 text-sm text-brand hover:underline"
        disabled={view.phase === 'checking'}
        onClick={() =>
          view.phase === 'running' ? stop.current?.abort() : setAttempt((value) => value + 1)
        }
      >
        {view.phase === 'running'
          ? 'Stop after current request'
          : view.phase === 'error'
            ? 'Retry delisting'
            : 'Check wallet again'}
      </button>
    </aside>
  )
}
