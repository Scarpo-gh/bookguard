# External Observation Dry Run — 2026-08-04

## Status

**Not anchored.** This is a read-only schema and transaction dry run. No wallet signature, broadcast, or mainnet state change occurred for this receipt.

## Source market observation

| Field | Value |
| --- | --- |
| Provider | Polymarket public Gamma API and CLOB API |
| Market question | Ethereum Up or Down - August 5, 9:50AM-9:55AM ET |
| Gamma market slug | `eth-updown-5m-1785937800` |
| CTF condition ID | `0xc1c0a93cc1321a1a4c45814182dc7f671a448017418f739d73dbc374b7163725` |
| Market state during fetch | `active: true`, `closed: false` |
| Observation time | `2026-08-04T14:02:42Z` (`1785852162`) |
| Gamma outcome prices | Up `0.505`, Down `0.495` |
| Up best bid / ask | `0.50` / `0.51` |
| Down best bid / ask | `0.49` / `0.50` |

The complete canonical snapshot is [`receipts/drafts/2026-08-04-polymarket-eth-updown-observation.json`](../receipts/drafts/2026-08-04-polymarket-eth-updown-observation.json). The CLOB response had no `last_trade_price` for either outcome, so the field is explicitly retained as an empty string rather than inferred.

## Prepared anchor inputs

| Field | Value |
| --- | --- |
| Receipt hash | `0x761557fd211bffbf7aa46c025b9c21d4c3567e82d45ecb0da0d2441b43fd9b9f` |
| Policy hash | `0x5aab2c07dcc68c76f1397011ed98f64e009aca8a8427ac0a80c5c10ab8c80799` (`bookguard:policy:polymarket-clob-top-of-book/v1`) |
| Market hash | `0x8bbbe1b06e577878308ce410a750259ea2557f4c981e792d9f865e2f5f329730` (`polymarket:condition:<conditionId>`) |
| Observed at | `1785852162` |
| Receipt bytes | `980` compact UTF-8 JSON bytes |

## Base Mainnet dry run

The following calls were made against `ReceiptAnchorV1` at `0x9a8fCf271F97075486673eA3eD48c4fda33374Ce` from the project wallet address, without sending a transaction:

```text
getAnchor(receiptHash): no record
anchorReceipt(...) eth_call: success
anchorReceipt(...) gas estimate: 115,677
Base gas price at check: 6,000,000 wei
```

A future anchor must re-fetch the market before signing. The prepared draft is intentionally not used as an implication that its historical order-book values are still current.
