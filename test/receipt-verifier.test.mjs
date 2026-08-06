import test from "node:test";
import assert from "node:assert/strict";

import { analyzeReceiptText } from "../receipt-verifier.mjs";

test("accepts exact canonical JSON and hashes its submitted UTF-8 text", () => {
  const receipt = '{"a":1,"b":{"c":2}}';

  assert.deepEqual(analyzeReceiptText(receipt), {
    canonicalText: receipt,
    canonical: true,
    receiptHash: "0xb3dba48372bd723eaddff745f015ca93d346cc6c0a67cdb3be75bb90880f5491",
  });
});

test("flags reformatted JSON and hashes the exact submitted bytes without normalizing", () => {
  const formattedReceipt = '{\n  "b": { "c": 2 },\n  "a": 1\n}';
  const result = analyzeReceiptText(formattedReceipt);

  assert.equal(result.canonical, false);
  assert.equal(result.canonicalText, '{"a":1,"b":{"c":2}}');
  assert.notEqual(result.receiptHash, "0xb3dba48372bd723eaddff745f015ca93d346cc6c0a67cdb3be75bb90880f5491");
});

test("rejects invalid JSON", () => {
  assert.throws(() => analyzeReceiptText('{not json}'), /valid JSON/i);
});
