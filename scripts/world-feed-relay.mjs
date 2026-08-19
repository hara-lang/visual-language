import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { rankItems } from "./world-feed-rank.mjs";

const here = new URL("../", import.meta.url);

const destinationById = (policy, destinationId) =>
  policy.relay.destinations.find((destination) => destination.id === destinationId);

const hasCanonicalAttribution = (item) =>
  Boolean(item.canonicalUrl && item.author && item.source);

const isNeverAutomated = (item, policy) => {
  const flags = new Set([item.kind, ...(item.flags ?? [])]);
  return policy.relay.neverAutomate.some((flag) => flags.has(flag));
};

export function publicationReceipt(item, rankScore, destinationId) {
  const payload = [item.id, item.canonicalUrl, rankScore, destinationId].join("|");
  return createHash("sha256").update(payload).digest("hex").slice(0, 20);
}

export function relayMode(item, destinationId, policy) {
  const destination = destinationById(policy, destinationId);
  if (!destination) return "blocked";
  if (!hasCanonicalAttribution(item) || isNeverAutomated(item, policy)) return "blocked";

  const haraOwned = item.ownership === "hara";
  const autoEligible = policy.relay.autoEligible.includes(item.kind);
  return destination.mode === "auto" && haraOwned && autoEligible ? "auto" : "review";
}

const compact = (value, maximum) => {
  if (value.length <= maximum) return value;
  return `${value.slice(0, Math.max(0, maximum - 1)).trimEnd()}…`;
};

export function relayDraft(item, destinationId) {
  const attribution = `${item.author} · ${item.sourceLabel ?? item.source}`;
  const suffix = `\n\n${attribution}\n${item.canonicalUrl}`;
  const limit = destinationId === "x" ? 280 : 700;
  return `${compact(item.title, Math.max(32, limit - suffix.length))}${suffix}`;
}

export function buildRelayEnvelope(item, destinationId, policy) {
  const destination = destinationById(policy, destinationId);
  const mode = relayMode(item, destinationId, policy);

  return {
    itemId: item.id,
    destinationId,
    destinationLabel: destination?.label ?? destinationId,
    mode,
    status: mode === "auto" ? "eligible" : mode === "review" ? "awaiting-review" : "blocked",
    canonicalUrl: item.canonicalUrl ?? null,
    sourceAuthor: item.author ?? null,
    sourcePlatform: item.source ?? null,
    rankScore: item.rankScore ?? 0,
    cooldownHours: policy.relay.cooldownHours,
    publicationReceipt:
      mode === "blocked"
        ? null
        : publicationReceipt(item, item.rankScore ?? 0, destinationId),
    draft: mode === "blocked" ? null : relayDraft(item, destinationId)
  };
}

export function buildRelayQueue(items, policy, destinationIds = ["world-hot", "x", "reddit", "channels", "newsletter"]) {
  return items.flatMap((item) =>
    destinationIds.map((destinationId) => buildRelayEnvelope(item, destinationId, policy))
  );
}

async function runDryRun() {
  const [items, policy] = await Promise.all([
    readFile(new URL("site/src/data/world-feed-sample.json", here), "utf8").then(JSON.parse),
    readFile(new URL("site/src/data/world-feed-policy.json", here), "utf8").then(JSON.parse)
  ]);

  const ranked = rankItems(items, policy).slice(0, 4);
  const queue = buildRelayQueue(ranked, policy).map((entry) => ({
    itemId: entry.itemId,
    destinationId: entry.destinationId,
    mode: entry.mode,
    status: entry.status,
    publicationReceipt: entry.publicationReceipt
  }));

  process.stdout.write(`${JSON.stringify(queue, null, 2)}\n`);
}

const invokedPath = process.argv[1] ? fileURLToPath(import.meta.url) === process.argv[1] : false;
if (invokedPath) await runDryRun();
