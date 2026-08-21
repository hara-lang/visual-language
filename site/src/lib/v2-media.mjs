import { createHash } from "node:crypto";

const stableHash = (value) => createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 16);

export const deliveryFormats = Object.freeze([
  { id: "email", label: "Email", ratio: "600 px column", channel: "inbox", interactive: false },
  { id: "print", label: "Print / PDF", ratio: "A4 / Letter", channel: "document", interactive: false },
  { id: "og", label: "Open Graph", ratio: "40:21", channel: "social", interactive: false },
  { id: "square", label: "Square", ratio: "1:1", channel: "social", interactive: false },
  { id: "portrait", label: "Portrait", ratio: "4:5", channel: "social", interactive: false },
  { id: "story", label: "Story", ratio: "9:16", channel: "social", interactive: false },
  { id: "text", label: "Plain text", ratio: "linear", channel: "static", interactive: false }
]);

export const deliveryFixtureNotice = Object.freeze({
  id: "hara-v2-media-2026-08",
  label: "Deterministic delivery fixtures",
  productionAuthority: false,
  summary: "These artifacts demonstrate Hara projection and provenance rules. Application repositories, registries, runtimes and reviewers remain authoritative for the content, revisions, measurements and receipts exported in production."
});

const storyBase = {
  id: "std-work-0-4-2",
  type: "package-release",
  template: "release-story",
  title: "std.work 0.4.2 makes executor and store boundaries explicit",
  shortTitle: "std.work 0.4.2",
  deck: "A smaller public work algebra with separate executor and store interfaces, portable receipts and migration notes.",
  proofLabel: "Portable boundary",
  proofValue: "5 hosts · 1 work value",
  canonicalUrl: "https://packages.hara-lang.org/std.work/0.4.2/",
  sourceIdentity: "package:std.work",
  sourceRevision: "package:std.work@0.4.2+sha.8bd2c741",
  authority: "Hara package registry",
  status: "current",
  locale: "en-AU",
  direction: "ltr",
  generatedAt: "2026-08-21T09:30:00+10:00",
  staleAfter: "2026-09-21T09:30:00+10:00",
  callToAction: "Read the release and migration notes",
  altText: "Hara package release card for std.work 0.4.2. The release makes executor and store boundaries explicit and reports one portable work value across five hosts.",
  plainText: [
    "STD.WORK 0.4.2",
    "Executor and store boundaries are now explicit.",
    "",
    "A smaller public work algebra with separate executor and store interfaces, portable receipts and migration notes.",
    "",
    "Proof: 5 hosts · 1 work value",
    "Source: package:std.work@0.4.2+sha.8bd2c741",
    "Authority: Hara package registry",
    "Canonical: https://packages.hara-lang.org/std.work/0.4.2/"
  ].join("\n")
};

export const releaseStory = Object.freeze({
  ...storyBase,
  fixtureRevision: `media-fixture:${stableHash(storyBase)}`
});

export const artifactStates = Object.freeze([
  {
    id: "current",
    label: "Current",
    symbol: "●",
    line: "solid",
    meaning: "The artifact reflects the cited current source revision.",
    action: "Open canonical source"
  },
  {
    id: "stale",
    label: "Stale",
    symbol: "↻",
    line: "dotted",
    meaning: "The artifact was valid for an older revision and should be regenerated.",
    action: "Open newer source"
  },
  {
    id: "unavailable",
    label: "Unavailable",
    symbol: "×",
    line: "broken",
    meaning: "The requested projection cannot currently be generated or retrieved.",
    action: "Use plain text"
  },
  {
    id: "failed",
    label: "Failed",
    symbol: "!",
    line: "double",
    meaning: "Generation reached a terminal failure with an exact receipt.",
    action: "Inspect failure receipt"
  }
]);

export const worldDigest = Object.freeze({
  id: "world-weekly-34",
  type: "editorial-digest",
  template: "world-whats-new",
  subject: "What’s new in Hara · std.work, Wasm sessions and three new community feeds",
  preheader: "Five useful updates from Hara World, with canonical links and package revisions.",
  canonicalUrl: "https://world.hara-lang.org/digest/2026-W34/",
  sourceIdentity: "world:digest:2026-W34",
  sourceRevision: "world:digest@34+sha.41c7e2b9",
  authority: "Hara World editorial feed",
  status: "current",
  locale: "en-AU",
  direction: "ltr",
  generatedAt: "2026-08-21T08:00:00+10:00",
  preferencesUrl: "https://world.hara-lang.org/preferences/email/",
  unsubscribeUrl: "https://world.hara-lang.org/unsubscribe/example-token/",
  items: [
    {
      kind: "package",
      title: "std.work 0.4.2 publishes the executor/store split",
      summary: "Migration notes and portable host evidence are available.",
      source: "packages.hara-lang.org",
      revision: "std.work@0.4.2"
    },
    {
      kind: "runtime",
      title: "Wasm sessions now expose requested and actual backend separately",
      summary: "The browser surface no longer implies that requested state is attached state.",
      source: "hara-lang.org",
      revision: "runtime-contract@12"
    },
    {
      kind: "community",
      title: "Three new Hara feeds joined World",
      summary: "Graphics Notes, Package Registry Journal and Small Language Systems retain canonical source links.",
      source: "world.hara-lang.org",
      revision: "feed-registry@18"
    },
    {
      kind: "snippet",
      title: "Snippet of the week: group clippings by canonical source",
      summary: "A compact pipeline with an active discussion and twelve remixes.",
      source: "world.hara-lang.org",
      revision: "snippet@42"
    },
    {
      kind: "spec",
      title: "HAL interface proposal 27 entered review",
      summary: "The proposal adds generated HTA/Wasm bindings from .hal interfaces.",
      source: "specs.hara-lang.org",
      revision: "proposal:27@3"
    }
  ]
});

export const packageReceipt = Object.freeze({
  id: "receipt-std-work-0-4-2",
  type: "transactional-receipt",
  template: "package-publication-receipt",
  title: "Package publication accepted",
  package: "std.work",
  version: "0.4.2",
  coordinate: "std.work:0.4.2",
  receipt: "receipt:pkg:204",
  sourceRevision: "manifest:8bd2c741",
  authority: "Hara package registry",
  status: "accepted",
  generatedAt: "2026-08-21T09:31:12+10:00",
  canonicalUrl: "https://packages.hara-lang.org/std.work/0.4.2/",
  checks: [
    ["Manifest", "accepted", "manifest:8bd2c741"],
    ["Namespace ownership", "accepted", "work.core@17"],
    ["Compatibility evidence", "accepted", "compat:matrix@31"],
    ["Signature", "accepted", "sig:ed25519:82f4…"]
  ]
});

export const specsPacket = Object.freeze({
  id: "hal-bindings-proposal-27",
  type: "proposal-packet",
  template: "spec-proposal-pdf",
  title: "Generate HTA/Wasm bindings from .hal interfaces",
  proposal: "HAL-27",
  sourceRevision: "proposal:27@3+sha.1d48c29e",
  authority: "Hara Specs proposal registry",
  status: "review",
  generatedAt: "2026-08-21T10:15:00+10:00",
  canonicalUrl: "https://specs.hara-lang.org/proposals/HAL-27/",
  sections: [
    ["Problem", "Wasm libraries expose portable interfaces but still require hand-written host-language binding glue."],
    ["Proposal", "Generate HTA and Wasm binding descriptors directly from the existing .hal interface contract."],
    ["Boundary", "The generator emits descriptors and ABI evidence. Products decide whether JavaScript, Rust, Java or another adapter is required."],
    ["Review evidence", "Three interface fixtures, five host targets and an unavailable future-target state are included." ]
  ]
});

export const benchmarkReport = Object.freeze({
  id: "benchmark-report-runtime-2026-08",
  type: "evidence-report",
  template: "benchmark-print-report",
  title: "Runtime dispatch evidence · August 2026",
  sourceRevision: "benchmarks:runtime@2026-08-18+sha.7a31e80f",
  authority: "Hara benchmark publication pipeline",
  status: "current",
  generatedAt: "2026-08-21T10:40:00+10:00",
  canonicalUrl: "https://hara-lang.org/benchmarks/runtime-dispatch/",
  uncertainty: "Median of 30 warm runs; 95% bootstrap interval. Missing and unsupported targets are not plotted as zero.",
  rows: [
    ["Tree evaluator", "1.00×", "0.98–1.03", "current"],
    ["Fiber evaluator", "0.91×", "0.89–0.94", "current"],
    ["Bytecode VM", "0.48×", "0.46–0.50", "current"],
    ["Native Rust", "0.31×", "0.30–0.33", "current"],
    ["Browser / Wasm", "0.57×", "0.54–0.60", "partial"],
    ["Java host", "N/A", "unsupported", "unsupported"]
  ]
});

export const productSocialCards = Object.freeze([
  ["WWW", "product-www", "The Hara programming language", "Readable forms. Portable runtimes. Evidence you can inspect.", "hara-lang.org"],
  ["Playground", "product-playground", "Run Hara in the browser", "Samples, sessions, files, canvas and live components.", "playground.hara-lang.org"],
  ["Specs", "product-specs", "Hara specifications", "Registry, checker, proposals and conformance evidence.", "specs.hara-lang.org"],
  ["Packages", "product-packages", "Packages and namespaces", "Distribution, compatibility and stewardship with exact provenance.", "packages.hara-lang.org"],
  ["World", "product-world", "What the Hara community is reading", "Articles, feeds, clippings, comments and contributor identity.", "world.hara-lang.org"],
  ["Learn", "product-learn", "Learn Hara by making", "Runnable lessons, guided projects and visible progress.", "learn.hara-lang.org"]
].map(([label, glyph, title, summary, destination], index) => Object.freeze({
  id: label.toLowerCase(),
  label,
  glyph,
  title,
  summary,
  destination,
  sourceRevision: `product-card:${label.toLowerCase()}@${index + 1}`,
  altText: `${label} Hara product card. ${title}. ${summary} Destination: ${destination}.`
})));

export const safeZones = Object.freeze({
  og: { width: 1200, height: 630, insetX: 72, insetY: 60, label: "40:21 Open Graph" },
  square: { width: 1080, height: 1080, insetX: 84, insetY: 84, label: "1:1 square" },
  portrait: { width: 1080, height: 1350, insetX: 84, insetY: 108, label: "4:5 portrait" },
  story: { width: 1080, height: 1920, insetX: 96, insetY: 240, label: "9:16 story" }
});

/** @param {object} source */
export function artifactEnvelope(source) {
  return Object.freeze({
    artifactType: source.type,
    template: source.template,
    canonicalUrl: source.canonicalUrl,
    sourceIdentity: source.sourceIdentity ?? source.id,
    sourceRevision: source.sourceRevision,
    authority: source.authority,
    status: source.status,
    locale: source.locale ?? "en-AU",
    direction: source.direction ?? "ltr",
    generatedAt: source.generatedAt,
    staleAfter: source.staleAfter ?? null,
    textEquivalent: source.plainText ?? source.altText ?? source.title
  });
}

/** @param {object} source @param {string} now */
export function artifactIsStale(source, now) {
  if (!source.staleAfter) return false;
  return Date.parse(now) > Date.parse(source.staleAfter);
}

/** @param {object} source */
export function plainTextProjection(source) {
  if (source.plainText) return source.plainText;
  const envelope = artifactEnvelope(source);
  return [
    source.title ?? source.subject ?? source.id,
    source.deck ?? source.preheader ?? "",
    "",
    `Status: ${envelope.status}`,
    `Source revision: ${envelope.sourceRevision}`,
    `Authority: ${envelope.authority}`,
    `Canonical: ${envelope.canonicalUrl}`
  ].filter(Boolean).join("\n");
}

export const deliverySummary = Object.freeze({
  formats: deliveryFormats.length,
  artifactStates: artifactStates.length,
  emailItems: worldDigest.items.length,
  receiptChecks: packageReceipt.checks.length,
  specSections: specsPacket.sections.length,
  benchmarkRows: benchmarkReport.rows.length,
  productCards: productSocialCards.length,
  safeZones: Object.keys(safeZones).length
});
