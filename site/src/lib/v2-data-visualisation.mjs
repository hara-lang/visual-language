// @ts-check

/** @typedef {"supported" | "partial" | "unsupported" | "missing" | "incomparable"} CompatibilityState */

export const dataVisualisationFixtureNotice = {
  id: "hara-v2-data-visualisation-fixture-2026-08",
  label: "Evidence-graphics design fixture",
  sourceRevision: "9a88bddd7a539d7a",
  productionData: false,
  summary: "Representative benchmark, compatibility and runtime evidence for visual review. Values are deterministic fixtures, not current Hara performance or support claims."
};

export const benchmarkComparison = {
  id: "benchmark-cold-start-form",
  title: "Cold-start executable form",
  metric: "Median wall time",
  unit: "ms",
  direction: "lower-is-better",
  baseline: 0,
  domain: [0, 16],
  sampleCount: 30,
  confidence: "95% bootstrap interval",
  environment: "Linux x86_64 · 8 vCPU · 16 GiB · isolated process",
  methodology: "Thirty cold processes per implementation; median shown with a 95% bootstrap interval.",
  sourceRevision: "bench-fixture:7b2ac941",
  generatedAt: "2026-08-20T19:20:00Z",
  series: [
    { id: "hara-native", label: "Hara native", value: 4.8, low: 4.5, high: 5.2, samples: 30, evidence: "run:hara-native:7b2ac941" },
    { id: "babashka", label: "Babashka", value: 6.7, low: 6.2, high: 7.3, samples: 30, evidence: "run:babashka:3c88fe20" },
    { id: "clojure-jvm", label: "Clojure JVM", value: 12.4, low: 11.7, high: 13.2, samples: 30, evidence: "run:clojure-jvm:d67e091b" },
    { id: "hara-wasm", label: "Hara Wasm", value: null, low: null, high: null, samples: 0, state: "incomparable", evidence: "target lacks an equivalent process-start boundary" }
  ]
};

export const benchmarkSmallMultiples = [
  { id: "parse", label: "Parse 10k forms", unit: "ms", domain: [0, 45], sourceRevision: "workload:parse:1ce20d9a", values: [{ label: "Hara", value: 18.2 }, { label: "Clojure", value: 31.6 }, { label: "Babashka", value: 22.9 }] },
  { id: "map", label: "Map 1m integers", unit: "ms", domain: [0, 80], sourceRevision: "workload:map:830c1be2", values: [{ label: "Hara", value: 34.6 }, { label: "Clojure", value: 62.1 }, { label: "Babashka", value: 54.8 }] },
  { id: "dispatch", label: "Dispatch 100k calls", unit: "ms", domain: [0, 30], sourceRevision: "workload:dispatch:721d829e", values: [{ label: "Hara", value: 13.7 }, { label: "Clojure", value: 24.4 }, { label: "Babashka", value: null, state: "missing" }] }
];

export const benchmarkDistribution = {
  id: "native-cold-start-distribution",
  label: "Hara native cold-start distribution",
  unit: "ms",
  sourceRevision: "distribution:7b2ac941",
  bins: [
    { range: "4.2–4.5", count: 3 },
    { range: "4.5–4.8", count: 9 },
    { range: "4.8–5.1", count: 12 },
    { range: "5.1–5.4", count: 5 },
    { range: "5.4–5.7", count: 1 }
  ]
};

export const compatibilityTargets = [
  { id: "jvm", label: "JVM 21" },
  { id: "rust", label: "Rust native" },
  { id: "wasm", label: "Wasm32" },
  { id: "js", label: "JavaScript host" }
];

export const packageCompatibility = [
  {
    id: "std-typed",
    coordinate: "hara/std.typed@0.9.2",
    releaseRevision: "release:typed:b37d9b71",
    cells: {
      jvm: { state: "supported", version: "0.9.2", evidence: "61/61 conformance" },
      rust: { state: "partial", version: "0.9.2", evidence: "57/61; recursive aliases pending" },
      wasm: { state: "supported", version: "0.9.2", evidence: "40/40 portable subset" },
      js: { state: "unsupported", version: null, evidence: "No direct implementation" }
    }
  },
  {
    id: "std-work",
    coordinate: "hara/std.work@0.3.0-experimental",
    releaseRevision: "release:work:d4502d3d",
    cells: {
      jvm: { state: "supported", version: "0.3.0", evidence: "Reference executor" },
      rust: { state: "partial", version: "0.3.0", evidence: "Checkpoint store only" },
      wasm: { state: "unsupported", version: null, evidence: "Durability provider unavailable" },
      js: { state: "incomparable", version: null, evidence: "Host adapter has no durable-step contract" }
    }
  },
  {
    id: "std-native",
    coordinate: "hara/std.native@2.0.0",
    releaseRevision: "release:native:845cf281",
    cells: {
      jvm: { state: "supported", version: "2.0.0", evidence: "Portable + JVM capability inventory" },
      rust: { state: "supported", version: "2.0.0", evidence: "Portable + native capability inventory" },
      wasm: { state: "partial", version: "2.0.0", evidence: "Browser-safe capability subset" },
      js: { state: "missing", version: null, evidence: "Evidence index not received" }
    }
  },
  {
    id: "hara-wasm-core",
    coordinate: "hara/hara-wasm-core@1.4.0",
    releaseRevision: "release:wasm:71cc80f4",
    cells: {
      jvm: { state: "incomparable", version: null, evidence: "Browser session product, not a JVM package" },
      rust: { state: "incomparable", version: null, evidence: "Compiled through Rust but not installed as a native runtime" },
      wasm: { state: "supported", version: "1.4.0", evidence: "Browser session contract 40/40" },
      js: { state: "partial", version: "1.4.0", evidence: "JavaScript host bridge; evaluator remains Wasm" }
    }
  }
];

export const runtimeTelemetry = {
  id: "session-playground-7a91",
  session: "pg-7a91",
  generation: 4,
  sourceRevision: "source:9f3c2ab7",
  backend: "interpreter",
  capabilityRevision: "capabilities:1f72aa90",
  sequenceRange: [140, 148],
  window: "2026-08-20T19:22:04.100Z/2026-08-20T19:22:05.012Z",
  summary: [
    { label: "Evaluation", value: 83, unit: "ms", state: "ready" },
    { label: "Queue wait", value: 12, unit: "ms", state: "ready" },
    { label: "Heap estimate", value: 18.4, unit: "MiB", state: "partial" },
    { label: "3D capability", value: null, unit: null, state: "unsupported" }
  ],
  events: [
    { sequence: 140, offset: 0, type: "session.ready", state: "success", detail: "generation 4 · interpreter" },
    { sequence: 141, offset: 12, type: "eval.queued", state: "queued", detail: "source 9f3c2ab7" },
    { sequence: 142, offset: 21, type: "eval.started", state: "active", detail: "capabilities eval · observations" },
    { sequence: 143, offset: 46, type: "namespace.loaded", state: "success", detail: "tutorial.profile" },
    { sequence: 144, offset: 73, type: "observation", state: "partial", detail: "heap estimate sampled" },
    { sequence: 145, offset: 95, type: "eval.completed", state: "success", detail: "83 ms" },
    { sequence: 146, offset: 108, type: "canvas.unavailable", state: "unsupported", detail: "sample declares no canvas capability" },
    { sequence: 147, offset: 514, type: "heartbeat", state: "stale", detail: "interval exceeded 400 ms review threshold" },
    { sequence: 148, offset: 912, type: "session.observed", state: "success", detail: "monotonic sequence retained" }
  ]
};

export const evidenceStates = [
  { id: "missing", symbol: "—", label: "Missing", rule: "The expected evidence value was not received. Keep the empty fact and source boundary visible." },
  { id: "stale", symbol: "△", label: "Stale", rule: "The value exists but is older than the declared freshness window. Show its timestamp and threshold." },
  { id: "partial", symbol: "◐", label: "Partial", rule: "Only a named subset is available. State the numerator, denominator or missing dimensions." },
  { id: "unsupported", symbol: "×", label: "Unsupported", rule: "The implementation or target cannot produce this measure. Do not render it as zero." },
  { id: "incomparable", symbol: "≠", label: "Incomparable", rule: "The measurements do not share an equivalent boundary, unit or methodology." }
];

export const dataVisualisationPrinciples = [
  "Name metric, unit, direction and baseline next to the graphic.",
  "Retain exact source, methodology, environment and revision references.",
  "Use position and length before area, volume or decorative perspective.",
  "Pair colour with words, symbols, patterns or structural placement.",
  "Keep confidence, ranges and sample counts visible when a point estimate is shown.",
  "Render missing, stale, partial, unsupported and incomparable as different facts.",
  "Provide an accessible table or ordered textual alternative for every evidence graphic.",
  "Let products own data and methodology; the package owns presentation grammar only."
];

export function percentage(value, domain) {
  if (value == null) return null;
  const [minimum, maximum] = domain;
  if (maximum <= minimum) return 0;
  return Math.max(0, Math.min(100, ((value - minimum) / (maximum - minimum)) * 100));
}

export function compatibilityCell(packageId, targetId) {
  return packageCompatibility.find(({ id }) => id === packageId)?.cells?.[targetId] ?? null;
}

export function runtimeEventsAfter(sequence) {
  return runtimeTelemetry.events.filter((event) => event.sequence > sequence);
}

export const dataVisualisationSummary = {
  benchmarkSeries: benchmarkComparison.series.length,
  smallMultiples: benchmarkSmallMultiples.length,
  compatibilityPackages: packageCompatibility.length,
  compatibilityTargets: compatibilityTargets.length,
  runtimeEvents: runtimeTelemetry.events.length,
  evidenceStates: evidenceStates.length
};
