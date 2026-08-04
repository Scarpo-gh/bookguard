# Receipts

## First Base Mainnet Anchor

BookGuard's first mainnet anchor records a canonical deployment-provenance receipt for `ReceiptAnchorV1`. It is a product self-provenance record, not a claim about upstream market data, outcomes, trading decisions, or profitability.

| Field | Value |
| --- | --- |
| Receipt source | [`receipts/2026-08-04-receipt-anchor-v1-deployment.json`](../receipts/2026-08-04-receipt-anchor-v1-deployment.json) |
| Canonical receipt bytes | 365 UTF-8 bytes; compact JSON with no trailing newline |
| Receipt hash | `0x8ab8c16734dc7178a280f3ed48fdf6609af644fdb88c50d49bed0348cbc2077c` |
| Policy hash | `0x0987a63a56cdf1ba50bbc85261bff3f98a17e0d73f47db1f8b9a8bfb66d07173` (`bookguard:policy:deployment-provenance/v1`) |
| Scope hash stored in `marketHash` | `0xe47ea7f7aecbe2684889496246c57fae9e97e830f37541109d8e98c5efa7e12f` (`bookguard:scope:system:receipt-anchor-v1`) |
| Observation time | `2026-08-04T12:08:12Z` (`1785845292`) |
| Anchor transaction | [`0xbb77e331e81b915c20a23205deecafc6d818a92613ab7dc29493f289254ee797`](https://basescan.org/tx/0xbb77e331e81b915c20a23205deecafc6d818a92613ab7dc29493f289254ee797) |
| Block | `49530988` (`2026-08-04T13:48:43Z`) |
| Anchored by | `0xD725160341c1c65Cf1369d271c897aFC5fcc3926` |
| Contract | [`ReceiptAnchorV1`](https://basescan.org/address/0x9a8fCf271F97075486673eA3eD48c4fda33374Ce) |
| Status | Success; emitted one `ReceiptAnchored` event |
| Gas used | `114,651` |
| Total fee | `0.000002651189021911 ETH` |

The contract field is named `marketHash`; this first record deliberately uses a BookGuard system scope because the receipt documents deployment provenance rather than an external market observation.

## Independent verification

The receipt can be recomputed from the checked-in canonical file and then read from Base Mainnet without a wallet:

```bash
PATH="$HOME/.local/bin:$PATH"
receipt_hex="0x$(xxd -p -c 100000 receipts/2026-08-04-receipt-anchor-v1-deployment.json | tr -d '\n')"
cast keccak "$receipt_hex"
cast call 0x9a8fCf271F97075486673eA3eD48c4fda33374Ce \
  'getAnchor(bytes32)(bytes32,bytes32,bytes32,uint64,address)' \
  0x8ab8c16734dc7178a280f3ed48fdf6609af644fdb88c50d49bed0348cbc2077c \
  --rpc-url https://mainnet.base.org
```

The read result must contain the receipt hash, the policy hash, the system scope hash, observation time `1785845292`, and the recorded anchorer address.
