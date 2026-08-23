import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  benchmarkComparison,
  benchmarkDistribution,
  benchmarkSmallMultiples,
  compatibilityCell,
  compatibilityTargets,
  dataVisualisationFixtureNotice,
  dataVisualisationPrinciples,
  evidenceStates,
  packageCompatibility,
  percentage,
  runtimeEventsAfter,
  runtimeTelemetry
} from "../site/src/lib/v2-data-visualisation.mjs";
import { catalogueItemById } from "../site/src/lib/v2-catalogue.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFile(resolve(root, path), "utf8");
const pagePath = "site/src/pages/data/index.astro";
const components = [
  "site/src/components/v2-data/DataBenchmarkEvidence.astro",
  "site/src/components/v2-data/DataCompatibilityEvidence.astro",
  "site/src/components/v2-data/DataRuntimeTelemetry.astro",
  "site/src/components/v2-data/DataEvidenceStates.astro"
];

test("data visualisation fixtures are deterministic and explicitly non-production", () => {
  assert.equal(dataVisualisationFixtureNotice.productionData, false);
  assert.match(dataVisualisationFixtureNotice.summary, /not current Hara performance or support claims/i);
  assert.match(dataVisualisationFixtureNotice.sourceRevision, /^[a-f0-9]{16}$/);
});

test("benchmark evidence retains metric, unit, direction, baseline, confidence, samples, method and revision", () => {
  assert.equal(benchmarkComparison.unit, "ms");
  assert.equal(benchmarkComparison.direction, "lower-is-better");
  assert.equal(benchmarkComparison.baseline, 0);
  assert.deepEqual(benchmarkComparison.domain, [0, 16]);
  assert.match(benchmarkComparison.confidence, /95%/);
  assert.ok(benchmarkComparison.sampleCount > 0);
  assert.ok(benchmarkComparison.methodology.length > 40);
  assert.match(benchmarkComparison.sourceRevision, /^bench-fixture:/);
  assert.ok(benchmarkComparison.series.some(({ state }) => state === "incomparable"));
});

test("small multiples disclose independent domains and missing values", () => {
  assert.equal(benchmarkSmallMultiples.length, 3);
  assert.ok(benchmarkSmallMultiples.every(({ domain, unit, sourceRevision }) => domain.length === 2 && unit && sourceRevision));
  assert.ok(benchmarkSmallMultiples.some(({ values }) => values.some(({ state }) => state === "missing")));
  assert.equal(benchmarkDistribution.bins.reduce((sum, { count }) => sum + count, 0), benchmarkComparison.sampleCount);
});

test("compatibility matrix covers supported, partial, unsupported, missing and incomparable as separate facts", () => {
  const states = new Set(packageCompatibility.flatMap(({ cells }) => Object.values(cells).map(({ state }) => state)));
  assert.deepEqual(states, new Set(["supported", "partial", "unsupported", "missing", "incomparable"]));
  assert.equal(packageCompatibility.length, 4);
  assert.equal(compatibilityTargets.length, 4);
  assert.equal(compatibilityCell("std-typed", "rust")?.state, "partial");
  assert.equal(compatibilityCell("unknown", "rust"), null);
  for (const pkg of packageCompatibility) {
    assert.match(pkg.releaseRevision, /^release:/);
    assert.equal(Object.keys(pkg.cells).length, compatibilityTargets.length);
    assert.ok(Object.values(pkg.cells).every(({ evidence }) => evidence.length > 0));
  }
});

test("runtime telemetry is fenced and event sequence is strictly monotonic", () => {
  assert.ok(runtimeTelemetry.session);
  assert.ok(runtimeTelemetry.generation > 0);
  assert.match(runtimeTelemetry.sourceRevision, /^source:/);
  assert.match(runtimeTelemetry.capabilityRevision, /^capabilities:/);
  const sequences = runtimeTelemetry.events.map(({ sequence }) => sequence);
  assert.deepEqual(sequences, [...sequences].sort((a, b) => a - b));
  assert.equal(new Set(sequences).size, sequences.length);
  assert.deepEqual(runtimeTelemetry.sequenceRange, [sequences[0], sequences.at(-1)]);
  assert.deepEqual(runtimeEventsAfter(145).map(({ sequence }) => sequence), [146, 147, 148]);
  assert.ok(runtimeTelemetry.events.some(({ state }) => state === "stale"));
  assert.ok(runtimeTelemetry.events.some(({ state }) => state === "unsupported"));
});

test("percentage helper is bounded and preserves null evidence", () => {
  assert.equal(percentage(null, [0, 10]), null);
  assert.equal(percentage(5, [0, 10]), 50);
  assert.equal(percentage(-2, [0, 10]), 0);
  assert.equal(percentage(12, [0, 10]), 100);
  assert.equal(percentage(5, [5, 5]), 0);
});

test("evidence-state and principle inventories preserve non-colour and authority rules", () => {
  assert.deepEqual(evidenceStates.map(({ id }) => id), ["missing", "stale", "partial", "unsupported", "incomparable"]);
  assert.equal(new Set(evidenceStates.map(({ symbol }) => symbol)).size, evidenceStates.length);
  assert.ok(dataVisualisationPrinciples.some((rule) => /colour with words, symbols/i.test(rule)));
  assert.ok(dataVisualisationPrinciples.some((rule) => /accessible table/i.test(rule)));
  assert.ok(dataVisualisationPrinciples.some((rule) => /products own data and methodology/i.test(rule)));
});

test("the route is active in the shared catalogue and composes all three reference applications", async () => {
  const route = catalogueItemById("data-visualisation");
  assert.equal(route?.path, "/data/");
  assert.equal(route?.href, "/data/");
  assert.equal(route?.status, "active");
  assert.equal(route?.issue, 91);
  await access(resolve(root, pagePath));
  const page = await read(pagePath);
  for (const component of ["DataBenchmarkEvidence", "DataCompatibilityEvidence", "DataRuntimeTelemetry", "DataEvidenceStates"]) {
    assert.match(page, new RegExp(`import ${component} from`));
    assert.match(page, new RegExp(`<${component}\\s*/>`));
  }
  for (const id of ["overview", "benchmarks", "compatibility", "telemetry", "states", "adoption"]) assert.match([page, ...(await Promise.all(components.map(read)))].join("\n"), new RegExp(`id=\\"${id}\\"`));
});

test("benchmark, compatibility and telemetry components expose accessible textual alternatives", async () => {
  const [benchmark, compatibility, telemetry] = await Promise.all(components.slice(0, 3).map(read));
  assert.match(benchmark, /Accessible data table and methodology/);
  assert.match(benchmark, /<caption>/);
  assert.match(benchmark, /role="img"/);
  assert.match(compatibility, /<caption>/);
  assert.match(compatibility, /data-compatibility-cards/);
  assert.match(compatibility, /symbols\[cell\.state\]/);
  assert.match(telemetry, /Accessible event table and session fence/);
  assert.match(telemetry, /Monotonic event sequence/);
  assert.doesNotMatch(telemetry, /aria-live="assertive"/);
});

test("public stylesheet is packaged, responsive, motion-safe and excludes protected-token definitions and perspective charts", async () => {
  const [css, packageJson] = await Promise.all([
    read("src/v2/data-visualisation.css"),
    read("package.json").then(JSON.parse)
  ]);
  assert.equal(packageJson.exports["./v2-data.css"], "./src/v2/data-visualisation.css");
  assert.ok(packageJson.files.includes("V2-DATA-VISUALISATION.md"));
  for (const selector of [".data-comparison-chart", ".data-confidence-range", ".data-small-multiples", ".data-compatibility-table", ".data-event-timeline", ".data-accessible-table"]) assert.match(css, new RegExp(selector.replace(".", "\\.")));
  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /@media \(max-width: 820px\)/);
  assert.match(css, /@media \(max-width: 560px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /perspective\s*:/i);
  assert.doesNotMatch(css, /transform:\s*rotate[XY]/i);
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/, "data stylesheet must consume protected tokens rather than redefine them");
});

test("written contract documents evidence states, accessibility, authority and downstream adoption", async () => {
  const document = await read("V2-DATA-VISUALISATION.md");
  for (const phrase of ["metric, unit, direction and baseline", "confidence", "Missing", "Stale", "Partial", "Unsupported", "Incomparable", "Accessibility contract", "Ownership boundary", "v2-data.css", "must not copy the guide fixtures"]) assert.match(document, new RegExp(phrase, "i"));
});
