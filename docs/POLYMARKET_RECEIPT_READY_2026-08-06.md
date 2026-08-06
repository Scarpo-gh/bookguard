# Polymarket Receipt Anchor — 2026-08-06

## Status

**Anchored on Base Mainnet.** The wallet-controlled transaction completed successfully after the read-only checks below.

## Canonical evidence

| Field | Value |
| --- | --- |
| Receipt file | [`receipts/2026-08-06-polymarket-gavin-newsom-top-of-book.json`](../receipts/2026-08-06-polymarket-gavin-newsom-top-of-book.json) |
| Receipt hash | `0x2a2230e5d142921705bcd0b04e8b65a3f34ea22edd6e6298684a9f6a8b87bcec` |
| Policy hash | `0x5aab2c07dcc68c76f1397011ed98f64e009aca8a8427ac0a80c5c10ab8c80799` |
| Market hash | `0xce2d31e123506852fce6881c14bfbae505721daa2e1621854104bfdc4817f1e5` |
| Observed at | `2026-08-06T14:50:51Z` / Unix `1786027851` |

The observed market was **Will Gavin Newsom win the 2028 Democratic presidential nomination?** Its Polymarket condition ID is `0x0f49db97f71c68b1e42a6d16e3de93d85dbf7d4148e3f018eb79e88554be9f75`.

## Preflight

- `getAnchor(receiptHash)` returned the all-zero, unanchored record.
- `anchorReceipt(receiptHash, policyHash, marketHash, observedAt)` read-only `eth_call` returned `0x` successfully.
- `eth_estimateGas` returned `115677` gas.
- Target contract: [`ReceiptAnchorV1` on Base Mainnet](https://basescan.org/address/0x9a8fCf271F97075486673eA3eD48c4fda33374Ce#code).
- Transaction value must remain `0 ETH`.

## Anchor transaction

| Field | Value |
| --- | --- |
| Transaction | [`0x5d7881dfc234897832843685dbc8b968e6a8edc037475134f41c999155545509`](https://basescan.org/tx/0x5d7881dfc234897832843685dbc8b968e6a8edc037475134f41c999155545509) |
| Block | `49619739` (`2026-08-06T15:07:05Z`) |
| Status | Success; one `ReceiptAnchored` event |
| Gas used | `114639` |
| Value | `0 ETH` |
| Anchored by | `0xD725160341c1c65Cf1369d271c897aFC5fcc3926` |

`getAnchor(receiptHash)` was reread after mining and returned the exact receipt hash, policy hash, market hash, observation time, and anchorer listed above.

## Scope

This evidence records the supplied canonical JSON bytes and the listed public-market observation. It does not prove the correctness of Polymarket's source data, market resolution, execution quality, outcome, or profitability.

## Wallet-controlled write record

The existing deployed contract was used through Remix **Browser Extension** on Base with `0 ETH` value. No new contract was deployed.
