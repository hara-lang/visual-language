const clamp = (value, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, Number.isFinite(Number(value)) ? Number(value) : 0));

export const DEFAULT_WEIGHTS = Object.freeze({
  haraRelevance: 0.35,
  engagementVelocity: 0.20,
  sourceTrust: 0.15,
  freshness: 0.15,
  conversationDepth: 0.10,
  novelty: 0.05
});

export const DEFAULT_PENALTIES = Object.freeze({
  duplicate: 0.50,
  sameAuthorSaturation: 0.25,
  sameSourceSaturation: 0.20
});

export const scoreFeedItem = (item, ranking = {}) => {
  const weights = { ...DEFAULT_WEIGHTS, ...(ranking.weights ?? {}) };
  const penalties = { ...DEFAULT_PENALTIES, ...(ranking.penalties ?? {}) };
  const signals = item?.signals ?? {};

  const positive = Object.entries(weights).reduce(
    (score, [signal, weight]) => score + clamp(weight, 0, 1) * clamp(signals[signal]),
    0
  );

  const negative = Object.entries(penalties).reduce(
    (score, [signal, weight]) => score + clamp(weight, 0, 1) * clamp(signals[signal]),
    0
  );

  return Number(clamp(positive - negative, 0, 1).toFixed(4));
};

const publishedTime = (item) => {
  const timestamp = Date.parse(item?.publishedAt ?? "");
  return Number.isFinite(timestamp) ? timestamp : 0;
};

export const rankFeedItems = (items, ranking = {}) =>
  [...(Array.isArray(items) ? items : [])]
    .map((item) => ({ ...item, score: scoreFeedItem(item, ranking) }))
    .sort((left, right) =>
      right.score - left.score ||
      publishedTime(right) - publishedTime(left) ||
      String(left.id ?? "").localeCompare(String(right.id ?? ""))
    );

export const groupConversations = (items, ranking = {}) => {
  const groups = new Map();

  for (const item of rankFeedItems(items, ranking)) {
    const key = item.clusterId || item.id;
    const group = groups.get(key) ?? {
      id: key,
      title: item.title,
      score: item.score,
      sources: [],
      items: []
    };

    group.score = Math.max(group.score, item.score);
    group.items.push(item);
    if (!group.sources.includes(item.sourceLabel)) group.sources.push(item.sourceLabel);
    groups.set(key, group);
  }

  return [...groups.values()].sort((left, right) =>
    right.score - left.score || String(left.id).localeCompare(String(right.id))
  );
};

export const relayDecision = (item, relay = {}) => {
  const required = relay.required ?? [];
  const missing = [];

  if (required.includes("canonical-url") && !item?.canonicalUrl) missing.push("canonical-url");
  if (required.includes("source-author") && !item?.author) missing.push("source-author");
  if (required.includes("source-platform") && !item?.source) missing.push("source-platform");

  const neverAutomate = new Set(relay.neverAutomate ?? []);
  if (neverAutomate.has(item?.kind)) {
    return { state: "blocked", reason: "content-kind", missing };
  }

  if (missing.length > 0) return { state: "blocked", reason: "missing-attribution", missing };

  const autoEligible = new Set(relay.autoEligible ?? []);
  if (item?.owned === true && autoEligible.has(item?.kind)) {
    return { state: "auto-eligible", reason: "trusted-owned-event", missing };
  }

  return { state: "review", reason: "community-content", missing };
};
