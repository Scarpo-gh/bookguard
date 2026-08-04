const GAMMA_MARKETS_URL = "https://gamma-api.polymarket.com/markets?slug=";
const CLOB_BOOK_URL = "https://clob.polymarket.com/book?token_id=";

async function readJson(url, fetcher) {
  const response = await fetcher(url);
  if (!response.ok) throw new Error(`Source request failed: ${url}`);
  return response.json();
}

function best(entries, comparison) {
  if (!Array.isArray(entries) || entries.length === 0) return null;
  return entries.reduce((current, candidate) => comparison(candidate, current) ? candidate : current);
}

function parseArray(value, field) {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) throw new Error();
    return parsed;
  } catch {
    throw new TypeError(`Market has an invalid ${field} field.`);
  }
}

export async function fetchObservation(slug, fetcher = fetch, now = () => new Date()) {
  if (typeof slug !== "string" || slug.length === 0) throw new TypeError("Provide a market slug.");

  const gammaUrl = `${GAMMA_MARKETS_URL}${encodeURIComponent(slug)}`;
  const markets = await readJson(gammaUrl, fetcher);
  const market = markets[0];
  if (!market) throw new Error(`No market found for slug: ${slug}`);
  if (market.active !== true || market.closed !== false) throw new Error("Market is not active and open.");

  const outcomes = parseArray(market.outcomes, "outcomes");
  const outcomePrices = parseArray(market.outcomePrices, "outcomePrices");
  const tokenIds = parseArray(market.clobTokenIds, "clobTokenIds");
  if (outcomes.length === 0 || outcomes.length !== tokenIds.length || outcomes.length !== outcomePrices.length) {
    throw new Error("Market outcome metadata is inconsistent.");
  }

  const books = await Promise.all(tokenIds.map(async (tokenId, index) => {
    const book = await readJson(`${CLOB_BOOK_URL}${encodeURIComponent(tokenId)}`, fetcher);
    const bestBid = best(book.bids, (candidate, current) => Number(candidate.price) > Number(current.price));
    const bestAsk = best(book.asks, (candidate, current) => Number(candidate.price) < Number(current.price));
    if (!bestBid || !bestAsk) throw new Error(`CLOB book is empty for outcome: ${outcomes[index]}`);

    return {
      bestAsk: { price: bestAsk.price, size: bestAsk.size },
      bestBid: { price: bestBid.price, size: bestBid.size },
      lastTradePrice: book.last_trade_price ?? "",
      outcome: outcomes[index],
      tickSize: book.tick_size,
      tokenId,
    };
  }));

  return {
    books,
    kind: "polymarket-clob-top-of-book-observation",
    market: {
      conditionId: market.conditionId,
      gammaOutcomePrices: outcomePrices,
      question: market.question,
      slug: market.slug,
    },
    observedAt: now().toISOString().replace(/\.\d{3}Z$/, "Z"),
    schema: "bookguard.receipt/v1",
    source: {
      clobBookTemplate: "https://clob.polymarket.com/book?token_id={tokenId}",
      gammaMarket: gammaUrl,
    },
  };
}
