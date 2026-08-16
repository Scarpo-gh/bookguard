# Deployments

## Base Mainnet — `ReceiptAnchorV1`

| Field | Value |
| --- | --- |
| Network | Base Mainnet |
| Chain ID | `8453` |
| Contract | [`0x9a8fCf271F97075486673eA3eD48c4fda33374Ce`](https://basescan.org/address/0x9a8fCf271F97075486673eA3eD48c4fda33374Ce) |
| Deployment transaction | [`0x6e22069ac37b4a7a6f1ac61c53c3617345d702f9c772b5f7087a847d0496fa9c`](https://basescan.org/tx/0x6e22069ac37b4a7a6f1ac61c53c3617345d702f9c772b5f7087a847d0496fa9c) |
| Block | `49452658` |
| Gas used | `246,000` |
| Value sent | `0 ETH` |
| Status | Success |
| Source verification | [BaseScan Exact Match](https://basescan.org/address/0x9a8fCf271F97075486673eA3eD48c4fda33374Ce#code) |

The contract was deployed directly by the project wallet through a wallet-controlled Remix Browser Extension session. BaseScan independently recompiles the published source as an exact bytecode match using Solidity `0.8.30`, optimizer enabled with `200` runs, and the compiler-default EVM target.

## Base Mainnet — `PolicyVersionRegistry`

| Field | Value |
| --- | --- |
| Network | Base Mainnet |
| Chain ID | `8453` |
| Contract | [`0x3Fd0504715E539b50bB539642465393dE9E617C3`](https://basescan.org/address/0x3Fd0504715E539b50bB539642465393dE9E617C3) |
| Deployment transaction | [`0x4b764cd81f46b64db8373ba1ba2fec7b15fc47c655e9712e7826b76a7acc2fb6`](https://basescan.org/tx/0x4b764cd81f46b64db8373ba1ba2fec7b15fc47c655e9712e7826b76a7acc2fb6) |
| Block | `50048511` |
| Gas used | `271,557` |
| Value sent | `0 ETH` |
| Status | Success |
| Source verification | [BaseScan verified source](https://basescan.org/address/0x3Fd0504715E539b50bB539642465393dE9E617C3#code) |

The deployment receipt was independently read from the Base Mainnet RPC: chain ID `8453`, successful receipt status, expected deployer `0xd725160341c1c65cf1369d271c897afc5fcc3926`, and the expected contract address. The deployed runtime bytecode matches the locally compiled `PolicyVersionRegistry` runtime bytecode after Solidity metadata is removed; both have `956` bytes of executable runtime code. See [`POLICY_VERSION_REGISTRY.md`](POLICY_VERSION_REGISTRY.md) and [`POLICY_VERSION_REGISTRY_DEPLOYMENT_PREVIEW.md`](POLICY_VERSION_REGISTRY_DEPLOYMENT_PREVIEW.md).

### First anchored receipt

The first canonical receipt was anchored on Base Mainnet in [`0xbb77e331e81b915c20a23205deecafc6d818a92613ab7dc29493f289254ee797`](https://basescan.org/tx/0xbb77e331e81b915c20a23205deecafc6d818a92613ab7dc29493f289254ee797), block `49530988`, with a successful `ReceiptAnchored` event. See [`RECEIPTS.md`](RECEIPTS.md) for the source receipt, canonical hashing inputs, and independent verification command.

### First external-market receipt

The first public Polymarket top-of-book observation receipt was anchored on Base Mainnet in [`0x5d7881dfc234897832843685dbc8b968e6a8edc037475134f41c999155545509`](https://basescan.org/tx/0x5d7881dfc234897832843685dbc8b968e6a8edc037475134f41c999155545509), block `49619739`, with a successful `ReceiptAnchored` event. See [`RECEIPTS.md`](RECEIPTS.md) and [`POLYMARKET_RECEIPT_READY_2026-08-06.md`](POLYMARKET_RECEIPT_READY_2026-08-06.md) for the canonical source, preflight, and post-mining readback.

## Base Sepolia — `ReceiptAnchorV1`

| Field | Value |
| --- | --- |
| Network | Base Sepolia Testnet |
| Chain ID | `84532` |
| Contract | [`0x2593004e9bc303424A48f8D75f64650fCeD03EC7`](https://sepolia.basescan.org/address/0x2593004e9bc303424A48f8D75f64650fCeD03EC7) |
| Deployment transaction | [`0x0641839a496cd33c39a794b1e3b1a22e2b82d89be92141df53c312841b7d9d35`](https://sepolia.basescan.org/tx/0x0641839a496cd33c39a794b1e3b1a22e2b82d89be92141df53c312841b7d9d35) |
| Block | `44962093` |
| Gas used | `246,000` |
| Value sent | `0 ETH` |
| Status | Success |

The contract was deployed through a wallet-controlled Remix Browser Extension session. No private key, seed phrase, or user funds were supplied to the contract.

## Verification status

The Base Mainnet deployment is source-verified on BaseScan as an exact bytecode match. Base Sepolia source verification is optional testnet documentation and is not required for the Base Mainnet product deployment.
