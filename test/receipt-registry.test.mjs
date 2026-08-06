import test from "node:test";
import assert from "node:assert/strict";

import { findRegisteredReceipt, matchesAnchor } from "../receipt-registry.mjs";

const RECEIPT_HASH = "0x2a2230e5d142921705bcd0b04e8b65a3f34ea22edd6e6298684a9f6a8b87bcec";

test("finds the first external Polymarket receipt by normalized hash", () => {
  const record = findRegisteredReceipt(RECEIPT_HASH.toUpperCase());

  assert.equal(record.marketQuestion, "Will Gavin Newsom win the 2028 Democratic presidential nomination?");
  assert.equal(record.observedAt, "2026-08-06T14:50:51Z");
  assert.match(record.receiptSourceUrl, /2026-08-06-polymarket-gavin-newsom-top-of-book\.json$/);
});

test("only renders a registry record when its on-chain fields match", () => {
  const record = findRegisteredReceipt(RECEIPT_HASH);
  const anchor = {
    receiptHash: RECEIPT_HASH,
    policyHash: record.policyHash,
    marketHash: record.marketHash,
    observedAt: record.observedAtUnix,
    anchored: true,
  };

  assert.equal(matchesAnchor(record, anchor), true);
  assert.equal(matchesAnchor(record, { ...anchor, marketHash: `0x${"0".repeat(64)}` }), false);
});
