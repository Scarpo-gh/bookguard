# Base Builder Operations

This repository is independent from the Arc hackathon repository. BookGuard is intended to create a credible Base builder footprint through working product evidence and verifiable Guild activity.

## Completed

- [x] Separate local Git repository: `~/bookguard`
- [x] `ReceiptAnchorV1` contract
- [x] Test-first contract coverage
- [x] Foundry verification command: `scripts/check.sh`
- [x] Foundry v1.7.1 installed locally with a verified release checksum

## Account and signature steps — repository owner

These steps require a password, OAuth consent, or wallet signature and must be completed by the repository owner.

1. Create the public GitHub repository `Scarpo-gh/bookguard` without initializing it with a README.
2. Add the repository-specific deploy key with write access.
3. Connect wallet, GitHub, and X accounts in Guild; then join the Guild.
4. Follow `@BuildOnBase` from the connected X account.
5. Obtain Base Sepolia faucet ETH. Never share a private key or seed phrase.

## Maintainer steps after repository access

1. Push the tested local `main` branch to the public remote.
2. Verify public commit visibility and repository metadata.
3. Run the Base Sepolia deployment command as a dry run before any broadcast.
4. Share dry-run output. A wallet-owner approval is required before broadcasting a deployment.
5. Verify the transaction hash and contract address on Base Sepolia Basescan.
6. The Base Guild `Contract Deployed` requirements are configured for Base Mainnet, not Base Sepolia. Deploy a meaningful contract on Base Mainnet, then refresh Guild Verify after indexing.

## Base Dashboard and distribution

- Base Dashboard metadata follows after the first web interface is live.
- The web app will be a standard mobile web app using wagmi, viem, and Base Account.
- A Farcaster manifest is not required for Base App distribution.
- A Builder Code is added only once the application produces meaningful transactions.
- Office Hours follow a live demo and one focused technical question.

## Security boundary

- No mainnet activity, user funds, custody, trading, order routing, token issuance, or reward-farming contract is in scope.
- x402 and Base Verify Onchain are deferred until a real paid API or anti-Sybil claim need exists.
