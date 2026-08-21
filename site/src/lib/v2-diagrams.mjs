// @ts-check

export const diagramFixtureNotice = {
  id: "hara-v2-diagrams-2026-08",
  label: "Design-review fixtures",
  sourceRevision: "diagram-fixture:4d3d7a2c1f6b9e08",
  productionAuthority: false,
  summary: "The diagrams use deterministic Hara-shaped fixtures to review visual grammar. Product repositories, runtimes, registries and specifications remain authoritative for architecture, events, states, dependencies and receipts."
};

export const diagramRelationKinds = [
  { id: "current", label: "Current boundary", symbol: "●", line: "solid", description: "Implemented and evidenced by the cited source revision." },
  { id: "proposed", label: "Proposed boundary", symbol: "◇", line: "dashed", description: "A planned relationship that must not be presented as current behavior." },
  { id: "external", label: "External authority", symbol: "↗", line: "double", description: "Identity or facts are controlled outside the illustrated product." },
  { id: "unavailable", label: "Unavailable path", symbol: "×", line: "broken", description: "The path cannot currently complete; this is not the same as failure." },
  { id: "degraded", label: "Degraded path", symbol: "!", line: "dotted", description: "The path remains usable with explicitly reduced guarantees." }
];

export const architectureMap = {
  id: "shared-callable-runtime",
  title: "Shared callable and host boundary",
  sourceRevision: "hara:runtime-boundary@62ceb4a16b4f361a",
  authority: "hara-lang/hara implementation and accepted runtime contracts",
  nodes: [
    { id: "source", label: "Hara source", kind: "artifact", status: "current", owner: "Author / repository", detail: "Exact repository, branch, path and source revision." },
    { id: "front-end", label: "Reader + front end", kind: "service", status: "current", owner: "Hara language", detail: "Parsing, syntax, macros and explicit semantic evaluation." },
    { id: "catalog", label: "Direct callable catalog", kind: "boundary", status: "current", owner: "Hara runtime", detail: "Symbol, arity, feature availability, origin and direct implementation." },
    { id: "tree", label: "Tree evaluator", kind: "host", status: "current", owner: "Hara runtime", detail: "Consumes the same callable values as other hosts." },
    { id: "fiber", label: "Fiber evaluator", kind: "host", status: "current", owner: "Hara runtime", detail: "Uses the shared catalog without structural evaluator re-entry." },
    { id: "bytecode", label: "Bytecode VM", kind: "host", status: "current", owner: "Hara runtime", detail: "Consumes the shared callable boundary." },
    { id: "native", label: "Native CLI", kind: "host", status: "current", owner: "Hara hosts", detail: "Provides process and filesystem capabilities explicitly." },
    { id: "wasm", label: "Browser / Wasm", kind: "host", status: "current", owner: "Hara hosts", detail: "Capability-fenced browser execution." },
    { id: "packages", label: "Package registry", kind: "authority", status: "external", owner: "Packages", detail: "Coordinates, releases, artifacts and compatibility facts." },
    { id: "remote", label: "Remote evaluator", kind: "host", status: "proposed", owner: "Future host", detail: "Not part of the current shared-host contract." }
  ],
  relations: [
    { id: "source-front", from: "source", to: "front-end", kind: "current", label: "read exact source", evidence: "source revision" },
    { id: "front-catalog", from: "front-end", to: "catalog", kind: "current", label: "resolve ordinary callable", evidence: "catalog revision" },
    { id: "catalog-tree", from: "catalog", to: "tree", kind: "current", label: "direct value", evidence: "runtime test" },
    { id: "catalog-fiber", from: "catalog", to: "fiber", kind: "current", label: "direct value", evidence: "runtime test" },
    { id: "catalog-bytecode", from: "catalog", to: "bytecode", kind: "current", label: "direct value", evidence: "VM test" },
    { id: "catalog-native", from: "catalog", to: "native", kind: "current", label: "capability-fenced call", evidence: "host receipt" },
    { id: "catalog-wasm", from: "catalog", to: "wasm", kind: "current", label: "capability-fenced call", evidence: "browser receipt" },
    { id: "packages-source", from: "packages", to: "source", kind: "external", label: "release identity", evidence: "registry receipt" },
    { id: "catalog-remote", from: "catalog", to: "remote", kind: "proposed", label: "future transport", evidence: "proposal only" }
  ]
};

export const runtimeFlow = {
  id: "session-run-receipt",
  title: "Session command, observation and receipt flow",
  fence: {
    session: "session:7c2d9a1e",
    generation: 4,
    sourceRevision: "source:4f31d2c8",
    requestedBackend: "wasm-hbc",
    actualBackend: "wasm-hbc",
    capabilityRevision: "capabilities:browser-safe@3"
  },
  stages: [
    { id: "load", label: "Load source", lane: "artifact", output: "exact source value", state: "current" },
    { id: "attach", label: "Attach capabilities", lane: "command", output: "capability fence", state: "current" },
    { id: "run", label: "Run form", lane: "command", output: "command 147", state: "current" },
    { id: "observe", label: "Observe result", lane: "observation", output: "value [2 3 4]", state: "current" },
    { id: "checkpoint", label: "Checkpoint boundary", lane: "receipt", output: "receipt 148", state: "current" },
    { id: "publish", label: "Publish share", lane: "handoff", output: "unavailable offline", state: "unavailable" }
  ],
  relations: [
    { from: "load", to: "attach", kind: "value", label: "source value" },
    { from: "attach", to: "run", kind: "command", label: "requested capabilities" },
    { from: "run", to: "observe", kind: "observation", label: "monotonic event 147" },
    { from: "observe", to: "checkpoint", kind: "receipt", label: "exact result boundary" },
    { from: "checkpoint", to: "publish", kind: "handoff", label: "network capability missing" }
  ]
};

export const sequenceDiagram = {
  id: "playground-session-sequence",
  title: "Playground run with exact session fencing",
  sourceRevision: "sequence:playground-run@1",
  lanes: [
    { id: "person", label: "Programmer", kind: "actor" },
    { id: "playground", label: "Playground", kind: "product" },
    { id: "host", label: "Session host", kind: "provider" },
    { id: "runtime", label: "Hara runtime", kind: "runtime" },
    { id: "receipts", label: "Receipt store", kind: "registry" }
  ],
  events: [
    { sequence: 141, from: "person", to: "playground", kind: "command", label: "Run exact source", revision: "source:4f31d2c8", state: "current" },
    { sequence: 142, from: "playground", to: "host", kind: "message", label: "Create generation 4", revision: "session:7c2d9a1e", state: "current" },
    { sequence: 143, from: "host", to: "runtime", kind: "call", label: "Evaluate with browser-safe capabilities", revision: "capabilities:browser-safe@3", state: "current" },
    { sequence: 144, from: "runtime", to: "host", kind: "fact", label: "Return value [2 3 4]", revision: "runtime:hbc@12", state: "current" },
    { sequence: 145, from: "host", to: "receipts", kind: "receipt", label: "Append observation receipt", revision: "receipt:145", state: "current" },
    { sequence: 146, from: "receipts", to: "playground", kind: "fact", label: "Confirm monotonic checkpoint", revision: "receipt:146", state: "current" },
    { sequence: 147, from: "playground", to: "person", kind: "fact", label: "Render result and fence", revision: "view:147", state: "current" },
    { sequence: 148, from: "playground", to: "receipts", kind: "timeout", label: "Share receipt unavailable offline", revision: "network:none", state: "unavailable" }
  ]
};

export const sessionStateMachine = {
  id: "session-lifecycle",
  title: "Browser session lifecycle",
  sourceRevision: "state:session-lifecycle@4",
  initial: "idle",
  states: [
    { id: "idle", label: "Idle", category: "initial", terminal: false, description: "No session exists." },
    { id: "ready", label: "Ready", category: "active", terminal: false, description: "Session identity and capabilities are attached." },
    { id: "running", label: "Running", category: "active", terminal: false, description: "One command is active for the current generation." },
    { id: "cancelling", label: "Cancelling", category: "degraded", terminal: false, description: "Terminal cancellation has been requested." },
    { id: "completed", label: "Completed", category: "terminal", terminal: true, description: "Observation and receipt are final for the generation." },
    { id: "failed", label: "Failed", category: "terminal", terminal: true, description: "Execution ended with an inspectable failure receipt." },
    { id: "disposed", label: "Disposed", category: "terminal", terminal: true, description: "Resources are released; disposal is idempotent." }
  ],
  transitions: [
    { from: "idle", to: "ready", label: "create", guard: "source and capability fence valid", evidence: "session-created receipt" },
    { from: "ready", to: "running", label: "run", guard: "no active command", evidence: "command-started event" },
    { from: "running", to: "completed", label: "complete", guard: "result available", evidence: "observation receipt" },
    { from: "running", to: "failed", label: "fail", guard: "terminal error", evidence: "failure receipt" },
    { from: "running", to: "cancelling", label: "cancel", guard: "command still active", evidence: "cancel-requested event" },
    { from: "cancelling", to: "failed", label: "cancelled", guard: "terminal cancellation observed", evidence: "cancelled receipt" },
    { from: "ready", to: "disposed", label: "dispose", guard: "no active command", evidence: "dispose receipt" },
    { from: "completed", to: "disposed", label: "dispose", guard: "generation terminal", evidence: "dispose receipt" },
    { from: "failed", to: "disposed", label: "dispose", guard: "generation terminal", evidence: "dispose receipt" }
  ],
  forbidden: [
    { from: "idle", to: "running", reason: "A session identity and capability fence must exist first." },
    { from: "completed", to: "running", reason: "A terminal generation cannot restart; create a replacement generation." },
    { from: "disposed", to: "ready", reason: "Disposed identity cannot be reactivated." }
  ]
};

export const packageGraph = {
  id: "package-namespace-graph",
  title: "Package, namespace, runtime and maintainer relationships",
  sourceRevision: "registry-fixture:packages@8",
  nodes: [
    { id: "std-work", label: "std.work", kind: "package", revision: "release:0.4.2", owner: "@mina", status: "current", detail: "Portable work algebra and executor/store interfaces." },
    { id: "std-work-sqlite", label: "std.work.sqlite", kind: "package", revision: "release:0.2.0", owner: "@mina", status: "current", detail: "SQLite work store and receipt ledger." },
    { id: "work-core", label: "work.core", kind: "namespace", revision: "namespace:17", owner: "@mina", status: "current", detail: "Public work constructors and predicates." },
    { id: "work-store", label: "work.store", kind: "namespace", revision: "namespace:12", owner: "@mina", status: "current", detail: "IWorkStore boundary." },
    { id: "work-runtime-old", label: "work.runtime", kind: "namespace", revision: "namespace:8", owner: "@archive", status: "superseded", detail: "Older wrapper superseded by executor/store separation." },
    { id: "rust", label: "Rust native", kind: "runtime", revision: "target:rust@12", owner: "Runtime", status: "current", detail: "Supported direct-callable host." },
    { id: "wasm", label: "Browser / Wasm", kind: "runtime", revision: "target:wasm@9", owner: "Runtime", status: "partial", detail: "Capability-free and browser-safe packages only." },
    { id: "native-image", label: "Native image", kind: "runtime", revision: "target:native-image@2", owner: "Runtime", status: "incompatible", detail: "SQLite provider unavailable in this fixture." },
    { id: "mina", label: "@mina", kind: "maintainer", revision: "identity:github@mina", owner: "GitHub", status: "external", detail: "Verified package publisher and namespace maintainer." }
  ],
  edges: [
    { id: "package-contains-core", from: "std-work", to: "work-core", kind: "contains", direction: "forward", label: "exports" },
    { id: "package-contains-store", from: "std-work", to: "work-store", kind: "contains", direction: "forward", label: "exports" },
    { id: "sqlite-depends-work", from: "std-work-sqlite", to: "std-work", kind: "direct", direction: "forward", label: "depends on" },
    { id: "sqlite-optional-store", from: "std-work-sqlite", to: "work-store", kind: "optional", direction: "forward", label: "provider implementation" },
    { id: "work-rust", from: "std-work", to: "rust", kind: "compatible", direction: "forward", label: "supported" },
    { id: "work-wasm", from: "std-work", to: "wasm", kind: "partial", direction: "forward", label: "portable subset" },
    { id: "sqlite-native-image", from: "std-work-sqlite", to: "native-image", kind: "incompatible", direction: "forward", label: "provider unavailable" },
    { id: "runtime-superseded", from: "work-runtime-old", to: "work-store", kind: "superseded", direction: "forward", label: "migrate to" },
    { id: "mina-maintains-work", from: "mina", to: "std-work", kind: "maintains", direction: "forward", label: "publisher" },
    { id: "mina-maintains-sqlite", from: "mina", to: "std-work-sqlite", kind: "maintains", direction: "forward", label: "publisher" }
  ]
};

export const diagramPrinciples = [
  "Name the diagram, exact source revision and authority before asking the shape to carry meaning.",
  "Use arrows, line style, symbols and words together; colour is a reinforcing cue only.",
  "Separate current, proposed, external, unavailable and degraded boundaries explicitly.",
  "Provide an equivalent ordered list, event table, transition table or adjacency table for every visual composition.",
  "At narrow widths, prefer the textual alternative over shrinking labels and relations into illegibility.",
  "Visual Language owns grammar and accessibility; products and registries own the facts and publication decisions."
];

export const diagramSummary = {
  architectureNodes: architectureMap.nodes.length,
  architectureRelations: architectureMap.relations.length,
  flowStages: runtimeFlow.stages.length,
  sequenceEvents: sequenceDiagram.events.length,
  stateTransitions: sessionStateMachine.transitions.length,
  graphNodes: packageGraph.nodes.length,
  graphEdges: packageGraph.edges.length,
  relationKinds: diagramRelationKinds.length
};

/** @param {{nodes: {id:string}[]} } diagram @param {string} id */
export function diagramNodeById(diagram, id) {
  return diagram.nodes.find((node) => node.id === id) ?? null;
}

/** @param {string} id */
export function packageRelationsFor(id) {
  return packageGraph.edges.filter(({ from, to }) => from === id || to === id);
}

/** @param {number} sequence */
export function sequenceEventsAfter(sequence) {
  return sequenceDiagram.events.filter((event) => event.sequence > sequence);
}

/** @param {string} from @param {string} to */
export function transitionAllowed(from, to) {
  return sessionStateMachine.transitions.some((transition) => transition.from === from && transition.to === to);
}
