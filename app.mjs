import { lookupAnchor, receiptHashFromSearch } from "./receipt-anchor.mjs";
import { canonicalJson } from "./canonical-json.mjs";
import { keccak256Utf8 } from "./keccak256.mjs";
import { fetchObservation } from "./polymarket-observation.mjs";

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
