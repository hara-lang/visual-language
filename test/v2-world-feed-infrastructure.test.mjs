import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  clusterByCanonicalUrl,
  rankItems,
  scoreItem,
  scoreReceipt
} from "../scripts/world-feed-rank.mjs";
import {
  buildRelayEnvelope,
  publicationReceipt,
  relayDraft,
  relayMode
} from "../scripts/world-feed-relay.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFile(resolve(root, path), "utf8");
const readJson = (path) => read(path).then(JSON.parse);

test("historical feed policy still covers native, repository, social, discussion, newsletter, and open-feed inputs", async () => {
  const policy = await readJson("site/src/data/world-feed-policy.json");
  const sourceIds = policy.ingestion.sources.map(({ id }) => id);

  assert.deepEqual(sourceIds, [
    "world",
    "github",
    "reddit",
    "x",
    "hacker-news",
    "substack",
    "rss"
  ]);
  assert.equal(policy.ingestion.sources.find(({ id }) => id === "substack").transport, "RSS");
});

test("historical relay policy remains review-first and limits automatic publication to narrow Hara-owned facts", async () => {
  const policy = await readJson("site/src/data/world-feed-policy.json");
  const destinations = Object.fromEntries(policy.relay.destinations.map((destination) => [destination.id, destination.mode]));

  assert.equal(policy.relay.defaultMode, "review");
  assert.equal(destinations.x, "review");
  assert.equal(destinations.reddit, "review");
  assert.equal(destinations.channels, "review");
  assert.equal(destinations.newsletter, "review");
  assert.equal(destinations["world-hot"], "auto");
  assert.deepEqual(policy.relay.autoEligible, [
    "hara-owned-release",
    "security-advisory",
    "scheduled-snippet-of-the-day"
  ]);
  assert.ok(policy.relay.neverAutomate.includes("quote-without-canonical-link"));
  assert.equal(policy.relay.cooldownHours, 72);
});

test("historical ranking is deterministic, inspectable, and strongly penalizes canonical duplicates", async () => {
  const [items, policy] = await Promise.all([
    readJson("site/src/data/world-feed-sample.json"),
    readJson("site/src/data/world-feed-policy.json")
  ]);

  const first = rankItems(items, policy);
  const second = rankItems(items, policy);
  assert.deepEqual(first, second);
  assert.equal(first[0].id, "github-schema-release");

  const canonical = items.find(({ id }) => id === "github-schema-release");
  const duplicate = items.find(({ id }) => id === "x-duplicate-schema");
  assert.ok(scoreItem(canonical, policy) > scoreItem(duplicate, policy) + 0.5);

  const receipt = scoreReceipt(canonical, policy);
  assert.equal(receipt.itemId, canonical.id);
  assert.equal(receipt.score, scoreItem(canonical, policy));
  assert.deepEqual(Object.keys(receipt.positive), Object.keys(policy.ranking.weights));
  assert.deepEqual(Object.keys(receipt.penalties), Object.keys(policy.ranking.penalties));
});

test("historical canonical clustering folds cross-posts without discarding source members", async () => {
  const items = await readJson("site/src/data/world-feed-sample.json");
  const clusters = clusterByCanonicalUrl(items);
  const releaseCluster = clusters.find(({ canonicalUrl }) => canonicalUrl === "https://example.invalid/hara/github/schema-release");

  assert.ok(releaseCluster);
  assert.equal(releaseCluster.members.length, 2);
  assert.equal(releaseCluster.sourceCount, 2);
  assert.deepEqual(releaseCluster.members.map(({ id }) => id), [
    "github-schema-release",
    "x-duplicate-schema"
  ]);
});

test("historical Hara-owned facts may auto-enter World hot while external relays stay reviewed", async () => {
  const [items, policy] = await Promise.all([
    readJson("site/src/data/world-feed-sample.json"),
    readJson("site/src/data/world-feed-policy.json")
  ]);
  const ranked = rankItems(items, policy);
  const release = ranked.find(({ id }) => id === "github-schema-release");
  const community = ranked.find(({ id }) => id === "x-work-algebra");

  assert.equal(relayMode(release, "world-hot", policy), "auto");
  assert.equal(relayMode(release, "x", policy), "review");
  assert.equal(relayMode(community, "world-hot", policy), "review");
  assert.equal(relayMode(community, "reddit", policy), "review");
});

test("historical relay envelopes retain attribution and stable receipts while blocking prohibited material", async () => {
  const [items, policy] = await Promise.all([
    readJson("site/src/data/world-feed-sample.json"),
    readJson("site/src/data/world-feed-policy.json")
  ]);
  const item = rankItems(items, policy).find(({ id }) => id === "x-work-algebra");
  const envelope = buildRelayEnvelope(item, "x", policy);

  assert.equal(envelope.status, "awaiting-review");
  assert.equal(envelope.canonicalUrl, item.canonicalUrl);
  assert.equal(envelope.sourceAuthor, item.author);
  assert.equal(envelope.sourcePlatform, item.source);
  assert.match(envelope.draft, /@mina_forms · X \/ Twitter/);
  assert.match(envelope.draft, /https:\/\/example\.invalid\/hara\/x\/work-algebra/);
  assert.equal(envelope.publicationReceipt, publicationReceipt(item, item.rankScore, "x"));
  assert.equal(relayDraft(item, "x").length <= 280, true);

  const blocked = buildRelayEnvelope({ ...item, flags: ["private-content"] }, "x", policy);
  assert.equal(blocked.mode, "blocked");
  assert.equal(blocked.publicationReceipt, null);
  assert.equal(blocked.draft, null);
});
