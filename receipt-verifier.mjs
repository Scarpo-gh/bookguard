import { canonicalJson } from "./canonical-json.mjs";
import { keccak256Utf8 } from "./keccak256.mjs";

export function analyzeReceiptText(text) {
  if (typeof text !== "string") {
    throw new TypeError("Receipt text must be valid JSON.");
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new TypeError("Receipt text must be valid JSON.");
  }

  const canonicalText = canonicalJson(parsed);
  return {
    canonicalText,
    canonical: text === canonicalText,
    receiptHash: keccak256Utf8(text),
  };
}
