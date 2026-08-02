# OutcomeRail Base

Base-native, read-only market-quality and receipt-provenance infrastructure.

> Prototype boundary: no trading, custody, order routing, user funds, investment advice, or profitability claims.

## First milestone

`ReceiptAnchorV1` binds a canonical off-chain receipt hash, policy hash, market hash and observation time to a Base transaction. It does not claim that upstream market data is true; it proves that a defined receipt was anchored.

## Development

```bash
PATH="$HOME/.local/bin:$PATH" scripts/check.sh
```

Deploying or broadcasting requires a separate explicit wallet approval.
