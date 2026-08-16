# EvidenceRootAnchor — Base Mainnet Deployment Preview

> **Status:** Read-only preflight evidence. This document does not authorize a broadcast.

## Exact target

| Field | Value |
| --- | --- |
| Chain | Base Mainnet |
| Chain ID | `8453` |
| Intended wallet signer | `0xd725160341c1c65cf1369d271c897afc5fcc3926` |
| Contract | `EvidenceRootAnchor` |
| Constructor arguments | none |
| ETH value sent to contract | `0 ETH` |
| Solidity | `0.8.30` |
| Optimizer | enabled, `200` runs |
| EVM target | compiler default |
| Creation bytecode size | `1,107` bytes |
| Keccak-256 of creation bytecode | `0x06acc2e47d6eaeb9bf37d7c67dda4642f292a9161dae19b6d17f56b1b5416b96` |

## RPC preflight

Read-only `eth_estimateGas` against Base Mainnet, using the intended public sender and exact compiled creation bytecode:

| Field | Value |
| --- | --- |
| Checked at | `2026-08-16T13:48:57Z` |
| Estimated deployment gas | `290,136` |
| RPC gas price at check | `6,000,000 wei` |
| Approximate fee at that price | `0.000001740816 ETH` |

Gas price and final wallet quote are dynamic. The wallet confirmation screen is the authority for the final fee.

## Verification completed before deployment

```text
Foundry tests: 9 passed
Node web tests: 26 passed
forge fmt --check (new Solidity files): passed
git diff --check: passed
```

## Required wallet-screen confirmation

Before deployment, verify in the wallet UI:

1. Network is **Base Mainnet** (`8453`).
2. Signer is `0xd725160341c1c65cf1369d271c897afc5fcc3926`.
3. Action is a **new contract deployment** of `EvidenceRootAnchor`.
4. Value is **0 ETH**.
5. Final gas/max fee is acceptable.
6. No token approval, transfer, or unrelated calldata appears.

After explicit approval: deploy through the wallet-controlled Remix flow, verify source on BaseScan, record the address/tx in `DEPLOYMENTS.md`, and refresh Guild Verify.
