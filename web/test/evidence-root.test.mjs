import test from "node:test";
import assert from "node:assert/strict";

import {
  buildEvidenceBatchPreview,
  buildEvidenceProof,
  encodeAnchorEvidenceRootCall,
  verifyEvidenceProof,
} from "../evidence-root.mjs";

const RECEIPTS = [
  "0x1111111111111111111111111111111111111111111111111111111111111111",
  "0x2222222222222222222222222222222222222222222222222222222222222222",
  "0x3333333333333333333333333333333333333333333333333333333333333333",
];

test("builds a canonical evidence batch with an inclusion proof", () => {
  const preview = buildEvidenceBatchPreview({
    receiptHashes: RECEIPTS,
    observedFrom: 1_786_800_000,
    observedTo: 1_786_803_600,
    metadata: { venue: "polymarket", policyId: "bookguard:policy:example/v1" },
  });
  const proof = buildEvidenceProof(RECEIPTS, RECEIPTS[1]);

  assert.match(preview.root, /^0x[0-9a-f]{64}$/);
  assert.match(preview.metadataHash, /^0x[0-9a-f]{64}$/);
  assert.equal(preview.leafCount, 3);
  assert.equal(verifyEvidenceProof({ receiptHash: RECEIPTS[1], proof, root: preview.root }), true);
});

test("encodes anchorEvidenceRoot calldata from a batch preview", () => {
  const preview = buildEvidenceBatchPreview({
    receiptHashes: RECEIPTS.slice(0, 2),
    observedFrom: 1_786_800_000,
    observedTo: 1_786_803_600,
    metadata: { venue: "polymarket" },
  });

  const calldata = encodeAnchorEvidenceRootCall(preview);

  assert.match(calldata, /^0x[0-9a-f]{264}$/);
  assert.equal(calldata.slice(10, 74), preview.root.slice(2));
  assert.equal(calldata.slice(74, 138), preview.metadataHash.slice(2));
});

test("rejects duplicate receipts, invalid observation windows, and tampered proofs", () => {
  assert.throws(
    () => buildEvidenceBatchPreview({ receiptHashes: [RECEIPTS[0], RECEIPTS[0]], observedFrom: 1, observedTo: 2, metadata: {} }),
    /unique/,
  );
  assert.throws(
    () => buildEvidenceBatchPreview({ receiptHashes: RECEIPTS, observedFrom: 0, observedTo: 2, metadata: {} }),
    /start/,
  );
  assert.throws(
    () => buildEvidenceBatchPreview({ receiptHashes: RECEIPTS, observedFrom: 3, observedTo: 2, metadata: {} }),
    /end/,
  );

  const preview = buildEvidenceBatchPreview({ receiptHashes: RECEIPTS, observedFrom: 1, observedTo: 2, metadata: {} });
  const proof = buildEvidenceProof(RECEIPTS, RECEIPTS[0]);
  assert.equal(verifyEvidenceProof({ receiptHash: RECEIPTS[0], proof: [...proof, RECEIPTS[2]], root: preview.root }), false);
});
