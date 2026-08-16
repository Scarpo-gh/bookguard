import test from "node:test";
import assert from "node:assert/strict";

import {
  buildPublisherKeyPreview,
  encodeRegisterPublisherKeyCall,
  encodeRevokeActiveKeyCall,
  encodeRotatePublisherKeyCall,
  matchesPublisherKey,
} from "../publisher-key.mjs";

const PUBLISHER = "0xd725160341c1c65cf1369d271c897afc5fcc3926";
const PUBLIC_KEY = "ed25519:MCowBQYDK2VwAyEA-example-public-key";
const URI = "ipfs://bafybookguardpublisherkeyv1";

test("builds a publisher-scoped public key discovery record", () => {
  const preview = buildPublisherKeyPreview({
    publisher: PUBLISHER,
    slug: "BookGuard Receipt Signer",
    publicKey: PUBLIC_KEY,
    uri: URI,
  });

  assert.equal(preview.publisher, PUBLISHER);
  assert.equal(preview.slug, "bookguard-receipt-signer");
  assert.match(preview.keyId, /^0x[0-9a-f]{64}$/);
  assert.match(preview.publicKeyHash, /^0x[0-9a-f]{64}$/);
  assert.equal(preview.uri, URI);
  assert.equal(matchesPublisherKey({ publicKey: PUBLIC_KEY, publicKeyHash: preview.publicKeyHash }), true);
  assert.equal(matchesPublisherKey({ publicKey: `${PUBLIC_KEY}-tampered`, publicKeyHash: preview.publicKeyHash }), false);
});

test("encodes wallet-controlled register, rotate, and revoke calls", () => {
  const preview = buildPublisherKeyPreview({ publisher: PUBLISHER, slug: "receipt-signer", publicKey: PUBLIC_KEY, uri: URI });

  const register = encodeRegisterPublisherKeyCall(preview);
  const rotate = encodeRotatePublisherKeyCall(preview);
  const revoke = encodeRevokeActiveKeyCall();

  assert.match(register, /^0x[0-9a-f]+$/);
  assert.equal(register.slice(10, 74), preview.keyId.slice(2));
  assert.equal(register.slice(74, 138), preview.publicKeyHash.slice(2));
  assert.equal(register.slice(138, 202), "60".padStart(64, "0"));
  assert.match(rotate, /^0x[0-9a-f]+$/);
  assert.match(revoke, /^0x[0-9a-f]{8}$/);
  assert.notEqual(register.slice(0, 10), rotate.slice(0, 10));
});

test("rejects missing publisher key discovery inputs", () => {
  assert.throws(() => buildPublisherKeyPreview({ publisher: "not-an-address", slug: "x", publicKey: PUBLIC_KEY, uri: URI }), /address/);
  assert.throws(() => buildPublisherKeyPreview({ publisher: PUBLISHER, slug: "", publicKey: PUBLIC_KEY, uri: URI }), /slug/);
  assert.throws(() => buildPublisherKeyPreview({ publisher: PUBLISHER, slug: "x", publicKey: "", uri: URI }), /public key/);
  assert.throws(() => buildPublisherKeyPreview({ publisher: PUBLISHER, slug: "x", publicKey: PUBLIC_KEY, uri: "" }), /URI/);
});
