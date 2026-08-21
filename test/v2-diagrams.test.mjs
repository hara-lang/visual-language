import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  architectureMap,
  diagramFixtureNotice,
  diagramNodeById,
  diagramPrinciples,
  diagramRelationKinds,
  diagramSummary,
  packageGraph,
  packageRelationsFor,
  runtimeFlow,
  sequenceDiagram,
  sequenceEventsAfter,
  sessionStateMachine,
  transitionAllowed
} from "../site/src/lib/v2-diagrams.mjs";
import {
  catalogueHref,
  catalogueItemById,
  catalogueItemIsCurrent
} from "../site/src/lib/v2-catalogue.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFile(resolve(root, path), "utf8");
const pagePath = "site/src/pages/v2/diagrams/index.astro";
const componentPaths = [
  "site/src/components/v2-diagrams/DiagramArchitecture.astro",
  "site/src/components/v2-diagrams/DiagramSequenceState.astro",
  "site/src/components/v2-diagrams/DiagramPackageGraph.astro",
  "site/src/components/v2-diagrams/DiagramGrammar.astro"
];

test("diagram fixtures are deterministic and explicitly non-authoritative", () => {
  assert.equal(diagramFixtureNotice.productionAuthority, false);
  assert.match(diagramFixtureNotice.summary, /deterministic Hara-shaped fixtures/i);
  assert.match(diagramFixtureNotice.summary, /remain authoritative/i);
  assert.match(diagramFixtureNotice.sourceRevision, /^diagram-fixture:[a-f0-9]{16}$/);
});

test("architecture maps distinguish current, proposed and external relations with exact evidence", () => {
  assert.equal(architectureMap.nodes.length, 10);
  assert.equal(architectureMap.relations.length, 9);
  assert.match(architectureMap.sourceRevision, /^hara:runtime-boundary@/);
  assert.ok(architectureMap.authority.length > 30);
  assert.deepEqual(new Set(architectureMap.relations.map(({ kind }) => kind)), new Set(["current", "external", "proposed"]));
  assert.equal(diagramNodeById(architectureMap, "catalog")?.label, "Direct callable catalog");
  assert.equal(diagramNodeById(architectureMap, "missing"), null);
  assert.ok(architectureMap.relations.every(({ from, to, label, evidence }) => from && to && label && evidence));
});

test("relation vocabulary communicates state with words, symbols and line treatment", () => {
  assert.deepEqual(diagramRelationKinds.map(({ id }) => id), ["current", "proposed", "external", "unavailable", "degraded"]);
  assert.equal(new Set(diagramRelationKinds.map(({ symbol }) => symbol)).size, diagramRelationKinds.length);
  assert.equal(new Set(diagramRelationKinds.map(({ line }) => line)).size, diagramRelationKinds.length);
  assert.ok(diagramRelationKinds.every(({ label, description }) => label.length > 4 && description.length > 30));
});

test("runtime flow retains the exact session, generation, source, backend and capability fence", () => {
  assert.match(runtimeFlow.fence.session, /^session:/);
  assert.ok(runtimeFlow.fence.generation > 0);
  assert.match(runtimeFlow.fence.sourceRevision, /^source:/);
  assert.equal(runtimeFlow.fence.requestedBackend, runtimeFlow.fence.actualBackend);
  assert.match(runtimeFlow.fence.capabilityRevision, /^capabilities:/);
  assert.deepEqual(runtimeFlow.stages.map(({ lane }) => lane), ["artifact", "command", "command", "observation", "receipt", "handoff"]);
  assert.equal(runtimeFlow.stages.at(-1)?.state, "unavailable");
  assert.match(runtimeFlow.stages.at(-1)?.output ?? "", /unavailable/i);
});

test("sequence events are strictly monotonic and preserve event classes and unavailable handoff", () => {
  const sequences = sequenceDiagram.events.map(({ sequence }) => sequence);
  assert.deepEqual(sequences, [141, 142, 143, 144, 145, 146, 147, 148]);
  assert.deepEqual(sequences, [...sequences].sort((left, right) => left - right));
  assert.equal(new Set(sequences).size, sequences.length);
  assert.deepEqual(new Set(sequenceDiagram.events.map(({ kind }) => kind)), new Set(["command", "message", "call", "fact", "receipt", "timeout"]));
  assert.equal(sequenceDiagram.events.at(-1)?.state, "unavailable");
  assert.deepEqual(sequenceEventsAfter(145).map(({ sequence }) => sequence), [146, 147, 148]);
  assert.ok(sequenceDiagram.events.every(({ revision }) => revision.length > 5));
});

test("session lifecycle declares initial, active, degraded and terminal states plus forbidden transitions", () => {
  assert.equal(sessionStateMachine.initial, "idle");
  assert.ok(sessionStateMachine.states.some(({ category }) => category === "initial"));
  assert.ok(sessionStateMachine.states.some(({ category }) => category === "active"));
  assert.ok(sessionStateMachine.states.some(({ category }) => category === "degraded"));
  assert.ok(sessionStateMachine.states.some(({ terminal }) => terminal));
  assert.equal(transitionAllowed("idle", "ready"), true);
  assert.equal(transitionAllowed("idle", "running"), false);
  assert.equal(transitionAllowed("completed", "running"), false);
  assert.equal(sessionStateMachine.forbidden.length, 3);
  assert.ok(sessionStateMachine.transitions.every(({ guard, evidence }) => guard.length > 8 && evidence.length > 8));
});

test("package graph keeps package, namespace, runtime and maintainer identities and edge semantics distinct", () => {
  assert.deepEqual(new Set(packageGraph.nodes.map(({ kind }) => kind)), new Set(["package", "namespace", "runtime", "maintainer"]));
  assert.deepEqual(new Set(packageGraph.edges.map(({ kind }) => kind)), new Set(["contains", "direct", "optional", "compatible", "partial", "incompatible", "superseded", "maintains"]));
  assert.ok(packageGraph.nodes.every(({ id, revision, owner, detail }) => id && revision && owner && detail));
  assert.ok(packageGraph.edges.every(({ id, from, to, direction, label }) => id && from && to && direction === "forward" && label));
  const stdWorkRelations = packageRelationsFor("std-work");
  assert.equal(stdWorkRelations.length, 6);
  assert.deepEqual(
    new Set(stdWorkRelations.map(({ id }) => id)),
    new Set([
      "package-contains-core",
      "package-contains-store",
      "sqlite-depends-work",
      "work-rust",
      "work-wasm",
      "mina-maintains-work"
    ])
  );
  assert.deepEqual(packageRelationsFor("missing"), []);
  assert.ok(packageGraph.edges.some(({ kind }) => kind === "incompatible"));
  assert.ok(packageGraph.edges.some(({ kind }) => kind === "superseded"));
});

test("diagram principles require textual equivalence, non-colour cues, narrow-width yielding and authority boundaries", () => {
  const principles = diagramPrinciples.join(" ");
  assert.match(principles, /arrows, line style, symbols and words/i);
  assert.match(principles, /ordered list, event table, transition table or adjacency table/i);
  assert.match(principles, /narrow widths/i);
  assert.match(principles, /products and registries own the facts/i);
  assert.equal(diagramSummary.architectureNodes, architectureMap.nodes.length);
  assert.equal(diagramSummary.sequenceEvents, sequenceDiagram.events.length);
  assert.equal(diagramSummary.stateTransitions, sessionStateMachine.transitions.length);
  assert.equal(diagramSummary.graphEdges, packageGraph.edges.length);
});

test("the diagrams route is active in the Foundations catalogue and uses the shared route shell", async () => {
  const route = catalogueItemById("diagrams");
  assert.ok(route);
  assert.equal(route.path, "/v2/diagrams/");
  assert.equal(route.href, "/v2/diagrams/");
  assert.equal(route.status, "active");
  assert.equal(route.issue, 100);
  assert.equal(catalogueHref(route, "/visual-language/"), "/visual-language/v2/diagrams/");
  assert.equal(catalogueItemIsCurrent(route, "/v2/diagrams/"), true);
  await access(resolve(root, pagePath));
  const page = await read(pagePath);
  assert.match(page, /import CatalogueHeader/);
  assert.match(page, /activePath="\/v2\/diagrams\/"/);
  assert.match(page, /initialiseDiagrams/);
  for (const component of ["DiagramArchitecture", "DiagramSequenceState", "DiagramPackageGraph", "DiagramGrammar"]) {
    assert.match(page, new RegExp(`import ${component} from`));
    assert.match(page, new RegExp(`<${component}\\s*/>`));
  }
});

test("all five reference compositions and shared grammar expose accessible textual equivalents", async () => {
  const sources = await Promise.all(componentPaths.map(read));
  const combined = sources.join("\n");
  for (const id of ["architecture", "flow", "sequence", "state", "graph", "grammar", "adoption"])
    assert.match(combined, new RegExp(`id=\\"${id}\\"`));
  assert.match(combined, /Equivalent relation list/);
  assert.match(combined, /Equivalent ordered flow/);
  assert.match(combined, /Equivalent monotonic event table/);
  assert.match(combined, /Equivalent transition table/);
  assert.match(combined, /Equivalent adjacency and evidence table/);
  assert.ok((combined.match(/<caption>/g) ?? []).length >= 4);
  assert.ok((combined.match(/role="img"/g) ?? []).length >= 5);
  assert.doesNotMatch(combined, /aria-live="assertive"/);
});

test("interaction helper supports selection, exact state stepping and non-persistent filtering", async () => {
  const script = await read("site/src/scripts/v2-diagrams.js");
  for (const marker of [
    "data-architecture-mode",
    "data-node-id",
    "data-sequence-mode",
    "data-state-action",
    "data-state-reset",
    "data-package-graph",
    "data-graph-relations"
  ]) assert.match(script, new RegExp(marker));
  assert.match(script, /export function initialiseDiagrams/);
  assert.match(script, /textContent/);
  assert.match(script, /replaceChildren/);
  assert.doesNotMatch(script, /localStorage|sessionStorage|document\.cookie/);
});

test("public diagrams stylesheet is packaged, responsive, print-safe and reduced-motion aware", async () => {
  const [css, packageJson] = await Promise.all([
    read("src/v2/diagrams.css"),
    read("package.json").then(JSON.parse)
  ]);
  assert.equal(packageJson.exports["./v2-diagrams.css"], "./src/v2/diagrams.css");
  assert.ok(packageJson.files.includes("V2-DIAGRAMS.md"));
  for (const selector of [
    ".diagram-architecture-visual",
    ".diagram-flow-visual",
    ".diagram-sequence-visual",
    ".diagram-state-visual",
    ".diagram-package-visual",
    ".diagram-alternative",
    ".diagram-table"
  ]) assert.match(css, new RegExp(selector.replace(".", "\\.")));
  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /@media \(max-width: 820px\)/);
  assert.match(css, /@media \(max-width: 560px\)/);
  assert.match(css, /\.diagram-visual\s*\{\s*display:\s*none/);
  assert.match(css, /@media print/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /perspective\s*:/i);
  assert.doesNotMatch(css, /transform:\s*rotate[XY]/i);
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/, "diagram stylesheet must consume protected Hara tokens rather than redefine them");
});

test("written contract covers evidence, accessibility, responsive delivery, ownership and downstream adoption", async () => {
  const document = await read("V2-DIAGRAMS.md");
  for (const phrase of [
    "Evidence before shape",
    "Boundary and confidence vocabulary",
    "Architecture and boundary maps",
    "Runtime and data-flow diagrams",
    "Sequence diagrams",
    "State-machine diagrams",
    "Package and namespace graphs",
    "Accessibility contract",
    "Responsive contract",
    "Print, PDF and low-bandwidth delivery",
    "Ownership boundary",
    "v2-diagrams.css",
    "must not copy the guide fixtures"
  ]) assert.match(document, new RegExp(phrase, "i"));
});
