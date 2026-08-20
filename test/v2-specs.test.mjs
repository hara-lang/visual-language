import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  changeDigest,
  checkerResult,
  checkerScenarios,
  conformanceForSpecification,
  conformanceMatrix,
  filterSpecifications,
  proposalFixture,
  proposalStates,
  registryDegradedStates,
  specificationById,
  specifications,
  specificationStatuses,
  specsFixtureNotice,
  specsRegistrySummary
} from "../site/src/lib/v2-specs.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFile(resolve(root, path), "utf8");
const pagePath = "site/src/pages/v2/specs/index.astro";
const componentPaths = [
  "site/src/components/v2-specs/SpecsRegistry.astro",
  "site/src/components/v2-specs/SpecsChecker.astro",
  "site/src/components/v2-specs/SpecsProposal.astro"
];

test("Specs fixture is explicit, deterministic, and covers every lifecycle state", () => {
  assert.equal(specsFixtureNotice.productionData, false);
  assert.match(specsFixtureNotice.summary, /not a live/i);
  assert.equal(specsFixtureNotice.sourceRevision.length, 16);

  assert.deepEqual(specificationStatuses.map(({ id }) => id), [
    "draft", "proposed", "accepted", "superseded", "withdrawn", "experimental"
  ]);
  assert.deepEqual(new Set(specifications.map(({ status }) => status)), new Set(specificationStatuses.map(({ id }) => id)));
  assert.equal(specsRegistrySummary.specifications, specifications.length);
  assert.equal(specsRegistrySummary.statuses, specificationStatuses.length);
});

test("specification identities, machine contracts, and exact revisions are unique", () => {
  const ids = specifications.map(({ id }) => id);
  const identifiers = specifications.map(({ identifier }) => identifier);
  const contracts = specifications.map(({ machineContract }) => machineContract);
  const revisions = specifications.map(({ revision }) => revision);

  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(identifiers).size, identifiers.length);
  assert.equal(new Set(contracts).size, contracts.length);
  assert.equal(new Set(revisions).size, revisions.length);

  for (const specification of specifications) {
    assert.match(specification.id, /^HSP-\d{4}$/);
    assert.match(specification.revision, /^[a-f0-9]{16}$/);
    assert.match(specification.machineContract, /^hara:specs:/);
    assert.ok(specification.normativeSections.length > 0);
    assert.ok(specification.explanatorySections.length > 0);
    assert.match(specification.canonicalSource, /hara-lang\/hara-specs/);
  }
});

test("registry filtering is deterministic across query, status, and domain", () => {
  assert.deepEqual(filterSpecifications(), specifications);
  assert.deepEqual(filterSpecifications({ query: "session" }).map(({ id }) => id), ["HSP-0008"]);
  assert.deepEqual(filterSpecifications({ status: "withdrawn" }).map(({ id }) => id), ["HSP-0003"]);
  assert.deepEqual(filterSpecifications({ domain: "typed" }).map(({ id }) => id), ["HSP-0012"]);
  assert.deepEqual(filterSpecifications({ query: "capability", status: "experimental", domain: "work" }).map(({ id }) => id), ["HSP-0016"]);
  assert.equal(specificationById("runtime.session")?.id, "HSP-0008");
  assert.equal(specificationById("HSP-0012")?.identifier, "std.typed.schema");
});

test("checker covers pass, warning, failure, unsupported, and unavailable without conflating them", () => {
  assert.deepEqual(checkerScenarios.map(({ state }) => state), [
    "pass", "warning", "failure", "unsupported", "unavailable"
  ]);
  for (const scenario of checkerScenarios) {
    assert.ok(scenario.findings.length > 0);
    assert.match(scenario.specRevision, /^[a-f0-9]{16}$/);
    assert.match(scenario.sourceRevision, /^[a-f0-9]{8}$/);
    if (scenario.state === "unavailable") assert.equal(scenario.receipt, null);
    else assert.match(scenario.receipt, /^check:/);
  }
  assert.equal(checkerResult("failure").findings.filter(({ severity }) => severity === "error").length, 2);
  assert.equal(checkerResult("missing").state, "pass");
});

test("conformance claims retain target, implementation revision, counts, state, and receipt boundary", () => {
  assert.equal(conformanceMatrix.length, specsRegistrySummary.conformanceClaims);
  assert.deepEqual(new Set(conformanceMatrix.map(({ state }) => state)), new Set(["pass", "warning", "failure", "unsupported"]));
  assert.equal(conformanceForSpecification("runtime.session@1.2.0").length, 3);

  for (const claim of conformanceMatrix) {
    assert.ok(claim.total > 0);
    assert.ok(claim.passed >= 0 && claim.passed <= claim.total);
    assert.ok(claim.implementation);
    assert.ok(claim.revision);
    if (claim.state === "unsupported") assert.equal(claim.receipt, null);
    else assert.match(claim.receipt, /^conformance:/);
  }
});

test("proposal workflow and digest expose durable review and migration facts", () => {
  assert.deepEqual(proposalStates.map(({ id }) => id), [
    "draft", "checks-pending", "review-requested", "changes-requested", "accepted", "merged"
  ]);
  assert.equal(proposalFixture.contentType, "specs.proposal");
  assert.equal(proposalFixture.schemaVersion, "3.0.0");
  assert.match(proposalFixture.githubProposal, /hara-lang\/hara-specs#/);
  assert.ok(proposalFixture.checks.some(({ state }) => state === "warning"));

  assert.deepEqual(new Set(changeDigest.map(({ kind }) => kind)), new Set(["additive", "breaking", "proposal"]));
  for (const entry of changeDigest) {
    assert.ok(entry.affectedPackages.length > 0);
    assert.ok(entry.affectedNamespaces.length > 0);
    assert.ok(entry.migration.length > 20);
    assert.match(entry.revision, /^[a-f0-9]{8}$/);
  }
  assert.deepEqual(registryDegradedStates.map(({ id }) => id), ["empty", "stale", "partial"]);
});

test("the shared catalogue activates the internal Specs route", async () => {
  const catalogue = await read("site/src/lib/v2-catalogue.mjs");
  const block = catalogue.match(/id:\s*"specs"[\s\S]*?(?=\n\s*\{\n\s*id:\s*"packages")/)?.[0] ?? "";
  assert.match(block, /path:\s*"\/v2\/specs\/"/);
  assert.match(block, /href:\s*"\/v2\/specs\/"/);
  assert.match(block, /status:\s*"active"/);
  assert.doesNotMatch(block, /status:\s*"planned"/);
  await access(resolve(root, pagePath));
});

test("the page composes registry, detail, checker, proposal, digest, and adoption surfaces", async () => {
  const page = await read(pagePath);
  const componentSources = await Promise.all(componentPaths.map(read));
  const combined = [page, ...componentSources].join("\n");
  for (const component of ["SpecsRegistry", "SpecsChecker", "SpecsProposal"]) {
    assert.match(page, new RegExp(`import ${component} from`));
    assert.match(page, new RegExp(`<${component}\\s*/>`));
  }
  for (const id of ["registry", "detail", "checker", "proposal", "digest", "adoption"]) {
    assert.match(combined, new RegExp(`id=\\"${id}\\"`));
  }
  for (const type of ["specs.proposal", "specs.version", "specs.conformance", "specs.publication-receipt"]) {
    assert.match(page, new RegExp(type.replace(".", "\\.")));
  }
  assert.match(page, /specs-fixture-notice/);
  assert.match(page, /specsFixtureNotice\.label/);
  assert.match(page, /Normative/);
  assert.match(page, /Explanatory/);
  assert.match(page, /hara-lang\/hara-specs/);
  assert.match(page, /initialiseSpecs/);
});

test("product components expose complete states and reuse the shared Shell", async () => {
  const [registry, checker, proposal] = await Promise.all(componentPaths.map(read));
  for (const source of [registry, checker, proposal]) {
    assert.match(source, /import Shell from/);
    assert.match(source, /<Shell/);
    assert.doesNotMatch(source, /<style(?:\s|>)/i);
  }

  assert.match(registry, /data-specs-query/);
  assert.match(registry, /data-spec-row/);
  assert.match(registry, /data-specs-empty/);
  assert.match(registry, /registryDegradedStates/);

  assert.match(checker, /checkerScenarios\.map/);
  assert.match(checker, /data-checker-scenario/);
  assert.match(checker, /data-checker-findings/);
  assert.match(checker, /conformanceMatrix\.map/);

  assert.match(proposal, /Raw front matter/);
  assert.match(proposal, /GitHub remains canonical|GitHub/);
  assert.match(proposal, /data-set-proposal-state/);
  assert.match(proposal, /data-digest-filter/);
});

test("interaction script provides keyboard registry navigation and honest state transitions", async () => {
  const script = await read("site/src/scripts/v2-specs.js");
  for (const marker of [
    "ArrowDown", "ArrowUp", "Home", "End",
    "data-specs-query", "data-checker-scenario", "replaceChildren",
    "data-set-proposal-state", "data-digest-filter", "navigator.clipboard"
  ]) assert.match(script, new RegExp(marker));

  assert.match(script, /scenario\.receipt \?\? "No receipt produced"/);
  assert.match(script, /event\.preventDefault\(\)/);
  assert.match(script, /export function initialiseSpecs/);
});

test("Specs styling contains focus, overflow, touch, responsive, and reduced-motion contracts", async () => {
  const stylePaths = [
    "site/src/styles/v2-specs.css",
    "site/src/styles/v2-specs-base.css",
    "site/src/styles/v2-specs-detail.css",
    "site/src/styles/v2-specs-workflow.css",
    "site/src/styles/v2-specs-responsive.css"
  ];
  const sources = await Promise.all(stylePaths.map(read));
  const css = sources.join("\n");
  assert.match(sources[0], /@import "\.\/v2-specs-base\.css"/);
  assert.match(sources[0], /@import "\.\/v2-specs-responsive\.css"/);
  for (const selector of [
    ".specs-local-nav",
    ".specs-registry-table-wrap",
    ".specs-detail-shell",
    ".specs-checker-shell",
    ".specs-proposal-shell",
    ".specs-digest-list",
    ".specs-adoption-grid"
  ]) assert.match(css, new RegExp(selector.replace(".", "\\.")));

  assert.match(css, /:focus-visible/);
  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /@media \(max-width: 1020px\)/);
  assert.match(css, /@media \(max-width: 780px\)/);
  assert.match(css, /@media \(max-width: 560px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /--hara-[A-Za-z0-9_-]+\s*:/, "product CSS must consume, not redefine, protected Hara tokens");
});

test("adoption documentation is packaged and names the authoritative boundaries", async () => {
  const [document, packageJson] = await Promise.all([
    read("V2-SPECS.md"),
    read("package.json").then(JSON.parse)
  ]);
  assert.ok(packageJson.files.includes("V2-SPECS.md"));
  for (const phrase of [
    "hara.specs@3.0.0",
    "Unavailable must never be normalized to failure",
    "GitHub remains canonical",
    "hara-lang/hara-specs",
    "Fixture contract",
    "Verification contract"
  ]) assert.match(document, new RegExp(phrase.replaceAll(".", "\\.")));
});
