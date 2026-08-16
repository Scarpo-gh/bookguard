# Deploy `PublisherKeyRegistry` on Base Mainnet with Remix

> Deployment is wallet-controlled. Do not broadcast before checking the final wallet confirmation screen.

## Remix deployment

1. Open [Remix](https://remix.ethereum.org/), create `contracts/PublisherKeyRegistry.sol`, and copy the repository source exactly.
2. Compile with Solidity `0.8.30`, optimizer enabled, `200` runs, and compiler-default EVM version.
3. In **Deploy & Run Transactions**, choose **Browser Extension** and switch the wallet to **Base Mainnet** / `8453`.
4. Select `PublisherKeyRegistry`; leave constructor input empty and value at `0`.
5. Before signing, check signer, Base Mainnet, new deployment target, `0 ETH`, and final gas fee. Do not approve a token approval, transfer, or existing-contract interaction.
6. After mining, save the contract address and transaction hash.

## BaseScan source verification

**Contract → Code → Verify and Publish**:

- Compiler Type: `Solidity (Single file)`
- Compiler Version: `v0.8.30+commit.73712a01`
- License: `MIT License (MIT)`
- Paste full source exactly
- Optimization: `Yes`
- Runs: `200`
- EVM: `default (compiler defaults)`
- Constructor arguments: blank

After BaseScan reports matching bytecode, update `DEPLOYMENTS.md` and refresh Guild Verify.
