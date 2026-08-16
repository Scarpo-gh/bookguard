import test from "node:test";
import assert from "node:assert/strict";
import { buildResearchRequestPreview, encodeCreateRequestCall, encodeFulfillRequestCall, encodeWithdrawRequestCall } from "../research-request.mjs";

const REQUEST = { market: "example-market", question: "Summarize liquidity risk." };
const SCOPE = { deliverable: "markdown", sources: ["CLOB", "Gamma"] };

test("builds canonical request and scope commitments", () => {
  const preview = buildResearchRequestPreview({ request: REQUEST, scope: SCOPE });
  assert.match(preview.requestHash, /^0x[0-9a-f]{64}$/);
  assert.match(preview.scopeHash, /^0x[0-9a-f]{64}$/);
  assert.match(preview.canonicalRequest, /^\{/);
});

test("encodes create, fulfill, and withdraw wallet calls", () => {
  const preview = buildResearchRequestPreview({ request: REQUEST, scope: SCOPE });
  const fulfillmentHash = "0x1111111111111111111111111111111111111111111111111111111111111111";
  assert.match(encodeCreateRequestCall(preview), /^0x[0-9a-f]{136}$/);
  assert.match(encodeFulfillRequestCall({ requestHash: preview.requestHash, fulfillmentHash }), /^0x[0-9a-f]{136}$/);
  assert.match(encodeWithdrawRequestCall(preview.requestHash), /^0x[0-9a-f]{72}$/);
});

test("rejects non-object or missing hash input", () => {
  assert.throws(() => buildResearchRequestPreview({ request: null, scope: SCOPE }), /object/);
  assert.throws(() => buildResearchRequestPreview({ request: REQUEST, scope: [] }), /object/);
  assert.throws(() => encodeWithdrawRequestCall("0x0"), /bytes32/);
});
