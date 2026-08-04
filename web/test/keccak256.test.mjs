import test from "node:test";
import assert from "node:assert/strict";

import { keccak256Utf8 } from "../keccak256.mjs";

test("matches Ethereum Keccak-256 vectors", () => {
  assert.equal(
    keccak256Utf8(""),
    "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
  );
  assert.equal(
    keccak256Utf8("hello"),
    "0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8",
  );
});

test("hashes canonical JSON bytes deterministically", () => {
  assert.equal(
    keccak256Utf8('{"outcomes":["Yes","No"]}'),
    "0x36bb0019d6423368c9c30ab014484360a662ca5688467611a7bc67ed57bec452",
  );
});
