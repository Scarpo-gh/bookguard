import { keccak256Utf8 } from "./keccak256.mjs";

const ADDRESS_PATTERN = /^0x[0-9a-fA-F]{40}$/;
const BYTES32_PATTERN = /^0x[0-9a-f]{64}$/;
const REGISTER_SELECTOR = keccak256Utf8("registerPublisherKey(bytes32,bytes32,string)").slice(0, 10);
const ROTATE_SELECTOR = keccak256Utf8("rotatePublisherKey(bytes32,bytes32,string)").slice(0, 10);
const REVOKE_SELECTOR = keccak256Utf8("revokeActiveKey()").slice(0, 10);

function normalizePublisher(value) {
  if (typeof value !== "string" || !ADDRESS_PATTERN.test(value)) {
    throw new TypeError("Enter a 20-byte publisher address.");
  }
  return value.toLowerCase();
}

function normalizeSlug(value) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError("Enter a non-empty key slug.");
  }
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

function normalizePublicKey(value) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError("Enter a non-empty public key representation.");
  }
  return value.trim();
}

function normalizeUri(value) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError("Enter a non-empty public key URI.");
  }
  return value.trim();
}

function normalizeBytes32(value, label) {
  if (typeof value !== "string" || !BYTES32_PATTERN.test(value)) {
    throw new TypeError(`${label} must be a normalized bytes32 hash.`);
  }
  return value;
}

function encodeDynamicString(value) {
  const bytes = new TextEncoder().encode(normalizeUri(value));
  const length = bytes.length.toString(16).padStart(64, "0");
  const payload = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${length}${payload.padEnd(Math.ceil(payload.length / 64) * 64, "0")}`;
}

function encodeKeyMutation(selector, { keyId, publicKeyHash, uri }) {
  return `${selector}${normalizeBytes32(keyId, "Key ID").slice(2)}${normalizeBytes32(publicKeyHash, "Public key hash").slice(2)}${"60".padStart(64, "0")}${encodeDynamicString(uri)}`;
}

/** Builds deterministic public key discovery inputs for PublisherKeyRegistry. */
export function buildPublisherKeyPreview({ publisher, slug, publicKey, uri }) {
  const normalizedPublisher = normalizePublisher(publisher);
  const normalizedSlug = normalizeSlug(slug);
  const normalizedPublicKey = normalizePublicKey(publicKey);
  const normalizedUri = normalizeUri(uri);

  return {
    publisher: normalizedPublisher,
    slug: normalizedSlug,
    keyId: keccak256Utf8(`bookguard:publisher-key/v1:${normalizedPublisher}:${normalizedSlug}`),
    publicKeyHash: keccak256Utf8(normalizedPublicKey),
    uri: normalizedUri,
  };
}

/** Checks that an exact public-key representation matches an on-chain key hash. */
export function matchesPublisherKey({ publicKey, publicKeyHash }) {
  try {
    return keccak256Utf8(normalizePublicKey(publicKey)) === normalizeBytes32(publicKeyHash, "Public key hash");
  } catch {
    return false;
  }
}

/** Returns calldata for a first or post-revocation key registration. */
export function encodeRegisterPublisherKeyCall(preview) {
  return encodeKeyMutation(REGISTER_SELECTOR, preview);
}

/** Returns calldata for a successor-key rotation. */
export function encodeRotatePublisherKeyCall(preview) {
  return encodeKeyMutation(ROTATE_SELECTOR, preview);
}

/** Returns calldata to irrevocably revoke the caller's active key. */
export function encodeRevokeActiveKeyCall() {
  return REVOKE_SELECTOR;
}
