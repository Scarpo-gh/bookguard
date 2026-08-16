# PublisherKeyRegistry — Base Mainnet Deployment Preview

> **Status:** Read-only preflight evidence. This document does not authorize a broadcast.

## Exact target

| Field | Value |
| --- | --- |
| Chain | Base Mainnet |
| Chain ID | `8453` |
| Intended wallet signer | `0xd725160341c1c65cf1369d271c897afc5fcc3926` |
| Contract | `PublisherKeyRegistry` |
| Constructor arguments | none |
| ETH value sent to contract | `0 ETH` |
| Solidity | `0.8.30` |
| Optimizer | enabled, `200` runs |
| EVM target | compiler default |
| Creation bytecode size | `2,614` bytes |
| Keccak-256 of creation bytecode | `0x3a6d11ed38c42ee069f8588b700bd25185710a41c4d05708ebaeb455f5922ab9` |

## RPC preflight

Read-only `eth_estimateGas` against Base Mainnet with the intended public sender and exact compiled creation bytecode:

| Field | Value |
| --- | --- |
| Checked at | `2026-08-16T14:22:39Z` |
| Estimated deployment gas | `618,330` |
| RPC gas price at check | `6,000,000 wei` |
| Approximate fee at that price | `0.000003709980 ETH` |

The final gas price and wallet quote are dynamic; wallet confirmation is authoritative.

## Verification completed before deployment

```text
Foundry tests: 13 passed
Node web tests: 29 passed
forge fmt --check (new Solidity files): passed
git diff --check: passed
```

## Required wallet-screen confirmation

Before approval, confirm:

1. Network is **Base Mainnet** / `8453`.
2. Signer is `0xd725160341c1c65cf1369d271c897afc5fcc3926`.
3. It is a **new contract deployment** of `PublisherKeyRegistry`.
4. Value is **0 ETH**.
5. Final gas/max fee is acceptable.
6. It is not a token approval, transfer, or call to an existing contract.

After explicit approval: deploy from Remix, verify the exact source on BaseScan, record contract/tx in `DEPLOYMENTS.md`, then refresh Guild Verify.
