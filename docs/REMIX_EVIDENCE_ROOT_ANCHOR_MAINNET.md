# Deploy `EvidenceRootAnchor` on Base Mainnet with Remix

> **Status:** Deployment preparation only. Do not broadcast until Onur reviews the exact wallet confirmation screen.

## Preflight

```bash
PATH="$HOME/.local/bin:$PATH" scripts/check.sh
PATH="$HOME/.local/bin:$PATH" forge fmt --check contracts/EvidenceRootAnchor.sol contracts/test/EvidenceRootAnchor.t.sol
```

Deploy exactly `contracts/EvidenceRootAnchor.sol` with:

- Solidity `0.8.30`
- optimizer enabled, `200` runs
- EVM version: compiler default
- no constructor arguments
- `0 ETH` value

## Wallet-controlled Remix flow

1. Open [Remix](https://remix.ethereum.org/) and create `contracts/EvidenceRootAnchor.sol`.
2. Copy the repository source exactly; do not alter whitespace, SPDX header, compiler pragma, or content.
3. In **Solidity Compiler**, select `0.8.30`, enable optimizer and set runs to `200`; compile `EvidenceRootAnchor.sol`.
4. In **Deploy & Run Transactions**, choose **Browser Extension**.
5. Switch the wallet to **Base Mainnet** / chain ID `8453`.
6. Select `EvidenceRootAnchor`; constructor inputs remain empty and value is `0`.
7. Before approving in the wallet, verify the signer, chain, new deployment target, `0 ETH` value, and gas fee.
8. Do not approve a token approval, transfer, or call to an existing address.
9. After the transaction mines, save the BaseScan transaction hash and deployed contract address.

## Source verification

On BaseScan: **Contract → Code → Verify and Publish**:

- Compiler Type: `Solidity (Single file)`
- Compiler Version: `v0.8.30+commit.73712a01`
- License: `MIT License (MIT)`
- Paste the entire contract source exactly
- Optimization: `Yes`
- Runs: `200`
- EVM: `default (compiler defaults)`
- Constructor arguments: blank

After BaseScan reports matching bytecode, update `docs/DEPLOYMENTS.md` with the verified address and transaction, then refresh Base Guild Verify.
