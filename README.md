# BookGuard

Base-native, read-only orderbook quality and receipt-provenance infrastructure.

> Prototype boundary: no trading, custody, order routing, user funds, investment advice, or profitability claims.

## First milestone

`ReceiptAnchorV1` binds a canonical off-chain receipt hash, policy hash, market hash and observation time to a Base transaction. It does not claim that upstream market data is true; it proves that a defined receipt was anchored.

## Policy provenance registry

[`PolicyVersionRegistry`](https://basescan.org/address/0x3Fd0504715E539b50bB539642465393dE9E617C3) records immutable, publisher-scoped policy version hashes so a receipt consumer can independently identify the policy content and publisher that produced it. It has no funds, trading, order-routing, token, upgrade, or recovery surface. See [`docs/POLICY_VERSION_REGISTRY.md`](docs/POLICY_VERSION_REGISTRY.md) and [`docs/DEPLOYMENTS.md`](docs/DEPLOYMENTS.md).

## Evidence batch commitments — not deployed

`EvidenceRootAnchor` commits one Merkle root and canonical batch metadata hash for many off-chain evidence receipts. Inclusion proofs remain local and dependency-free; the contract stores no receipt leaves, funds, order state, or trading logic. See [`docs/EVIDENCE_ROOT_ANCHOR.md`](docs/EVIDENCE_ROOT_ANCHOR.md).

## Publisher key discovery — not deployed

`PublisherKeyRegistry` publishes public signing-key discovery records with explicit rotation and revocation state. It stores a public-key hash and URI only: never private keys, signatures, funds, or trading state. See [`docs/PUBLISHER_KEY_REGISTRY.md`](docs/PUBLISHER_KEY_REGISTRY.md).

## Development

```bash
PATH="$HOME/.local/bin:$PATH" scripts/check.sh
```

Deploying or broadcasting requires a separate explicit wallet approval.

Builder/Guild and Base Sepolia operations: [`docs/BASE_BUILDER_OPERATIONS.md`](docs/BASE_BUILDER_OPERATIONS.md).

Wallet-safe Remix deployment guide: [`docs/REMIX_BASE_SEPOLIA_DEPLOY.md`](docs/REMIX_BASE_SEPOLIA_DEPLOY.md).

Verified Base Mainnet and Base Sepolia deployments: [`docs/DEPLOYMENTS.md`](docs/DEPLOYMENTS.md).

First canonical Base Mainnet receipt anchor: [`docs/RECEIPTS.md`](docs/RECEIPTS.md).

Polymarket external-observation schema and unanchored Base dry run: [`docs/POLYMARKET_OBSERVATION_RECEIPT_V1.md`](docs/POLYMARKET_OBSERVATION_RECEIPT_V1.md) and [`docs/EXTERNAL_OBSERVATION_DRY_RUN_2026-08-04.md`](docs/EXTERNAL_OBSERVATION_DRY_RUN_2026-08-04.md).

Fresh, unanchored Polymarket receipt prepared for wallet-controlled anchoring: [`docs/POLYMARKET_RECEIPT_READY_2026-08-06.md`](docs/POLYMARKET_RECEIPT_READY_2026-08-06.md).

## Read-only web lookup

`web/` contains a dependency-free browser interface for reading `getAnchor(bytes32)` from the verified Base Mainnet contract and previewing fresh Polymarket Gamma+CLOB observation receipts. It never requests a wallet connection and it never sends a transaction.

Live lookup: [scarpo-gh.github.io/bookguard](https://scarpo-gh.github.io/bookguard/). The page includes a link that loads the first anchored deployment receipt.

```bash
python3 -m http.server 4173 --directory web
```

Open `http://127.0.0.1:4173` locally, then submit a `bytes32` receipt hash (`0x` followed by 64 hexadecimal characters). The page makes a read-only `eth_call` to Base Mainnet.
