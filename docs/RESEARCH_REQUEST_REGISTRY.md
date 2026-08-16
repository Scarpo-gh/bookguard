# ResearchRequestRegistry

`ResearchRequestRegistry` is BookGuard's planned fifth Base Mainnet contract. It creates a public, immutable commitment to a research request and scope without holding any payment or user funds.

> **Deployment status:** Implemented and locally tested; **not deployed**.

## Lifecycle and safety boundary

- `createRequest(requestHash, scopeHash)` creates an `Open` request.
- Only its requester may `withdrawRequest` while open.
- Only its requester may `fulfillRequest(requestHash, fulfillmentHash)`, recording acceptance of an off-chain delivery commitment.
- `Withdrawn` and `Fulfilled` are terminal states.

It is not a marketplace, escrow, payment processor, dispute resolver, reputation system, trading tool, or evidence-truth oracle. A contributor delivers off-chain; requester acceptance prevents an unsolicited third party from attaching an arbitrary fulfillment hash.

## Data format

`web/research-request.mjs` canonicalizes request and scope JSON, hashes each UTF-8 canonical representation with keccak-256, and produces wallet calldata for create/withdraw/fulfill operations. The contract stores only fixed-size hashes, requester address, timestamps, and lifecycle state.

## Validation

```bash
PATH="$HOME/.local/bin:$PATH" forge test --match-contract ResearchRequestRegistryTest -vv
node --test web/test/research-request.test.mjs
```
