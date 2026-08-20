// @ts-check

export const packagesFixtureNotice = {
  id: "hara-v2-packages-fixture-2026-08",
  label: "Package registry design-review fixture",
  generatedAt: "2026-08-21T00:06:00Z",
  sourceRevision: "packages-fixture:8d4e9a71",
  registryRevision: "package-registry@2.2.0:71c4ef92",
  productionData: false,
  summary: "Representative package, release, namespace, compatibility, publishing, and maintainer facts. Versions and receipts are not live registry records."
};

export const packageContentTypes = [
  { id: "packages.package", version: "2.2.0", label: "Package", authority: "Package registry" },
  { id: "packages.release", version: "2.2.0", label: "Release", authority: "Release registry" },
  { id: "packages.namespace", version: "2.2.0", label: "Namespace", authority: "Namespace registry" },
  { id: "packages.maintainer", version: "2.2.0", label: "Maintainer record", authority: "Identity + namespace registries" },
  { id: "packages.compatibility", version: "2.2.0", label: "Compatibility record", authority: "Compatibility registry" }
];

export const discoveryViews = [
  { id: "updated", label: "Recently updated", description: "Exact current releases ordered by registry update time." },
  { id: "widely-used", label: "Widely used", description: "Reverse-dependency evidence without hiding compatibility or maintenance state." },
  { id: "new", label: "Newly published", description: "First publication time, not promotional ranking." }
];

export const discoveryFilters = {
  domain: ["all", "language", "workflow", "distribution", "graphics", "storage"],
  runtime: ["all", "jvm", "rust", "wasm", "node"],
  stability: ["all", "stable", "preview", "deprecated"],
  license: ["all", "Apache-2.0", "EPL-2.0", "MIT"],
  compatibility: ["all", "verified", "partial", "unknown"]
};

export const packageCards = [
  {
    id: "package-hara-std-typed",
    coordinate: "hara/std.typed",
    title: "Typed schemas and coercion",
    summary: "Canonical schema, validation, coercion, and typed data contracts for Hara programs.",
    domain: "language",
    runtimes: ["jvm", "rust", "wasm", "node"],
    stability: "stable",
    license: "Apache-2.0",
    compatibility: "verified",
    latestVersion: "2.4.1",
    releaseRevision: "6a7f813ca41d227e",
    updatedAt: "2026-08-18T09:15:00Z",
    publishedAt: "2025-11-04T04:20:00Z",
    dependants: 128,
    namespaces: ["std.typed", "std.typed.schema", "std.typed.coerce", "std.typed.validate"],
    saved: true,
    followed: true,
    maintenance: "active"
  },
  {
    id: "package-hara-std-work",
    coordinate: "hara/std.work",
    title: "Durable work algebra",
    summary: "Replayable work, checkpointed steps, capabilities, queues, timers, and durable receipts.",
    domain: "workflow",
    runtimes: ["jvm", "rust", "node"],
    stability: "preview",
    license: "Apache-2.0",
    compatibility: "partial",
    latestVersion: "0.9.0",
    releaseRevision: "d2b9f02674aa51c8",
    updatedAt: "2026-08-20T06:40:00Z",
    publishedAt: "2026-05-14T12:05:00Z",
    dependants: 47,
    namespaces: ["std.work", "std.work.runtime", "std.work.backend"],
    saved: false,
    followed: true,
    maintenance: "active"
  },
  {
    id: "package-hara-code-maven",
    coordinate: "hara/code.maven",
    title: "Artifact and dependency resolution",
    summary: "Exact Maven coordinate resolution, repository policy, lock data, and artifact verification.",
    domain: "distribution",
    runtimes: ["jvm", "node"],
    stability: "stable",
    license: "EPL-2.0",
    compatibility: "verified",
    latestVersion: "4.1.3",
    releaseRevision: "87bc4109e3a5f712",
    updatedAt: "2026-08-11T23:10:00Z",
    publishedAt: "2024-02-20T02:00:00Z",
    dependants: 212,
    namespaces: ["code.maven", "code.maven.package", "code.maven.repository"],
    saved: true,
    followed: false,
    maintenance: "active"
  },
  {
    id: "package-hara-ui-canvas",
    coordinate: "hara/ui.canvas",
    title: "Canvas and live visual fields",
    summary: "Canvas scenes, deterministic animation controls, observation streams, and portable visual forms.",
    domain: "graphics",
    runtimes: ["wasm", "node"],
    stability: "preview",
    license: "MIT",
    compatibility: "partial",
    latestVersion: "0.6.2",
    releaseRevision: "a119e8f742dccb30",
    updatedAt: "2026-08-19T18:20:00Z",
    publishedAt: "2026-07-22T07:30:00Z",
    dependants: 18,
    namespaces: ["ui.canvas", "ui.canvas.field", "ui.canvas.observation"],
    saved: false,
    followed: false,
    maintenance: "active"
  },
  {
    id: "package-greenways-hestia-client",
    coordinate: "greenways/hestia-client",
    title: "Signed document storage client",
    summary: "Key-scoped storage, signed version chains, room access, and receipt-aware document retrieval.",
    domain: "storage",
    runtimes: ["jvm", "node", "wasm"],
    stability: "preview",
    license: "Apache-2.0",
    compatibility: "unknown",
    latestVersion: "0.3.0",
    releaseRevision: "359de19a764bc08f",
    updatedAt: "2026-08-16T11:45:00Z",
    publishedAt: "2026-08-02T03:15:00Z",
    dependants: 6,
    namespaces: ["hestia.client", "hestia.client.room", "hestia.client.receipt"],
    saved: true,
    followed: true,
    maintenance: "review"
  },
  {
    id: "package-hara-legacy-stream",
    coordinate: "hara/legacy.stream",
    title: "Legacy stream adapters",
    summary: "Compatibility-only stream aliases retained while consumers migrate to explicit work and channel contracts.",
    domain: "workflow",
    runtimes: ["jvm"],
    stability: "deprecated",
    license: "EPL-2.0",
    compatibility: "partial",
    latestVersion: "1.8.7",
    releaseRevision: "501ce18e7eaa0bf4",
    updatedAt: "2026-04-01T01:00:00Z",
    publishedAt: "2021-08-10T01:00:00Z",
    dependants: 31,
    namespaces: ["legacy.stream", "legacy.stream.adapter"],
    saved: false,
    followed: false,
    maintenance: "migration-only"
  }
];

export const discoveryStates = [
  { id: "ready", label: "Registry ready", tone: "success", summary: "Search, filters, exact identities, and release facts are current at the shown registry revision." },
  { id: "empty-query", label: "Empty query", tone: "muted", summary: "Browse remains useful before typing; no request or inferred intent is fabricated." },
  { id: "no-results", label: "No matching package", tone: "warning", summary: "Keep filters visible, explain the mismatch, and offer a reset without replacing the query." },
  { id: "stale-index", label: "Search index stale", tone: "warning", summary: "Results remain readable with the indexed-at fence; exact package pages continue to query the registry." },
  { id: "registry-degraded", label: "Registry degraded", tone: "error", summary: "Cached discovery is labelled stale. Publishing, following, and compatibility claims are disabled." }
];

/** @param {string} id */
export function packageById(id) {
  return packageCards.find((item) => item.id === id || item.coordinate === id) ?? null;
}

/**
 * @param {{query?:string,domain?:string,runtime?:string,stability?:string,license?:string,compatibility?:string,view?:string}=} options
 */
export function filterPackages(options = {}) {
  const query = String(options.query ?? "").trim().toLowerCase();
  const matches = packageCards.filter((item) => {
    const searchable = [item.coordinate, item.title, item.summary, ...item.namespaces].join(" ").toLowerCase();
    return (!query || searchable.includes(query))
      && (!options.domain || options.domain === "all" || item.domain === options.domain)
      && (!options.runtime || options.runtime === "all" || item.runtimes.includes(options.runtime))
      && (!options.stability || options.stability === "all" || item.stability === options.stability)
      && (!options.license || options.license === "all" || item.license === options.license)
      && (!options.compatibility || options.compatibility === "all" || item.compatibility === options.compatibility);
  });

  const view = options.view ?? "updated";
  return [...matches].sort((left, right) => {
    if (view === "widely-used") return right.dependants - left.dependants || left.coordinate.localeCompare(right.coordinate);
    if (view === "new") return right.publishedAt.localeCompare(left.publishedAt) || left.coordinate.localeCompare(right.coordinate);
    return right.updatedAt.localeCompare(left.updatedAt) || left.coordinate.localeCompare(right.coordinate);
  });
}
