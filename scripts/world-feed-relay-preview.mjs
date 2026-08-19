#!/usr/bin/env node

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { rankFeedItems, relayDecision } from "../site/src/lib/world-feed-ranking.mjs";

const root = new URL("../", import.meta.url);
const policy = JSON.parse(await readFile(new URL("site/src/data/world-feed-policy.json", root), "utf8"));
const feed = JSON.parse(await readFile(new URL("site/src/data/world-feed-sample.json", root), "utf8"));
const threshold = 0.75;

export const buildRelayPreview = (items = feed, relayPolicy = policy) => {
  const ranked = rankFeedItems(items, relayPolicy.ranking);

  return {
    generatedBy: fileURLToPath(import.meta.url),
    policyVersion: relayPolicy.version,
    mode: relayPolicy.relay.defaultMode,
    threshold,
    candidates: ranked
      .filter((item) => item.score >= threshold)
      .map((item) => ({
        id: item.id,
        source: item.source,
        sourceAuthor: item.author,
        canonicalUrl: item.canonicalUrl,
        score: item.score,
        decision: relayDecision(item, relayPolicy.relay),
        destinations: relayPolicy.relay.destinations.map(({ id, mode }) => ({ id, mode })),
        draft: {
          text: `${item.title} — ${item.author} on ${item.sourceLabel}`,
          canonicalUrl: item.canonicalUrl
        }
      }))
  };
};

const preview = buildRelayPreview();

if (process.argv.includes("--check")) {
  assert.equal(preview.mode, "review");
  assert.ok(preview.candidates.length > 0);
  assert.ok(preview.candidates.every((candidate) => candidate.sourceAuthor));
  assert.ok(preview.candidates.every((candidate) => candidate.canonicalUrl));
  assert.ok(preview.candidates.every((candidate) => candidate.decision.state !== "blocked"));
  assert.ok(
    preview.candidates
      .filter((candidate) => candidate.decision.state === "auto-eligible")
      .every((candidate) => feed.find((item) => item.id === candidate.id)?.owned === true)
  );
  process.stdout.write(`World relay preview valid: ${preview.candidates.length} candidates under policy v${preview.policyVersion}.\n`);
} else {
  process.stdout.write(`${JSON.stringify(preview, null, 2)}\n`);
}
