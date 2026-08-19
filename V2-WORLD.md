# Hara World v2 application contract

Issue: [hara-lang/visual-language#42](https://github.com/hara-lang/visual-language/issues/42)

Primary acceptance surface: `/v2/world/`

Downstream implementation: [hara-lang/hara-world](https://github.com/hara-lang/hara-world)

## Product boundary

World is the focused public reader and durable discussion surface for Hara. It owns:

- reviewed native articles and package-release entries;
- Hot, New, Following, and Clippings discovery;
- clippings that preserve the canonical source and import evidence;
- durable comments, mentions, tombstones, moderation, and exact receipts;
- GitHub-backed contributor profiles;
- evidence projections for packages, namespaces, reviews, and badges;
- optional presence with explicit privacy controls;
- owned bots with a visible owner, owner presence, purpose, source set, policy, and receipt;
- Snippet of the Day;
- the weekly What’s New digest across web, email, and RSS.

World does not own structured teaching, package authority, namespace authority, specification authority, or production credentials. Those remain with Learn, Packages, Specs, identity services, source registries, and provider adapters.

Learning links may appear as a deliberate route out of World, but Learn is not a World navigation destination. The earlier community and onboarding studies remain under Learn as teaching material.

## Shared content contract

World consumes the `hara.world` schema namespace from `site/src/lib/v2-frontmatter.mjs` at version `2.0.0`.

The required content types are:

| Type | Purpose | Controlled boundary |
| --- | --- | --- |
| `world.article` | Original World article | identity, lifecycle, canonical route, revision, review, publication receipt |
| `world.clipping` | Imported excerpt or link with authored World context | canonical source, digest, retrieval, transformation, syndication, moderation |
| `world.feed` | Reviewed source registration | source identity, permission, health, lifecycle, import receipts |
| `world.profile` | GitHub-backed contributor profile | stable identity plus projected contribution evidence |
| `world.bot` | Automation with accountable ownership | owner, policy, purpose, sources, presence requirement, moderation |

Browser-editable context must never replace source-, registry-, identity-, reviewer-, or runtime-controlled facts.

## Acceptance screens

### 1. Front page

The public front page is useful before sign-in and exposes:

- Hot, New, Following, and Clippings;
- source type;
- original author;
- submitter;
- points, comments, and age;
- canonical URL and provenance;
- linked package, namespace, release, or review evidence;
- Snippet of the Day;
- reviewed source health;
- weekly digest preview.

Empty following, partial evidence, stale source, and moderated-item states each explain the next safe action.

### 2. Article and thread

An article keeps authorship, publication state, revision, review, and contribution evidence separate from discussion popularity.

Comments are durable addressable revisions. Required states are:

- published;
- collapsed with a reason and an inspectable exact revision;
- deleted with a tombstone and preserved reply topology;
- moderated with a reason and moderation receipt;
- offline composer with a local draft and no false success state.

Bot comments must show `BOT`, owner identity, owner presence, purpose, sources, policy, and comment receipt. A policy requiring an online owner disables replies while the owner is absent.

### 3. Clipping workflow

Capture fences:

- canonical HTTPS URL;
- original author;
- provider and source type;
- publication and retrieval times;
- source digest;
- permission evidence;
- import receipt;
- transformation identity and excerpt digest.

Authored context remains separately editable. Duplicate, source-unavailable, and unclear-permission states stop publication without discarding the private draft.

### 4. Feed directory and submission

The directory displays:

- source type and URL;
- accountable owner;
- permission and review receipt;
- cadence and approved entry count;
- active, stale, failing, and paused health states;
- last successful fetch or exact failure class.

Submission verifies control and permission before the first imported entry becomes eligible for World. RSS, Atom, JSON Feed, and OPML remain portable first-class interfaces.

### 5. Contributor profile

GitHub is the identity anchor. Package roles, namespace scopes, contribution counts, and badges are evidence projections, not self-authored authority.

Every authority-like fact names its registry or ledger and exact receipt. When evidence cannot refresh, the profile stays readable, new derived badges are suppressed, and existing facts are marked stale.

Owned bots appear on the accountable owner’s profile with their purpose and policy boundary.

### 6. Presence

Presence is optional, account-scoped, and hidden by default. Users control:

- online visibility;
- current activity disclosure;
- last-seen precision;
- whether owned bots may reply while the owner is online.

Presence never changes authorship, contribution evidence, review state, or public front matter. When presence is unavailable, people render offline and owner-present bot replies pause; reading and durable discussion continue.

### 7. What’s New digest

The digest selects already approved World objects into one fenced edition and projects it to:

- web;
- email;
- RSS.

Each destination retains a delivery receipt. Partial delivery does not invalidate successful projections; failed destinations retry idempotently from the same edition revision.

Required states are empty, draft, scheduled, published, and partial delivery failure.

## State contract

Semantic state identifiers are stable implementation inputs. They should not be reduced to colour-only styling.

| Family | Required states |
| --- | --- |
| Front page | loading, empty, partial, stale, moderated |
| Thread | published, collapsed, deleted, moderated, offline composer |
| Clipping | draft, duplicate, source unavailable, permission missing, published |
| Feeds | empty, awaiting review, active, stale, failing, paused |
| Profile | empty contributions, current, stale evidence, identity unavailable, suspended |
| Presence | online, away, recent, offline, hidden, service unavailable |
| Digest | empty, draft, scheduled, published, delivery failure |

Every state needs a text label, explanation, evidence boundary, and recovery or inspection action where one exists.

## Existing studies

The primary route is the acceptance surface. These remain reachable as references:

- `/v2/world/discussion/` — earlier focused discussion composition;
- `/v2/world/around/` — external signal, provenance, and review-first relay study;
- `/v2/world/feed/` — broad provider, clustering, ranking, and relay infrastructure;
- `/v2/world/community/` — Learn-owned community reader specimen;
- `/v2/world/onboarding/` — Learn-owned executable onboarding specimen.

They do not replace `/v2/world/` and should not re-expand the primary product boundary.

## Adoption in hara-world

The existing `hara-world` architecture already has the right publication spine:

- Neon for private drafts, workflow state, account state, and consent;
- Git for reviewed portable public content;
- merge as publication;
- `content/articles/community/` for native article records;
- `registry/sources.json` for approved RSS/Atom source permission and ownership;
- `scripts/sync-feeds.mjs` for bounded deterministic feed intake;
- release algebra for provider-independent projections;
- a credentialed provider outbox that returns structured receipts.

The next implementation steps are:

1. **Schema adoption.** Map native articles, clippings, source registrations, profiles, and bots to `hara.world` 2.0.0. Do not let browser payloads set identity, canonical source, moderation, or receipts.
2. **Reader views.** Project the Git-reviewed public plane into Hot, New, Following, and Clippings without changing the canonical publication record.
3. **Source health.** Project active, stale, failing, and paused states from `registry/sources.json` and `scripts/sync-feeds.mjs`, retaining last-success and failure evidence.
4. **Durable discussion.** Add a canonical comment collection with exact revisions, parent references, mentions, tombstones, moderation decisions, and bot disclosures. Neon may hold private drafts and mutation workflow; reviewed public records remain portable.
5. **Evidence projections.** Resolve profile package roles, namespace scopes, contribution activity, and badges from authoritative registries. A profile record must not grant authority.
6. **Presence service.** Keep presence in an account-scoped realtime/session boundary. It is not Git content and is not publication evidence.
7. **Bot enforcement.** Enforce owner, policy, source, purpose, and owner-presence requirements server-side. A disabled UI is not the authority.
8. **Digest projection.** Build the weekly edition from approved World objects and feed it into the existing release algebra/outbox with one edition revision and per-destination receipts.

## Accessibility and responsive contract

- all navigation and controls are keyboard reachable;
- focus is visible;
- source, moderation, health, presence, and bot states do not rely on colour alone;
- disabled bot replies explain why they are paused;
- collapsed comments use semantic disclosure;
- narrow layouts avoid document-level horizontal overflow;
- detailed desktop specimens may scroll inside their framed laboratory canvas;
- reduced motion removes decorative movement without removing state feedback.

## Validation

The repository acceptance commands are:

```sh
npm test
npm run site:build
```

The focused World tests also protect the shared content types, product boundary, provenance rules, bot owner-presence behavior, detailed screen inventory, state coverage, historical-study links, and `hara-world` adoption targets.
