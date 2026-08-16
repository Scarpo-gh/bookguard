import { canonicalJson } from "./canonical-json.mjs";
import { keccak256Utf8 } from "./keccak256.mjs";

const BYTES32_PATTERN = /^0x[0-9a-f]{64}$/;
const ANCHOR_SELECTOR = keccak256Utf8("anchorEvidenceRoot(bytes32,bytes32,uint64,uint64)").slice(0, 10);

function normalizeBytes32(value, label) {
  if (typeof value !== "string" || !/^0x[0-9a-fA-F]{64}$/.test(value)) {
    throw new TypeError(`${label} must be a 32-byte hexadecimal hash.`);
  }
  return value.toLowerCase();
}

function normalizeTimestamp(value, label) {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new TypeError(`Observation ${label} must be a positive safe integer.`);
  }
  return value;
}

function normalizeMetadata(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError("Batch metadata must be an object.");
  }
  return value;
}

function normalizeReceiptHashes(receiptHashes) {
  if (!Array.isArray(receiptHashes) || receiptHashes.length === 0) {
    throw new TypeError("At least one receipt hash is required.");
  }

  const normalized = receiptHashes.map((hash) => normalizeBytes32(hash, "Receipt hash")).sort();
  if (new Set(normalized).size !== normalized.length) {
    throw new TypeError("Receipt hashes must be unique within a batch.");
  }
  return normalized;
}

function hashLeaf(receiptHash) {
  return keccak256Utf8(`bookguard:evidence-leaf/v1:${receiptHash}`);
}

function hashNode(left, right) {
  const [first, second] = [left, right].sort();
  return keccak256Utf8(`bookguard:evidence-node/v1:${first}:${second}`);
}

function buildLevels(receiptHashes) {
  const levels = [receiptHashes.map(hashLeaf).sort()];
  while (levels.at(-1).length > 1) {
    const current = levels.at(-1);
    const next = [];
    for (let index = 0; index < current.length; index += 2) {
      next.push(hashNode(current[index], current[index + 1] ?? current[index]));
    }
    levels.push(next);
  }
  return levels;
}

/** Builds canonical root and metadata inputs for EvidenceRootAnchor. */
export function buildEvidenceBatchPreview({ receiptHashes, observedFrom, observedTo, metadata }) {
  const normalizedReceipts = normalizeReceiptHashes(receiptHashes);
  const start = normalizeTimestamp(observedFrom, "start");
  const end = normalizeTimestamp(observedTo, "end");
  if (end < start) throw new TypeError("Observation end must not precede start.");

  const root = buildLevels(normalizedReceipts).at(-1)[0];
  const canonicalMetadata = canonicalJson({
    format: "bookguard:evidence-batch/v1",
    leafCount: normalizedReceipts.length,
    metadata: normalizeMetadata(metadata),
    observedFrom: start,
    observedTo: end,
    root,
  });

  return {
    root,
    metadataHash: keccak256Utf8(canonicalMetadata),
    canonicalMetadata,
    leafCount: normalizedReceipts.length,
    observedFrom: start,
    observedTo: end,
  };
}

/** Returns a sibling-hash proof for one receipt under the documented v1 format. */
export function buildEvidenceProof(receiptHashes, receiptHash) {
  const normalizedReceipts = normalizeReceiptHashes(receiptHashes);
  const targetLeaf = hashLeaf(normalizeBytes32(receiptHash, "Receipt hash"));
  let index = buildLevels(normalizedReceipts)[0].indexOf(targetLeaf);
  if (index === -1) throw new TypeError("Receipt hash is not in this batch.");

  const proof = [];
  for (const level of buildLevels(normalizedReceipts).slice(0, -1)) {
    proof.push(level[index ^ 1] ?? level[index]);
    index = Math.floor(index / 2);
  }
  return proof;
}

/** Verifies inclusion without any RPC call or wallet connection. */
export function verifyEvidenceProof({ receiptHash, proof, root }) {
  try {
    let current = hashLeaf(normalizeBytes32(receiptHash, "Receipt hash"));
    if (!Array.isArray(proof)) return false;
    for (const sibling of proof) current = hashNode(current, normalizeBytes32(sibling, "Proof sibling"));
    return current === normalizeBytes32(root, "Evidence root");
  } catch {
    return false;
  }
}

/** Returns wallet-controlled calldata for an EvidenceRootAnchor write. */
export function encodeAnchorEvidenceRootCall({ root, metadataHash, observedFrom, observedTo }) {
  const start = normalizeTimestamp(observedFrom, "start");
  const end = normalizeTimestamp(observedTo, "end");
  if (end < start) throw new TypeError("Observation end must not precede start.");
  const encodeUint64 = (value) => BigInt(value).toString(16).padStart(64, "0");

  return `${ANCHOR_SELECTOR}${normalizeBytes32(root, "Evidence root").slice(2)}${normalizeBytes32(metadataHash, "Metadata hash").slice(2)}${encodeUint64(start)}${encodeUint64(end)}`;
}
