import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const focusedPageUrl = new URL("../site/src/pages/world/feed/index.astro", import.meta.url);
const canonicalPageUrl = new URL("../site/src/pages/world/index.astro", import.meta.url);
const styleUrl = new URL("../site/src/styles/v2-world-feed.css", import.meta.url);
const sharedCalmStyleUrl = new URL("../src/v2/calm-surfaces.css", import.meta.url);
const policyUrl = new URL("../site/src/data/world-feed-policy.json", import.meta.url);
const feedUrl = new URL("../site/src/data/world-feed-sample.json", import.meta.url);

const {
  groupConversations,
  normaliseFeedItem,
  rankFeedItems,
  relayDecision,
  scoreFeedItem
} = await import("../site/src/lib/world-feed-ranking.mjs");

const [focusedPage, canonicalPage, styles, sharedCalmStyles, policyText, feedText] = await Promise.all([
  readFile(focusedPageUrl, "utf8"),
  readFile(canonicalPageUrl, "utf8"),
  readFile(styleUrl, "utf8"),
  readFile(sharedCalmStyleUrl, "utf8"),
  readFile(policyUrl, "utf8"),
  readFile(feedUrl, "utf8")
]);

const policy = JSON.parse(policyText);
const feed = JSON.parse(feedText);

test("World keeps its canonical cross-source route and a focused data-driven feed reference", () => {
  for (const anchor of ["feed-explorer", "sources", "conversation", "relay"])
    assert.match(canonicalPage, new RegExp(`id=\\"${anchor}\\"`));

  assert.match(focusedPage, /v2\/world\/feed\//);
  assert.match(focusedPage, /const worldLab = `\$\{basePath\}v2\/world\/`/);
  assert.match(focusedPage, /← Existing World study/);
});

test("the focused World feed lab covers discovery, clustering, sources, and relay", () => {
  for (const anchor of ["feed", "conversations", "sources", "relay"])
    assert.match(focusedPage, new RegExp(`id=\\"${anchor}\\"`));

  for (const label of [
    "GitHub",
    "Reddit",
    "X / Twitter",
    "Hacker News",
    "Substack",
    "RSS / JSON Feed"
  ]) assert.ok(focusedPage.includes(label), `missing source label: ${label}`);

  assert.match(focusedPage, /See what the Hara world is talking about/);
  assert.match(focusedPage, /Conversation clusters/);
  assert.match(focusedPage, /Source registry/);
  assert.match(focusedPage, /Hara Bot relay/);
  assert.match(focusedPage, /canonical attribution/);
  assert.match(focusedPage, /Human gate active/);
});

test("the relay screen makes its non-spam boundary explicit", () => {
  assert.match(focusedPage, /No autonomous replies/);
  assert.match(focusedPage, /Never auto/);
  assert.match(focusedPage, /does not manufacture engagement/);
  assert.match(focusedPage, /Publication receipt/);
  assert.match(focusedPage, /reviewer or trusted automation rule/);
});

test("the ingestion and relay policy is explicit and complete data", () => {
  assert.equal(policy.version, 1);
  assert.equal(policy.mode, "review");
  assert.deepEqual(
    policy.ingestion.sources.map((source) => source.id),
    ["world", "github", "reddit", "x", "hacker-news", "substack", "rss"]
  );
  assert.ok(policy.ingestion.sources.every((source) => source.trust >= 0 && source.trust <= 1));
  assert.equal(policy.relay.defaultMode, "review");
  assert.ok(policy.relay.neverAutomate.includes("replies"));
  assert.ok(policy.relay.neverAutomate.includes("comments"));
  assert.ok(policy.relay.required.includes("canonical-url"));
  assert.ok(policy.relay.required.includes("publication-receipt"));
  assert.ok(policy.relay.autoEligible.includes("hara-owned-release"));
});

test("feed normalization retains source facts while deriving reference conveniences", () => {
  const release = feed.find((item) => item.id === "github-schema-release");
  const normalized = normaliseFeedItem(release);

  assert.equal(normalized.id, release.id);
  assert.equal(normalized.canonicalUrl, release.canonicalUrl);
  assert.equal(normalized.author, release.author);
  assert.equal(normalized.excerpt, release.summary);
  assert.equal(normalized.owned, true);
  assert.deepEqual(normalized.topics, ["std.typed", "schema", "runtime"]);
  assert.equal(normalized.clusterId, "schema-values");
});

test("feed ranking is deterministic and preserves normalized source objects", () => {
  const ranked = rankFeedItems(feed, policy.ranking);
  const reranked = rankFeedItems([...feed].reverse(), policy.ranking);

  assert.equal(ranked.length, feed.length);
  assert.equal(ranked[0].id, "github-schema-release");
  assert.deepEqual(
    ranked.map(({ id, score }) => ({ id, score })),
    reranked.map(({ id, score }) => ({ id, score }))
  );
  assert.ok(ranked.every((item) => item.canonicalUrl && item.author && item.source));
  assert.ok(ranked.every((item) => Array.isArray(item.topics) && typeof item.excerpt === "string"));
  assert.ok(ranked.every((item) => item.score >= 0 && item.score <= 1));
  assert.equal(scoreFeedItem(feed[0], policy.ranking), ranked.find((item) => item.id === feed[0].id).score);
});

test("conversation grouping connects sources without merging their identity", () => {
  const groups = groupConversations(feed, policy.ranking);
  const schema = groups.find((group) => group.id === "schema-values");

  assert.ok(schema);
  assert.equal(schema.items.length, 2);
  assert.deepEqual([...schema.sources].sort(), ["GitHub", "X / Twitter"]);
  assert.deepEqual(schema.items.map((item) => item.id).sort(), ["github-schema-release", "x-duplicate-schema"]);
  assert.ok(schema.items.every((item) => item.canonicalUrl === "https://example.invalid/hara/github/schema-release"));
});

test("relay decisions are narrow, attributable, and review-first", () => {
  const ownedRelease = feed.find((item) => item.id === "github-schema-release");
  const communityPost = feed.find((item) => item.id === "x-work-algebra");

  assert.deepEqual(relayDecision(ownedRelease, policy.relay), {
    state: "auto-eligible",
    reason: "trusted-owned-event",
    missing: []
  });
  assert.deepEqual(relayDecision(communityPost, policy.relay), {
    state: "review",
    reason: "community-content",
    missing: []
  });
  assert.equal(relayDecision({ ...communityPost, canonicalUrl: "" }, policy.relay).state, "blocked");
  assert.equal(relayDecision({ ...communityPost, kind: "replies" }, policy.relay).state, "blocked");
});

test("the World feed styling consumes shared v2 tokens and the shared motion contract", () => {
  assert.match(styles, /var\(--hara-v2-canvas-clean\)/);
  assert.match(styles, /var\(--hara-v2-panel-raised\)/);
  assert.match(styles, /var\(--hara-v2-signal\)/);
  assert.match(focusedPage, /import "\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/src\/v2\.css"/);
  assert.match(sharedCalmStyles, /prefers-reduced-motion/);
  assert.doesNotMatch(styles, /--hara-v2-[\w-]+\s*:/);
  assert.doesNotMatch(focusedPage, /<style(?:\s|>)/);
});
