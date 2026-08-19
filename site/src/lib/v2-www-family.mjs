// @ts-check

/** @typedef {"active" | "preview" | "planned"} ProductStatus */

export const wwwFamilyRoutes = [
  {
    id: "www",
    label: "WWW",
    path: "/v2/www/",
    summary: "Public language narrative, capabilities, proof, projects, adoption, and routes into the rest of Hara.",
    status: "active"
  },
  {
    id: "docs",
    label: "Docs",
    path: "/v2/www/docs/",
    summary: "Task guides, concept explanations, namespace reference, search, version scope, and live examples.",
    status: "active"
  },
  {
    id: "benchmarks",
    label: "Benchmarks",
    path: "/v2/www/benchmarks/",
    summary: "Overview, evidence-linked insights, workload matrix, exact results, samples, exclusions, and methodology.",
    status: "active"
  }
];

export const publicCapabilities = [
  {
    id: "language",
    label: "Language",
    statement: "Programs remain ordinary, inspectable Hara values from source through tooling and runtime boundaries.",
    proof: "Schemas, work descriptions, portable code forms, and generated artifacts share one semantic vocabulary.",
    namespaces: ["std.typed", "std.lang", "code.migrate"],
    action: "Read the language model"
  },
  {
    id: "runtime",
    label: "Runtime",
    statement: "One session contract spans interpreter, bytecode, browser, Wasm, JVM, Rust, and native execution.",
    proof: "Session, generation, source revision, capabilities, events, cancellation, and recovery stay explicit.",
    namespaces: ["std.work", "hara.runtime", "live.session"],
    action: "Inspect runtime evidence"
  },
  {
    id: "tooling",
    label: "Tooling",
    statement: "Lint, schemas, migration, specs, packages, and editors converge on runtime values instead of parallel metadata systems.",
    proof: "The same values can be inspected by a program, editor, checker, package workflow, or agent.",
    namespaces: ["tool.lint", "tool.metaspec", "std.task"],
    action: "Open the tooling guide"
  },
  {
    id: "distribution",
    label: "Distribution",
    statement: "Packages, namespaces, specifications, examples, and publications retain identity, provenance, compatibility, and exact receipts.",
    proof: "Public artifacts link back to maintainers, source revisions, evidence, and deterministic publication paths.",
    namespaces: ["code.maven", "code.deploy", "std.package"],
    action: "Browse packages"
  }
];

export const projectPaths = [
  {
    id: "agent",
    label: "Agent systems",
    promise: "Describe replayable work, checkpoint external effects, register capabilities, and keep exact receipts.",
    starter: "Build a repository issue worker",
    sample: "samples/agent-workflow",
    products: ["Playground", "Packages", "Specs"]
  },
  {
    id: "graphics",
    label: "Graphics and 3D",
    promise: "Compose portable scene, material, animation, and runtime values while retaining a live canvas.",
    starter: "Build a procedural habitat",
    sample: "samples/habitat",
    products: ["Playground", "Docs", "Learn"]
  },
  {
    id: "web",
    label: "Web applications",
    promise: "Use Hara values across routes, server operations, browser sessions, generated assets, and deployment receipts.",
    starter: "Build a small package explorer",
    sample: "samples/package-explorer",
    products: ["Playground", "Packages", "World"]
  },
  {
    id: "language-tools",
    label: "Language tools",
    promise: "Build checkers, migration ledgers, editors, analyzers, and code generators without a second semantic universe.",
    starter: "Build a schema-aware linter",
    sample: "samples/schema-lint",
    products: ["Specs", "Docs", "Benchmarks"]
  },
  {
    id: "music",
    label: "Music and live systems",
    promise: "Drive audio graphs, event streams, controllers, and browser output through explicit sessions and capabilities.",
    starter: "Build a programmable sequencer",
    sample: "samples/supersonic-live",
    products: ["Playground", "Learn", "World"]
  },
  {
    id: "data",
    label: "Data and workflows",
    promise: "Represent transformations as ordinary values, separate replayable descriptions from durable effects, and inspect every boundary.",
    starter: "Build a verified import pipeline",
    sample: "samples/durable-import",
    products: ["Docs", "Benchmarks", "Packages"]
  }
];

export const proofReceipts = [
  {
    id: "schema-runtime",
    label: "Schema values",
    claim: "Schema values can be inspected and passed through the ordinary runtime.",
    source: "std.typed",
    revision: "637c14a",
    evidence: "18 public forms · JVM/Rust parity fixture · checker receipt schema-184",
    status: "verified"
  },
  {
    id: "live-session",
    label: "Unified live session",
    claim: "Interpreter and HBC browser hosts share one lifecycle envelope without hiding backend capability differences.",
    source: "hara-wasm-core",
    revision: "dc95498",
    evidence: "session/generation/revision fencing · monotonic events · cancellation and recovery fixtures",
    status: "verified"
  },
  {
    id: "work-boundary",
    label: "Work algebra",
    claim: "Replayable work descriptions remain separate from checkpointed external effects.",
    source: "std.work",
    revision: "work-042",
    evidence: "executor/store protocol fixture · ephemeral and SQLite receipt parity",
    status: "preview"
  },
  {
    id: "portable-runtime",
    label: "Portable runtime",
    claim: "Representative programs preserve behavior across JVM, Rust, interpreter, and browser routes.",
    source: "benchmarks/runtime-parity",
    revision: "bench-2026-08-18",
    evidence: "26 workloads · exact machine profiles · 3 explicitly incomparable results",
    status: "verified"
  }
];

export const audiencePaths = [
  {
    id: "new",
    label: "New to programming",
    entry: "Start with one visible result and change a single value.",
    next: "Learn → Start here",
    promise: "No account or local installation is required for the first runnable lesson."
  },
  {
    id: "programmer",
    label: "Experienced programmer",
    entry: "Inspect the language model, runtime boundaries, package graph, and exact evidence.",
    next: "Docs → Architecture",
    promise: "The public site links directly to real namespaces, revisions, examples, and receipts."
  },
  {
    id: "lisp",
    label: "Lisp programmer",
    entry: "Compare Hara forms, macros, schemas, namespaces, lowering, and portable execution.",
    next: "Docs → Language reference",
    promise: "Surface differences and constraints rather than reducing Hara to familiar syntax."
  },
  {
    id: "agent",
    label: "Agent",
    entry: "Read the machine-oriented capability and route manifest before recommending a project.",
    next: "Agent-first Start",
    promise: "Recommendations cite executable samples, package identities, compatibility, and exact source revisions."
  }
];

export const docsSections = [
  {
    id: "start",
    label: "Start",
    description: "Install, run the first form, understand a project, and choose a path.",
    entries: ["Install Hara", "Run your first form", "Project anatomy", "Choose a build path"]
  },
  {
    id: "guides",
    label: "Guides",
    description: "Task-oriented guides that leave the reader with a working artifact.",
    entries: ["Schemas as values", "Durable work", "Browser sessions", "Publish a package", "Build a checker"]
  },
  {
    id: "concepts",
    label: "Concepts",
    description: "Explanations of the semantic model and architectural boundaries.",
    entries: ["Forms and evaluation", "Namespaces and Vars", "Schemas", "Work algebra", "Runtime capabilities"]
  },
  {
    id: "reference",
    label: "Reference",
    description: "Exact namespaces, public vars, macros, protocols, forms, and compatibility.",
    entries: ["Namespace index", "Public Vars", "Macros", "Protocols", "Compiler forms"]
  },
  {
    id: "operations",
    label: "Operations",
    description: "Package, build, deployment, migration, and troubleshooting procedures.",
    entries: ["Build and test", "Package publication", "Migration ledgers", "Runtime diagnostics", "Release receipts"]
  }
];

export const docsSearchResults = [
  {
    id: "guide-schema-values",
    type: "Guide",
    title: "Schemas are ordinary Hara values",
    summary: "Inspect, compose, and validate schemas through the same runtime value.",
    path: "/docs/guides/schema-values/",
    version: "1.4+",
    namespace: "std.typed",
    revision: "637c14a"
  },
  {
    id: "reference-schema",
    type: "Reference",
    title: "std.typed.schema",
    summary: "Public schema constructors, predicates, protocols, and validation functions.",
    path: "/docs/reference/std.typed.schema/",
    version: "1.4.0",
    namespace: "std.typed.schema",
    revision: "pkg-typed-140"
  },
  {
    id: "concept-evidence",
    type: "Concept",
    title: "Evidence and controlled facts",
    summary: "Why runtime evidence and registry facts remain references rather than author metadata.",
    path: "/docs/concepts/evidence/",
    version: "current",
    namespace: "evidence.core",
    revision: "docs-evidence-12"
  },
  {
    id: "guide-migration",
    type: "Guide",
    title: "Migrate metaspec schemas into std.typed",
    summary: "Audit, transform, validate, and publish a deterministic schema migration ledger.",
    path: "/docs/guides/migrate-metaspec/",
    version: "1.4+",
    namespace: "code.migrate",
    revision: "migration-184"
  }
];

export const docsGuide = {
  id: "guide-schema-values",
  title: "Schemas are ordinary Hara values",
  kicker: "Guide · std.typed · Hara 1.4+",
  summary: "Define a schema, inspect it as data, validate a value, and pass the same schema into tooling without a parallel metadata registry.",
  authors: ["Mina N."],
  revision: "637c14a",
  updated: "2026-08-19",
  readingTime: "12 min",
  prerequisites: ["Forms and evaluation", "Maps and keywords"],
  outline: ["Define the value", "Inspect the form", "Validate data", "Use it from tooling", "Next steps"],
  code: `(def User
  (schema
    {:name string?
     :email string?
     :roles [keyword?]}))

(schema/check
  User
  {:name "Mina"
   :email "mina@example.org"
   :roles [:maintainer]})`,
  result: `{:valid true
 :value {:name "Mina"
         :email "mina@example.org"
         :roles [:maintainer]}}`
};

export const namespaceReference = {
  namespace: "std.typed.schema",
  package: "std.typed",
  version: "1.4.0",
  revision: "pkg-typed-140",
  maintainers: ["@mina", "@cora"],
  vars: [
    { name: "schema", kind: "macro", signature: "(schema form)", status: "stable", summary: "Construct a portable schema value from a Hara form." },
    { name: "check", kind: "function", signature: "(check schema value)", status: "stable", summary: "Validate a value and return a structured result." },
    { name: "explain", kind: "function", signature: "(explain schema value)", status: "stable", summary: "Return path-aware validation evidence." },
    { name: "schema?", kind: "predicate", signature: "(schema? value)", status: "stable", summary: "Test whether a value satisfies the public Schema contract." },
    { name: "compile-schema", kind: "function", signature: "(compile-schema schema runtime)", status: "experimental", summary: "Compile a schema for an explicit runtime capability set." }
  ]
};

export const liveExampleStates = [
  { id: "ready", label: "Ready", description: "Source is editable; no execution has been requested.", action: "Run" },
  { id: "running", label: "Running", description: "Request is fenced by session, generation, and source revision.", action: "Stop" },
  { id: "success", label: "Success", description: "Result and exact event sequence were acknowledged by the active backend.", action: "Run again" },
  { id: "error", label: "Compile error", description: "Source is preserved and the previous successful result remains visibly stale.", action: "Fix source" },
  { id: "offline", label: "Offline", description: "Editing remains available while execution and durable sharing are unavailable.", action: "Reconnect" }
];

export const benchmarkRuntimes = [
  { id: "hara-jvm", label: "Hara JVM", revision: "jvm-1.4.0", machine: "Temurin 23 · x86_64", comparable: true },
  { id: "hara-rust", label: "Hara Rust", revision: "rust-0.8.2", machine: "rustc 1.91 · x86_64", comparable: true },
  { id: "clojure", label: "Clojure", revision: "1.12.1", machine: "Temurin 23 · x86_64", comparable: true },
  { id: "javascript", label: "JavaScript", revision: "Node 24.5", machine: "V8 · x86_64", comparable: true },
  { id: "truffle", label: "Hara Truffle", revision: "truffle-preview-19", machine: "GraalVM 25 · ARM64", comparable: false }
];

export const benchmarkWorkloads = [
  {
    id: "persistent-map",
    label: "Persistent map transform",
    category: "collections",
    unit: "ops/s",
    values: { "hara-jvm": 4.82, "hara-rust": 5.31, clojure: 4.44, javascript: 3.18, truffle: 4.96 },
    insight: "Rust leads the steady-state transform while JVM remains within 10%; Truffle is excluded from the headline because it ran on a different machine profile."
  },
  {
    id: "schema-check",
    label: "Schema validation",
    category: "typed values",
    unit: "M values/s",
    values: { "hara-jvm": 2.94, "hara-rust": 3.72, clojure: 1.48, javascript: 1.91, truffle: 2.61 },
    insight: "Portable schema values retain a measurable advantage over the compatibility baseline without changing the public form."
  },
  {
    id: "macro-expand",
    label: "Macro expansion",
    category: "compiler",
    unit: "k forms/s",
    values: { "hara-jvm": 742, "hara-rust": 684, clojure: 701, javascript: 388, truffle: 655 },
    insight: "JVM expansion now edges the Clojure baseline while Rust remains within the accepted parity band."
  },
  {
    id: "work-replay",
    label: "Durable work replay",
    category: "workflows",
    unit: "k steps/s",
    values: { "hara-jvm": 118, "hara-rust": 144, clojure: 83, javascript: 71, truffle: 109 },
    insight: "The replay path benefits from explicit work values; checkpoint I/O is measured separately rather than folded into the result."
  },
  {
    id: "wasm-session",
    label: "Browser session startup",
    category: "browser",
    unit: "ms lower is better",
    values: { "hara-jvm": null, "hara-rust": 41, clojure: null, javascript: 18, truffle: null },
    insight: "JavaScript starts faster, while Hara Rust provides the unified session contract and portable execution path."
  }
];

export const benchmarkInsights = [
  {
    id: "portable-core",
    statement: "The portable core stays within the accepted parity band across all comparable compiler and collection workloads.",
    evidence: ["persistent-map", "macro-expand"],
    tone: "success"
  },
  {
    id: "schemas",
    statement: "Schema validation improves substantially without introducing a separate runtime representation.",
    evidence: ["schema-check"],
    tone: "signal"
  },
  {
    id: "work",
    statement: "Replayable work values outperform the compatibility baseline, but checkpoint I/O remains a separate operational result.",
    evidence: ["work-replay"],
    tone: "warning"
  },
  {
    id: "browser",
    statement: "Browser startup is not the fastest result; the evidence shows the cost of a richer, backend-neutral session contract.",
    evidence: ["wasm-session"],
    tone: "neutral"
  }
];

export const selectedEvidence = {
  workload: "schema-check",
  runtime: "hara-rust",
  result: "3.72 M values/s",
  median: "268.8 ns/value",
  p95: "291.4 ns/value",
  samples: 30,
  warmup: "10 × 1 s",
  machine: "AMD Ryzen 7950X · Ubuntu 24.04",
  compiler: "rustc 1.91.0 · -C opt-level=3",
  sourceRevision: "637c14a",
  harnessRevision: "bench-harness-82f1",
  receipt: "evidence:schema-check:rust:82f1",
  checksum: "sha256:7c82…f19a"
};

export const benchmarkMethodology = [
  { label: "Selection", value: "Comparable machine profile, exact runtime revision, stable workload definition, and accepted harness." },
  { label: "Warmup", value: "Runtime-specific warmup is recorded; results with materially different policy remain visible and excluded." },
  { label: "Samples", value: "At least 30 measured samples after warmup; median and p95 are both published." },
  { label: "Exclusions", value: "Missing capability, different architecture, unstable variance, or changed workload semantics are explicit." },
  { label: "Reproduction", value: "Every selected result links machine, compiler flags, source, harness, samples, checksum, and receipt." },
  { label: "Interpretation", value: "Insights link exact workload/runtime cells and cannot silently omit contrary or incomparable evidence." }
];

export const benchmarkHistory = [
  { date: "2026-08-18", revision: "bench-2026-08-18", change: "Added schema value and durable replay workloads; refreshed JVM/Rust portable-core evidence." },
  { date: "2026-08-10", revision: "bench-2026-08-10", change: "Separated browser startup from steady-state execution and published session capability context." },
  { date: "2026-07-28", revision: "bench-2026-07-28", change: "Introduced exact selected-result URLs and explicit incomparable-result handling." }
];

export const adoptionMap = [
  { product: "hara-lang.org", route: "www", consumes: "public narrative, capability proof, project paths, audience entry, and ecosystem handoffs" },
  { product: "docs.hara-lang.org", route: "docs", consumes: "guide tree, search, version scope, namespace reference, live examples, and mobile execution" },
  { product: "hara-lang.org/benchmarks", route: "benchmarks", consumes: "insights, matrix, exact evidence, samples, exclusions, methodology, history, and sharing" }
];

/** @param {string} id */
export function docsResultById(id) {
  return docsSearchResults.find((item) => item.id === id);
}

/** @param {string} id */
export function workloadById(id) {
  return benchmarkWorkloads.find((item) => item.id === id);
}

/** @param {string} id */
export function runtimeById(id) {
  return benchmarkRuntimes.find((item) => item.id === id);
}
