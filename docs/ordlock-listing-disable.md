# OrdLock listing create OFF (OPL-4693) + cancel on load/sweep (OPL-4696)

`ORDLOCK_LISTING_DISABLED` is **true** on this site.

## Policy

- **Create** listing: OFF (UI + API).
- **Buy** existing listings: ON.
- **Cancel** existing listings: ON.
- **Wallet load / BSV sweep** (OPL-4696): cancel listed OrdLock UTXOs (cancel→BRC-100), then optional sweep (cancel→new address). Fail soft. Does not prompt a new wallet connect.

## Surfaces on 1sat.app

This repo is infra/marketing plus BRC-100 discovery (`/.well-known/brc100-wallet.json`, `/brc100`). There is no in-page create-listing dialog.

| Path | Behavior |
| --- | --- |
| All pages | `OrdLockCancelOnLoad` — if `window.onesat` / `window.yours` is already loaded, cancel owned `ordlock` outputs |
| `/brc100` | Wallet session landing (native app owns `/brc100/pay` via Universal Links) |
| `/sweep` | Cancel listed OrdLock first, then point at wallet/desktop for full BSV sweep |
| `POST`/`PUT` `/api/listings` | **410** create rejected |

Helpers: `lib/cancel-ordlock.ts` (`cancelOwnedOrdLockListings`, `cancelThenSweep`).

## Do not mix

Ty Everett / BSV dependency upgrade PRs are a separate wave (OPL-4702).

## Re-enable

Flip `ORDLOCK_LISTING_DISABLED` after the replacement contract lands (OPL-4697 / OPL-4699). Keep cancel-on-load until old listings are gone.
