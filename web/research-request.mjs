import { canonicalJson } from "./canonical-json.mjs";
import { keccak256Utf8 } from "./keccak256.mjs";

const BYTES32 = /^0x[0-9a-f]{64}$/;
const CREATE = keccak256Utf8("createRequest(bytes32,bytes32)").slice(0, 10);
const FULFILL = keccak256Utf8("fulfillRequest(bytes32,bytes32)").slice(0, 10);
const WITHDRAW = keccak256Utf8("withdrawRequest(bytes32)").slice(0, 10);

function object(value, label) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw new TypeError(`${label} must be an object.`);
  return value;
}
function hash(value, label) {
  if (typeof value !== "string" || !BYTES32.test(value)) throw new TypeError(`${label} must be a normalized bytes32 hash.`);
  return value;
}
function two(selector, first, second) {
  return `${selector}${hash(first, "First argument").slice(2)}${hash(second, "Second argument").slice(2)}`;
}

/** Builds immutable request and scope commitments from canonical JSON. */
export function buildResearchRequestPreview({ request, scope }) {
  const canonicalRequest = canonicalJson(object(request, "Request"));
  const canonicalScope = canonicalJson(object(scope, "Scope"));
  return { canonicalRequest, canonicalScope, requestHash: keccak256Utf8(canonicalRequest), scopeHash: keccak256Utf8(canonicalScope) };
}
export function encodeCreateRequestCall({ requestHash, scopeHash }) { return two(CREATE, requestHash, scopeHash); }
export function encodeFulfillRequestCall({ requestHash, fulfillmentHash }) { return two(FULFILL, requestHash, fulfillmentHash); }
export function encodeWithdrawRequestCall(requestHash) { return `${WITHDRAW}${hash(requestHash, "Request hash").slice(2)}`; }
