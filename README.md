# BookGuard

Base-native, read-only orderbook quality and receipt-provenance infrastructure.

> Prototype boundary: no trading, custody, order routing, user funds, investment advice, or profitability claims.

## First milestone

`ReceiptAnchorV1` binds a canonical off-chain receipt hash, policy hash, market hash and observation time to a Base transaction. It does not claim that upstream market data is true; it proves that a defined receipt was anchored.

## Development

```bash
PATH="$HOME/.local/bin:$PATH" scripts/check.sh
```

Deploying or broadcasting requires a separate explicit wallet approval.

Builder/Guild and Base Sepolia operations: [`docs/BASE_BUILDER_OPERATIONS.md`](docs/BASE_BUILDER_OPERATIONS.md).

Wallet-safe Remix deployment guide: [`docs/REMIX_BASE_SEPOLIA_DEPLOY.md`](docs/REMIX_BASE_SEPOLIA_DEPLOY.md).

Verified Base Mainnet and Base Sepolia deployments: [`docs/DEPLOYMENTS.md`](docs/DEPLOYMENTS.md).

First canonical Base Mainnet receipt anchor: [`docs/RECEIPTS.md`](docs/RECEIPTS.md).

## Read-only web lookup

`web/` contains a dependency-free browser interface for reading `getAnchor(bytes32)` from the verified Base Mainnet contract. It never requests a wallet connection and it never sends a transaction.

Live lookup: [scarpo-gh.github.io/bookguard](https://scarpo-gh.github.io/bookguard/). The page includes a link that loads the first anchored deployment receipt.

```bash
python3 -m http.server 4173 --directory web
```

Open `http://127.0.0.1:4173` locally, then submit a `bytes32` receipt hash (`0x` followed by 64 hexadecimal characters). The page makes a read-only `eth_call` to Base Mainnet.
