import { canonicalJson } from "../web/canonical-json.mjs";
import { fetchObservation } from "../web/polymarket-observation.mjs";

if (import.meta.url === `file://${process.argv[1]}`) {
  const slug = process.argv[2];
  if (!slug) {
    console.error("Usage: node scripts/polymarket-observation-receipt.mjs <market-slug>");
    process.exitCode = 2;
  } else {
    fetchObservation(slug)
      .then((receipt) => process.stdout.write(`${canonicalJson(receipt)}\n`))
      .catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
      });
  }
}
