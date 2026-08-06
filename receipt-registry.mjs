const RECEIPTS = [
  {
    receiptHash: "0x2a2230e5d142921705bcd0b04e8b65a3f34ea22edd6e6298684a9f6a8b87bcec",
    policyHash: "0x5aab2c07dcc68c76f1397011ed98f64e009aca8a8427ac0a80c5c10ab8c80799",
    marketHash: "0xce2d31e123506852fce6881c14bfbae505721daa2e1621854104bfdc4817f1e5",
    observedAt: "2026-08-06T14:50:51Z",
    observedAtUnix: 1786027851,
    kind: "Polymarket CLOB top-of-book observation",
    marketQuestion: "Will Gavin Newsom win the 2028 Democratic presidential nomination?",
    marketConditionId: "0x0f49db97f71c68b1e42a6d16e3de93d85dbf7d4148e3f018eb79e88554be9f75",
    receiptSourceUrl: "https://github.com/Scarpo-gh/bookguard/blob/main/receipts/2026-08-06-polymarket-gavin-newsom-top-of-book.json",
    anchorTransactionUrl: "https://basescan.org/tx/0x5d7881dfc234897832843685dbc8b968e6a8edc037475134f41c999155545509",
    policyDescription: "Public Gamma metadata and CLOB top-of-book snapshot; no market outcome, execution, or profitability claim.",
  },
];

export function findRegisteredReceipt(receiptHash) {
  if (typeof receiptHash !== "string") return null;
  return RECEIPTS.find((record) => record.receiptHash === receiptHash.toLowerCase()) ?? null;
}

export function matchesAnchor(record, anchor) {
  return Boolean(
    record
    && anchor?.anchored === true
    && record.receiptHash === anchor.receiptHash
    && record.policyHash === anchor.policyHash
    && record.marketHash === anchor.marketHash
    && record.observedAtUnix === anchor.observedAt,
  );
}
