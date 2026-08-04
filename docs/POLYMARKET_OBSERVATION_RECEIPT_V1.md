# Polymarket Observation Receipt V1

## Purpose

This schema records an immutable, reproducible observation of a public Polymarket market and its CLOB top-of-book state. It is evidence of what BookGuard fetched at a stated time. It does **not** attest to the correctness of Polymarket data, market resolution, future prices, execution quality, profitability, or a trading recommendation.

## Canonicalization

1. Use a JSON object containing only the fields below.
2. Sort every object key lexically at every nesting level.
3. Preserve array order: outcome order and source-request order are meaningful data.
4. Encode as compact UTF-8 JSON without indentation or a trailing newline.
5. Compute `receiptHash = keccak256(canonicalUtf8Bytes)`.
6. Compute `policyHash = keccak256("bookguard:policy:polymarket-clob-top-of-book/v1")`.
7. Compute `marketHash = keccak256("polymarket:condition:<conditionId>")`.

`web/canonical-json.mjs` implements the deterministic object-key ordering rule. Its unit tests cover recursive ordering and ordered arrays.

## Receipt shape

```json
{
  "books": [
    {
      "bestAsk": { "price": "string", "size": "string" },
      "bestBid": { "price": "string", "size": "string" },
      "lastTradePrice": "string",
      "outcome": "string",
      "tickSize": "string",
      "tokenId": "string"
    }
  ],
  "kind": "polymarket-clob-top-of-book-observation",
  "market": {
    "conditionId": "0x...",
    "gammaOutcomePrices": ["string", "string"],
    "question": "string",
    "slug": "string"
  },
  "observedAt": "YYYY-MM-DDTHH:mm:ssZ",
  "schema": "bookguard.receipt/v1",
  "source": {
    "clobBookTemplate": "https://clob.polymarket.com/book?token_id={tokenId}",
    "gammaMarket": "https://gamma-api.polymarket.com/markets?slug=<slug>"
  }
}
```

For each book, `bestBid` is the maximum returned bid price and `bestAsk` is the minimum returned ask price. The source endpoints are public and read-only; no Polymarket authentication or wallet interaction is involved.

If CLOB omits `last_trade_price`, store an empty string. Do not substitute a midpoint, Gamma outcome price, or an inferred value.

## Read-only generator

Generate a fresh canonical receipt to stdout with Node 22 or later:

```bash
node scripts/polymarket-observation-receipt.mjs <market-slug>
```

For example:

```bash
node scripts/polymarket-observation-receipt.mjs eth-updown-5m-1785937800
```

The generator makes three unauthenticated GET requests: one Gamma market lookup and one CLOB order-book lookup per outcome. It rejects missing, inactive, closed, inconsistent, or empty-book markets. It does not write files, connect a wallet, sign, or send a transaction.

The web preview computes the Ethereum Keccak-256 receipt hash locally from its exact canonical JSON string. The implementation is dependency-free and is tested against Foundry `cast keccak` vectors.

## Anchor procedure

Before a mainnet write:

1. Fetch Gamma market metadata and both outcome books fresh.
2. Validate the market is active and the returned `conditionId`, outcomes, and token IDs match across the source data.
3. Generate and commit the exact canonical receipt file.
4. Derive the three `bytes32` values and `observedAt` Unix seconds from that file.
5. Run `eth_call` simulation and gas estimation against `ReceiptAnchorV1`.
6. Have the wallet owner review the target contract, value (`0 ETH`), function, hashes, and gas in the wallet UI before signing.
7. After mining, read `getAnchor(receiptHash)` directly from Base and record the transaction in the repository.
