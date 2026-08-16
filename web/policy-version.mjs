import { canonicalJson } from "./canonical-json.mjs";
import { keccak256Utf8 } from "./keccak256.mjs";

const ADDRESS_PATTERN = /^0x[0-9a-fA-F]{40}$/;
const SELECTOR = keccak256Utf8("registerPolicyVersion(bytes32,uint64,bytes32)").slice(0, 10);

function normalizePublisher(value) {
  if (typeof value !== "string" || !ADDRESS_PATTERN.test(value)) {
    throw new TypeError("Enter a 20-byte publisher address.");
  }
  return value.toLowerCase();
}

function normalizeSlug(value) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError("Enter a non-empty policy slug.");
  }
  return value.trim().toLowerCase();
}

function normalizeVersion(value) {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new TypeError("Policy version must be a positive safe integer.");
  }
  return value;
}

function normalizePolicy(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError("Policy must be a policy object.");
  }
  return value;
}

function encodeUint64(value) {
  return BigInt(normalizeVersion(value)).toString(16).padStart(64, "0");
}

function normalizeBytes32(value, label) {
  if (typeof value !== "string" || !/^0x[0-9a-f]{64}$/.test(value)) {
    throw new TypeError(`${label} must be a normalized bytes32 hash.`);
  }
  return value;
}

/**
 * Builds deterministic off-chain inputs for PolicyVersionRegistry.
 * The publisher address is deliberately part of the namespace derivation so
 * similarly named policies cannot collide across publishers.
 */
export function buildPolicyVersionPreview({ publisher, slug, version, policy }) {
  const normalizedPublisher = normalizePublisher(publisher);
  const normalizedSlug = normalizeSlug(slug);
  const normalizedVersion = normalizeVersion(version);
  const canonicalPolicy = canonicalJson(normalizePolicy(policy));

  return {
    publisher: normalizedPublisher,
    slug: normalizedSlug,
    version: normalizedVersion,
    policyId: keccak256Utf8(`bookguard:policy-namespace/v1:${normalizedPublisher}:${normalizedSlug}`),
    canonicalPolicy,
    contentHash: keccak256Utf8(canonicalPolicy),
  };
}

/** Returns calldata for a wallet-controlled PolicyVersionRegistry write. */
export function encodeRegisterPolicyVersionCall({ policyId, version, contentHash }) {
  return `${SELECTOR}${normalizeBytes32(policyId, "Policy ID").slice(2)}${encodeUint64(version)}${normalizeBytes32(contentHash, "Content hash").slice(2)}`;
}
