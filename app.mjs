import { lookupAnchor, receiptHashFromSearch } from "./receipt-anchor.mjs";

const form = document.querySelector("#lookup-form");
const input = document.querySelector("#receipt-hash");
const button = form.querySelector("button");
const message = document.querySelector("#lookup-message");
const badge = document.querySelector("#result-badge");
const emptyResult = document.querySelector("#empty-result");
const anchorResult = document.querySelector("#anchor-result");

const fields = {
  receiptHash: document.querySelector("#result-receipt"),
  policyHash: document.querySelector("#result-policy"),
  marketHash: document.querySelector("#result-market"),
  observedAt: document.querySelector("#result-observed"),
  anchorer: document.querySelector("#result-anchorer"),
};

function setBadge(label, state = "neutral") {
  badge.textContent = label;
  badge.className = `badge ${state}`;
}

function setMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function formatObservedAt(timestamp) {
  if (timestamp === 0) return "—";
  return `${new Date(timestamp * 1000).toISOString()} (${timestamp})`;
}

function renderAnchor(anchor) {
  emptyResult.hidden = true;
  anchorResult.hidden = false;
  fields.receiptHash.textContent = anchor.receiptHash;
  fields.policyHash.textContent = anchor.policyHash;
  fields.marketHash.textContent = anchor.marketHash;
  fields.observedAt.textContent = formatObservedAt(anchor.observedAt);
  fields.anchorer.textContent = anchor.anchorer;

  if (anchor.anchored) {
    setBadge("Anchored", "found");
    setMessage("Anchor record read from Base Mainnet.");
  } else {
    setBadge("Not anchored", "missing");
    setMessage("No record exists for this receipt hash on ReceiptAnchorV1.");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  button.disabled = true;
  setBadge("Reading Base…");
  setMessage("Calling getAnchor() at the latest Base Mainnet block.");

  try {
    renderAnchor(await lookupAnchor(input.value.trim()));
  } catch (error) {
    setBadge("Query failed");
    setMessage(error.message, true);
  } finally {
    button.disabled = false;
  }
});

const receiptHash = receiptHashFromSearch(window.location.search);
if (receiptHash) {
  input.value = receiptHash;
  form.requestSubmit();
}
