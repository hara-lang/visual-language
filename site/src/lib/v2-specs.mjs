// @ts-check

/** @typedef {"draft" | "proposed" | "accepted" | "superseded" | "withdrawn" | "experimental"} SpecificationStatus */
/** @typedef {"pass" | "warning" | "failure" | "unsupported" | "unavailable"} CheckerState */

export const specsFixtureNotice = {
  id: "hara-v2-specs-fixture-2026-08",
  label: "Design-review fixture",
  generatedAt: "2026-08-20T14:32:31Z",
  sourceRevision: "94b11634c640bde9",
  productionData: false,
  summary: "Representative registry, checker, review, and digest data for interaction review. It is not a live hara-specs registry snapshot."
};

export const specificationStatuses = [
  { id: "draft", label: "Draft", authority: "Author", summary: "Editable proposal without a durable public decision." },
  { id: "proposed", label: "Proposed", authority: "Review registry", summary: "Exact submitted revision is fenced while review is active." },
  { id: "accepted", label: "Accepted", authority: "Specification registry", summary: "Normative version and publication receipt are current." },
  { id: "superseded", label: "Superseded", authority: "Specification registry", summary: "Historical version remains inspectable and points to its replacement." },
  { id: "withdrawn", label: "Withdrawn", authority: "Specification registry", summary: "Proposal is no longer current; identity and withdrawal reason remain durable." },
  { id: "experimental", label: "Experimental", authority: "Working group", summary: "Useful for implementation study but not an accepted compatibility promise." }
];

export const specificationDomains = [
  { id: "runtime", label: "Runtime" },
  { id: "typed", label: "Typed data" },
  { id: "work", label: "Work" },
  { id: "native", label: "Native boundary" },
  { id: "packages", label: "Packages" },
  { id: "interop", label: "Interop" }
];

export const specifications = [
  {
    id: "HSP-0008",
    identifier: "runtime.session",
    title: "Unified live-session lifecycle",
    version: "1.2.0",
    status: "accepted",
    domain: "runtime",
    revision: "7107147d45d4c03f",
    updatedAt: "2026-08-19",
    summary: "One fenced lifecycle envelope for browser, interpreter, compiled, and embedded execution surfaces.",
    tags: ["session", "generation", "capabilities", "observations"],
    normativeSections: ["Session identity and generation", "Source-revision fencing", "Monotonic event sequence", "Cancellation, replacement, and disposal"],
    explanatorySections: ["Browser integration guidance", "Embed examples", "Failure-state rationale"],
    requirements: [
      { id: "REQ-001", level: "must", text: "Every execution names a session identity, generation, and exact source revision." },
      { id: "REQ-004", level: "must", text: "Backend selection never silently falls back to a different implementation." },
      { id: "REQ-009", level: "should", text: "Observation streams expose a monotonic sequence within the session envelope." }
    ],
    grammar: "session-envelope = identity generation source-revision backend capabilities sequence state receipts",
    examples: ["playground/live-session", "docs/embedded-example"],
    packages: ["hara-runtime", "hara-wasm-core"],
    namespaces: ["std.runtime.session", "code.runtime"],
    implementations: ["JVM", "Rust", "Browser/Wasm"],
    tests: ["runtime-session-conformance", "browser-live-session-contract"],
    canonicalSource: "hara-lang/hara-specs · specs/runtime/session.md",
    machineContract: "hara:specs:runtime.session:1.2.0",
    receipt: "spec-receipt:runtime.session:1.2.0:7107147d"
  },
  {
    id: "HSP-0012",
    identifier: "std.typed.schema",
    title: "Portable typed-schema values",
    version: "0.9.2",
    status: "proposed",
    domain: "typed",
    revision: "b37d9b71c0a24e8a",
    updatedAt: "2026-08-18",
    summary: "Canonical values, validation boundaries, recursive references, and normalized diagnostics for std.typed.",
    tags: ["schema", "validation", "portable", "diagnostics"],
    normativeSections: ["Schema value model", "Recursive references", "Validation result normalization", "Compatibility rules"],
    explanatorySections: ["Migration from legacy predicates", "Authoring examples"],
    requirements: [
      { id: "REQ-002", level: "must", text: "Schema identity is stable across runtime representations." },
      { id: "REQ-006", level: "must", text: "Failures retain a machine code and exact value path." },
      { id: "REQ-011", level: "may", text: "A renderer may group repeated diagnostics without discarding source paths." }
    ],
    grammar: "schema = scalar | collection | union | reference | constrained",
    examples: ["typed/person", "typed/package-manifest"],
    packages: ["hara-typed"],
    namespaces: ["std.typed", "std.typed.schema"],
    implementations: ["JVM", "Rust"],
    tests: ["typed-schema-portable-corpus"],
    canonicalSource: "hara-lang/hara-specs · proposals/HSP-0012.md",
    machineContract: "hara:specs:std.typed.schema:0.9.2",
    receipt: null
  },
  {
    id: "HSP-0016",
    identifier: "work.executor",
    title: "Durable work executor boundary",
    version: "0.3.0",
    status: "experimental",
    domain: "work",
    revision: "d4502d3d8be1f796",
    updatedAt: "2026-08-17",
    summary: "Separates replayable work algebra, checkpointed steps, runtime execution, durability, and capabilities.",
    tags: ["work", "steps", "durability", "capability", "capabilities"],
    normativeSections: ["Work algebra", "Checkpointed step boundary", "Capability declaration", "Receipt and replay rules"],
    explanatorySections: ["DBOS comparison", "Provider examples", "Failure recovery study"],
    requirements: [
      { id: "REQ-003", level: "must", text: "External effects occur only inside an explicit checkpointed step." },
      { id: "REQ-008", level: "must", text: "Replay reuses durable step outputs instead of repeating completed effects." },
      { id: "REQ-014", level: "should", text: "Capability denial reports the required and granted capability sets." }
    ],
    grammar: "work = pure | step | chain | branch | parallel | retry",
    examples: ["work/github-comment", "work/durable-timer"],
    packages: ["hara-work"],
    namespaces: ["std.work", "work.runtime"],
    implementations: ["JVM"],
    tests: ["work-replay-corpus", "checkpoint-receipt-fixture"],
    canonicalSource: "hara-lang/hara-specs · experiments/work/executor.md",
    machineContract: "hara:specs:work.executor:0.3.0",
    receipt: null
  },
  {
    id: "HSP-0004",
    identifier: "native.result",
    title: "Normalized native result and error",
    version: "1.1.1",
    status: "superseded",
    domain: "native",
    revision: "9a85d3ed8a13f114",
    updatedAt: "2026-08-13",
    summary: "Historical cross-runtime result, error-class, and host-boundary normalization contract.",
    tags: ["native", "result", "error", "host"],
    normativeSections: ["Result envelope", "Error class", "Host value conversion"],
    explanatorySections: ["Migration to native.behavior", "Historical runtime notes"],
    requirements: [
      { id: "REQ-001", level: "must", text: "Success and failure retain a stable normalized envelope." },
      { id: "REQ-005", level: "must", text: "Error class is callable and comparable across supported runtimes." }
    ],
    grammar: "result = ok(value) | error(class message data)",
    examples: ["native/error-class"],
    packages: ["hara-native"],
    namespaces: ["std.native"],
    implementations: ["JVM", "Rust"],
    tests: ["native-result-legacy-corpus"],
    canonicalSource: "hara-lang/hara-specs · archive/native/result-1.1.1.md",
    machineContract: "hara:specs:native.result:1.1.1",
    receipt: "spec-receipt:native.result:1.1.1:9a85d3ed",
    replacedBy: "native.behavior@2.0.0"
  },
  {
    id: "HSP-0021",
    identifier: "package.manifest",
    title: "Package and namespace publication manifest",
    version: "0.1.0-draft",
    status: "draft",
    domain: "packages",
    revision: "2de379eef5635f20",
    updatedAt: "2026-08-16",
    summary: "Draft package identity, namespace inventory, compatibility declaration, artifacts, and provenance receipt contract.",
    tags: ["package", "namespace", "publication", "provenance"],
    normativeSections: ["Package identity", "Namespace inventory", "Artifact digest", "Compatibility declaration"],
    explanatorySections: ["Registry listing preview", "Maintainer workflow"],
    requirements: [
      { id: "REQ-001", level: "must", text: "A release names the exact package version and artifact digest." },
      { id: "REQ-007", level: "should", text: "Namespace stewardship is referenced from the namespace registry." }
    ],
    grammar: "manifest = package version namespaces artifacts compatibility provenance",
    examples: ["packages/release-manifest"],
    packages: ["hara-package-tools"],
    namespaces: ["code.package", "code.maven"],
    implementations: [],
    tests: ["package-manifest-draft-vectors"],
    canonicalSource: "hara-lang/hara-specs · drafts/package/manifest.md",
    machineContract: "hara:specs:package.manifest:0.1.0-draft",
    receipt: null
  },
  {
    id: "HSP-0003",
    identifier: "legacy.foreign-call",
    title: "Legacy foreign call notation",
    version: "0.8.0",
    status: "withdrawn",
    domain: "interop",
    revision: "4f2e7a9301cb43f0",
    updatedAt: "2026-07-29",
    summary: "Withdrawn proposal retained to explain why host calls moved to explicit native capability boundaries.",
    tags: ["legacy", "interop", "foreign", "migration"],
    normativeSections: ["Historical call notation"],
    explanatorySections: ["Withdrawal rationale", "Migration to native capabilities"],
    requirements: [],
    grammar: "foreign-call = withdrawn",
    examples: ["archive/foreign-call"],
    packages: [],
    namespaces: ["legacy.foreign"],
    implementations: [],
    tests: [],
    canonicalSource: "hara-lang/hara-specs · archive/HSP-0003.md",
    machineContract: "hara:specs:legacy.foreign-call:0.8.0",
    receipt: "withdrawal-receipt:HSP-0003:4f2e7a93",
    withdrawalReason: "Implicit host authority prevented portable capability review."
  }
];

export const conformanceMatrix = [
  { id: "jvm-runtime-session", specification: "runtime.session@1.2.0", implementation: "Hara JVM", target: "JDK 21", revision: "f4ac17e2", state: "pass", passed: 82, total: 82, receipt: "conformance:jvm:runtime.session:82-82" },
  { id: "rust-runtime-session", specification: "runtime.session@1.2.0", implementation: "Hara Rust", target: "native", revision: "cc8f2301", state: "warning", passed: 79, total: 82, receipt: "conformance:rust:runtime.session:79-82" },
  { id: "wasm-runtime-session", specification: "runtime.session@1.2.0", implementation: "Browser/Wasm", target: "wasm32", revision: "71cc80f4", state: "pass", passed: 40, total: 40, receipt: "conformance:wasm:runtime.session:40-40" },
  { id: "jvm-typed-schema", specification: "std.typed.schema@0.9.2", implementation: "Hara JVM", target: "JDK 21", revision: "3b4b7a12", state: "pass", passed: 61, total: 61, receipt: "conformance:jvm:std.typed.schema:61-61" },
  { id: "rust-typed-schema", specification: "std.typed.schema@0.9.2", implementation: "Hara Rust", target: "native", revision: "fe63a129", state: "failure", passed: 57, total: 61, receipt: "conformance:rust:std.typed.schema:57-61" },
  { id: "wasm-work-executor", specification: "work.executor@0.3.0", implementation: "Browser/Wasm", target: "wasm32", revision: "unavailable", state: "unsupported", passed: 0, total: 46, receipt: null }
];

export const checkerScenarios = [
  {
    id: "pass",
    label: "Pass",
    state: "pass",
    specification: "runtime.session",
    version: "1.2.0",
    specRevision: "7107147d45d4c03f",
    sourceLabel: "examples/session-envelope.hara",
    sourceRevision: "9f3c2ab7",
    implementation: "browser-checker@0.6.1",
    summary: "The value satisfies all required session-envelope fields and lifecycle constraints.",
    findings: [
      { id: "PASS-001", severity: "notice", line: 1, column: 1, path: "$", message: "Validated 14 normative requirements against runtime.session@1.2.0." }
    ],
    receipt: "check:runtime.session:1.2.0:9f3c2ab7:pass"
  },
  {
    id: "warning",
    label: "Warning",
    state: "warning",
    specification: "std.typed.schema",
    version: "0.9.2",
    specRevision: "b37d9b71c0a24e8a",
    sourceLabel: "schemas/person.hara",
    sourceRevision: "2c771a0d",
    implementation: "browser-checker@0.6.1",
    summary: "The schema is valid but uses a compatibility alias scheduled for removal before acceptance.",
    findings: [
      { id: "TYPE-ALIAS-014", severity: "warning", line: 7, column: 12, path: "$.fields.email", message: "Alias :string? is accepted for 0.9.x; use [:maybe :string] for the proposed 1.0 contract." },
      { id: "TYPE-NOTE-002", severity: "notice", line: 1, column: 1, path: "$", message: "Recursive reference graph is finite and resolves successfully." }
    ],
    receipt: "check:std.typed.schema:0.9.2:2c771a0d:warning"
  },
  {
    id: "failure",
    label: "Failure",
    state: "failure",
    specification: "work.executor",
    version: "0.3.0",
    specRevision: "d4502d3d8be1f796",
    sourceLabel: "work/github-comment.hara",
    sourceRevision: "ad90d3b1",
    implementation: "browser-checker@0.6.1",
    summary: "An external provider effect appears outside a checkpointed step and cannot be replayed safely.",
    findings: [
      { id: "WORK-EFFECT-003", severity: "error", line: 12, column: 5, path: "$.body[2]", message: "Provider call github/comment must occur inside an explicit :step boundary." },
      { id: "WORK-CAP-008", severity: "error", line: 5, column: 3, path: "$.capabilities", message: "Required capability :github/write is not declared." },
      { id: "WORK-RECEIPT-011", severity: "warning", line: 9, column: 3, path: "$.id", message: "Stable step identity is required before a retry policy can be checked." }
    ],
    receipt: "check:work.executor:0.3.0:ad90d3b1:failure"
  },
  {
    id: "unsupported",
    label: "Unsupported",
    state: "unsupported",
    specification: "package.manifest",
    version: "0.1.0-draft",
    specRevision: "2de379eef5635f20",
    sourceLabel: "package.hara",
    sourceRevision: "178a991f",
    implementation: "browser-checker@0.6.1",
    summary: "The selected draft uses an artifact-signature rule that this browser checker does not implement.",
    findings: [
      { id: "CHECKER-UNSUPPORTED-021", severity: "error", line: 18, column: 1, path: "$.artifacts.signature", message: "Rule package.signature@0.1 is not supported by browser-checker@0.6.1." }
    ],
    receipt: "check:package.manifest:0.1.0-draft:178a991f:unsupported"
  },
  {
    id: "unavailable",
    label: "Checker unavailable",
    state: "unavailable",
    specification: "runtime.session",
    version: "1.2.0",
    specRevision: "7107147d45d4c03f",
    sourceLabel: "examples/session-envelope.hara",
    sourceRevision: "9f3c2ab7",
    implementation: "remote-checker",
    summary: "The selected remote checker cannot be reached. No pass or failure claim has been produced.",
    findings: [
      { id: "CHECKER-OFFLINE", severity: "error", line: null, column: null, path: null, message: "Remote checker unavailable; retain the exact input and retry without changing the source fence." }
    ],
    receipt: null
  }
];

export const proposalStates = [
  { id: "draft", label: "Draft", actor: "Author", evidence: "Local revision" },
  { id: "checks-pending", label: "Checks pending", actor: "Checker", evidence: "Fenced input + queued checks" },
  { id: "review-requested", label: "Review requested", actor: "Author", evidence: "GitHub proposal + submission receipt" },
  { id: "changes-requested", label: "Changes requested", actor: "Reviewer", evidence: "Review decision on exact revision" },
  { id: "accepted", label: "Accepted", actor: "Specification authority", evidence: "Acceptance decision + version assignment" },
  { id: "merged", label: "Merged", actor: "Canonical repository", evidence: "Git commit + publication receipt" }
];

export const proposalFixture = {
  id: "proposal-HSP-0024",
  specNumber: "HSP-0024",
  title: "Filesystem provider capability contract",
  contentType: "specs.proposal",
  schemaVersion: "3.0.0",
  status: "review-requested",
  exactRevision: "42cb7e16b3e955b4",
  githubProposal: "hara-lang/hara-specs#124",
  summary: "Defines provider identity, capability discovery, path semantics, failure normalization, and lifecycle behavior for pluggable filesystems.",
  compatibility: "Additive provider contract; existing native filesystem behavior remains supported.",
  normativeChange: "Adds IFilesystem capability negotiation and exact provider-error normalization.",
  examples: ["native", "google-drive", "github", "sftp", "indexeddb"],
  checks: [
    { id: "schema", state: "pass", label: "Front matter valid" },
    { id: "examples", state: "pass", label: "Five provider vectors parse" },
    { id: "compatibility", state: "warning", label: "Browser path normalization needs review" }
  ]
};

export const reviewQueue = [
  { id: "HSP-0024", title: "Filesystem provider capability contract", revision: "42cb7e16", state: "review-requested", reviewers: 3, checks: "2 pass · 1 warning", age: "4h" },
  { id: "HSP-0012", title: "Portable typed-schema values", revision: "b37d9b71", state: "changes-requested", reviewers: 2, checks: "61 / 61", age: "2d" },
  { id: "HSP-0022", title: "Namespace stewardship transfer", revision: "f9207a61", state: "checks-pending", reviewers: 0, checks: "queued", age: "18m" }
];

export const changeDigest = [
  {
    id: "digest-runtime-session-1.2",
    kind: "additive",
    specification: "runtime.session@1.2.0",
    title: "Disposal is now terminal and idempotent",
    summary: "Adds an explicit disposal receipt and preserves replacement history without changing successful Run behavior.",
    affectedPackages: ["hara-runtime", "hara-wasm-core"],
    affectedNamespaces: ["std.runtime.session"],
    migration: "Adopt the disposal receipt field; existing lifecycle consumers remain valid.",
    publishedAt: "2026-08-19",
    revision: "7107147d"
  },
  {
    id: "digest-native-behavior-2.0",
    kind: "breaking",
    specification: "native.behavior@2.0.0",
    title: "Inventory-only native methods require a reviewable reason",
    summary: "Unclassified additions, removals, and renames now fail the conformance guard.",
    affectedPackages: ["hara-native", "hara-rust"],
    affectedNamespaces: ["std.native"],
    migration: "Classify every native method as portable, capability-specific, or inventory-only with a named reason.",
    publishedAt: "2026-08-18",
    revision: "845cf281"
  },
  {
    id: "digest-typed-schema-0.9.2",
    kind: "proposal",
    specification: "std.typed.schema@0.9.2",
    title: "Normalized value paths in validation findings",
    summary: "Proposal adds stable machine codes and exact nested value paths across supported runtimes.",
    affectedPackages: ["hara-typed"],
    affectedNamespaces: ["std.typed", "std.typed.schema"],
    migration: "No migration until acceptance; implementation previews should retain legacy diagnostics alongside new paths.",
    publishedAt: "2026-08-18",
    revision: "b37d9b71"
  }
];

export const registryDegradedStates = [
  { id: "empty", label: "No matching specifications", summary: "Keep the active filters visible and offer one clear reset action." },
  { id: "stale", label: "Registry index is stale", summary: "Show the last indexed revision and do not claim newer proposal state." },
  { id: "partial", label: "Partial registry", summary: "Render available records, name unavailable sources, and keep exact revision facts visible." }
];

/** @param {string} id */
export function specificationById(id) {
  return specifications.find((entry) => entry.id === id || entry.identifier === id);
}

/**
 * @param {{query?: string, status?: string, domain?: string}=} filters
 */
export function filterSpecifications(filters = {}) {
  const query = String(filters.query ?? "").trim().toLowerCase();
  const status = String(filters.status ?? "all");
  const domain = String(filters.domain ?? "all");

  return specifications.filter((entry) => {
    const searchable = [entry.id, entry.identifier, entry.title, entry.summary, ...entry.tags].join(" ").toLowerCase();
    return (!query || searchable.includes(query)) &&
      (status === "all" || entry.status === status) &&
      (domain === "all" || entry.domain === domain);
  });
}

/** @param {string} id */
export function checkerResult(id) {
  return checkerScenarios.find((scenario) => scenario.id === id) ?? checkerScenarios[0];
}

/** @param {string} specification */
export function conformanceForSpecification(specification) {
  return conformanceMatrix.filter((entry) => entry.specification === specification);
}

export const specsRegistrySummary = {
  specifications: specifications.length,
  statuses: specificationStatuses.length,
  accepted: specifications.filter(({ status }) => status === "accepted").length,
  activeReview: specifications.filter(({ status }) => ["draft", "proposed", "experimental"].includes(status)).length,
  conformanceClaims: conformanceMatrix.length,
  checkerScenarios: checkerScenarios.length,
  exactFixtureRevision: specsFixtureNotice.sourceRevision
};
