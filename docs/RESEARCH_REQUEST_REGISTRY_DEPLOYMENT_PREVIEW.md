# ResearchRequestRegistry — Base Mainnet Deployment Preview

> Read-only preflight; wallet approval is required before broadcast.

| Field | Value |
| --- | --- |
| Chain | Base Mainnet (`8453`) |
| Intended signer | `0xd725160341c1c65cf1369d271c897afc5fcc3926` |
| Constructor | none |
| Value | `0 ETH` |
| Solidity | `0.8.30`, optimizer enabled, `200` runs, compiler-default EVM |
| Creation bytecode | `1,640` bytes |
| Creation bytecode keccak | `0xa04fd35d890f55c3fdafcfeca7a2beeb0fda73b00f7b1acfa0e0ff01680343c1` |
| Base RPC `eth_estimateGas` | `406,184` gas |
| RPC gas price at check | `6,000,000 wei` |

Validation before preflight: Foundry **17/17** and Node **32/32** tests passed; relevant `forge fmt --check` and `git diff --check` passed.

Wallet confirmation must show Base Mainnet, the expected signer, a new `ResearchRequestRegistry` deployment, `0 ETH`, and an acceptable final gas fee. After deployment, verify exact source on BaseScan with Solidity `0.8.30`, single file, MIT, optimizer enabled/200 runs, default EVM, and blank constructor arguments.
