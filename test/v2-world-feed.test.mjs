import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageUrl = new URL("../site/src/pages/v2/world/feed/index.astro", import.meta.url);
const redirectUrl = new URL("../site/src/pages/v2/world/index.astro", import.meta.url);
const styleUrl = new URL("../site/src/styles/v2-world-feed.css", import.meta.url);
const policyUrl = new URL("../site/src/data/world-feed-policy.json", import.meta.url);
const feedUrl = new URL("../site/src/data/world-feed-sample.json", import.meta.url);

const { groupConversations, rankFeedItems, relayDecision, scoreFeedItem } = await import(
  "../site/src/lib/world-feed-ranking.mjs"
);

const [page, redirect, styles, policyText, feedText] = await Promise.all([
  readFile(pageUrl, "utf8"),
  readFile(redirectUrl, "utf8"),
  readFile(styleUrl, "utf8"),
  readFile(policyUrl, "utf8"),
  readFile(feedUrl, "utf8")
]);

const policy = JSON.parse(policyText);
const feed = JSON.parse(feedText);

test("World routes incoming visitors to the feed explorer", () => {
  assert.match(redirect, /v2\/world\/feed\//);
  assert.match(redirect, /window\.location\.replace/);
  assert.match(redirect, /Open World feed explorer/);
});

test("the World feed lab covers discovery, clustering, sources, and relay", () => {
  for (const anchor of ["feed", "conversations", "sources", "relay"]) {
    assert.match(page, new RegExp(`id=\\"${anchor}\\"`));
  }

  for (const label of [
    "GitHub",
    "Reddit",
    "X / Twitter",
    "Hacker News",
    "Substack",
    "RSS / JSON Feed"
  ]) {
    assert.ok(page.includes(label), `missing source label: ${label}`);
  }

  assert.match(page, /See what the Hara world is talking about/);
  assert.match(page, /Conversation clusters/);
  assert.match(page, /Source registry/);
  assert.match(page, /Hara Bot relay/);
  assert.match(page, /canonical attribution/);
  assert.match(page, /Human gate active/);
});

test("the relay screen makes its non-spam boundary explicit", () => {
  assert.match(page, /No autonomous replies/);
  assert.match(page, /Never auto/);
  assert.match(page, /does not manufacture engagement/);
  assert.match(page, /Publication receipt/);
  assert.match(page, /reviewer or trusted automation rule/);
});

test("the ingestion and relay policy is explicit data", () => {
  assert.equal(policy.version, 1);
  assert.equal(policy.mode, "review");
  assert.deepEqual(
    policy.ingestion.sources.map((source) => source.id),
    ["world", "github", "reddit", "x", "hacker-news", "substack", "rss"]
  );
  assert.equal(policy.relay.defaultMode, "review");
  assert.ok(policy.relay.neverAutomate.includes("replies"));
  assert.ok(policy.relay.neverAutomate.includes("comments"));
  assert.ok(policy.relay.required.includes("canonical-url"));
  assert.ok(policy.relay.required.includes("publication-receipt"));
  assert.ok(policy.relay.autoEligible.includes("hara-owned-release"));
});

test("feed ranking is deterministic and preserves source objects", () => {
  const ranked = rankFeedItems(feed, policy.ranking);
  const reranked = rankFeedItems([...feed].reverse(), policy.ranking);

  assert.equal(ranked.length, feed.length);
  assert.equal(ranked[0].id, "github-hara-typed-schema");
  assert.deepEqual(
    ranked.map(({ id, score }) => ({ id, score })),
    reranked.map(({ id, score }) => ({ id, score }))
  );
  assert.ok(ranked.every((item) => item.canonicalUrl && item.author && item.source));
  assert.ok(ranked.every((item) => item.score >= 0 && item.score <= 1));
  assert.equal(scoreFeedItem(feed[0], policy.ranking), ranked.find((item) => item.id === feed[0].id).score);
});

test("conversation grouping connects sources without merging their identity", () => {
  const groups = groupConversations(feed, policy.ranking);
  const schema = groups.find((group) => group.id === "schema-values");

  assert.ok(schema);
  assert.equal(schema.items.length, 2);
  assert.deepEqual(schema.sources.sort(), ["GitHub", "X / Twitter"]);
  assert.deepEqual(schema.items.map((item) => item.id).sort(), ["github-hara-typed-schema", "x-schema-thread"]);
});

test("relay decisions are narrow, attributable, and review-first", () => {
  const ownedRelease = feed.find((item) => item.id === "github-hara-typed-schema");
  const communityPost = feed.find((item) => item.id === "x-schema-thread");

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
  assert.equal(
    relayDecision({ ...communityPost, canonicalUrl: "" }, policy.relay).state,
    "blocked"
  );
  assert.equal(
    relayDecision({ ...communityPost, kind: "replies" }, policy.relay).state,
    "blocked"
  );
});

test("the World feed styling consumes shared v2 tokens", () => {
  assert.match(styles, /var\(--hara-v2-paper\)/);
  assert.match(styles, /var\(--hara-v2-panel-raised\)/);
  assert.match(styles, /var\(--hara-v2-signal\)/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.doesNotMatch(styles, /--hara-v2-[\w-]+\s*:/);
  assert.doesNotMatch(page, /<style(?:\s|>)/);
});
