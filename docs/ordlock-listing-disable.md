# OrdLock listing create OFF (OPL-4693)

`ORDLOCK_LISTING_DISABLED` is **true** on this site.

## Policy

- **Create** listing: OFF (UI + API).
- **Buy** existing listings: ON (not hosted here; remains on market/wallet surfaces).
- **Cancel** existing listings: ON (not hosted here; remains on market/wallet surfaces).

This repo (`b-open-io/1sat.app`) is the 1sat.app infra/marketing site. It has no marketplace wallet, no `sellOrdinal` / create-listing dialog, and no buy/cancel transaction paths.

## What changed here

- Kill switch: `lib/ordlock.ts` (`ORDLOCK_LISTING_DISABLED`).
- API: `POST` / `PUT` `/api/listings` returns **410** (create rejected). Buy/cancel are not implemented on this host.
- Docs clipboard on `/browser` no longer teaches listing **create**. Buy/cancel language stays.
- Sweep/import skill copy points at cancel-listed-UTXO behavior for wallet surfaces (OPL-4696). This host has no wallet runtime (`ORDLOCK_WALLET_RUNTIME = false`).

## Do not mix

Ty Everett / BSV dependency upgrade PRs are a separate wave (OPL-4702). Not this change.

## Re-enable

Flip `ORDLOCK_LISTING_DISABLED` after the replacement contract lands (OPL-4697 / OPL-4699).
