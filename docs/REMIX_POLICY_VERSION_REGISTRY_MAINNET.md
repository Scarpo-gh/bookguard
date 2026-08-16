# Deploy `PolicyVersionRegistry` on Base Mainnet with Remix

> **Status:** Deployment preparation only. Do not deploy until all local tests pass, exact bytecode is checked, and Onur explicitly approves the wallet confirmation screen.

## Preflight

1. From the repository root, run:

   ```bash
   PATH="$HOME/.local/bin:$PATH" scripts/check.sh
   PATH="$HOME/.local/bin:$PATH" forge fmt --check contracts/PolicyVersionRegistry.sol contracts/test/PolicyVersionRegistry.t.sol
   ```

2. Confirm the exact source to deploy is `contracts/PolicyVersionRegistry.sol`.
3. Confirm compiler settings match `foundry.toml`:
   - Solidity `0.8.30`
   - optimizer enabled
   - optimizer runs `200`
   - default EVM target
4. The contract has **no constructor arguments** and deployment sends **0 ETH** to the contract.

## Wallet-controlled Remix flow

1. Open [Remix](https://remix.ethereum.org/) and create `contracts/PolicyVersionRegistry.sol`.
2. Paste the checked repository source exactly; do not modify it in Remix.
3. In **Solidity Compiler**, select `0.8.30`, enable optimizer and set runs to `200`; compile `PolicyVersionRegistry.sol`.
4. In **Deploy & Run Transactions**, choose **Browser Extension**.
5. In the wallet, switch to **Base Mainnet** / chain ID `8453`.
6. Select `PolicyVersionRegistry`; leave constructor inputs empty and transaction value at `0`.
7. Before pressing Deploy, inspect the wallet confirmation screen and confirm:
   - signer is the intended project wallet;
   - network is Base Mainnet (`8453`);
   - target is contract deployment, not an existing address;
   - value is `0 ETH`;
   - gas fee is within the reviewed budget;
   - no token approval or unrelated call is present.
8. **Stop here until Onur explicitly approves this exact confirmation screen.**
9. After mining, save contract address and deployment transaction hash.

## Post-deploy verification

1. Verify source on BaseScan with the same source, compiler, optimizer and EVM settings.
2. Read `getPolicyPublisher(policyId)` and `getPolicyVersion(policyId, version)` using the BaseScan Read Contract tab or a local `eth_call`.
3. Publish one small, non-financial example policy only after a separate wallet confirmation of the exact `registerPolicyVersion` calldata.
4. Add address, transaction, gas, value, source verification URL and test evidence to `docs/DEPLOYMENTS.md`.
5. Refresh Base Guild Verify after BaseScan indexing confirms the deployment.
