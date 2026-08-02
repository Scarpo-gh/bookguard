# Deploy `ReceiptAnchorV1` on Base Sepolia with Remix

## Preconditions

- Use a wallet controlled by you. Do not export or share its seed phrase or private key.
- Select the **Base Sepolia** network (chain ID `84532`).
- Fund the wallet with Base Sepolia ETH.

## Steps

1. Open [Remix IDE](https://remix.ethereum.org/).
2. In **File explorers**, create `contracts/ReceiptAnchorV1.sol`.
3. Copy the current contract source from this repository into that file.
4. Open **Solidity compiler**:
   - compiler version: `0.8.30`
   - enable optimization
   - optimizer runs: `200`
   - click **Compile ReceiptAnchorV1.sol**
5. Open **Deploy & run transactions**:
   - Environment: **Injected Provider**
   - approve the wallet connection
   - verify that the wallet shows **Base Sepolia** / chain ID `84532`
   - contract: `ReceiptAnchorV1`
   - constructor arguments: none
6. Click **Deploy** and inspect the wallet confirmation before approving it.
7. Save the transaction hash and deployed contract address.

## Expected dry-run envelope

The pre-deployment estimate was obtained against Base Sepolia from the intended deployer address:

- estimated gas: `249,120`
- observed gas price: `6,000,000 wei`
- estimated cost: approximately `0.000001494720` Base Sepolia ETH

These are estimates, not a fixed promise. The wallet confirmation is authoritative.

## Verification

After deployment, verify on Base Sepolia Basescan and provide:

- transaction hash
- contract address

The next step is source verification and Guild deploy-role verification.
