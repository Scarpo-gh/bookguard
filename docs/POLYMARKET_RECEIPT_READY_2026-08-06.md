# Polymarket Receipt Ready for Anchor — 2026-08-06

## Status

**Unanchored and prepared for a wallet-controlled Base Mainnet transaction.** The checks below used read-only JSON-RPC calls. No signature, broadcast, or mainnet state change occurred.

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

## Scope

This evidence records the supplied canonical JSON bytes and the listed public-market observation. It does not prove the correctness of Polymarket's source data, market resolution, execution quality, outcome, or profitability.

## Wallet-controlled write

Use Remix **Browser Extension** with the existing deployed contract. Review the target, Base network, `0 ETH` value, function arguments, and wallet fee before confirming. Do not deploy another contract.
