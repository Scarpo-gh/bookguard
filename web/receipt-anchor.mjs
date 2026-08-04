export const BASE_MAINNET_RPC = "https://mainnet.base.org";
export const RECEIPT_ANCHOR_ADDRESS = "0x9a8fCf271F97075486673eA3eD48c4fda33374Ce";

const GET_ANCHOR_SELECTOR = "0x7feb51d9";
const ANCHOR_RECEIPT_SELECTOR = "0x9d09f2eb";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const BYTES32_PATTERN = /^0x[0-9a-fA-F]{64}$/i;

export function normalizeReceiptHash(value) {
  if (typeof value !== "string" || !BYTES32_PATTERN.test(value)) {
    throw new TypeError("Enter a 32-byte hexadecimal hash: 0x followed by 64 characters.");
  }

  return value.toLowerCase();
}

export function receiptHashFromSearch(search) {
  const value = new URLSearchParams(search).get("receipt");
  if (value === null) return null;

  try {
    return normalizeReceiptHash(value);
  } catch {
    return null;
  }
}

export function encodeGetAnchorCall(receiptHash) {
  return `${GET_ANCHOR_SELECTOR}${normalizeReceiptHash(receiptHash).slice(2)}`;
}

function encodeUint64(value) {
  if (!Number.isInteger(value) || value <= 0 || value > Number.MAX_SAFE_INTEGER) {
    throw new TypeError("Observed time must be a positive safe integer.");
  }
  return BigInt(value).toString(16).padStart(64, "0");
}

export function encodeAnchorReceiptCall(receiptHash, policyHash, marketHash, observedAt) {
  return `${ANCHOR_RECEIPT_SELECTOR}${normalizeReceiptHash(receiptHash).slice(2)}${normalizeReceiptHash(policyHash).slice(2)}${normalizeReceiptHash(marketHash).slice(2)}${encodeUint64(observedAt)}`;
}

export function decodeAnchorResult(result) {
  if (typeof result !== "string" || !/^0x[0-9a-fA-F]{320}$/.test(result)) {
    throw new Error("Base returned an unexpected getAnchor response.");
  }

  const words = result.slice(2).match(/.{64}/g);
  const anchorer = `0x${words[4].slice(24)}`.toLowerCase();

  return {
    receiptHash: `0x${words[0]}`.toLowerCase(),
    policyHash: `0x${words[1]}`.toLowerCase(),
    marketHash: `0x${words[2]}`.toLowerCase(),
    observedAt: Number(BigInt(`0x${words[3]}`)),
    anchorer,
    anchored: anchorer !== ZERO_ADDRESS,
  };
}

export async function lookupAnchor(receiptHash, fetcher = fetch) {
  const response = await fetcher(BASE_MAINNET_RPC, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_call",
      params: [
        {
          to: RECEIPT_ANCHOR_ADDRESS,
          data: encodeGetAnchorCall(receiptHash),
        },
        "latest",
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Base RPC request failed (${response.status}).`);
  }

  const payload = await response.json();
  if (payload.error) {
    throw new Error(payload.error.message || "Base RPC returned an error.");
  }

  return decodeAnchorResult(payload.result);
}

async function rpcRequest(method, params, fetcher) {
  const response = await fetcher(BASE_MAINNET_RPC, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (!response.ok) throw new Error(`Base RPC request failed (${response.status}).`);

  const payload = await response.json();
  if (payload.error) throw new Error(payload.error.message || "Base RPC returned an error.");
  return payload.result;
}

export async function preflightAnchor({ receiptHash, policyHash, marketHash, observedAt }, fetcher = fetch) {
  const normalizedReceiptHash = normalizeReceiptHash(receiptHash);
  const calldata = encodeAnchorReceiptCall(normalizedReceiptHash, policyHash, marketHash, observedAt);
  const anchor = await lookupAnchor(normalizedReceiptHash, fetcher);
  if (anchor.anchored) return { anchor, calldata, simulation: "not-run", estimatedGas: null };

  const transaction = { to: RECEIPT_ANCHOR_ADDRESS, data: calldata };
  const [simulation, estimatedGas] = await Promise.all([
    rpcRequest("eth_call", [transaction, "latest"], fetcher),
    rpcRequest("eth_estimateGas", [transaction], fetcher),
  ]);
  if (typeof simulation !== "string") throw new Error("Base returned an unexpected anchorReceipt simulation response.");
  return { anchor, calldata, simulation: "passed", estimatedGas: BigInt(estimatedGas) };
}
