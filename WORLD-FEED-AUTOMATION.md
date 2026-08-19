# Hara World feed explorer and relay contract

This document defines the product boundary visualized by the World v2 laboratory. It is an implementation contract for a future Hara World ingestion service and Hara Bot relay worker; it does not activate production social accounts from the visual-language repository.

## Product role

Hara World is the public reading and conversation layer for the Hara ecosystem. It should feel closer to a focused Reddit or Hacker News reader than a general social network:

- collect useful Hara material from the open web;
- preserve the original author, platform, canonical URL, and publication time;
- cluster copies and cross-platform discussion around one canonical story;
- rank transparently enough that an operator can inspect why something is hot;
- let a visitor move from an external item into a World discussion, project, maintainer, package, or repository;
- keep tutorials and structured courses at `learn.hara-lang.org` rather than making World responsible for every product surface.

The first source set is Hara World, GitHub, Reddit, X / Twitter, Hacker News, Substack, RSS, and JSON Feed. OPML remains a portable subscription format.

## Normalized item

Every provider lowers source material into the same minimum envelope:

```text
id
source / sourceLabel
author
title / summary
canonicalUrl
publishedAt
kind / ownership
signals
metrics
```

Provider-specific payloads may be retained for auditing, but ranking and presentation consume the normalized envelope. Deleted, private, or no-longer-public material must be tombstoned rather than silently copied into a permanent World object.

## Ranking

The prototype ranker is deterministic. A score is the weighted sum of:

- Hara relevance — whether the item is substantively about Hara rather than a keyword collision;
- engagement velocity — recent response relative to the source's normal scale;
- source trust — identity, provenance, and provider confidence, not prestige;
- freshness — decay inside the selected time window;
- conversation depth — substantive replies and linked discussion;
- novelty — information not already represented by the canonical cluster.

It subtracts duplicate, same-author saturation, and same-source saturation penalties. Stable item IDs break ties. A score receipt records every contribution so operators can inspect ordering and tune policy without rewriting historical facts.

Ranking is discovery, not endorsement. Source badges and canonical links remain visible at every rank.

## Conversation clustering

Canonical URL is the first clustering key. Providers may add explicit equivalence evidence when a release, article, tweet, Reddit submission, and Hacker News discussion refer to the same underlying event. The cluster keeps:

- one canonical story summary;
- every source link and author attribution;
- source-local engagement counts without pretending they are directly comparable;
- a World discussion thread that links outward instead of replacing the original discussion;
- merge and split receipts for moderation.

A link-only repost should normally contribute activity to the cluster rather than occupy another top-level feed position.

## Hara Bot relay boundary

Hara Bot is an attributed relay, not an autonomous engagement persona.

### Default behavior

External destinations are review-gated:

- Hara Bot on X / Twitter;
- Hara-owned Reddit communities;
- Matrix or Discord announcement channels;
- the What's New newsletter.

World's own `What's hot` module may update automatically because it is a ranked view of already-ingested public facts, not a new external publication.

### Narrow automatic eligibility

Only these Hara-owned facts may bypass a human review step, and only for destinations whose policy is explicitly `auto`:

- Hara-owned releases;
- security advisories;
- scheduled Snippet of the Day posts.

Community posts, third-party articles, quotes, commentary, replies, and conversation summaries remain review-gated even when they score highly.

### Never automate

The relay must block:

- replies and comments presented as standalone posts;
- private or deleted content;
- unattributed quotes;
- a quote or summary without its canonical link;
- a destination inside its cooldown window;
- a duplicate publication receipt;
- content whose source terms prohibit redistribution.

### Required publication envelope

Every proposed relay contains:

- canonical URL;
- source author;
- source platform;
- rank score and score receipt;
- destination and policy mode;
- generated draft;
- cooldown and deduplication key;
- immutable publication receipt after delivery.

Edits to a generated draft are stored as operator decisions rather than changing the ingested source record.

## Provider and worker shape

The production service should separate four concerns:

1. **Providers** fetch or receive source events and normalize them.
2. **Store** keeps source snapshots, canonical clusters, moderation state, ranking receipts, and relay receipts.
3. **Ranker** produces inspectable ordered views from normalized signals and policy.
4. **Relay worker** consumes approved publication envelopes and performs idempotent destination effects.

A destination effect is complete only when the provider returns a durable external identifier. Retries use the same publication receipt and must not create a second post.

## Prototype files

- `site/src/data/world-feed-policy.json` — source, ranking, and relay policy;
- `site/src/data/world-feed-sample.json` — normalized illustrative input;
- `scripts/world-feed-rank.mjs` — deterministic score and canonical clustering preview;
- `scripts/world-feed-relay.mjs` — review/auto decision and publication-envelope preview;
- `/v2/world/` — feed, source, conversation, and relay interface study.

No API credentials, account tokens, production webhooks, or live posting effects belong in this repository.
