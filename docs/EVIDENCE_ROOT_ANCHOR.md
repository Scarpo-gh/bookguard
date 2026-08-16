# EvidenceRootAnchor

`EvidenceRootAnchor` is BookGuard's third Base Mainnet contract. It anchors one immutable commitment to a batch of off-chain evidence receipts.

> **Deployment status:** Deployed and source-verified on Base Mainnet at [`0x51CF0354Ad780775a70e09Ef0D84b2Eb9A3fdd18`](https://basescan.org/address/0x51CF0354Ad780775a70e09Ef0D84b2Eb9A3fdd18#code) in [transaction `0x2bc…63a7e`](https://basescan.org/tx/0x2bc706a45b06cf12352e6377a067561c75dc19484178932e0a20a00842663a7e).

## Why it is separate from ReceiptAnchorV1

`ReceiptAnchorV1` anchors one individual receipt. `EvidenceRootAnchor` commits to a batch without writing every leaf on-chain. A consumer can later verify one receipt's membership with an off-chain sibling proof and a single Base `getEvidenceBatch(root)` read.

## On-chain batch record

For each unique root the contract stores:

- `root` — Evidence Merkle root;
- `metadataHash` — keccak-256 of canonical batch metadata JSON;
- `observedFrom` and `observedTo` — inclusive UTC Unix observation window;
- `anchoredAt` — Base block timestamp;
- `publisher` — the address that anchored the batch.

The same root cannot be anchored twice. The contract stores no leaves, proofs, external market data, funds, order state, tokens, or trading logic.

## BookGuard evidence-root format v1

The dependency-free helper `web/evidence-root.mjs` defines the format. Input receipt hashes are normalized to lowercase, must be unique, then are lexicographically sorted.

```text
leaf(receiptHash) = keccak256("bookguard:evidence-leaf/v1:" + receiptHash)
node(a, b)        = keccak256("bookguard:evidence-node/v1:" + min(a,b) + ":" + max(a,b))
```

For an odd level, its final node pairs with itself. A proof contains one sibling hash per tree level; a verifier begins with the receipt leaf and applies `node(current, sibling)` in order until it obtains the root.

Canonical metadata is:

```json
{
  "format":"bookguard:evidence-batch/v1",
  "leafCount":3,
  "metadata":{"policyId":"bookguard:policy:example/v1","venue":"polymarket"},
  "observedFrom":1786800000,
  "observedTo":1786803600,
  "root":"0x..."
}
```

The metadata hash commits to both the root and the claimed evidence window; the root separately commits to its receipt leaves.

## Local usage

```js
import {
  buildEvidenceBatchPreview,
  buildEvidenceProof,
  verifyEvidenceProof,
} from "./web/evidence-root.mjs";

const receipts = ["0x...", "0x...", "0x..."];
const batch = buildEvidenceBatchPreview({
  receiptHashes: receipts,
  observedFrom: 1786800000,
  observedTo: 1786803600,
  metadata: { venue: "polymarket", policyId: "bookguard:policy:example/v1" },
});
const proof = buildEvidenceProof(receipts, receipts[0]);
console.log(verifyEvidenceProof({ receiptHash: receipts[0], proof, root: batch.root })); // true
```

## Local validation

```bash
PATH="$HOME/.local/bin:$PATH" forge test --match-contract EvidenceRootAnchorTest -vv
node --test web/test/evidence-root.test.mjs
```

## Non-goals

This contract does not prove that a receipt is factually true, a policy is good, a market outcome is likely, or a strategy is profitable. It only proves that a publisher committed a defined root and metadata hash at a Base block time.

## Mainnet deployment gate

Before any broadcast: run the full test suite, format check, bytecode/gas preflight, and inspect a wallet-controlled Base Mainnet confirmation showing the intended signer, new contract deployment, `0 ETH` value and acceptable gas. After explicit approval: deploy, verify source on BaseScan, record the address and transaction in `DEPLOYMENTS.md`, then refresh Guild Verify.
