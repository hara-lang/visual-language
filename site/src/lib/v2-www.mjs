// @ts-check

import {
  applicationContractMap,
  contentContractById
} from "./v2-frontmatter.mjs";

const requiredContractIds = ["www", "docs", "benchmarks"];

export const wwwContracts = Object.fromEntries(requiredContractIds.map((id) => {
  const contract = contentContractById(id);
  if (!contract) throw new Error(`Missing ${id} content contract for issue #38.`);
  return [id, contract];
}));

export const wwwAdoptionContract = applicationContractMap.find(({ issue }) => issue === 38);
if (!wwwAdoptionContract) throw new Error("Missing issue #38 application contract map entry.");

export const familyRoutes = [
  {
    id: "home",
    label: "Overview",
    path: "/www/",
    summary: "Language model, first form, runtime choices, libraries, source records, and current changes.",
    schemaNamespace: wwwContracts.www.schemaNamespace,
    schemaVersion: wwwContracts.www.schemaVersion
  },
  {
    id: "docs",
    label: "Docs",
    path: "/www/docs/",
    summary: "Task-oriented guides, reference material, search, versions, and bounded executable examples.",
    schemaNamespace: wwwContracts.docs.schemaNamespace,
    schemaVersion: wwwContracts.docs.schemaVersion
  },
  {
    id: "benchmarks",
    label: "Benchmarks",
    path: "/www/benchmarks/",
    summary: "Workload results, comparison matrices, selected evidence, methods, uncertainty, and result history.",
    schemaNamespace: wwwContracts.benchmarks.schemaNamespace,
    schemaVersion: wwwContracts.benchmarks.schemaVersion
  }
];

export const homeSectionNavigation = [
  { id: "first-example", label: "First form" },
  { id: "capabilities", label: "Language model" },
  { id: "proof", label: "Projects and records" },
  { id: "changes", label: "Changes" },
  { id: "start", label: "Run or install" },
  { id: "states", label: "Unavailable states" }
];

export const docsSectionNavigation = [
  { id: "start-map", label: "Start map" },
  { id: "guide", label: "Guide" },
  { id: "reference", label: "Reference" },
  { id: "search", label: "Search" },
  { id: "runtime-states", label: "Runtime states" },
  { id: "responsive", label: "Responsive" }
];

export const benchmarkSectionNavigation = [
  { id: "insights", label: "Summary" },
  { id: "matrix", label: "Matrix" },
  { id: "selected-result", label: "Selected result" },
  { id: "history", label: "History" },
  { id: "result-states", label: "Result states" },
  { id: "source-table", label: "Source table" }
];

export const homeNarrative = {
  contentType: "www.narrative-page",
  schema: "hara.www/narrative-page",
  schemaVersion: wwwContracts.www.schemaVersion,
  title: "Hara is a programming language built from readable forms.",
  summary: "A form is a Hara data structure that can represent code or data and can be inspected before evaluation. Explicit runtimes evaluate or lower forms on browser Wasm, JVM, and Rust hosts; libraries, capabilities, revisions, and results remain named at those boundaries.",
  eyebrow: "Hara programming language",
  revision: "sha256:www-family-issue-38",
  proofRefs: [
    "benchmark:runtime-dispatch/2026-08",
    "spec:work-algebra/v1",
    "package:std.work/1.8.0"
  ]
};

export const homeProofLedger = [
  { label: "Language unit", value: "Readable forms", detail: "Code and data share an inspectable representation." },
  { label: "Runtime hosts", value: "Wasm · JVM · Rust", detail: "Each executable surface names its host and capabilities." },
  { label: "Library model", value: "Namespaces and packages", detail: "Public symbols resolve to versioned, maintained records." },
  { label: "Evidence record", value: "Revision and method", detail: "Measurements and results name their source and context." }
];

export const capabilitySections = [
  {
    id: "portability",
    number: "01",
    title: "Forms can be interpreted, lowered, generated, or hosted.",
    summary: "The authored form remains available for inspection while an explicit runtime chooses how to evaluate or translate it.",
    proof: "Representative source revisions are attached to runtime and benchmark records.",
    items: ["Browser Wasm sessions", "JVM and Truffle hosts", "Rust-native lowering", "Generated target code"]
  },
  {
    id: "tooling",
    number: "02",
    title: "Libraries and tools use ordinary Hara values.",
    summary: "Filesystem, compiler, lint, migration, work, package, and deployment interfaces compose through named namespaces and data values.",
    proof: "Namespace references resolve to packages and exact releases.",
    items: ["std.lib.* foundations", "tool.lint facts", "code.migrate ledger", "work algebra"]
  },
  {
    id: "runtimes",
    number: "03",
    title: "Executable examples identify their runtime session.",
    summary: "A session is one runtime context with an identity, backend, generation, capabilities, and an explicit unavailable or degraded state.",
    proof: "The documentation specimen keeps static source separate from executable runtime state.",
    items: ["Isolated sessions", "Shared groups", "Capability fencing", "Execution receipts"]
  },
  {
    id: "interop",
    number: "04",
    title: "Host interop is represented at an explicit boundary.",
    summary: "Host values, native interfaces, package coordinates, and generated outputs retain their source and ownership information.",
    proof: "References point to package, namespace, specification, and evidence records.",
    items: ["JVM libraries", "Rust native ABI", "JavaScript hosts", "PostgreSQL and service tooling"]
  }
];

export const ecosystemMap = [
  { id: "language", label: "Language", title: "Forms and semantics", summary: "Evaluation, macros, namespaces, schemas, and portable code." },
  { id: "runtime", label: "Runtime", title: "Sessions and execution", summary: "Wasm, JVM, Rust, native interfaces, and explicit capabilities." },
  { id: "library", label: "Library", title: "Reusable systems", summary: "std.lib.*, std.work, code.*, tool.*, and packageable facilities." },
  { id: "evidence", label: "Records", title: "Specifications and measurements", summary: "Conformance, benchmarks, exact revisions, and reproducibility receipts." },
  { id: "community", label: "Community", title: "World and Learn", summary: "Articles, discussions, examples, curriculum, packages, and contributor records." }
];

export const projectProof = [
  {
    id: "std-work",
    package: "std.work",
    project: "Durable work algebra",
    summary: "Replayable work, checkpointed steps, stores, executors, and explicit capability boundaries.",
    evidence: "package:std.work/1.8.0",
    route: "packages/std.work"
  },
  {
    id: "hara-wasm-core",
    package: "hara-wasm-core",
    project: "Browser runtime kernel",
    summary: "Isolated and shared sessions with source revision, generation, and runtime status exposed.",
    evidence: "runtime:wasm-core/main@9f42",
    route: "github/hara-wasm-core"
  },
  {
    id: "tool-lint",
    package: "tool.lint",
    project: "Fact-oriented analysis",
    summary: "Unresolved symbols, type facts, arity, schema mismatches, and source locations as inspectable output.",
    evidence: "spec:lint-facts/v2",
    route: "docs/tool.lint"
  },
  {
    id: "code-migrate",
    package: "code.migrate",
    project: "Deterministic source migration",
    summary: "A governing ledger for generated publication, compatibility dispositions, and reproducible regeneration.",
    evidence: "receipt:migration/code-migrate",
    route: "docs/code.migrate"
  }
];

export const releaseSummary = [
  { date: "20 Aug 2026", kind: "Runtime", title: "Session controls become a shared interface contract", revision: "rev:runtime-ui-88", impact: "Docs and Playground can expose the same lifecycle states." },
  { date: "19 Aug 2026", kind: "Content", title: "Front matter registry reaches seven route families", revision: "rev:content-428e", impact: "Overview, Docs, and Benchmarks now consume shared typed metadata." },
  { date: "18 Aug 2026", kind: "Language", title: "Schema becomes a first-class typed primitive", revision: "rev:schema-71c4", impact: "Reference, checking, lint, and publication can share one semantic boundary." }
];

export const handoffs = [
  { id: "learn", label: "Learn", title: "Study the language in sequence", summary: "Continue from the first form into concepts, exercises, projects, and curriculum revisions.", action: "Read Learn", href: "/learn/" },
  { id: "world", label: "World", title: "Read community work and discussion", summary: "Read articles, clippings, discussions, package changes, and owner-attributed bot contributions.", action: "Read World", href: "/world/" }
];

export const gettingStartedChoices = [
  {
    id: "browser",
    label: "Browser",
    title: "Run the first form",
    command: "Open the runnable example",
    summary: "Use a capability-fenced Wasm session and inspect the exact source revision before running."
  },
  {
    id: "brew",
    label: "Local CLI",
    title: "Install Hara locally",
    command: "brew install hara-lang/tap/hara",
    summary: "Create a local project, run the REPL, and select a JVM or native host explicitly."
  },
  {
    id: "agent",
    label: "Repository guide",
    title: "Use an agent to inspect the repository",
    command: "Read the Hara repository and suggest a verified first example",
    summary: "Require exact files, implementation status, and a verification command before running an example."
  }
];

export const docsTaskMap = [
  { id: "first-program", time: "8 min", level: "New to Hara", title: "Evaluate the first form", summary: "Open an isolated browser session and inspect the result and capability boundary." },
  { id: "project", time: "20 min", level: "Application", title: "Create a portable project", summary: "Add namespaces, dependencies, tests, and an explicit target runtime." },
  { id: "work", time: "30 min", level: "Systems", title: "Build a durable work pipeline", summary: "Separate replayable work from checkpointed effects and record receipts." },
  { id: "native", time: "25 min", level: "Interop", title: "Call a native interface", summary: "Resolve host values, lifecycle, errors, and ownership through a narrow ABI." },
  { id: "package", time: "18 min", level: "Distribution", title: "Publish a package", summary: "Register namespace ownership, compatibility, artifact digest, and release notes." },
  { id: "inspect", time: "12 min", level: "Tooling", title: "Inspect compiler and lint facts", summary: "Move from source form to generated output without losing source locations." }
];

export const docsSidebarGroups = [
  { label: "Start", items: ["Orientation", "First program", "Project model", "Runtime choice"] },
  { label: "Language", items: ["Forms and values", "Functions", "Macros", "Namespaces", "Schemas"] },
  { label: "Systems", items: ["Sessions", "Work algebra", "Native interfaces", "Packages", "Deployment"] },
  { label: "Reference", items: ["std.lib.*", "std.work", "tool.*", "code.*", "Runtime API"] }
];

export const docsOutline = [
  { id: "model-work", label: "Model the work" },
  { id: "checkpoint-effects", label: "Checkpoint effects" },
  { id: "attach-runtime", label: "Attach a runtime" },
  { id: "inspect-receipt", label: "Inspect the receipt" }
];

export const docsArticle = {
  contentType: "docs.guide",
  schema: "hara.docs/guide",
  schemaVersion: wwwContracts.docs.schemaVersion,
  title: "Build a durable work pipeline",
  summary: "Keep deterministic orchestration separate from checkpointed effects while the runtime records exact boundaries.",
  versionRange: ">=1.8 <2.0",
  revision: "sha256:72a194a3",
  runtimeExample: "runtime-example:docs-work-01",
  publicationReceipt: "receipt:docs:pub-1098"
};

export const apiReferences = [
  { namespace: "std.work", symbol: "work-spec", kind: "protocol method", signature: "(work-spec [work])", since: "1.8.0", summary: "Return the canonical algebraic representation of a work value." },
  { namespace: "std.work", symbol: "submit", kind: "function", signature: "(submit executor store work)", since: "1.8.0", summary: "Submit work through explicit executor and store interfaces." },
  { namespace: "std.work", symbol: "step", kind: "constructor", signature: "(step id f & capabilities)", since: "1.8.0", summary: "Declare a checkpointed effect boundary with named capabilities." },
  { namespace: "std.work", symbol: "chain", kind: "constructor", signature: "(chain & work)", since: "1.8.0", summary: "Compose work without forcing an execution strategy." }
];

export const docsSearchResults = [
  { type: "Guide", category: "Systems", title: "Build a durable work pipeline", excerpt: "Replayable work, checkpointed steps, stores, executors, and receipts.", version: "1.8", runtime: "All" },
  { type: "Reference", category: "API", title: "std.work/work-spec", excerpt: "Canonical algebraic representation for work values.", version: "1.8", runtime: "All" },
  { type: "Version note", category: "Migration", title: "Migrating work.* to the narrow executor/store ABI", excerpt: "Runtime maps become host configuration rather than a public protocol.", version: "1.8", runtime: "JVM" },
  { type: "Live example", category: "Tutorial", title: "Checkpoint an HTTP effect", excerpt: "Fence network access and replay from the recorded result.", version: "1.8", runtime: "Wasm" }
];

export const runtimeStateSpecimens = [
  {
    id: "runtime-unavailable",
    tone: "warning",
    eyebrow: "Unavailable runtime",
    title: "Wasm backend could not attach",
    summary: "The article remains readable. Running is disabled and the exact source stays copyable.",
    details: ["Backend: wasm-core", "Fallback: static source", "Retry preserves revision"]
  },
  {
    id: "compile-error",
    tone: "danger",
    eyebrow: "Compile error",
    title: "Capability declaration is missing",
    summary: "The error names the source range and required capability instead of replacing the article with an editor.",
    details: ["work.hal:8:13", "Required: :network", "Session generation: 4"]
  },
  {
    id: "stale-version",
    tone: "notice",
    eyebrow: "Stale version",
    title: "Example targets Hara 1.8; selector is on 1.9-next",
    summary: "Readers can pin the documented version, inspect the migration note, or open the exact revision.",
    details: ["Documented: 1.8.0", "Selected: 1.9-next", "Revision remains immutable"]
  }
];

export const benchmarkReport = {
  contentType: "benchmarks.report",
  schema: "hara.benchmarks/report",
  schemaVersion: wwwContracts.benchmarks.schemaVersion,
  title: "Runtime dispatch and collection workloads",
  question: "How do selected Hara runtime paths compare with the named baselines under this method and environment?",
  revision: "sha256:bench-2026-08-19-b19e",
  methodology: "methodology:runtime-shootout/v3",
  evidence: "evidence:runtime-shootout/2026-08-19",
  comparability: "review-fixture"
};

export const benchmarkInsights = [
  {
    id: "steady-call",
    label: "Steady call path",
    value: "1.00× baseline",
    confidence: "high fixture",
    summary: "The selected integer call fixture matches the Rust-full baseline after warm-up.",
    evidence: "evidence:int-call/b19e"
  },
  {
    id: "collection",
    label: "Persistent collection path",
    value: "1.05–1.31×",
    confidence: "mixed fixture",
    summary: "Map and parser workloads remain close in this fixture, while allocation-sensitive paths require separate interpretation.",
    evidence: "evidence:collections/b19e"
  },
  {
    id: "startup",
    label: "Cold start",
    value: "Not comparable",
    confidence: "excluded",
    summary: "Wasm download, JVM startup, and native process launch answer different questions and are not combined.",
    evidence: "review:comparability/cold-start"
  }
];

export const benchmarkFilters = {
  runtimes: ["All runtimes", "Hara Wasm", "Hara JVM", "Hara native", "Rust", "Julia", "Node"],
  categories: ["All workloads", "Dispatch", "Collections", "Parsing", "Interop"],
  confidence: ["All confidence", "High", "Medium", "Low", "Incomparable"]
};

export const benchmarkColumns = [
  { id: "hara", label: "Hara native" },
  { id: "rust", label: "Rust full" },
  { id: "julia", label: "Julia" },
  { id: "node", label: "Node" }
];

export const benchmarkRows = [
  {
    id: "integer-call",
    category: "Dispatch",
    label: "integer-call",
    unit: "ns/op",
    results: {
      hara: { value: 18.4, display: "18.4", state: "selected", confidence: "high" },
      rust: { value: 18.4, display: "18.4", state: "baseline", confidence: "high" },
      julia: { value: 22.9, display: "22.9", state: "comparable", confidence: "high" },
      node: { value: 38.2, display: "38.2", state: "comparable", confidence: "high" }
    }
  },
  {
    id: "vector-map",
    category: "Collections",
    label: "vector-map",
    unit: "ns/op",
    results: {
      hara: { value: 41.7, display: "41.7", state: "advantage", confidence: "high" },
      rust: { value: 39.8, display: "39.8", state: "baseline", confidence: "high" },
      julia: { value: 49.2, display: "49.2", state: "comparable", confidence: "high" },
      node: { value: 78.4, display: "78.4", state: "comparable", confidence: "medium" }
    }
  },
  {
    id: "persistent-map",
    category: "Collections",
    label: "persistent-map",
    unit: "ns/op",
    results: {
      hara: { value: 113, display: "113", state: "comparable", confidence: "medium" },
      rust: { value: 108, display: "108", state: "baseline", confidence: "high" },
      julia: { value: null, display: "Different structure", state: "incomparable", confidence: "incomparable" },
      node: { value: 172, display: "172", state: "comparable", confidence: "medium" }
    }
  },
  {
    id: "parser-small",
    category: "Parsing",
    label: "parser-small",
    unit: "μs/op",
    results: {
      hara: { value: 6.2, display: "6.2", state: "advantage", confidence: "high" },
      rust: { value: 5.9, display: "5.9", state: "baseline", confidence: "high" },
      julia: { value: 7.8, display: "7.8", state: "comparable", confidence: "medium" },
      node: { value: null, display: "Missing", state: "missing", confidence: "low" }
    }
  },
  {
    id: "ffi-roundtrip",
    category: "Interop",
    label: "ffi-roundtrip",
    unit: "ns/op",
    results: {
      hara: { value: 84.1, display: "84.1", state: "low-confidence", confidence: "low" },
      rust: { value: 31.4, display: "31.4", state: "baseline", confidence: "high" },
      julia: { value: 72.8, display: "72.8", state: "low-confidence", confidence: "low" },
      node: { value: 91.6, display: "91.6", state: "low-confidence", confidence: "low" }
    }
  }
];

export const selectedBenchmark = {
  workload: "integer-call",
  comparison: "Hara native vs Rust full",
  hara: "18.4 ns/op",
  baseline: "18.4 ns/op",
  ratio: "1.00×",
  samples: 30,
  warmups: 12,
  rsd: "1.7%",
  confidence: "High",
  sourceRevision: "hara@9b6c10e",
  harnessRevision: "bench@b19e4a2",
  evidenceDigest: "sha256:b19e4a2f",
  environment: ["AMD Ryzen 7950X", "Ubuntu 24.04", "CPU 4 pinned", "performance governor", "release + LTO"],
  baselineConfig: ["rustc 1.89.0", "opt-level=3", "lto=fat", "target-cpu=native"],
  method: ["Warm process before sampling", "Thirty independent sample windows", "Median reported with RSD", "Outliers retained; exclusions require review receipt"],
  rawPath: "evidence/runtime-shootout/2026-08-19/integer-call.json"
};

export const benchmarkHistory = [
  { revision: "9b6c10e", date: "19 Aug", value: 18.4, delta: "−3.2%", note: "Dispatch cache avoids repeated symbol resolution." },
  { revision: "740a3c8", date: "12 Aug", value: 19.0, delta: "−1.0%", note: "Lowering emits direct integer path." },
  { revision: "3d1120a", date: "05 Aug", value: 19.2, delta: "+0.5%", note: "Namespace registry safety check added." },
  { revision: "0f6c41b", date: "29 Jul", value: 19.1, delta: "baseline", note: "First comparable harness revision." }
];

export const benchmarkResultStates = [
  {
    id: "missing",
    tone: "warning",
    eyebrow: "Missing result",
    title: "Node parser sample did not publish",
    summary: "The matrix shows a missing cell and keeps the workload visible instead of substituting zero or hiding the row.",
    details: ["Harness exited before receipt", "No ratio calculated", "Rerun request attached"]
  },
  {
    id: "incomparable",
    tone: "notice",
    eyebrow: "Incomparable",
    title: "Persistent collection semantics differ",
    summary: "The selected baseline uses mutable storage, so the interface withholds a winner and explains the semantic mismatch.",
    details: ["State: partial", "Reviewer: benchmark registry", "Reason is shareable"]
  },
  {
    id: "low-confidence",
    tone: "danger",
    eyebrow: "Low confidence",
    title: "FFI variance exceeds the review threshold",
    summary: "Values remain inspectable, but summary and ranking surfaces do not promote the result.",
    details: ["RSD: 12.8%", "Threshold: 5%", "Affinity investigation open"]
  }
];

export const benchmarkSourceRows = [
  { workload: "integer-call", source: "bench/int-call.hal", hara: "9b6c10e", baseline: "rust@1.89.0", method: "runtime-shootout/v3", evidence: "b19e4a2f", state: "Comparable" },
  { workload: "vector-map", source: "bench/vector-map.hal", hara: "9b6c10e", baseline: "rust@1.89.0", method: "runtime-shootout/v3", evidence: "8ca9117d", state: "Comparable" },
  { workload: "persistent-map", source: "bench/persistent-map.hal", hara: "9b6c10e", baseline: "rust@1.89.0", method: "collections/v2", evidence: "a0dc8271", state: "Partial" },
  { workload: "parser-small", source: "bench/parser-small.hal", hara: "9b6c10e", baseline: "rust@1.89.0", method: "parser/v4", evidence: "3e72be10", state: "Missing Node" },
  { workload: "ffi-roundtrip", source: "bench/ffi-roundtrip.hal", hara: "9b6c10e", baseline: "rust@1.89.0", method: "interop/v1", evidence: "f88c020a", state: "Low confidence" }
];

export const sharedOwnership = [
  { layer: "Shared visual language", owns: "Theme, tokens, buttons, fields, tables, badges, tool chrome, responsive primitives", source: "src/v2.css + src/astro/v2/*" },
  { layer: "Shared content contract", owns: "Schema namespaces, required fields, controlled facts, exact revision, evidence and receipts", source: "site/src/lib/v2-frontmatter.mjs" },
  { layer: "Hara public site", owns: "Family header, local navigation, overview ordering, docs reading shell, benchmark evidence composition", source: "site/src/components/v2-www/*" },
  { layer: "Downstream implementation", owns: "Production data, authentication, search index, runtime provider, benchmark registry and canonical domains", source: "hara-www / hara-docs / hara-benchmarks" }
];

export const adoptionNotes = [
  {
    product: "hara-www",
    consume: ["WwwFamilyHeader", "WwwSubnav", "hara.www contracts", "overview reading order"],
    replace: ["Fixture release feed", "Fixture package records", "Example runtime adapter"],
    preserve: "Definition → example → reference hierarchy and unavailable runtime state."
  },
  {
    product: "hara-docs",
    consume: ["Docs reading shell", "LiveHaraExample", "hara.docs contracts", "state specimens"],
    replace: ["Static search results", "Static API symbols", "Fixture version selector"],
    preserve: "Prose remains primary; executable examples are bounded and revision-pinned."
  },
  {
    product: "hara-benchmarks",
    consume: ["Result-summary ordering", "Evidence matrix", "selected-result ledger", "hara.benchmarks contracts"],
    replace: ["All numeric fixtures", "Evidence files", "Comparison review state"],
    preserve: "Every result exposes method, environment, samples, baseline, revision, and comparability."
  }
];

/**
 * Resolve a family-local path through an Astro base path.
 * @param {string} basePath
 * @param {string} path
 */
export function withBasePath(basePath, path) {
  const base = basePath.endsWith("/") ? basePath : `${basePath}/`;
  return `${base}${path.replace(/^\/+/, "")}`;
}

/** @param {string} id */
export function familyRouteById(id) {
  return familyRoutes.find((route) => route.id === id);
}

/** @param {string} id */
export function benchmarkRowById(id) {
  return benchmarkRows.find((row) => row.id === id);
}

export const benchmarkStateCounts = benchmarkRows.reduce((counts, row) => {
  for (const result of Object.values(row.results)) {
    counts[result.state] = (counts[result.state] ?? 0) + 1;
  }
  return counts;
}, {});
