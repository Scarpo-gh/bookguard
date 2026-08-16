# PolicyVersionRegistry — Base Mainnet Deployment Preview

> **Status:** Read-only preflight evidence. This document does not authorize a broadcast.

## Exact target

| Field | Value |
| --- | --- |
| Chain | Base Mainnet |
| Chain ID | `8453` |
| Intended wallet signer | `0xd725160341c1c65cf1369d271c897afc5fcc3926` |
| Contract | `PolicyVersionRegistry` |
| Constructor arguments | none |
| ETH value sent to contract | `0 ETH` |
| Solidity | `0.8.30` |
| Optimizer | enabled, `200` runs |
| Creation bytecode size | `1,037` bytes |
| Keccak-256 of creation bytecode | `0xa50448e99164545ad094988afe99a09235af127c527e885750593da507fac4be` |

## RPC preflight

Read-only `eth_estimateGas` against `https://mainnet.base.org`, using the intended public sender and exact compiled creation bytecode, returned:

| Field | Value |
| --- | --- |
| Checked at | `2026-08-16T12:37:11Z` |
| Estimated deployment gas | `274,879` |
| RPC gas price at check | `6,000,000 wei` |
| Approximate fee at that price | `0.000001649274 ETH` |

Gas price and final wallet quote are dynamic. The wallet confirmation screen is the authority for the final maximum fee.

## Verification already completed

```text
forge tests: 6 passed
Node web tests: 23 passed
forge fmt --check (new Solidity files): passed
git diff --check: passed
```

A direct `forge create` was deliberately not executed because it requires a signing backend. No private key, keystore, seed phrase, or signer was accessed.

## Required wallet-screen confirmation

Before deployment, verify in the wallet UI:

1. Network is **Base Mainnet** (`8453`).
2. Signer is `0xd725160341c1c65cf1369d271c897afc5fcc3926`.
3. Action is a **new contract deployment** of the reviewed source; it is not an interaction with an existing contract.
4. Value is **0 ETH**.
5. Final gas/max fee is acceptable.
6. No token approval, transfer, or unrelated calldata appears.

After this explicit confirmation, use the wallet-controlled Remix flow in [`REMIX_POLICY_VERSION_REGISTRY_MAINNET.md`](REMIX_POLICY_VERSION_REGISTRY_MAINNET.md). Then verify source on BaseScan, add the resulting address/transaction to `DEPLOYMENTS.md`, and refresh Guild Verify.
