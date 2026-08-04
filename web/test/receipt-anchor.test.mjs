import test from "node:test";
import assert from "node:assert/strict";

import {
  decodeAnchorResult,
  encodeGetAnchorCall,
  lookupAnchor,
  normalizeReceiptHash,
} from "../receipt-anchor.mjs";

const RECEIPT_HASH = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const POLICY_HASH = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
const MARKET_HASH = "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc";
const ANCHORER = "0xD725160341c1c65Cf1369d271c897aFC5fcc3926";

function word(value) {
  return value.padStart(64, "0");
}

test("normalizes a valid bytes32 receipt hash", () => {
  assert.equal(normalizeReceiptHash(RECEIPT_HASH.toUpperCase()), RECEIPT_HASH);
});

test("rejects a receipt hash that is not bytes32", () => {
  assert.throws(() => normalizeReceiptHash("0x1234"), /32-byte hexadecimal hash/);
});

test("encodes getAnchor calldata", () => {
  assert.equal(encodeGetAnchorCall(RECEIPT_HASH), `0x7feb51d9${RECEIPT_HASH.slice(2)}`);
});

test("decodes an anchored receipt response", () => {
  const result = `0x${[
    RECEIPT_HASH.slice(2),
    POLICY_HASH.slice(2),
    MARKET_HASH.slice(2),
    word("665f3c00"),
    word(ANCHORER.slice(2).toLowerCase()),
  ].join("")}`;

  assert.deepEqual(decodeAnchorResult(result), {
    receiptHash: RECEIPT_HASH,
    policyHash: POLICY_HASH,
    marketHash: MARKET_HASH,
    observedAt: 1717517312,
    anchorer: ANCHORER.toLowerCase(),
    anchored: true,
  });
});

test("decodes a missing receipt response", () => {
  const missing = `0x${"0".repeat(64 * 5)}`;

  assert.deepEqual(decodeAnchorResult(missing), {
    receiptHash: `0x${"0".repeat(64)}`,
    policyHash: `0x${"0".repeat(64)}`,
    marketHash: `0x${"0".repeat(64)}`,
    observedAt: 0,
    anchorer: "0x0000000000000000000000000000000000000000",
    anchored: false,
  });
});

test("looks up a receipt with a Base eth_call", async () => {
  const missing = `0x${"0".repeat(64 * 5)}`;
  const calls = [];
  const fetcher = async (url, options) => {
    calls.push({ url, options });
    return { ok: true, json: async () => ({ jsonrpc: "2.0", id: 1, result: missing }) };
  };

  const anchor = await lookupAnchor(RECEIPT_HASH, fetcher);

  assert.equal(calls[0].url, "https://mainnet.base.org");
  assert.deepEqual(JSON.parse(calls[0].options.body).params[0], {
    to: "0x9a8fCf271F97075486673eA3eD48c4fda33374Ce",
    data: `0x7feb51d9${RECEIPT_HASH.slice(2)}`,
  });
  assert.equal(anchor.anchored, false);
});
