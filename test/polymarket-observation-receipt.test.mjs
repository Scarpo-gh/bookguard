import test from "node:test";
import assert from "node:assert/strict";

import { fetchObservation } from "../../scripts/polymarket-observation-receipt.mjs";

const SLUG = "eth-updown-demo";
const YES_TOKEN = "yes-token";
const NO_TOKEN = "no-token";
const CONDITION_ID = "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc";

function response(payload) {
  return { ok: true, json: async () => payload };
}

test("fetches Gamma metadata and derives the true CLOB top of book", async () => {
  const calls = [];
  const fetcher = async (url) => {
    calls.push(url);
    if (url.includes("gamma-api")) {
      return response([{
        active: true,
        closed: false,
        clobTokenIds: JSON.stringify([YES_TOKEN, NO_TOKEN]),
        conditionId: CONDITION_ID,
        outcomePrices: JSON.stringify(["0.52", "0.48"]),
        outcomes: JSON.stringify(["Up", "Down"]),
        question: "Ethereum Up or Down?",
        slug: SLUG,
      }]);
    }
    if (url.includes(YES_TOKEN)) {
      return response({
        asks: [{ price: "0.55", size: "4" }, { price: "0.53", size: "7" }],
        bids: [{ price: "0.49", size: "3" }, { price: "0.51", size: "5" }],
        last_trade_price: "0.52",
        tick_size: "0.01",
      });
    }
    return response({
      asks: [{ price: "0.50", size: "8" }],
      bids: [{ price: "0.47", size: "6" }],
      tick_size: "0.01",
    });
  };

  const observation = await fetchObservation(
    SLUG,
    fetcher,
    () => new Date("2026-08-04T14:10:00Z"),
  );

  assert.equal(calls.length, 3);
  assert.equal(observation.market.conditionId, CONDITION_ID);
  assert.equal(observation.observedAt, "2026-08-04T14:10:00Z");
  assert.deepEqual(observation.books, [
    {
      bestAsk: { price: "0.53", size: "7" },
      bestBid: { price: "0.51", size: "5" },
      lastTradePrice: "0.52",
      outcome: "Up",
      tickSize: "0.01",
      tokenId: YES_TOKEN,
    },
    {
      bestAsk: { price: "0.50", size: "8" },
      bestBid: { price: "0.47", size: "6" },
      lastTradePrice: "",
      outcome: "Down",
      tickSize: "0.01",
      tokenId: NO_TOKEN,
    },
  ]);
});

test("rejects inactive or closed markets", async () => {
  const fetcher = async () => response([{
    active: false,
    closed: false,
    clobTokenIds: "[]",
    outcomePrices: "[]",
    outcomes: "[]",
  }]);

  await assert.rejects(
    fetchObservation(SLUG, fetcher, () => new Date("2026-08-04T14:10:00Z")),
    /not active and open/,
  );
});
