import test from "node:test";
import assert from "node:assert/strict";

import { canonicalJson } from "../canonical-json.mjs";

test("serializes object keys recursively in lexical order", () => {
  assert.equal(
    canonicalJson({ z: 3, a: { y: true, b: "x" }, list: [{ b: 2, a: 1 }] }),
    '{"a":{"b":"x","y":true},"list":[{"a":1,"b":2}],"z":3}',
  );
});

test("preserves array order because outcomes are ordered data", () => {
  assert.equal(canonicalJson({ outcomes: ["Yes", "No"] }), '{"outcomes":["Yes","No"]}');
});
