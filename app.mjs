import { lookupAnchor, preflightAnchor, receiptHashFromSearch } from "./receipt-anchor.mjs";
import { canonicalJson } from "./canonical-json.mjs";
import { keccak256Utf8 } from "./keccak256.mjs";
import { fetchObservation } from "./polymarket-observation.mjs";
import { findRegisteredReceipt, matchesAnchor } from "./receipt-registry.mjs";

const form = document.querySelector("#lookup-form");
const input = document.querySelector("#receipt-hash");
const button = form.querySelector("button");
const message = document.querySelector("#lookup-message");
const badge = document.querySelector("#result-badge");
const emptyResult = document.querySelector("#empty-result");
const anchorResult = document.querySelector("#anchor-result");
const registeredEvidence = document.querySelector("#registered-evidence");

const fields = {
  receiptHash: document.querySelector("#result-receipt"),
  policyHash: document.querySelector("#result-policy"),
  marketHash: document.querySelector("#result-market"),
  observedAt: document.querySelector("#result-observed"),
  anchorer: document.querySelector("#result-anchorer"),
};

const evidenceFields = {
  question: document.querySelector("#evidence-question"),
  kind: document.querySelector("#evidence-kind"),
  observed: document.querySelector("#evidence-observed"),
  condition: document.querySelector("#evidence-condition"),
  policy: document.querySelector("#evidence-policy"),
  source: document.querySelector("#evidence-source"),
  transaction: document.querySelector("#evidence-transaction"),
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

function renderRegisteredEvidence(anchor) {
  const record = findRegisteredReceipt(anchor.receiptHash);
  if (!matchesAnchor(record, anchor)) {
    registeredEvidence.hidden = true;
    return;
  }

  registeredEvidence.hidden = false;
  evidenceFields.question.textContent = record.marketQuestion;
  evidenceFields.kind.textContent = record.kind;
  evidenceFields.observed.textContent = record.observedAt;
  evidenceFields.condition.textContent = record.marketConditionId;
  evidenceFields.policy.textContent = record.policyDescription;
  evidenceFields.source.href = record.receiptSourceUrl;
  evidenceFields.transaction.href = record.anchorTransactionUrl;
}

function renderAnchor(anchor) {
  emptyResult.hidden = true;
  anchorResult.hidden = false;
  fields.receiptHash.textContent = anchor.receiptHash;
  fields.policyHash.textContent = anchor.policyHash;
  fields.marketHash.textContent = anchor.marketHash;
  fields.observedAt.textContent = formatObservedAt(anchor.observedAt);
  fields.anchorer.textContent = anchor.anchorer;
  renderRegisteredEvidence(anchor);

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

const marketPreviewForm = document.querySelector("#market-preview-form");
const marketSlugInput = document.querySelector("#market-slug");
const marketPreviewButton = marketPreviewForm.querySelector("button");
const marketPreviewMessage = document.querySelector("#market-preview-message");
const marketPreviewResult = document.querySelector("#market-preview-result");
const marketQuestion = document.querySelector("#market-question");
const marketObserved = document.querySelector("#market-observed");
const marketBooks = document.querySelector("#market-books");
const marketCanonical = document.querySelector("#market-canonical");
const marketReceiptHash = document.querySelector("#market-receipt-hash");
const preflightButton = document.querySelector("#anchor-preflight");
const preflightMessage = document.querySelector("#anchor-preflight-message");
const preflightResult = document.querySelector("#anchor-preflight-result");
const preflightFields = {
  policyHash: document.querySelector("#preflight-policy"),
  marketHash: document.querySelector("#preflight-market"),
  status: document.querySelector("#preflight-status"),
  gas: document.querySelector("#preflight-gas"),
};
const POLYMARKET_POLICY = "bookguard:policy:polymarket-clob-top-of-book/v1";
let currentReceipt = null;

function setMarketMessage(text, isError = false) {
  marketPreviewMessage.textContent = text;
  marketPreviewMessage.classList.toggle("error", isError);
}

function addBookRow(book) {
  const row = document.createElement("div");
  const term = document.createElement("dt");
  const definition = document.createElement("dd");
  term.textContent = `${book.outcome} top of book`;
  definition.textContent = `Bid ${book.bestBid.price} × ${book.bestBid.size} · Ask ${book.bestAsk.price} × ${book.bestAsk.size}`;
  row.append(term, definition);
  marketBooks.append(row);
}

function renderMarketObservation(observation) {
  marketPreviewResult.hidden = false;
  marketQuestion.textContent = observation.market.question;
  marketObserved.textContent = `Observed ${observation.observedAt} · ${observation.market.conditionId}`;
  marketBooks.replaceChildren();
  observation.books.forEach(addBookRow);
  const canonicalReceipt = canonicalJson(observation);
  marketCanonical.textContent = canonicalReceipt;
  marketReceiptHash.textContent = keccak256Utf8(canonicalReceipt);
  currentReceipt = { observation, receiptHash: marketReceiptHash.textContent };
  preflightButton.disabled = false;
  preflightResult.hidden = true;
  preflightMessage.textContent = "Checks duplicate state, simulation, and gas without a wallet.";
  preflightMessage.classList.remove("error");
}

marketPreviewForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  marketPreviewButton.disabled = true;
  setMarketMessage("Fetching public Gamma metadata and CLOB books.");

  try {
    renderMarketObservation(await fetchObservation(marketSlugInput.value.trim()));
    setMarketMessage("Canonical receipt preview generated locally. It is not anchored.");
  } catch (error) {
    setMarketMessage(error.message, true);
  } finally {
    marketPreviewButton.disabled = false;
  }
});

preflightButton.addEventListener("click", async () => {
  if (!currentReceipt) return;

  const policyHash = keccak256Utf8(POLYMARKET_POLICY);
  const marketHash = keccak256Utf8(`polymarket:condition:${currentReceipt.observation.market.conditionId.toLowerCase()}`);
  const observedAt = Math.floor(Date.parse(currentReceipt.observation.observedAt) / 1000);
  preflightButton.disabled = true;
  preflightMessage.textContent = "Reading ReceiptAnchorV1 and simulating anchorReceipt() on Base.";
  preflightMessage.classList.remove("error");

  try {
    const result = await preflightAnchor({
      receiptHash: currentReceipt.receiptHash,
      policyHash,
      marketHash,
      observedAt,
    });
    preflightResult.hidden = false;
    preflightFields.policyHash.textContent = policyHash;
    preflightFields.marketHash.textContent = marketHash;
    preflightFields.status.textContent = result.anchor.anchored ? "Already anchored — no write should be sent." : "Not anchored · simulation passed";
    preflightFields.gas.textContent = result.estimatedGas === null ? "—" : result.estimatedGas.toString();
    preflightMessage.textContent = result.anchor.anchored
      ? "This exact receipt is already anchored."
      : "Preflight passed. This page still cannot sign or broadcast a transaction.";
  } catch (error) {
    preflightMessage.textContent = error.message;
    preflightMessage.classList.add("error");
  } finally {
    preflightButton.disabled = false;
  }
});
