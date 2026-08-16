import test from "node:test";
import assert from "node:assert/strict";

import { buildPolicyVersionPreview, encodeRegisterPolicyVersionCall } from "../policy-version.mjs";

const PUBLISHER = "0x1111111111111111111111111111111111111111";

test("builds a publisher-scoped policy namespace and canonical content hash", () => {
  const preview = buildPolicyVersionPreview({
    publisher: PUBLISHER,
    slug: "polymarket-clob-risk",
    version: 1,
    policy: { maxSpreadBps: 125, minVisibleDepthUsd: 500, staleAfterSeconds: 10 },
  });

  assert.equal(preview.publisher, PUBLISHER);
  assert.equal(preview.version, 1);
  assert.match(preview.policyId, /^0x[0-9a-f]{64}$/);
  assert.match(preview.contentHash, /^0x[0-9a-f]{64}$/);
  assert.equal(preview.canonicalPolicy, "{\"maxSpreadBps\":125,\"minVisibleDepthUsd\":500,\"staleAfterSeconds\":10}");
});

test("encodes registerPolicyVersion calldata from a preview", () => {
  const preview = buildPolicyVersionPreview({
    publisher: PUBLISHER,
    slug: "polymarket-clob-risk",
    version: 2,
    policy: { maxSpreadBps: 100 },
  });

  const calldata = encodeRegisterPolicyVersionCall(preview);

  assert.match(calldata, /^0x[0-9a-f]{200}$/);
  assert.equal(calldata.slice(10, 74), preview.policyId.slice(2));
  assert.equal(calldata.slice(-64), preview.contentHash.slice(2));
});

test("rejects an invalid publisher, slug, version, or policy body", () => {
  const valid = { publisher: PUBLISHER, slug: "risk", version: 1, policy: { maxSpreadBps: 100 } };

  assert.throws(() => buildPolicyVersionPreview({ ...valid, publisher: "0x1234" }), /20-byte publisher/);
  assert.throws(() => buildPolicyVersionPreview({ ...valid, slug: "" }), /slug/);
  assert.throws(() => buildPolicyVersionPreview({ ...valid, version: 0 }), /version/);
  assert.throws(() => buildPolicyVersionPreview({ ...valid, policy: null }), /policy object/);
});
