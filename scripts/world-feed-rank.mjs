import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const here = new URL("../", import.meta.url);

export const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));

const rounded = (value, places = 4) => {
  const scale = 10 ** places;
  return Math.round(value * scale) / scale;
};

export function scoreItem(item, policy) {
  const weights = policy.ranking.weights;
  const penalties = policy.ranking.penalties;
  const signals = item.signals ?? {};

  const positive = Object.entries(weights).reduce(
    (total, [key, weight]) => total + clamp01(signals[key]) * Number(weight),
    0
  );

  const negative = Object.entries(penalties).reduce(
    (total, [key, weight]) => total + clamp01(signals[key]) * Number(weight),
    0
  );

  return rounded(clamp01(positive - negative));
}

export function scoreReceipt(item, policy) {
  const weights = policy.ranking.weights;
  const penalties = policy.ranking.penalties;
  const signals = item.signals ?? {};

  return {
    itemId: item.id,
    score: scoreItem(item, policy),
    positive: Object.fromEntries(
      Object.entries(weights).map(([key, weight]) => [
        key,
        rounded(clamp01(signals[key]) * Number(weight))
      ])
    ),
    penalties: Object.fromEntries(
      Object.entries(penalties).map(([key, weight]) => [
        key,
        rounded(clamp01(signals[key]) * Number(weight))
      ])
    )
  };
}

export function rankItems(items, policy) {
  return [...items]
    .map((item) => ({
      ...item,
      rankScore: scoreItem(item, policy),
      rankReceipt: scoreReceipt(item, policy)
    }))
    .sort((left, right) =>
      right.rankScore - left.rankScore || left.id.localeCompare(right.id)
    );
}

export function clusterByCanonicalUrl(items) {
  const clusters = new Map();

  for (const item of items) {
    const key = item.canonicalUrl || `item:${item.id}`;
    const cluster = clusters.get(key) ?? [];
    cluster.push(item);
    clusters.set(key, cluster);
  }

  return [...clusters.entries()]
    .map(([canonicalUrl, members]) => ({
      canonicalUrl,
      members: [...members].sort((a, b) => a.id.localeCompare(b.id)),
      sourceCount: new Set(members.map((member) => member.source)).size
    }))
    .sort((a, b) =>
      b.sourceCount - a.sourceCount || a.canonicalUrl.localeCompare(b.canonicalUrl)
    );
}

async function runPreview() {
  const [items, policy] = await Promise.all([
    readFile(new URL("site/src/data/world-feed-sample.json", here), "utf8").then(JSON.parse),
    readFile(new URL("site/src/data/world-feed-policy.json", here), "utf8").then(JSON.parse)
  ]);

  const preview = rankItems(items, policy).map(({ id, source, title, rankScore }) => ({
    id,
    source,
    title,
    rankScore
  }));

  process.stdout.write(`${JSON.stringify(preview, null, 2)}\n`);
}

const invokedPath = process.argv[1] ? fileURLToPath(import.meta.url) === process.argv[1] : false;
if (invokedPath) await runPreview();
