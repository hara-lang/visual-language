// @ts-check

import { contentContracts } from "./v2-frontmatter.mjs";

const requiredWorldTypeIds = [
  "world.article",
  "world.clipping",
  "world.feed",
  "world.profile",
  "world.bot"
];

export const worldContentContract = contentContracts.find(({ id }) => id === "world");

if (!worldContentContract) {
  throw new Error("The shared hara.world front matter contract is required by the World laboratory.");
}

export const worldContentTypes = Object.freeze(worldContentContract.types.map((contentType) => ({ ...contentType })));
export const worldTypeIds = Object.freeze(worldContentTypes.map(({ id }) => id));

const missingWorldTypeIds = requiredWorldTypeIds.filter((id) => !worldTypeIds.includes(id));
if (missingWorldTypeIds.length > 0) {
  throw new Error(`The hara.world contract is missing: ${missingWorldTypeIds.join(", ")}`);
}

export const worldProductBoundary = Object.freeze({
  statement: "World is the focused community reader and durable discussion surface for Hara.",
  owns: [
    "articles and reviewed package-release entries",
    "Hot, New, Following, and Clippings discovery",
    "canonical clippings with source provenance",
    "durable comments, mentions, moderation, and receipts",
    "GitHub-backed contributor profiles and contribution evidence",
    "optional presence with explicit privacy controls",
    "owned bots with visible purpose, sources, policy, owner, and reply state",
    "Snippet of the Day and the weekly What’s New digest"
  ],
  excludes: [
    {
      capability: "structured lessons, exercises, progress, and guided projects",
      destination: "/v2/learn/",
      owner: "Learn"
    },
    {
      capability: "package publication and namespace authority",
      destination: "/v2/packages/",
      owner: "Packages"
    },
    {
      capability: "specification proposals and conformance authority",
      destination: "/v2/specs/",
      owner: "Specs"
    }
  ]
});

export const worldSections = Object.freeze([
  { id: "front-page", label: "Front page", detail: "Hot · New · Following · Clippings" },
  { id: "article-thread", label: "Article + thread", detail: "Durable comments and accountable bots" },
  { id: "clipping", label: "Clipping", detail: "Capture · context · provenance · review" },
  { id: "feeds", label: "Feed directory", detail: "Review, lifecycle, and source health" },
  { id: "profile", label: "Contributor profile", detail: "GitHub identity and evidence" },
  { id: "presence", label: "Presence", detail: "Optional, private by default" },
  { id: "digest", label: "What’s New", detail: "Web · email · RSS" }
]);

export const worldPrimaryNavigation = Object.freeze([
  { id: "hot", label: "Hot", count: 24 },
  { id: "new", label: "New", count: 18 },
  { id: "following", label: "Following", count: 7 },
  { id: "clippings", label: "Clippings", count: 12 }
]);

export const frontPageStories = Object.freeze([
  {
    id: "executor-store-boundary",
    contentType: "world.article",
    sourceType: "World article",
    title: "A smaller work algebra: executor and store as the durable ABI",
    summary: "A design note narrows work.* to explicit execution and storage boundaries, with runtime policy kept as ordinary data.",
    author: { name: "Mina Park", handle: "@mina_forms", github: "mina-forms" },
    submitter: { name: "Mina Park", handle: "@mina_forms" },
    canonicalUrl: "/world/articles/work-executor-store-abi/",
    provenance: "native · reviewed revision 8c2b",
    score: 84,
    comments: 23,
    age: "18 min",
    tags: ["work.*", "architecture"],
    evidence: [
      { kind: "package", label: "std.work", receipt: "pkg:std.work@7c11" },
      { kind: "namespace", label: "work.*", receipt: "ns:work.*@2f04" }
    ],
    state: "current"
  },
  {
    id: "typed-schema-runtime",
    contentType: "world.clipping",
    sourceType: "Reviewed clipping",
    title: "Schema becomes a runtime value in std.typed",
    summary: "A clipped implementation note retains the canonical pull request while adding community context about validation and tool.lint.",
    author: { name: "Chris Zheng", handle: "@hoebat", github: "hoebat" },
    submitter: { name: "Aya Chen", handle: "@aya_codes" },
    canonicalUrl: "https://github.com/hara-lang/hara/pull/842",
    provenance: "GitHub · sha256:9b7e… · import receipt 0118",
    score: 71,
    comments: 31,
    age: "44 min",
    tags: ["std.typed", "tool.lint"],
    evidence: [
      { kind: "pull request", label: "hara#842", receipt: "github:pr/842@9b7e" }
    ],
    state: "current"
  },
  {
    id: "hara-wasm-release",
    contentType: "world.feed",
    sourceType: "Package release",
    title: "hara-wasm-core 0.8.0 publishes session isolation receipts",
    summary: "A reviewed release feed entry links the package artifact, compatibility record, and exact source revision.",
    author: { name: "Hara release registry", handle: "@hara-packages", github: "hara-lang" },
    submitter: { name: "Package feed", handle: "registry source 04" },
    canonicalUrl: "/packages/hara-wasm-core/releases/0.8.0/",
    provenance: "package registry · signed artifact digest",
    score: 66,
    comments: 12,
    age: "2 h",
    tags: ["Wasm", "release"],
    evidence: [
      { kind: "release", label: "hara-wasm-core 0.8.0", receipt: "release:0.8.0@a61c" },
      { kind: "compatibility", label: "browser + WASI", receipt: "compat:a61c" }
    ],
    state: "current"
  },
  {
    id: "provider-question",
    contentType: "world.article",
    sourceType: "Discussion prompt",
    title: "What is the smallest useful provider contract for Historia imports?",
    summary: "A focused question asks where downloading, original-document storage, and indexing should meet without making the provider own the graph.",
    author: { name: "Noah Singh", handle: "@noah_graphs", github: "noah-graphs" },
    submitter: { name: "Noah Singh", handle: "@noah_graphs" },
    canonicalUrl: "/world/discussions/historia-provider-contract/",
    provenance: "native · publication receipt 8124",
    score: 53,
    comments: 19,
    age: "4 h",
    tags: ["historia", "providers"],
    evidence: [],
    state: "partial"
  }
]);

export const snippetOfTheDay = Object.freeze({
  contentType: "world.article",
  title: "Turn a value into inspectable work",
  code: "(work/spec\n  {:op :step\n   :id :code/list\n   :fn list-code-units})",
  author: "@sora_runtime",
  canonicalUrl: "/world/snippets/inspectable-work/",
  receipt: "snippet:2026-08-20@10e4",
  state: "published"
});

export const articleThread = Object.freeze({
  contentType: "world.article",
  title: "A smaller work algebra: executor and store as the durable ABI",
  dek: "What remains when orchestration policy, machine selection, and runtime maps stop pretending to be the algebra itself?",
  author: {
    name: "Mina Park",
    handle: "@mina_forms",
    github: "mina-forms",
    avatar: "MP"
  },
  publication: {
    canonicalUrl: "/world/articles/work-executor-store-abi/",
    revision: "sha256:8c2bca45…",
    receipt: "world:publication/8124",
    reviewedBy: "@hara-editorial",
    publishedAt: "20 Aug 2026 · 09:12 AEST"
  },
  paragraphs: [
    "Work should describe what must happen. An executor decides how a step runs, while a store remembers the exact boundaries that may be reused.",
    "The useful public ABI is therefore smaller than a universal runtime object: values remain ordinary data, capabilities stay explicit, and durable receipts can be inspected without adopting one scheduler.",
    "This note tests the idea against ephemeral execution, Postgres-backed checkpoints, and native interfaces without allowing any one provider to become the language model."
  ],
  evidence: [
    { label: "std.work package", value: "std.work@0.7.0", receipt: "pkg:std.work@7c11" },
    { label: "Namespace stewardship", value: "work.* · 3 maintainers", receipt: "ns:work.*@2f04" },
    { label: "Referenced proposal", value: "hara#861", receipt: "github:issue/861@6d72" }
  ],
  comments: [
    {
      id: "comment-1",
      state: "published",
      author: { name: "Aya Chen", handle: "@aya_codes", avatar: "AC" },
      age: "12 min",
      body: "The separation becomes much clearer when replay is described as a store decision rather than an executor feature.",
      receipt: "comment:1181@f90a",
      replies: 2
    },
    {
      id: "comment-2",
      state: "collapsed",
      author: { name: "Theo Grant", handle: "@theo_native", avatar: "TG" },
      age: "9 min",
      body: "Collapsed after readers marked this as tangential. The comment remains available with its exact revision and reason.",
      receipt: "comment:1184@a17f",
      moderation: "Reader-collapsed · 4 relevance flags",
      replies: 0
    },
    {
      id: "comment-3",
      state: "moderated",
      author: { name: "Removed contribution", handle: "identity retained for moderators", avatar: "—" },
      age: "7 min",
      body: "This revision is hidden because it exposed a private credential. A durable moderation receipt replaces the public body.",
      receipt: "moderation:554@19d0",
      moderation: "Credential exposure · reviewer @world-mod",
      replies: 0
    },
    {
      id: "comment-4",
      state: "deleted",
      author: { name: "Deleted by author", handle: "tombstone", avatar: "—" },
      age: "3 min",
      body: "The author deleted this comment. Replies and the deletion receipt remain addressable.",
      receipt: "deletion:1191@0bb2",
      replies: 1
    }
  ]
});

export const ownedBot = Object.freeze({
  contentType: "world.bot",
  name: "Hara Index",
  handle: "@hara-index",
  label: "BOT",
  owner: {
    name: "Mina Park",
    handle: "@mina_forms",
    profileUrl: "/world/people/mina-forms/",
    presence: "away",
    presenceLabel: "Away · last active 12 min ago"
  },
  purpose: "Attach package, namespace, specification, and publication evidence to discussions when an exact registry match exists.",
  sources: ["package registry", "namespace registry", "specification registry", "World publication receipts"],
  policy: {
    id: "world-bot-policy/17",
    receipt: "policy:17@sha256:4c0e…",
    mode: "owner-present replies",
    state: "active"
  },
  comment: "Evidence linked: std.work@0.7.0 is published under work.* and currently lists three maintainers. This is registry context, not an endorsement of the proposal.",
  commentReceipt: "bot-comment:1190@sha256:821e…"
});

/**
 * Owned bots may publish prepared evidence, but conversational replies require
 * an active policy and a visibly present accountable owner.
 * @param {{ ownerPresence: string, policyState?: string }} input
 */
export function botReplyState({ ownerPresence, policyState = "active" }) {
  if (policyState !== "active") {
    return {
      id: "paused-policy",
      canReply: false,
      label: "Replies paused",
      reason: "The owner must reactivate the bot policy before it can reply."
    };
  }

  if (ownerPresence !== "online") {
    return {
      id: "paused-owner-absent",
      canReply: false,
      label: "Reply when owner returns",
      reason: "This bot only joins live discussion while its accountable owner is online."
    };
  }

  return {
    id: "ready",
    canReply: true,
    label: "Reply with owner present",
    reason: "The owner is online and the active bot policy permits a reviewed reply."
  };
}

export const ownedBotReply = Object.freeze(botReplyState({
  ownerPresence: ownedBot.owner.presence,
  policyState: ownedBot.policy.state
}));

export const clippingWorkflow = Object.freeze({
  contentType: "world.clipping",
  source: {
    title: "Schema as a first-class runtime value",
    author: "Chris Zheng",
    provider: "GitHub",
    sourceType: "Pull request",
    canonicalUrl: "https://github.com/hara-lang/hara/pull/842",
    publishedAt: "19 Aug 2026 · 14:10 AEST",
    retrievedAt: "20 Aug 2026 · 08:42 AEST",
    sourceDigest: "sha256:9b7e7e0c…",
    permission: "Public repository · excerpt + link"
  },
  context: {
    title: "Why this matters to tool.lint",
    note: "The change gives lint facts a typed value that can travel through the shared registry boundary. The clipping adds this relationship without rewriting the pull request.",
    tags: ["std.typed", "tool.lint", "schema"]
  },
  transformation: {
    method: "title + 36-word excerpt + authored context",
    transformer: "world-clipping/2.0.0",
    excerptDigest: "sha256:3a9d6a81…"
  },
  importReceipt: "world:import/0118@sha256:667d…",
  publicationReceipt: "world:publication/8131@sha256:982b…",
  lifecycle: [
    { id: "capture", label: "Captured", detail: "Canonical URL and provider snapshot fenced.", state: "complete" },
    { id: "context", label: "Context added", detail: "Submitter note is stored separately from source facts.", state: "complete" },
    { id: "validate", label: "Validated", detail: "HTTPS, digest, attribution, and duplicate checks passed.", state: "complete" },
    { id: "review", label: "Reviewed", detail: "Excerpt scope and relevance approved by @world-editor.", state: "complete" },
    { id: "publish", label: "Published", detail: "Canonical source and exact import receipt remain visible.", state: "current" }
  ],
  failureStates: [
    { id: "duplicate", label: "Possible duplicate", detail: "A clipping already points to this canonical URL and revision.", action: "Open existing clipping" },
    { id: "source-unavailable", label: "Source unavailable", detail: "The provider snapshot failed; context remains a private draft.", action: "Retry capture" },
    { id: "permission-missing", label: "Permission unclear", detail: "Publish a link card only; do not retain an excerpt until reviewed.", action: "Request review" }
  ]
});

/**
 * Build the immutable provenance portion of a clipping. Author context is
 * intentionally separate so it cannot overwrite source-controlled facts.
 * @param {{ canonicalUrl: string, sourceDigest: string, importReceipt: string, context?: string }} input
 */
export function createClippingProvenance({ canonicalUrl, sourceDigest, importReceipt, context = "" }) {
  const parsed = new URL(canonicalUrl);
  if (parsed.protocol !== "https:") throw new Error("World clippings require an HTTPS canonical source.");
  if (!sourceDigest.startsWith("sha256:")) throw new Error("World clippings require a sha256 source digest.");
  if (!importReceipt.trim()) throw new Error("World clippings require an import receipt.");

  return Object.freeze({
    canonicalUrl: parsed.toString(),
    sourceDigest,
    importReceipt,
    context,
    controlled: ["canonicalUrl", "sourceDigest", "importReceipt"],
    editable: ["context"]
  });
}

export const clippingProvenance = createClippingProvenance({
  canonicalUrl: clippingWorkflow.source.canonicalUrl,
  sourceDigest: clippingWorkflow.source.sourceDigest,
  importReceipt: clippingWorkflow.importReceipt,
  context: clippingWorkflow.context.note
});

export const feedDirectory = Object.freeze({
  contentType: "world.feed",
  filters: ["All reviewed", "Package releases", "Community writing", "Paused", "Needs attention"],
  sources: [
    {
      id: "hara-packages",
      name: "Hara package releases",
      sourceType: "Package registry",
      url: "/packages/feed.json",
      owner: "hara-lang",
      status: "active",
      health: "Healthy · fetched 4 min ago",
      cadence: "On release",
      entries: 18,
      reviewReceipt: "source:04@771a"
    },
    {
      id: "kernel-notes",
      name: "Kernel Notes",
      sourceType: "Atom",
      url: "https://notes.example.org/hara/atom.xml",
      owner: "@aya_codes",
      status: "active",
      health: "Stale · last successful fetch 3 d ago",
      cadence: "Weekly",
      entries: 7,
      reviewReceipt: "source:17@09ce"
    },
    {
      id: "compiler-field-log",
      name: "Compiler Field Log",
      sourceType: "RSS",
      url: "https://field.example.org/rss.xml",
      owner: "@theo_native",
      status: "paused",
      health: "Failing · TLS validation",
      cadence: "Irregular",
      entries: 4,
      reviewReceipt: "source:21@442d"
    }
  ],
  submission: {
    url: "https://journal.example.org/hara/feed.xml",
    owner: "@noah_graphs",
    permission: "I control this feed and permit World to index titles, summaries, and canonical links.",
    lifecycle: ["Draft", "URL verified", "Permission reviewed", "Source approved", "First import reviewed"],
    state: "awaiting-permission-review",
    receipt: "source-proposal:44@a21e"
  },
  states: [
    { id: "empty", label: "No reviewed feeds", detail: "Show submission guidance without inventing content." },
    { id: "stale", label: "Source stale", detail: "Retain last reviewed entries and display the last successful fetch." },
    { id: "failing", label: "Source failing", detail: "Stop intake, expose the failure class, and preserve prior provenance." },
    { id: "paused", label: "Source paused", detail: "No future entries are imported until owner or reviewer resumes it." }
  ]
});

export const contributorProfile = Object.freeze({
  contentType: "world.profile",
  identity: {
    name: "Mina Park",
    handle: "@mina_forms",
    github: "mina-forms",
    githubId: "github:18420317",
    avatar: "MP",
    bio: "Runtime and tooling contributor focused on inspectable work and durable developer workflows.",
    joined: "May 2026",
    profileReceipt: "profile:mina-forms@06d1"
  },
  contributionSummary: [
    { value: 38, label: "merged contributions" },
    { value: 12, label: "reviewed articles" },
    { value: 4, label: "maintained packages" },
    { value: 2, label: "namespace scopes" }
  ],
  packages: [
    { name: "std.work", role: "Maintainer", version: "0.7.0", evidence: "package registry", receipt: "pkg:std.work@7c11" },
    { name: "tool.lint", role: "Contributor", version: "0.4.3", evidence: "merged changes", receipt: "contrib:tool.lint@923f" },
    { name: "historia.core", role: "Reviewer", version: "0.2.0", evidence: "review ledger", receipt: "review:historia@0dd8" }
  ],
  namespaces: [
    { name: "work.*", role: "Maintainer", scope: "runtime-neutral algebra", receipt: "ns:work.*@2f04" },
    { name: "tool.lint.*", role: "Delegate", scope: "schema diagnostics", receipt: "ns:tool.lint.*@41ad" }
  ],
  badges: [
    { label: "Package maintainer", evidence: "4 active package grants", receipt: "badge:maintainer@7ad1" },
    { label: "Review steward", evidence: "26 accepted reviews", receipt: "badge:review@111f" },
    { label: "Source owner", evidence: "1 reviewed Atom feed", receipt: "badge:source@09ce" }
  ],
  activity: [
    { kind: "article", title: "A smaller work algebra", age: "18 min", receipt: "world:publication/8124" },
    { kind: "review", title: "Reviewed std.typed schema note", age: "1 d", receipt: "review:118@00c4" },
    { kind: "release", title: "Published std.work 0.7.0", age: "4 d", receipt: "release:std.work/0.7.0" }
  ],
  unavailableState: {
    label: "Identity evidence unavailable",
    detail: "Keep the last reviewed profile visible, mark evidence stale, and suppress newly derived badges."
  }
});

export const presenceModel = Object.freeze({
  default: "hidden",
  privacy: "Presence is opt-in, account-scoped, and never written into article front matter or public contribution receipts.",
  people: [
    { name: "Mina Park", handle: "@mina_forms", avatar: "MP", state: "away", label: "Away", detail: "last active 12 min ago", sharesActivity: true },
    { name: "Aya Chen", handle: "@aya_codes", avatar: "AC", state: "online", label: "Online", detail: "reading this thread", sharesActivity: true },
    { name: "Theo Grant", handle: "@theo_native", avatar: "TG", state: "recent", label: "Recently active", detail: "active 38 min ago", sharesActivity: false },
    { name: "Private member", handle: "presence hidden", avatar: "—", state: "hidden", label: "Hidden", detail: "no last-seen disclosure", sharesActivity: false }
  ],
  settings: [
    { id: "visibility", label: "Show when I am online", value: "Following only", state: "selected" },
    { id: "activity", label: "Show current activity", value: "Off", state: "selected" },
    { id: "last-seen", label: "Show last active time", value: "Approximate", state: "selected" },
    { id: "bots", label: "Allow owned bots to reply", value: "Only while online", state: "selected" }
  ],
  degraded: {
    label: "Presence service unavailable",
    detail: "Discussion remains fully readable and writable. Everyone appears offline; bots that require owner presence pause replies."
  }
});

export const worldDigest = Object.freeze({
  title: "What’s New in Hara · 20–27 August 2026",
  status: "scheduled",
  issue: 18,
  intro: "Five reviewed signals from packages, World articles, clippings, and durable discussions—each linked to its canonical source.",
  sections: [
    {
      label: "Shipped",
      items: [
        { title: "hara-wasm-core 0.8.0", sourceType: "Package release", canonicalUrl: "/packages/hara-wasm-core/releases/0.8.0/", receipt: "release:a61c" },
        { title: "Front matter contract 2.0", sourceType: "World article", canonicalUrl: "/world/articles/front-matter-contract/", receipt: "world:8110" }
      ]
    },
    {
      label: "Discussed",
      items: [
        { title: "Executor and store as the work ABI", sourceType: "World thread", canonicalUrl: "/world/articles/work-executor-store-abi/", receipt: "world:8124" },
        { title: "Historia provider boundary", sourceType: "Discussion prompt", canonicalUrl: "/world/discussions/historia-provider-contract/", receipt: "world:8128" }
      ]
    },
    {
      label: "Clipped",
      items: [
        { title: "Schema as a runtime value", sourceType: "Reviewed clipping", canonicalUrl: "/world/clippings/schema-runtime-value/", receipt: "world:8131" }
      ]
    }
  ],
  outputs: [
    { id: "web", label: "Web edition", status: "preview ready", receipt: "digest:web/18@0c1a" },
    { id: "email", label: "Email", status: "1,248 confirmed subscribers", receipt: "digest:email/18@a19e" },
    { id: "rss", label: "RSS", status: "portable full-text summary", receipt: "digest:rss/18@77d0" }
  ],
  subscription: {
    state: "confirmed",
    frequency: "Weekly",
    formats: ["Email", "RSS"],
    consentReceipt: "subscription:9481@dc01"
  },
  states: [
    { id: "empty", label: "No eligible items", detail: "Do not publish an edition; explain the skipped week in the archive." },
    { id: "draft", label: "Editorial draft", detail: "Selection and framing remain private and mutable." },
    { id: "scheduled", label: "Scheduled", detail: "Exact content and destination previews are fenced before delivery." },
    { id: "published", label: "Published", detail: "Web, email, and RSS outputs each retain a delivery receipt." },
    { id: "delivery-failure", label: "Partial delivery", detail: "Successful channels stay published; failed adapters can retry idempotently." }
  ]
});

export const worldStateCoverage = Object.freeze({
  frontPage: ["loading", "empty", "partial", "stale", "moderated"],
  thread: ["published", "collapsed", "deleted", "moderated", "offline-composer"],
  clipping: ["draft", "duplicate", "source-unavailable", "permission-missing", "published"],
  feeds: ["empty", "awaiting-review", "active", "stale", "failing", "paused"],
  profile: ["empty-contributions", "current", "stale-evidence", "identity-unavailable", "suspended"],
  presence: ["online", "away", "recent", "offline", "hidden", "service-unavailable"],
  digest: ["empty", "draft", "scheduled", "published", "delivery-failure"]
});

export const historicalWorldStudies = Object.freeze([
  {
    id: "discussion",
    label: "Focused discussion study",
    path: "/v2/world/discussion/",
    summary: "Earlier article, feed, clipping, comments, presence, profile, and bot ownership exploration."
  },
  {
    id: "around",
    label: "Around Hara study",
    path: "/v2/world/around/",
    summary: "External signal discovery, provenance, moderation, and review-first relay exploration."
  },
  {
    id: "feed",
    label: "Cross-source feed study",
    path: "/v2/world/feed/",
    summary: "Broad source-provider, clustering, ranking, and relay infrastructure retained for reference."
  },
  {
    id: "community",
    label: "Community reader study",
    path: "/v2/world/community/",
    summary: "Earlier community composition retained as a Learn-owned teaching specimen."
  },
  {
    id: "onboarding",
    label: "Programmer onboarding study",
    path: "/v2/world/onboarding/",
    summary: "Executable onboarding exploration retained under Learn, outside World navigation."
  }
]);

export const haraWorldAdoption = Object.freeze([
  {
    id: "contract",
    label: "Adopt the shared content contract",
    target: "Astro content collections + registry validation",
    detail: "Map native articles, clippings, source registrations, profiles, and owned bots to hara.world 2.0.0 without allowing browser input to set identity, canonical source, moderation, or receipts."
  },
  {
    id: "native-publication",
    label: "Keep review as publication",
    target: "content/articles/community/ + /post proposal flow",
    detail: "Neon remains private draft and workflow state. Merged portable records remain the public feed source."
  },
  {
    id: "feed-intake",
    label: "Expose reviewed source health",
    target: "registry/sources.json + scripts/sync-feeds.mjs",
    detail: "Project active, stale, failing, and paused source states into the directory while preserving permission and import receipts."
  },
  {
    id: "discussion",
    label: "Add durable discussion records",
    target: "new canonical comment collection + private composer state",
    detail: "Publish comments, mentions, tombstones, moderation decisions, and bot disclosures as addressable revisions rather than ephemeral card state."
  },
  {
    id: "identity-evidence",
    label: "Separate profile from authority",
    target: "public profile records + package/namespace registries",
    detail: "GitHub identity anchors the profile; package roles, namespace scopes, and badges are projections with named evidence receipts."
  },
  {
    id: "presence",
    label: "Keep presence ephemeral and optional",
    target: "account-scoped realtime/session service",
    detail: "Presence never changes public contribution records. A service outage degrades to offline and pauses owner-present bot replies."
  },
  {
    id: "digest",
    label: "Drive digest from approved World objects",
    target: "release algebra + provider outbox",
    detail: "Generate web, email, and RSS projections from one fenced edition, retaining per-destination delivery receipts and idempotent retry."
  }
]);

export const worldInventory = Object.freeze({
  screens: worldSections.length,
  contentTypes: worldContentTypes.length,
  frontPageModes: worldPrimaryNavigation.length,
  stateFamilies: Object.keys(worldStateCoverage).length,
  stateVariants: Object.values(worldStateCoverage).reduce((total, states) => total + states.length, 0),
  historicalStudies: historicalWorldStudies.length,
  adoptionSteps: haraWorldAdoption.length
});
