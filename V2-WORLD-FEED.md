# Hara World feed explorer

This field study narrows Hara World into a public reading and discussion layer for the programming language. It is designed for an incoming visitor who does not yet know which repository, package, project, or community channel to follow.

The primary study lives at `/v2/world/feed/`. `/v2/world/` advances to that route so the existing World launcher in the v2 document reference becomes feed-first.

## Product shape

World is not a replacement for GitHub, Reddit, X / Twitter, Hacker News, Substack, RSS, or JSON Feed. It indexes public source objects and retains the original author, platform, publication time, canonical URL, and source metrics. The interface adds four things:

1. **Feed explorer** — hot, new, rising, source, topic, repository, article, and runnable-object views.
2. **Conversation clusters** — a navigable relationship between a release, social post, discussion, essay, or follow-up without merging their identities.
3. **Source registry** — inspectable queries, cadence, transport, trust, submitted feeds, dedupe rules, and removal controls.
4. **Hara Bot relay** — a review-first queue for amplifying useful Hara work to World, X / Twitter, Hara-owned Reddit communities, Matrix or Discord channels, and the What’s New newsletter.

Learning material remains outside World. World may surface a runnable snippet or link to a learning object, but it is not a course portal.

## Source envelope

Every provider adapter should emit the same minimum envelope before ranking:

```clojure
{:source/id          :github
 :source/object-id   "…"
 :source/author      "hara-lang"
 :source/published   #inst "2026-08-19T08:45:00Z"
 :source/canonical   "https://github.com/hara-lang/hara/…"
 :content/kind       :hara-owned-release
 :content/title      "…"
 :content/summary    "…"
 :content/topics     #{:std.typed :schema}
 :content/metrics    {:reactions 31 :comments 12 :shares 9}
 :content/hash       "…"
 :ingestion/provider :github-api
 :ingestion/receipt  "…"}
```

Platform response objects stay inside provider adapters. Ranking, clustering, moderation, and relay consume the source envelope.

## Ranking

`site/src/lib/world-feed-ranking.mjs` provides the deterministic preview used by the study. The policy is data in `site/src/data/world-feed-policy.json`.

The positive score combines:

- Hara relevance — whether the object is materially about Hara, its packages, projects, or programming model.
- Engagement velocity — rate rather than raw lifetime popularity.
- Source trust — provenance and source-policy confidence, not prestige.
- Freshness — time-window relevance.
- Conversation depth — substantive follow-up and discussion.
- Novelty — whether the item adds new information.

Duplicate, same-author, and same-source saturation penalties keep one post, author, or platform from occupying the whole surface. Stable tie-breaks make the preview reproducible.

This score is a World discovery score. It is not a universal quality score and should never be presented as one.

## Conversation clustering

A cluster is a relationship record, not a new source object. The production form should retain:

```clojure
{:cluster/id       "schema-values"
 :cluster/members  [source-object-id …]
 :cluster/evidence [{:kind :canonical-link :weight 1.0}
                    {:kind :topic-overlap :weight 0.8}
                    {:kind :time-window :weight 0.5}]
 :cluster/policy   1
 :cluster/review   {:state :open}}
```

A moderator can split an incorrect cluster, add an omitted source, or mark a relationship as disputed. The correction is retained as a moderation receipt.

World comments may refer to a source object or cluster. They do not masquerade as replies on the external platform. Sending a reply elsewhere is a separate, explicit destination action.

## Relay automation

The relay is deliberately split into durable boundaries:

```text
source adapters
  → normalised source envelope
  → dedupe and removal check
  → deterministic rank
  → relay candidate
  → policy decision
  → destination-specific draft
  → human review or narrow trusted rule
  → external provider effect
  → publication receipt
```

A useful Hara implementation can model this as work rather than a monolithic cron handler:

```clojure
{:op :chain
 :id :world/relay-candidate
 :work [{:op :step :id :world/ingest}
        {:op :pure :id :world/normalise}
        {:op :step :id :world/dedupe}
        {:op :pure :id :world/rank}
        {:op :pure :id :world/policy}
        {:op :step :id :world/review}
        {:op :step :id :world/publish}
        {:op :step :id :world/receipt}]}
```

The external publish step is capability-scoped by destination. A Reddit provider cannot publish to X; a newsletter provider cannot reply to a GitHub issue. Provider credentials never enter the source object, ranking policy, draft, or receipt.

### Review-first default

Community content always enters review. A high score can nominate an item; it cannot directly authorize an external Hara account.

A reviewer chooses:

- whether the item should be amplified;
- destination or destinations;
- final wording and media;
- publication time;
- whether the draft is an attributed link, a short digest, or a newsletter inclusion.

### Narrow auto-eligibility

Only these first-party facts are auto-eligible in the prototype policy:

- Hara-owned release announcements;
- security advisories;
- a scheduled snippet-of-the-day object.

Auto-eligible does not mean immediate publication. Canonical metadata, dedupe, cooldown, destination capability, account state, and final receipt checks still have to pass.

### Never automated

The prototype policy forbids autonomous:

- replies or comments;
- quote-post arguments;
- private, deleted, blocked, or opted-out content;
- reposts without a canonical link and source author;
- synthetic engagement or generated conversations.

This prevents the Hara Bot from becoming a spam or engagement-manipulation system.

## Destination draft

A destination adapter receives an approved draft, not a raw ranked object:

```clojure
{:draft/id          "…"
 :draft/source      source-object-id
 :draft/policy      1
 :draft/reviewer    github-user-id
 :draft/destination :x
 :draft/text        "…"
 :draft/canonical   "https://…"
 :draft/media       []
 :draft/not-before  #inst "…"
 :draft/hash        "…"}
```

The draft must visibly attribute community work. The canonical source URL is mandatory even when the destination can generate a rich preview.

## Publication receipt

Every attempted outbound effect produces a receipt:

```clojure
{:receipt/id            "…"
 :receipt/source        source-object-id
 :receipt/draft         draft-id
 :receipt/policy        1
 :receipt/authorization {:kind :human-review :actor github-user-id}
 :receipt/destination   :x
 :receipt/text-hash     "…"
 :receipt/provider-id   "…"
 :receipt/status        :published
 :receipt/attempt       1
 :receipt/published-at  #inst "…"}
```

Failed, rejected, superseded, cancelled, and removed attempts are also receipts. This allows retries to be idempotent and makes outbound activity auditable.

## Production boundary

This visual-language pull request does not:

- connect to external platform APIs;
- add platform credentials or secrets;
- publish, reply, comment, vote, or subscribe anywhere;
- scrape private or authenticated content;
- change any `*.hara-world.org` deployment.

It supplies the interaction model, source and ranking policy, deterministic sample ranking, relay decisions, and tests. A production implementation should bind the same contracts to explicit provider adapters, durable work execution, moderation, and account-level capabilities in the appropriate runtime repository.
